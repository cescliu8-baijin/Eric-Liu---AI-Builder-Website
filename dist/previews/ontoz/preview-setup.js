// Portfolio-only adapter: no persistent data or live service connection.
window.previewStorage = { getItem() { return null; }, setItem() {}, removeItem() {} };
