export {mountUniversalSelector} from './remote.js';
import { mountInDocument } from './src/selector.js';
export { mountPlayerSelector, readPlayerState } from './src/player.js';

export const OPENING_SELECTOR_VERSION = '1.0.0';

// Works when imported inside the selector iframe or from a Tavern Helper host script.
export function mountOpeningSelector(startDocument = document) {
  let hostDocument=startDocument;
  try {let win=startDocument.defaultView;for(let i=0;i<8 && win?.parent && win.parent!==win;i++){
    void win.parent.document;win=win.parent;hostDocument=win.document;
  }} catch { /* sandbox boundary: scan the current document */ }
  if (hostDocument.__uosObserver?.version === OPENING_SELECTOR_VERSION) return hostDocument.__uosObserver;
  hostDocument.__uosObserver?.close?.();
  let mounted = 0;
  const visit = (doc, depth = 0) => {
    if (!doc || depth > 8) return;
    // The Tavern Helper loader owns the outer document. Pass it explicitly to
    // the card iframe, whose own window may be sandboxed or expose local `$`.
    try { const root=doc.querySelector('[data-uos]'); if(root) root.__uosHostDocument=hostDocument; } catch {}
    try { if (mountInDocument(doc)) mounted++; } catch (error) { console.warn('[Aliceneko Opening Selector]', error); }
    for (const frame of doc.querySelectorAll('iframe')) {
      try { visit(frame.contentDocument, depth + 1); } catch { /* cross-origin iframe */ }
    }
  };
  visit(hostDocument);
  // Tavern Helper loads once, while swiping away and back recreates the HTML iframe.
  const hostWindow=hostDocument.defaultView || window;
  const observer = new hostWindow.MutationObserver(() => {
    visit(hostDocument);
  });
  if (hostDocument.body) observer.observe(hostDocument.body, { childList: true, subtree: true });
  const poll = hostWindow.setInterval(() => visit(hostDocument), 1200);
  const api={version:OPENING_SELECTOR_VERSION,scan:()=>visit(hostDocument),close:()=>{observer.disconnect();hostWindow.clearInterval(poll);delete hostDocument.__uosObserver}};
  hostDocument.__uosObserver=api;
  return api;
}
