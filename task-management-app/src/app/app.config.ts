import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';

import {
  NbButtonModule,
  NbIconModule,
  NbLayoutModule,
  NbMenuModule,
  NbSidebarModule,
  NbThemeModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

import { TaskRepository } from './domain/repositories/task.repo';
import { UserRepository } from './domain/repositories/user.repo';
import { TaskLocalRepository } from './data/repositories/task.local.repository';
import { UserLocalRepository } from './data/repositories/user.local.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(
      BrowserAnimationsModule,
      NbToastrModule.forRoot(),
      NbWindowModule.forRoot(),
      NbThemeModule.forRoot({ name: 'default' }),
      NbSidebarModule.forRoot(),
      NbMenuModule.forRoot(),
      NbLayoutModule,
      NbButtonModule,
      NbIconModule,
      NbEvaIconsModule,
    ),
    { provide: TaskRepository, useClass: TaskLocalRepository },
    { provide: UserRepository, useClass: UserLocalRepository },
  ],
};
