import { CommonModule } from '@angular/common';
import { Component, inject, DestroyRef } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NbLayoutModule,
  NbCardModule,
  NbTabsetModule,
  NbSidebarModule,
  NbIconModule,
  NbIconLibraries,
} from '@nebular/theme';
import { filter, forkJoin, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface TabItem {
  title: string;
  route: string;
}

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

  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private http = inject(HttpClient);
  private icons = inject(NbIconLibraries);

  constructor() {
    const mapIcons: Record<string, string> = {
      'plus-outline': 'assets/icons/plus.svg',
      'clock-outline': 'assets/icons/clock.svg',
      'repeat-outline': 'assets/icons/repeat.svg',
      'trash-outline': 'assets/icons/trash.svg',
      'edit-outline': 'assets/icons/edit.svg',
      'person-add-outline': 'assets/icons/person-add.svg',
      'more-vertical-outline': 'assets/icons/more-vertical.svg',
      'save-outline': 'assets/icons/save.svg',
    };

    const loaders$ = Object.entries(mapIcons).map(([name, url]) =>
      this.http
        .get(url, { responseType: 'text' })
        .pipe(map((svg) => [name, svg] as const)),
    );

    forkJoin(loaders$).subscribe((entries) => {
      const pack = Object.fromEntries(entries);
      this.icons.registerSvgPack('app', pack);
      this.icons.setDefaultPack('app');
    });

    this.syncSelectedIndex(this.router.url);

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((e) => {
        this.syncSelectedIndex(e.urlAfterRedirects);
      });
  }

  onChangeTab(e: any) {
    let idx = typeof e?.index === 'number' ? e.index : -1;

    if (idx < 0 && this.tabs) {
      const byRef = this.tabs.indexOf(e);
      if (byRef >= 0) idx = byRef;
    }

    if (idx < 0 && e?.tabTitle) {
      idx = this.tabs.findIndex((t) => t.title === e.tabTitle);
    }

    if (idx < 0) return;

    this.selectedIndex = idx;
    this.router.navigateByUrl(this.tabs[idx].route);
  }

  private syncSelectedIndex(url: string) {
    this.selectedIndex = url.includes('/users') ? 1 : 0;
  }
}
