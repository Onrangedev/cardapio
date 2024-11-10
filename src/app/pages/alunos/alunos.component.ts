import { CUSTOM_ELEMENTS_SCHEMA, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { register } from 'swiper/element/bundle';
import { StorageService } from '../../services/storage.service';
import { spreadsheetsService } from '../../services/spreadsheets.service';
import { HttpClientModule } from '@angular/common/http';
import { NutritionDialogComponent } from '../../components/nutrition-dialog/nutrition-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PwaDialogService } from '../../services/pwa-dialog.service';

register();

@Component({
  selector: 'app-alunos',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    RouterLink,
    MatIcon,
    MatButtonModule,
    HttpClientModule,
  ],
  providers: [spreadsheetsService],
  templateUrl: './alunos.component.html',
  styleUrl: './alunos.component.css'
})
export class AlunosComponent {
  phrases = ['Alimente seu corpo, cultive sua saúde.', 'Uma boa alimentação é o primeiro passo para uma vida mais saudável.', 'Coma bem, viva melhor.', 'Seu corpo agradece cada alimento saudável.', 'A comida é o combustível do seu corpo. Abasteça-o com o melhor!', 'A saúde começa no prato.', 'Alimente seus sonhos com uma dieta balanceada.', 'Uma dieta equilibrada é a receita para uma vida feliz e saudável.', 'Invista em sua saúde, invista em uma boa alimentação.',
  'Cada garfada é uma oportunidade para nutrir seu corpo.', 'A alimentação saudável não é uma dieta, é um estilo de vida.', 'Você é o que você come. Escolha bem!', 'A comida é o nosso melhor remédio.', 'Cozinhar com amor é nutrir a alma.', 'Uma alimentação saudável é um presente para o seu futuro.','A comida é a nossa primeira medicina.', 'A alimentação saudável é a base para uma vida ativa e produtiva.', 'Ame seu corpo, alimente-o com carinho.', 'O que você come hoje define como você se sentirá amanhã.', 'A comida não é apenas combustível, é uma experiência.', 'A alimentação é uma forma de amor próprio.', 'Escolha alimentos que alimentem seu corpo e seu espírito.', 'A comida conecta as pessoas e a natureza.', 'A alimentação saudável é um ato de amor por você mesmo.', 'A alimentação saudável é um investimento a longo prazo.', 'Cada escolha alimentar é uma oportunidade para crescer.','A comida é a nossa linguagem universal. Fale a linguagem da saúde.', 'A natureza nos oferece a melhor farmácia: os alimentos naturais.', 'Um corpo saudável é a nossa maior riqueza.', 'A comida é a arte de nutrir o corpo e a alma.', 'A felicidade se encontra também no prato.', 'A alimentação saudável é um hábito, não uma obrigação.', 'Cozinhar é um ato de amor e cuidado consigo mesmo.', 'A comida é a nossa primeira medicina preventiva.', 'Uma boa digestão é a base de uma boa saúde.', 'A alimentação saudável nos conecta com a natureza e com nós mesmos.', 'Escolha alimentos que te deixem leve e energizado.', 'A comida é celebração da vida.', 'A alimentação saudável é um estilo de vida que contagia.', 'Um corpo bem nutrido é mais resistente a doenças.', 'A comida é a nossa primeira casa.', 'A alimentação saudável é um ato de gratidão à vida.', 'Coma devagar e saboreie cada mordida.', 'A comida é a nossa melhor companhia.', 'A alimentação saudável é um investimento no futuro.', 'A comida nos conecta com nossas raízes.', 'A alimentação saudável é um ato de amor pela vida.', 'A comida é a nossa primeira paixão.', 'A alimentação saudável é um estilo de vida que transforma.', 'Um corpo saudável é uma mente saudável.'];
  
  readonly dialog = inject(MatDialog);
  
  shouldShowInstallButton: boolean = false;
  phrase!: string;
  data: any;
  menu: Array<SheetsDataInterface> = [];
  days: string[] = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'];
  load: boolean = false;
  isOutOfAir: boolean = false;
  today: string = '';

  constructor(
    private storageService: StorageService,
    private spreadsheets: spreadsheetsService,
    private pwaDialogService: PwaDialogService,
  ) {}

