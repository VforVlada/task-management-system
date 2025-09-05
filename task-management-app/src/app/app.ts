import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  NbCardModule,
  NbIconModule,
  NbLayoutModule,
  NbMenuModule,
  NbRouteTabsetModule,
  NbSidebarModule,
} from '@nebular/theme';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterModule,
    NbLayoutModule,
    NbSidebarModule,
    NbCardModule,
    NbMenuModule,
    NbIconModule,
    NbRouteTabsetModule,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  tabs = [
    { title: 'Tasks', route: ['/tasks'] },
    { title: 'Users', route: ['/users'] },
  ];
}
