import { provideServerRendering } from '@angular/platform-server';

export const serverRoutes = [
  {
    path: '**',
    renderMode: 'prerender'
  }
];
