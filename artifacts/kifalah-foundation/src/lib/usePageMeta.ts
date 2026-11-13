import { useEffect } from 'react';

const SITE = 'Kifalah Foundation Ghana';
const DEFAULT_DESCRIPTION =
  "Kifalah Foundation Ghana works to improve lives through education, women's empowerment, youth skills, community development and humanitarian support across Ghana.";

function setMeta(selector: string, value: string) {
  document.head.querySelector(selector)?.setAttribute('content', value);
}

// Sets the browser tab title and the description/preview text for the current page.
// (Search engines that run JavaScript read these; link previews in chat apps use the
// site-wide tags in index.html.)
export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE}` : SITE;
    const desc = (description && description.trim()) || DEFAULT_DESCRIPTION;
    const short = desc.length > 160 ? `${desc.slice(0, 157).trimEnd()}...` : desc;
    document.title = fullTitle;
    setMeta('meta[name="description"]', short);
    setMeta('meta[property="og:title"]', fullTitle);
    setMeta('meta[property="og:description"]', short);
    setMeta('meta[name="twitter:title"]', fullTitle);
    setMeta('meta[name="twitter:description"]', short);
  }, [title, description]);
}
