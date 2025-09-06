import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';

import {
  NbMenuModule,
  NbSidebarModule,
  NbThemeModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';

import { TaskRepository } from './domain/repositories/task.repo';
import { UserRepository } from './domain/repositories/user.repo';
import { TaskLocalRepository } from './data/repositories/task.local.repository';
import { UserLocalRepository } from './data/repositories/user.local.repository';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    importProvidersFrom(
      NbThemeModule.forRoot({ name: 'default' }),
      NbSidebarModule.forRoot(),
      NbMenuModule.forRoot(),
      NbToastrModule.forRoot(),
      NbWindowModule.forRoot(),
    ),
    { provide: TaskRepository, useClass: TaskLocalRepository },
    { provide: UserRepository, useClass: UserLocalRepository },
  ],
};
