// This patch fixes the React 19 fetch polyfill error in environments where window.fetch is a getter.
if (typeof window !== 'undefined' && window.fetch) {
  try {
    Object.defineProperty(window, 'fetch', {
      value: window.fetch,
      writable: true,
      configurable: true
    });
  } catch (e) {
    // Ignore if not configurable
  }
}
