import { mountInDocument } from './src/selector.js';

export const OPENING_SELECTOR_VERSION = '0.1.0-beta.6';

// Works when imported inside the selector iframe or from a Tavern Helper host script.
export function mountOpeningSelector(startDocument = document) {
  let mounted = 0;
  const visit = (doc, depth = 0) => {
    if (!doc || depth > 8) return;
    try { if (mountInDocument(doc)) mounted++; } catch (error) { console.warn('[Aliceneko Opening Selector]', error); }
    for (const frame of doc.querySelectorAll('iframe')) {
      try { visit(frame.contentDocument, depth + 1); } catch { /* cross-origin iframe */ }
    }
  };
  visit(startDocument);
  if (mounted) return mounted;
  // Chat HTML and same-origin iframe bodies may render after the host script.
  const cleanup = () => { observer.disconnect(); clearInterval(poll); clearTimeout(timer); };
  const observer = new MutationObserver(() => {
    visit(startDocument);
    if (mounted) cleanup();
  });
  if (startDocument.body) observer.observe(startDocument.body, { childList: true, subtree: true });
  const poll = setInterval(() => { visit(startDocument); if (mounted) cleanup(); }, 500);
  const timer = setTimeout(cleanup, 30000);
  return 0;
}
