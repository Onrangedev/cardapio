import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private theme: 'light' | 'dark' | 'fulldark' = 'light';

  constructor(private storageService: StorageService) {
    this.loadTheme();
  }

  getTheme() {
    return this.theme;
  }

  setTheme(theme: 'light' | 'dark' | 'fulldark') {
    this.theme = theme;
    this.storageService.setItem('theme', theme);
    console.log(theme);
    
    window.location.reload();
  }

  private loadTheme() {
    const storedTheme = this.storageService.getItem('theme');
    if (storedTheme) this.theme = storedTheme as 'light' | 'dark' | 'fulldark';
    else this.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
