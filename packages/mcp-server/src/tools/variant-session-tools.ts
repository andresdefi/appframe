import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import {
  generatePanoramicScreenshots,
  generateScreenshots,
  loadConfig,
  validateConfig,
} from '@appframe/core';
import type { AppframeConfig, PanoramicElement, TemplateStyle } from '@appframe/core';
import { dirname, join, parse as parsePath } from 'node:path';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { stringify } from 'yaml';

type VariantStatus = 'draft' | 'approved';

interface VariantArtifact {
  id: string;
  exportedAt: string;
  outputDir: string;
  mode: 'individual' | 'panoramic';
  platform: string;
  locale?: string;
  filePaths: string[];
}

interface VariantSessionVariant {
  id: string;
  name: string;
  description: string;
  status: VariantStatus;
  config: AppframeConfig;
  artifacts: VariantArtifact[];
}

interface VariantSessionFile {
  version: 1;
  sourceConfigPath: string;
  createdAt: string;
  updatedAt: string;
  activeVariantId: string;
  variants: VariantSessionVariant[];
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function makeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'variant';
}

function defaultSessionPath(configPath: string): string {
  const parsed = parsePath(configPath);
  return join(parsed.dir, `${parsed.name}.variants.session.json`);
}

async function readSession(sessionPath: string): Promise<VariantSessionFile> {
  const raw = JSON.parse(await readFile(sessionPath, 'utf-8')) as VariantSessionFile;
  return raw;
}

async function writeSession(sessionPath: string, session: VariantSessionFile): Promise<void> {
  await mkdir(dirname(sessionPath), { recursive: true });
  await writeFile(sessionPath, JSON.stringify(session, null, 2), 'utf-8');
}

function ensureValidConfig(config: AppframeConfig, label: string): AppframeConfig {
  const result = validateConfig(config);
  if (!result.success) {
    const message = result.errors.map((error) => `${error.path}: ${error.message}`).join('; ');
    throw new Error(`${label} is invalid: ${message}`);
  }
  return result.config;
}

function getDynamicStyle(baseStyle: TemplateStyle): TemplateStyle {
  switch (baseStyle) {
    case 'minimal':
    case 'clean':
      return 'bold';
    case 'bold':
      return 'editorial';
    case 'editorial':
      return 'branded';
    case 'branded':
      return 'clean';
    case 'glow':
      return 'minimal';
    case 'playful':
      return 'branded';
    default:
      return 'bold';
  }
}

function createDynamicIndividualVariant(source: AppframeConfig): AppframeConfig {
  const config = clone(source);
  config.mode = 'individual';
  delete config.panoramic;
  delete config.frameCount;

  config.theme.style = getDynamicStyle(config.theme.style);
  config.theme.fontWeight = Math.max(config.theme.fontWeight ?? 600, 700);

  const layouts = ['center', 'angled-right', 'angled-left', 'center'] as const;
  config.screens = config.screens.map((screen, index) => ({
    ...screen,
    layout: screen.layout ?? layouts[index % layouts.length],
    composition: 'single',
    autoSizeHeadline: screen.autoSizeHeadline ?? true,
    autoSizeSubtitle: screen.autoSizeSubtitle ?? false,
  }));

  return ensureValidConfig(config, 'Dynamic individual variant');
}

function buildPanoramicElementsFromScreens(config: AppframeConfig): PanoramicElement[] {
  const screenCount = Math.max(config.screens.length, 2);
  const frame = config.frames.ios ?? config.frames.android;
  const textColor = config.theme.colors.text ?? '#0F172A';
  const subtitleColor = config.theme.colors.subtitle ?? '#64748B';
  const elements: PanoramicElement[] = [];

  for (let i = 0; i < screenCount; i++) {
    const screen = config.screens[i] ?? config.screens[config.screens.length - 1];
    if (!screen) continue;

    const frameSliceStart = (i / screenCount) * 100;
    const frameCenter = frameSliceStart + (100 / screenCount) / 2;

    elements.push({
      type: 'device',
      screenshot: screen.screenshot,
      localeSourceScreen: i < config.screens.length ? i : undefined,
      frame,
      frameStyle: config.frames.style,
      x: frameCenter - 7,
      y: 22,
      width: 14,
      rotation: 0,
      deviceScale: 92,
      deviceTop: 15,
      deviceOffsetX: 0,
      deviceAngle: 8,
      deviceTilt: 0,
      cornerRadius: 0,
      fullscreenScreenshot: false,
      z: 5,
    });

    elements.push({
      type: 'text',
      content: screen.headline,
      localeSourceScreen: i < config.screens.length ? i : undefined,
      localeSourceField: 'headline',
      x: frameSliceStart + 4,
      y: 6,
      fontSize: 3.8,
      color: textColor,
      fontWeight: config.theme.fontWeight ?? 700,
      fontStyle: 'normal',
      textAlign: 'left',
      lineHeight: 1.1,
      maxWidth: Math.max(12, Math.floor(100 / screenCount) - 6),
      letterSpacing: 0,
      textTransform: '',
      rotation: 0,
      z: 10,
    });

    if (screen.subtitle) {
      elements.push({
        type: 'label',
        content: screen.subtitle,
        localeSourceScreen: i < config.screens.length ? i : undefined,
        localeSourceField: 'subtitle',
        x: frameSliceStart + 4,
        y: 18,
        fontSize: 1.6,
        color: subtitleColor,
        backgroundColor: undefined,
        padding: 0,
        borderRadius: 0,
        z: 11,
      });
    }
  }

  return elements;
}

