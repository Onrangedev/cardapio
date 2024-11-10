import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { StorageService } from '../../services/storage.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    MatSlideToggleModule,
    MatIcon,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './configuracoes.component.html',
  styleUrl: './configuracoes.component.css'
})
export class ConfiguracoesComponent implements AfterViewInit {
  @ViewChild('theme') selectTheme!: ElementRef;

  toggleImgs: boolean = false;
  togglePhrases: boolean = true;

  themes: Array<Themes> = [
    { value: 'auto', viewValue: 'Auto' },
    { value: 'light', viewValue: 'Light' },
    { value: 'dark', viewValue: 'Dark' },
    { value: 'fulldark', viewValue: 'Full Dark' }
  ];

  selectedTheme = this.themes[1].value;
  date: string = '**/**/****';

  constructor(private storageService: StorageService, private themeService: ThemeService) {}

  ngAfterViewInit() {
    this.loadTheme();
    this.loadToggles();
    this.loadLastChange();
  }

  private loadTheme():void {
    const savedTheme = this.themeService.getTheme();
    if (savedTheme !== null) this.themes.forEach((item, index) => item.value === savedTheme ? this.selectedTheme = this.themes[index].value : '');
  }

  private loadToggles():void {
    const savedImg: boolean | null = this.storageService.getItem('toggleImg');
    const savedPhrases: boolean | null = this.storageService.getItem('togglePhrases');

    if (savedImg !== null) this.toggleImgs = savedImg;
    if (savedPhrases !== null) this.togglePhrases = savedPhrases;
  }

  private loadLastChange(): void {
    const savedLastChange = this.storageService.getItem('lastChange');
    if (savedLastChange) this.date = savedLastChange.toString();
  }

  public setToggleImgs(): void {
    this.storageService.setItem('toggleImg', this.toggleImgs);
  }

  public setTogglePhrases(): void {
    this.storageService.setItem('togglePhrases', this.togglePhrases);
  }

  public callSetTheme(): void {
    this.themeService.setTheme(this.selectTheme.nativeElement.value);
  }

  public async share() {
    try {
      await navigator.share({
        url: 'https://onrange.com.br/',
      });
    } catch (err) {
      this.copyLink();
    }
  }

  public copyLink(): void {
    navigator.clipboard.writeText('https://onrange.com.br/');
  }
}

interface Themes {
  value: string,
  viewValue: string
}
