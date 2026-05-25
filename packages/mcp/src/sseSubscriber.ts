export interface SSESubscriberOptions {
  url: string;
  onEvent: (event: Record<string, unknown>) => void;
  onError?: (err: Error) => void;
}

export function subscribeToSSE(options: SSESubscriberOptions): { close: () => void } {
  const { url, onEvent, onError } = options;
  let controller: AbortController | null = null;
  let closed = false;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  async function connect(): Promise<void> {
    if (closed) return;
    controller = new AbortController();
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { accept: 'text/event-stream' },
      });
      if (!res.ok || !res.body) {
        throw new Error(`SSE connect failed: ${res.status}`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop()!;
        for (const part of parts) {
          for (const line of part.split('\n')) {
            if (line.startsWith('data: ')) {
              try {
                const payload = JSON.parse(line.slice(6));
                if (typeof payload === 'object' && payload !== null) {
                  onEvent(payload as Record<string, unknown>);
                }
              } catch {
                // malformed JSON - skip
              }
            }
          }
        }
      }
    } catch (err) {
      if (closed) return;
      if (err instanceof Error && err.name === 'AbortError') return;
      onError?.(err instanceof Error ? err : new Error(String(err)));
    }
    if (!closed) {
      reconnectTimer = setTimeout(connect, 3000);
    }
  }

  void connect();

  return {
    close() {
      closed = true;
      controller?.abort();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    },
  };
}