function createPanoramicStoryboardVariant(source: AppframeConfig): AppframeConfig {
  const config = clone(source);

  if (config.mode === 'panoramic' && config.panoramic && config.frameCount) {
    config.theme.style = config.theme.style === 'editorial' ? 'clean' : 'editorial';
    config.theme.fontWeight = Math.min(Math.max(config.theme.fontWeight ?? 600, 600), 700);
    return ensureValidConfig(config, 'Panoramic variant');
  }

  if (config.screens.length === 0) {
    throw new Error('Cannot build a panoramic storyboard variant without screens');
  }

  config.mode = 'panoramic';
  config.frameCount = Math.max(config.screens.length, 2);
  config.theme.style = config.theme.style === 'editorial' ? 'clean' : 'editorial';
  config.theme.fontWeight = Math.min(Math.max(config.theme.fontWeight ?? 600, 600), 700);
  config.panoramic = {
    background: {
      type: 'solid',
      color: config.theme.colors.background ?? '#F8FAFC',
    },
    elements: buildPanoramicElementsFromScreens(config),
  };

  return ensureValidConfig(config, 'Panoramic storyboard variant');
}

function summarizeVariant(variant: VariantSessionVariant): string {
  const mode = variant.config.mode === 'panoramic' ? 'panoramic' : 'individual';
  const screenCount = variant.config.mode === 'panoramic'
    ? `${variant.config.frameCount ?? 0} frames`
    : `${variant.config.screens.length} screens`;
  return `- ${variant.id}: ${variant.name} [${variant.status}] (${mode}, ${screenCount}, ${variant.artifacts.length} exports)`;
}

function createSessionVariants(config: AppframeConfig, variantCount: number): VariantSessionVariant[] {
  const secondConceptConfig = config.mode === 'panoramic' || config.screens.length === 0
    ? createPanoramicStoryboardVariant(config)
    : createDynamicIndividualVariant(config);
  const secondConceptDescription = config.mode === 'panoramic' || config.screens.length === 0
    ? 'An alternate panoramic concept derived from the source storyboard.'
    : 'A more visually dynamic individual concept using safer single-device rendering.';

  const variants: VariantSessionVariant[] = [
    {
      id: 'concept-a',
      name: 'Concept A',
      description: 'Original concept seeded from the source config.',
      status: 'draft',
      config: ensureValidConfig(clone(config), 'Concept A'),
      artifacts: [],
    },
    {
      id: 'concept-b',
      name: 'Concept B',
      description: secondConceptDescription,
      status: 'draft',
      config: secondConceptConfig,
      artifacts: [],
    },
  ];

  if (variantCount === 3) {
    variants.push({
      id: 'concept-c',
      name: 'Concept C',
      description: 'A panoramic storyboard concept derived from the source screens.',
      status: 'draft',
      config: createPanoramicStoryboardVariant(config),
      artifacts: [],
    });
  }

  return variants;
}

async function writeTemporaryConfig(sourceConfigPath: string, variantId: string, config: AppframeConfig): Promise<string> {
  const tempPath = join(dirname(sourceConfigPath), `.appframe-${variantId}-${Date.now()}.yml`);
  await writeFile(tempPath, stringify(config), 'utf-8');
  return tempPath;
}

