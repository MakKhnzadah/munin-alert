// Simple WebSocket/STOMP placeholder for future integration
// Intentionally not connecting yet to avoid ECONNREFUSED during development

export function createWsClient() {
  return {
    connect: () => {
      console.log('[WS] Placeholder connect called');
      return Promise.resolve();
    },
    subscribe: (topic, handler) => {
      console.log('[WS] Placeholder subscribe', topic);
      return () => console.log('[WS] Placeholder unsubscribe', topic);
    },
    send: (destination, body) => {
      console.log('[WS] Placeholder send', destination, body);
    },
    disconnect: () => console.log('[WS] Placeholder disconnect')
  };
}
