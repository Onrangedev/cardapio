import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

let theme;
const storedTheme = localStorage.getItem('theme');

if (storedTheme) {
  if (storedTheme.replace(/"/g, '') === 'light' || storedTheme.replace(/"/g, '') === 'dark' || storedTheme.replace(/"/g, '') === 'fulldark') theme = storedTheme.replace(/"/g, '')
  else theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
} else {
  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}


document.documentElement.classList.add(theme);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