  async ngOnInit() {
    this.loadPhrase();
    this.shouldShowInstallButton = this.pwaDialogService.showInstallBanner();

    const todayNum = new Date().getDay();
    if (todayNum !== 0 && todayNum !== 6) this.today = this.days[todayNum - 1];

    const savedMenu: Array<SheetsDataInterface> | null = this.storageService.getItem('menu');
    const savedOutOfAir: boolean | null = this.storageService.getItem('outOfAir');

    if (savedMenu) savedMenu.forEach((item) => this.menu.push(new SheetsData(item.day, item.louch, item.snack, item.snackCalories, item.snackLactose, item.louchCalories, item.louchLactose)));
    if (savedOutOfAir) this.isOutOfAir = savedOutOfAir;

    if (this.menu.length != 0) {
      if (navigator.onLine && !this.isOutOfAir) {
        this.printOutOfAir();
        this.requestData();
      } else if (navigator.onLine) {
        this.requestData();
      }
    } else if (!navigator.onLine) {
      this.printOutOfAir();
    } else {
      this.requestData();
    }
  }
  
  private async requestData() {    
    this.load = true;

    this.spreadsheets.getSheetData().subscribe(
      (res) => {
        this.data = this.transpose(res.values);

        const lastChange = this.data[2][0];
        const status = this.data[2][1];
        const isMaintenance = status === 'Manutenção';
        const isOff = status === 'Desligado';
        const isAlunosPage = location.href.includes('onrange.com.br');

        this.load = false;
        
        if (status !== 'Ativo' && (isMaintenance && isAlunosPage) || isOff) {
          this.printOutOfAir();
        } else {
          this.loadCard();
          this.saveLastChange(lastChange);          
          this.saveMenu();
        }
      }, (error) => {
        console.error('Erro ao buscar dados da planilha:', error);
      }
    );
  }

  private printOutOfAir(): void {
    this.storageService.setItem('outOfAir', true);
    this.clearMenu();
    alert('O servidor está fora do Ar!');
  }

  private saveMenu(): void {
    this.storageService.setItem('menu', this.menu);
  }

  private saveLastChange(date: string): void {
    this.storageService.setItem('lastChange', date);
  }

  public loadPhrase(): void {
    const savedPhrase = localStorage.getItem('togglePhrases');
    if (savedPhrase === 'false') return;

    const num = Math.floor(Math.random() * (this.phrases.length - 0) + 0);
    this.phrase = `"${this.phrases[num]}"`;
  }

  private loadCard(): void {    
    this.clearMenu();
    for (let i = 0; i < this.days.length; i++) {
      const day = this.days[i];
      const snack = this.data[0][i].split('/')[0];
      const snackCalories = parseInt(this.data[0][i].split('/')[2]);
      const snackLactose = Boolean(this.data[0][i].split('/')[3] === 'true' ? true : false);
      const louch = this.data[1][i].split('/')[0];
      const louchCalories = parseInt(this.data[1][i].split('/')[2]);
      const louchLactose = Boolean(this.data[1][i].split('/')[3] === 'true' ? true : false);

      const sheetData = new SheetsData(day, louch, snack, snackCalories, snackLactose, louchCalories, louchLactose);
      this.menu.push(sheetData);
    }
  }

  public openNutritionalDialog(snackCalories: number, snackLactose: boolean, louchCalories: number, louchLactose: boolean) {
    const dialogRef = this.dialog.open(NutritionDialogComponent, {
      data: {snackCalories: snackCalories, snackLactose: snackLactose, louchCalories: louchCalories, louchLactose: louchLactose},
    });
    dialogRef.afterClosed().subscribe();
  }

  public openPwaDialog(): void {
    this.pwaDialogService.promptInstallation();
  }
  
  private clearMenu(): void {
    this.menu = [];
  }

  private transpose(matrix: [any]): Array<any> {
    return matrix[0].map((_: any, colIndex: any) => matrix.map(row => row[colIndex]));
  }

  private currentAudio: HTMLAudioElement | null = null;

  public playSound(): void {
    if (!this.currentAudio || this.currentAudio.paused) {
      this.currentAudio = new Audio("./kiam-sound.mp3");
      this.currentAudio.play();
    }
  }
}

class SheetsData implements SheetsDataInterface {
  day: string;
  snack: string;
  snackCalories: number;
  snackLactose: boolean;
  louch: string;
  louchCalories: number;
  louchLactose: boolean;

  constructor(day: string, louch: string, snack: string, snackCalories: number, snackLactose: boolean, louchCalories: number, louchLactose: boolean) {
    this.day = day;
    this.snack = snack;
    this.snackCalories = snackCalories;
    this.snackLactose = snackLactose;
    this.louch = louch;
    this.louchCalories = louchCalories;
    this.louchLactose = louchLactose;
  }
}

interface SheetsDataInterface {
  day: string;
  snack: string;
  snackCalories: number;
  snackLactose: boolean;
  louch: string;
  louchCalories: number;
  louchLactose: boolean;
}
