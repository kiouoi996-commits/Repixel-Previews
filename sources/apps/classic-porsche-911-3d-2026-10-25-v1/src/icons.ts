export const paths: Record<string, string> = {
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  search: '<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  back: '<path d="M20 12H4m6-6-6 6 6 6"/>',
  bookmark: '<path d="M6 3h12v18l-6-4-6 4V3Z"/>',
  home: '<path d="m3 11 9-8 9 8M5 9v12h5v-7h4v7h5V9"/>',
  car: '<path d="m5 9 2-5h10l2 5M3 10h18v9H3v-9Zm2 9v2m14-2v2M6 14h2m8 0h2M7 9h10"/>',
  profile: '<circle cx="12" cy="7" r="4"/><path d="M4 22v-2a8 8 0 0 1 16 0v2H4Z"/>',
  engine: '<path d="m9 3-1 3-3 1-2 4 2 4 3 1 1 3h6l1-3 3-1 2-4-2-4-3-1-1-3H9Z"/>',
  power: '<path d="m4 19 4-9 4 5 7-11M14 4h5v5"/>',
  speed: '<path d="M5 19a9 9 0 1 1 14 0M12 13l5-7"/><circle cx="12" cy="13" r="1.5"/>',
  acceleration: '<circle cx="12" cy="13" r="8"/><path d="M9 2h6m-3 0v3m0 8 4-5"/>',
  weight: '<path d="M5 7h14l2 14H3L5 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2m-6 6 3 3 3-3"/>',
  transmission: '<circle cx="6" cy="4" r="1.5"/><circle cx="18" cy="4" r="1.5"/><circle cx="6" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M6 7v10m12-10v10M6 12h12m-6-8v16"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  check: '<path d="m4 12 5 5L20 6"/>',
};
export function icon(name: string, size = 24, filled = false) {
  return `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.car}</svg>`;
}
