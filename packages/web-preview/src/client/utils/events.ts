// Server-Sent Events subscriber for /api/events.
//
// The preview server broadcasts a `project-changed` event whenever an
// out-of-band writer (e.g. an MCP agent) PUTs a new AppframeConfig.
// Browser-originated edits (PUT bodies flagged with __editorState:true)
// are NOT broadcast — they'd just echo the browser's own state back at
// it. See packages/web-preview/src/routes/events.ts and the gating in
// routes/config.ts.
//
// Returns an unsubscribe function. Reconnects automatically on transient
// network errors via the native EventSource reconnect behaviour.

type ServerEventHandler = (event: { type: string } & Record<string, unknown>) => void;

export function subscribeToServerEvents(onEvent: ServerEventHandler): () => void {
  if (typeof EventSource === 'undefined') {
    return () => {};
  }
  const source = new EventSource('/api/events');
  source.onmessage = (msg) => {
    try {
      const payload = JSON.parse(msg.data) as { type?: string } & Record<string, unknown>;
      if (typeof payload.type === 'string') {
        onEvent(payload as { type: string } & Record<string, unknown>);
      }
    } catch {
      // Ignore malformed events — the channel keeps streaming.
    }
  };
  source.onerror = () => {
    // EventSource auto-reconnects. Nothing to do here unless we want
    // to surface offline state in the UI later.
  };
  return () => source.close();
}
