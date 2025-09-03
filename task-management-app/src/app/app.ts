import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NbIconModule, NbLayoutModule, NbMenuModule, NbSidebarModule } from '@nebular/theme';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule,
    NbLayoutModule,
    NbSidebarModule,
    NbMenuModule, NbIconModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  menuItems = [
    { title: 'Tasks', link: '/tasks', icon: 'list-outline' },
    { title: 'Users', link: '/users', icon: 'people-outline' },
  ];
}
