declare module '@appframe/web-preview' {
  export interface PreviewServerOptions {
    configPath?: string;
    sessionPath?: string;
    port?: number;
  }

  export function startPreviewServer(options: PreviewServerOptions): Promise<void>;
}
