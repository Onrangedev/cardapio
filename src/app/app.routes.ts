import { Routes } from '@angular/router';
import { AlunosComponent } from './pages/alunos/alunos.component';
import { ConfiguracoesComponent } from './pages/configuracoes/configuracoes.component';

export const routes: Routes = [
    { path: '', component: AlunosComponent },
    { path: 'configuracoes', component: ConfiguracoesComponent },
];
