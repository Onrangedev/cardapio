import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PwaDialogComponent } from '../components/pwa-dialog/pwa-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class PwaDialogService {
  readonly dialog = inject(MatDialog);
  
  private deferredPrompt: any;
  public allowsPwa = false;

  constructor() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.allowsPwa = true;
    });
  }

  private isIos(): boolean {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  }

  public showInstallBanner(): boolean {
    return !window.matchMedia('(display-mode: standalone)').matches && !this.isIos();
  }

  public promptInstallation(): void {
    if (this.allowsPwa && this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt = null;
    } else {
      this.dialogForChrome();
    }
  }

  private dialogForChrome(): void {
    this.dialog.open(PwaDialogComponent);
  }
}
