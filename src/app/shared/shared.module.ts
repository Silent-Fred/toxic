import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

export const ToxicRoutes = {
  home: 'home',
  translate: 'translate',
  sync: 'sync',
  tutorial: 'tutorial',
} as const;

export const ToxicIcons = [
  {
    name: 'menu',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M80 160h352M80 256h352M80 352h352"/></svg>`,
  },
  {
    name: 'upload',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M64 192v-72a40 40 0 0140-40h75.89a40 40 0 0122.19 6.72l27.84 18.56a40 40 0 0022.19 6.72H408a40 40 0 0140 40v40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path d="M479.9 226.55L463.68 392a40 40 0 01-39.93 40H88.25a40 40 0 01-39.93-40L32.1 226.55A32 32 0 0164 192h384.1a32 32 0 0131.8 34.55z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>`,
  },
  {
    name: 'share',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M336 192h40a40 40 0 0140 40v192a40 40 0 01-40 40H136a40 40 0 01-40-40V232a40 40 0 0140-40h40M336 128l-80-80-80 80M256 321V48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>`,
  },
  {
    name: 'close',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368"/></svg>`,
  },
  {
    name: 'settings',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M262.29 192.31a64 64 0 1057.4 57.4 64.13 64.13 0 00-57.4-57.4zM416.39 256a154.34 154.34 0 01-1.53 20.79l45.21 35.46a10.81 10.81 0 012.45 13.75l-42.77 74a10.81 10.81 0 01-13.14 4.59l-44.9-18.08a16.11 16.11 0 00-15.17 1.75A164.48 164.48 0 01325 400.8a15.94 15.94 0 00-8.82 12.14l-6.73 47.89a11.08 11.08 0 01-10.68 9.17h-85.54a11.11 11.11 0 01-10.69-8.87l-6.72-47.82a16.07 16.07 0 00-9-12.22 155.3 155.3 0 01-21.46-12.57 16 16 0 00-15.11-1.71l-44.89 18.07a10.81 10.81 0 01-13.14-4.58l-42.77-74a10.8 10.8 0 012.45-13.75l38.21-30a16.05 16.05 0 006-14.08c-.36-4.17-.58-8.33-.58-12.5s.21-8.27.58-12.35a16 16 0 00-6.07-13.94l-38.19-30A10.81 10.81 0 0149.48 186l42.77-74a10.81 10.81 0 0113.14-4.59l44.9 18.08a16.11 16.11 0 0015.17-1.75A164.48 164.48 0 01187 111.2a15.94 15.94 0 008.82-12.14l6.73-47.89A11.08 11.08 0 01213.23 42h85.54a11.11 11.11 0 0110.69 8.87l6.72 47.82a16.07 16.07 0 009 12.22 155.3 155.3 0 0121.46 12.57 16 16 0 0015.11 1.71l44.89-18.07a10.81 10.81 0 0113.14 4.58l42.77 74a10.8 10.8 0 01-2.45 13.75l-38.21 30a16.05 16.05 0 00-6.05 14.08c.33 4.14.55 8.3.55 12.47z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>`,
  },
  {
    name: 'warning',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M85.57 446.25h340.86a32 32 0 0028.17-47.17L284.18 82.58c-12.09-22.44-44.27-22.44-56.36 0L57.4 399.08a32 32 0 0028.17 47.17z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path d="M250.26 195.39l5.74 122 5.73-121.95a5.74 5.74 0 00-5.79-6h0a5.74 5.74 0 00-5.68 5.95z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path d="M256 397.25a20 20 0 1120-20 20 20 0 01-20 20z"/></svg>`,
  },
  {
    name: 'language',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M48 112h288M192 64v48M272 448l96-224 96 224M301.5 384h133M281.3 112S257 206 199 277 80 384 80 384"/><path d="M256 336s-35-27-72-75-56-85-56-85" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>`,
  },
  {
    name: 'flag',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M80 464V68.14a8 8 0 014-6.9C91.81 56.66 112.92 48 160 48c64 0 145 48 192 48a199.53 199.53 0 0077.23-15.77 2 2 0 012.77 1.85v219.36a4 4 0 01-2.39 3.65C421.37 308.7 392.33 320 352 320c-48 0-128-32-192-32s-80 16-80 16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32"/></svg>`,
  },
  {
    name: 'checkmark',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 128L192 384l-96-96"/></svg>`,
  },
  {
    name: 'bulb',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M304 384v-24c0-29 31.54-56.43 52-76 28.84-27.57 44-64.61 44-108 0-80-63.73-144-144-144a143.6 143.6 0 00-144 144c0 41.84 15.81 81.39 44 108 20.35 19.21 52 46.7 52 76v24M224 480h64M208 432h96M256 384V256" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path d="M294 240s-21.51 16-38 16-38-16-38-16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>`,
  },
  {
    name: 'grid',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><rect x="48" y="48" width="176" height="176" rx="20" ry="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><rect x="288" y="48" width="176" height="176" rx="20" ry="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><rect x="48" y="288" width="176" height="176" rx="20" ry="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><rect x="288" y="288" width="176" height="176" rx="20" ry="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>`,
  },
  {
    name: 'hand-left',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M80 320V144a32 32 0 0132-32h0a32 32 0 0132 32v112M144 256V80a32 32 0 0132-32h0a32 32 0 0132 32v160M272 241V96a32 32 0 0132-32h0a32 32 0 0132 32v224M208 240V48a32 32 0 0132-32h0a32 32 0 0132 32v192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path d="M80 320c0 117.4 64 176 152 176s123.71-39.6 144-88l52.71-144c6.66-18.05 3.64-34.79-11.87-43.6h0c-15.52-8.82-35.91-4.28-44.31 11.68L336 320" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>`,
  },
  {
    name: 'puzzle',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M413.66 246.1H386a2 2 0 01-2-2v-77.24A38.86 38.86 0 00345.14 128H267.9a2 2 0 01-2-2V98.34c0-27.14-21.5-49.86-48.64-50.33a49.53 49.53 0 00-50.4 49.51V126a2 2 0 01-2 2H87.62A39.74 39.74 0 0048 167.62V238a2 2 0 002 2h26.91c29.37 0 53.68 25.48 54.09 54.85.42 29.87-23.51 57.15-53.29 57.15H50a2 2 0 00-2 2v70.38A39.74 39.74 0 0087.62 464H158a2 2 0 002-2v-20.93c0-30.28 24.75-56.35 55-57.06 30.1-.7 57 20.31 57 50.28V462a2 2 0 002 2h71.14A38.86 38.86 0 00384 425.14v-78a2 2 0 012-2h28.48c27.63 0 49.52-22.67 49.52-50.4s-23.2-48.64-50.34-48.64z"/></svg>`,
  },
  {
    name: 'puzzle-top-left',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" class="toxic-icon" viewBox="0 0 512 512"><path d="m413.66 246.1h-27.66c-1.1046 0-2-0.89543-2-2v-77.24c0-21.462-17.398-38.86-38.86-38.86h-257.52c-21.854 0.0659-39.554 17.766-39.62 39.62v256.76c0.06589 21.854 17.766 39.554 39.62 39.62h70.38c1.1046 0 2-0.89543 2-2v-20.93c0-30.28 24.75-56.35 55-57.06 30.1-0.7 57 20.31 57 50.28v27.71c0 1.1046 0.89543 2 2 2h71.14c21.462 0 38.86-17.398 38.86-38.86v-78c0-1.1046 0.89543-2 2-2h28.48c27.63 0 49.52-22.67 49.52-50.4s-23.2-48.64-50.34-48.64z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>`,
  },
  {
    name: 'puzzle-left',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" class="toxic-icon" viewBox="0 0 512 512"><path d="m413.66 246.1h-27.66c-1.1046 0-2-0.89543-2-2v-77.24c0-21.462-17.398-38.86-38.86-38.86h-77.24c-1.1046 0-2-0.89543-2-2v-27.66c0-27.14-21.5-49.86-48.64-50.33-27.686-0.48638-50.393 21.82-50.4 49.51v28.48c0 1.1046-0.89543 2-2 2h-77.24c-21.854 0.06589-39.554 17.766-39.62 39.62v256.76c0.06589 21.854 17.766 39.554 39.62 39.62h70.38c1.1046 0 2-0.89543 2-2v-20.93c0-30.28 24.75-56.35 55-57.06 30.1-0.7 57 20.31 57 50.28v27.71c0 1.1046 0.89543 2 2 2h71.14c21.462 0 38.86-17.398 38.86-38.86v-78c0-1.1046 0.89543-2 2-2h28.48c27.63 0 49.52-22.67 49.52-50.4s-23.2-48.64-50.34-48.64z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>`,
  },
  {
    name: 'puzzle-bottom-left',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" class="toxic-icon" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="m48 166.86c0-21.462 17.398-38.86 38.86-38.86h77.24c1.1046 0 2-0.89543 2-2v-27.66c0-27.14 21.5-49.86 48.64-50.33 27.686-0.48638 50.393 21.82 50.4 49.51v28.48c0 1.1046 0.89543 2 2 2h77.24c21.854 0.0659 39.554 17.766 39.62 39.62v70.38c0 1.1046-0.89543 2-2 2h-26.91c-29.37 0-53.68 25.48-54.09 54.85-0.42 29.87 23.51 57.15 53.29 57.15h27.71c1.1046 0 2 0.89543 2 2v70.38c-0.0659 21.854-17.766 39.554-39.62 39.62h-257.52c-21.462 0-38.86-17.398-38.86-38.86z"/></svg>`,
  },
  {
    name: 'sync',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M434.67 285.59v-29.8c0-98.73-80.24-178.79-179.2-178.79a179 179 0 00-140.14 67.36m-38.53 82v29.8C76.8 355 157 435 256 435a180.45 180.45 0 00140-66.92" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M32 256l44-44 46 44M480 256l-44 44-46-44"/></svg>`,
  },
  {
    name: 'magic-wand',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><rect fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" x="280.48" y="122.9" width="63.03" height="378.2" rx="31.52" transform="rotate(-45 312.002 311.994)"/><path d="M178.38 178.38a31.64 31.64 0 000 44.75L223.25 268 268 223.25l-44.87-44.87a31.64 31.64 0 00-44.75 0z"/><path stroke="currentColor" stroke-miterlimit="10" stroke-width="32" stroke-linecap="round" d="M48 192h48M90.18 90.18l33.94 33.94M192 48v48M293.82 90.18l-33.94 33.94M124.12 259.88l-33.94 33.94"/></svg>`,
  },
] as const;

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class SharedModule {}
