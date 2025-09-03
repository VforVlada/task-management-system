
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';

import {
  NbThemeModule,
  NbLayoutModule,
  NbSidebarModule,
  NbButtonModule,
  NbIconModule,
  NbMenuModule,
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
      NbThemeModule.forRoot({ name: 'default' }),
      NbSidebarModule.forRoot(),
      NbMenuModule.forRoot(),     
      NbLayoutModule,
      NbSidebarModule.forRoot(),
      NbButtonModule,
      NbIconModule,
      NbEvaIconsModule
    ),
    { provide: TaskRepository, useClass: TaskLocalRepository },
    { provide: UserRepository, useClass: UserLocalRepository },
  ],
};
