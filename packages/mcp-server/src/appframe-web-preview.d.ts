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
    branchVariants?: boolean;
  }) => Promise<PreviewSessionReviewRebuildResult>;

  export interface PreviewSessionReviewRefreshResult extends PreviewSessionReviewRebuildResult {
    previewArtifacts: Array<{
      variantId: string;
      filePaths: string[];
      thumbnailPath: string | null;
    }>;
    recommendedVariantId: string | null;
    scores: Array<{ variantId: string; total: number }>;
    aiVisualScoring: {
      status: string;
      reason?: string;
      model?: string;
    };
  }

  export type PreviewSessionReviewRefreshHandler = (args: {
    sessionPath: string;
    branchVariants?: boolean;
  }) => Promise<PreviewSessionReviewRefreshResult>;

  export function startPreviewServer(options: PreviewServerOptions): Promise<void>;
  export function registerSessionReviewRebuildHandler(handler: PreviewSessionReviewRebuildHandler | null): void;
  export function registerSessionReviewRefreshHandler(handler: PreviewSessionReviewRefreshHandler | null): void;
}
