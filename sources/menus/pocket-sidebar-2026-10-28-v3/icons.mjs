export const paths={
 Discover:'M3 11 12 3l9 8v10h-6v-7H9v7H3Z',
 Objects:'M5 21 7 5q5-4 10 0l2 16M6 13h12',
 Saved:'M6 3h12v19l-6-5-6 5Z',
 Compare:'M12 2v19M5 21h14M3 7h18M5 7l-4 8h8ZM19 7l-4 8h8Z',
 Bag:'M4 7h16l2 15H2ZM8 8V5a4 4 0 0 1 8 0v3',
 close:'M5 5l14 14M19 5 5 19',
 arrow:'M4 12h16M14 6l6 6-6 6',
 diagonal:'M5 19 19 5M5 5h14v14',
 back:'M15 5l-7 7 7 7',
 help:'M9 8a3 3 0 1 1 5 2l-2 2v2M12 18v.1',
 search:'M17 17l5 5M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
 plus:'M12 4v16M4 12h16',
 minus:'M4 12h16',
 star:'M12 0l2 8 8-5-5 8 7 2-8 2 5 8-8-5-2 7-2-8-8 5 5-8-7-2 8-2-5-8 8 5Z'
};
export const icon=(name)=>`<svg viewBox="0 0 24 24" aria-hidden="true" fill="${name==='star'?'currentColor':'none'}" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${paths[name]||paths.Objects}"/></svg>`;