export function registerVariantSessionTools(server: McpServer): void {
  server.tool(
    'appframe_create_variant_session',
    'Create a file-backed appframe variant session from a base config. This is intended for agent workflows: it creates 2-3 explicit concepts, tracks the active concept, and stores approval/export history.',
    {
      configPath: z.string().describe('Absolute path to the base appframe.yml config file'),
      sessionPath: z.string().optional().describe('Optional absolute path for the variant session JSON file'),
      variantCount: z.number().min(2).max(3).default(3).describe('Number of concepts to create (2-3)'),
    },
    async ({ configPath, sessionPath, variantCount }) => {
      try {
        const config = await loadConfig(configPath);
        const resolvedSessionPath = sessionPath ?? defaultSessionPath(configPath);
        const timestamp = new Date().toISOString();
        const variants = createSessionVariants(config, variantCount);
        const session: VariantSessionFile = {
          version: 1,
          sourceConfigPath: configPath,
          createdAt: timestamp,
          updatedAt: timestamp,
          activeVariantId: variants[0]!.id,
          variants,
        };

        await writeSession(resolvedSessionPath, session);

        return {
          content: [{
            type: 'text' as const,
            text: `Variant session created at ${resolvedSessionPath}\n\nActive variant: ${session.activeVariantId}\n\n${variants.map(summarizeVariant).join('\n')}`,
          }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { content: [{ type: 'text' as const, text: `Failed to create variant session: ${message}` }] };
      }
    },
  );

  server.tool(
    'appframe_list_variant_session',
    'List all variants in a file-backed appframe variant session, including which one is active and which one is approved.',
    {
      sessionPath: z.string().describe('Absolute path to the variant session JSON file'),
    },
    async ({ sessionPath }) => {
      try {
        const session = await readSession(sessionPath);
        return {
          content: [{
            type: 'text' as const,
            text: `Variant session: ${sessionPath}\nSource config: ${session.sourceConfigPath}\nActive variant: ${session.activeVariantId}\n\n${session.variants.map(summarizeVariant).join('\n')}`,
          }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { content: [{ type: 'text' as const, text: `Failed to read variant session: ${message}` }] };
      }
    },
  );

  server.tool(
    'appframe_select_variant',
    'Select the active variant in a file-backed appframe variant session.',
    {
      sessionPath: z.string().describe('Absolute path to the variant session JSON file'),
      variantId: z.string().describe('Variant id to make active, for example concept-a or concept-c'),
    },
    async ({ sessionPath, variantId }) => {
      try {
        const session = await readSession(sessionPath);
        const variant = session.variants.find((entry) => entry.id === variantId);
        if (!variant) {
          return { content: [{ type: 'text' as const, text: `Unknown variant id: ${variantId}` }] };
        }

        session.activeVariantId = variantId;
        session.updatedAt = new Date().toISOString();
        await writeSession(sessionPath, session);

        return {
          content: [{
            type: 'text' as const,
            text: `Active variant set to ${variantId} (${variant.name}).`,
          }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { content: [{ type: 'text' as const, text: `Failed to select variant: ${message}` }] };
      }
    },
  );

  server.tool(
    'appframe_approve_variant',
    'Approve one variant in a file-backed appframe variant session. Approving one concept marks all others as draft so agents can export the approved concept explicitly.',
    {
      sessionPath: z.string().describe('Absolute path to the variant session JSON file'),
      variantId: z.string().describe('Variant id to approve'),
    },
    async ({ sessionPath, variantId }) => {
      try {
        const session = await readSession(sessionPath);
        let found = false;
        session.variants = session.variants.map((variant) => {
          const approved = variant.id === variantId;
          if (approved) found = true;
          return {
            ...variant,
            status: approved ? 'approved' : 'draft',
          };
        });
        if (!found) {
          return { content: [{ type: 'text' as const, text: `Unknown variant id: ${variantId}` }] };
        }

        session.activeVariantId = variantId;
        session.updatedAt = new Date().toISOString();
        await writeSession(sessionPath, session);

        return {
          content: [{
            type: 'text' as const,
            text: `Approved ${variantId}. All other variants are now marked as draft.`,
          }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { content: [{ type: 'text' as const, text: `Failed to approve variant: ${message}` }] };
      }
    },
  );

  server.tool(
    'appframe_export_variant',
    'Export a specific or active variant from a file-backed appframe variant session. Uses the individual renderer for individual variants and the panoramic renderer for panoramic variants.',
    {
      sessionPath: z.string().describe('Absolute path to the variant session JSON file'),
      variantId: z.string().optional().describe('Variant id to export. Defaults to the active variant'),
      outputDir: z.string().optional().describe('Optional absolute output directory override'),
      platform: z.enum(['ios', 'android', 'mac', 'watch', 'all']).optional().describe('Optional platform filter'),
      locale: z.string().optional().describe('Optional locale for individual-mode exports only'),
    },
    async ({ sessionPath, variantId, outputDir, platform, locale }) => {
      try {
        const session = await readSession(sessionPath);
        const targetVariantId = variantId ?? session.activeVariantId;
        const variant = session.variants.find((entry) => entry.id === targetVariantId);
        if (!variant) {
          return { content: [{ type: 'text' as const, text: `Unknown variant id: ${targetVariantId}` }] };
        }
        if (locale && variant.config.mode === 'panoramic') {
          return { content: [{ type: 'text' as const, text: 'Locale-specific export is not supported for panoramic variants in the core renderer yet.' }] };
        }

        const resolvedOutputDir = outputDir
          ?? join(dirname(sessionPath), 'variant-output', slugify(variant.name));
        const tempConfigPath = await writeTemporaryConfig(session.sourceConfigPath, variant.id, variant.config);

        try {
          const result = variant.config.mode === 'panoramic'
            ? await generatePanoramicScreenshots({
                configPath: tempConfigPath,
                outputDir: resolvedOutputDir,
                platform: platform === 'all' ? undefined : platform,
              })
            : await generateScreenshots({
                configPath: tempConfigPath,
                outputDir: resolvedOutputDir,
                platform: platform === 'all' ? undefined : platform,
                locale,
              });

          const artifact: VariantArtifact = {
            id: makeId('artifact'),
            exportedAt: new Date().toISOString(),
            outputDir: resolvedOutputDir,
            mode: variant.config.mode === 'panoramic' ? 'panoramic' : 'individual',
            platform: platform ?? 'all',
            locale,
            filePaths: result.screenshots.map((shot) => shot.outputPath),
          };

          session.variants = session.variants.map((entry) => (
            entry.id === variant.id
              ? { ...entry, artifacts: [artifact, ...entry.artifacts] }
              : entry
          ));
          session.activeVariantId = variant.id;
          session.updatedAt = artifact.exportedAt;
          await writeSession(sessionPath, session);

          return {
            content: [{
              type: 'text' as const,
              text: `Exported ${variant.id} (${variant.name}) to ${resolvedOutputDir}\n\n${artifact.filePaths.join('\n')}`,
            }],
          };
        } finally {
          await rm(tempConfigPath, { force: true });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { content: [{ type: 'text' as const, text: `Failed to export variant: ${message}` }] };
      }
    },
  );

  server.tool(
    'appframe_export_approved_variant',
    'Export the approved variant from a file-backed appframe variant session. Fails if no variant is approved.',
    {
      sessionPath: z.string().describe('Absolute path to the variant session JSON file'),
      outputDir: z.string().optional().describe('Optional absolute output directory override'),
      platform: z.enum(['ios', 'android', 'mac', 'watch', 'all']).optional().describe('Optional platform filter'),
      locale: z.string().optional().describe('Optional locale for individual-mode exports only'),
    },
    async ({ sessionPath, outputDir, platform, locale }) => {
      try {
        const session = await readSession(sessionPath);
        const approved = session.variants.find((variant) => variant.status === 'approved');
        if (!approved) {
          return { content: [{ type: 'text' as const, text: 'No approved variant found. Use appframe_approve_variant first.' }] };
        }

        const resolvedOutputDir = outputDir
          ?? join(dirname(sessionPath), 'variant-output', slugify(approved.name));
        const tempConfigPath = await writeTemporaryConfig(session.sourceConfigPath, approved.id, approved.config);

        try {
          const result = approved.config.mode === 'panoramic'
            ? await generatePanoramicScreenshots({
                configPath: tempConfigPath,
                outputDir: resolvedOutputDir,
                platform: platform === 'all' ? undefined : platform,
              })
            : await generateScreenshots({
                configPath: tempConfigPath,
                outputDir: resolvedOutputDir,
                platform: platform === 'all' ? undefined : platform,
                locale,
              });

          const artifact: VariantArtifact = {
            id: makeId('artifact'),
            exportedAt: new Date().toISOString(),
            outputDir: resolvedOutputDir,
            mode: approved.config.mode === 'panoramic' ? 'panoramic' : 'individual',
            platform: platform ?? 'all',
            locale,
            filePaths: result.screenshots.map((shot) => shot.outputPath),
          };

          session.variants = session.variants.map((entry) => (
            entry.id === approved.id
              ? { ...entry, artifacts: [artifact, ...entry.artifacts] }
              : entry
          ));
          session.activeVariantId = approved.id;
          session.updatedAt = artifact.exportedAt;
          await writeSession(sessionPath, session);

          return {
            content: [{
              type: 'text' as const,
              text: `Exported approved variant ${approved.id} (${approved.name}) to ${resolvedOutputDir}\n\n${artifact.filePaths.join('\n')}`,
            }],
          };
        } finally {
          await rm(tempConfigPath, { force: true });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { content: [{ type: 'text' as const, text: `Failed to export approved variant: ${message}` }] };
      }
    },
  );
}
