declare module '@appframe/web-preview' {
  export interface PreviewServerOptions {
    configPath?: string;
    sessionPath?: string;
    port?: number;
  }

  export interface PreviewSessionReviewRebuildResult {
    sessionPath: string;
    manifestPath: string;
    updatedVariantIds: string[];
    clearedPreviewVariantIds: string[];
    recommendationReason: string;
    plan: {
      variants: unknown[];
    };
  }

  export type PreviewSessionReviewRebuildHandler = (args: {
    sessionPath: string;
  }) => Promise<PreviewSessionReviewRebuildResult>;

  export function startPreviewServer(options: PreviewServerOptions): Promise<void>;
  export function registerSessionReviewRebuildHandler(handler: PreviewSessionReviewRebuildHandler | null): void;
}
