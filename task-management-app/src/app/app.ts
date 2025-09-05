import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import {
  NbLayoutModule,
  NbCardModule,
  NbTabsetModule,
  NbSidebarModule,
  NbIconModule,
} from '@nebular/theme';
import { filter } from 'rxjs';

type TabItem = { title: string; route: string };

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NbLayoutModule,
    NbSidebarModule,
    NbCardModule,
    NbIconModule,
    NbTabsetModule,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  tabs: TabItem[] = [
    { title: 'Tasks', route: '/tasks' },
    { title: 'Users', route: '/users' },
  ];

  selectedIndex = 0;

  constructor(private router: Router) {
    this.syncSelectedIndex(this.router.url);
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) =>
        this.syncSelectedIndex(e.urlAfterRedirects)
      );
  }

  onChangeTab(e: any) {
    let idx = typeof e?.index === 'number' ? e.index : -1;

    if (idx < 0 && this.tabs) {
      const byRef = this.tabs.indexOf(e);
      if (byRef >= 0) idx = byRef;
    }

    if (idx < 0 && e?.tabTitle) {
      idx = this.tabs.findIndex(t => t.title === e.tabTitle);
    }

    if (idx < 0) return;

    this.selectedIndex = idx;
    this.router.navigateByUrl(this.tabs[idx].route);
  }

  private syncSelectedIndex(url: string) {
    this.selectedIndex = url.includes('/users') ? 1 : 0;
  }
}
