import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { AlcaldeComponent } from './entregas/alcalde/component/alcaldeComponent/alcaldeComponent';
import { AlcanyizComponent } from './entregas/alcanyiz/component/alcanyizComponent/alcanyizComponent';
import { CalinescuComponent } from './entregas/calinescu/component/calinescuComponent/calinescuComponent';
import { CastanyeraComponent } from './entregas/castanyera/component/castanyeraComponent/castanyeraComponent';
import { ContrerasComponent } from './entregas/contreras/component/contrerasComponent/contrerasComponent';
import { FernandezComponent } from './entregas/fernandez/component/fernandezComponent/fernandezComponent';
import { GarciaComponent } from './entregas/garcia/component/garciaComponent/garciaComponent';
import { PallasComponent } from './entregas/pallas/component/pallasComponent/pallasComponent';
import { PalomaresComponent } from './entregas/palomares/component/palomaresComponent/palomaresComponent';
import { PavonComponent } from './entregas/pavon/component/pavonComponent/pavonComponent';
import { ReynaComponent } from './entregas/reyna/component/reynaComponent/reynaComponent';
import { SalinasComponent } from './entregas/salinas/component/salinasComponent/salinasComponent';
import { SemperteguiComponent } from './entregas/sempertegui/component/semperteguiComponent/semperteguiComponent';
import { SilvestreComponent } from './entregas/silvestre/component/silvestreComponent/silvestreComponent';
import { SoaresComponent } from './entregas/soares/component/soaresComponent/soaresComponent';
import { UskiComponent } from './entregas/uski/component/uskiComponent/uskiComponent';
import { ZanonComponent } from './entregas/zanon/component/zanonComponent/zanonComponent';
import { DinoComponent } from './entregas/calinescu/component/dino-component/dino-component';
import { DinoDetails } from './entregas/calinescu/component/dino-details/dino-details';
import { Favoritos } from './entregas/calinescu/component/favoritos/favoritos';
import { HomePageComponent } from './entregas/sempertegui/component/homePageComponent/homePageComponent';
import { CatalogPageComponent } from './entregas/sempertegui/component/catalogPageComponent/catalogPageComponent';
import { ProductPageComponent } from './entregas/sempertegui/component/productPageComponent/productPageComponent';

// Importar componentes hijos de soares
import { HomeComponent } from './entregas/soares/soares/component/home/home.component';
import { GamesComponent } from './entregas/soares/soares/component/games/games.component';
import { PlayersModalComponent } from './entregas/soares/soares/component/players/players.component';
import { RankingComponent } from './entregas/soares/soares/component/ranking/ranking.component';
import { StatisticsComponent } from './entregas/soares/soares/component/statistics/statistics.component';
import { TeamsComponent } from './entregas/soares/soares/component/teams/teams.component';
import { QuizComponent } from './entregas/soares/soares/component/quiz/quiz.component';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'home', component: Home },
    { path: 'alcalde', component: AlcaldeComponent },
    { path: 'alcanyiz', component: AlcanyizComponent },
    { path: 'alfonso', component: AlfonsoComponent },
    { 
        path: 'calinescu', 
        component: CalinescuComponent,
        children: [
            { path: 'lista', component: DinoComponent },
            { path: 'dino-details/:nombre', component: DinoDetails },
            { path: 'favoritos', component: Favoritos }
        ]
    },
    {
        path: 'alfonso',
        loadComponent: () => import('./entregas/alfonso/component/alfonsoComponent/alfonsoComponent').then(m => m.AlfonsoComponent),
    },
    {
        path: 'alfonso/menu',
        loadComponent: () => import('./entregas/alfonso/component/menuPage/menuPage').then(m => m.MenuPageComponent),
    },
    {
        path: 'alfonso/stock',
        loadComponent: () => import('./entregas/alfonso/component/stockPage/stockPage').then(m => m.StockPageComponent),
    },
    { path: 'calinescu', component: CalinescuComponent },
    { path: 'castanyera', component: CastanyeraComponent },
    { path: 'contreras', component: ContrerasComponent },
    { path: 'fernandez', component: FernandezComponent },
    { path: 'garcia', component: GarciaComponent },
    { path: 'pallas', component: PallasComponent },
    { path: 'palomares', component: PalomaresComponent },
    { path: 'pavon', component: PavonComponent },
    { path: 'reyna', component: ReynaComponent },
    { path: 'salinas', component: SalinasComponent },
    { path: 'sempertegui', component: SemperteguiComponent,
        children: [
            { path: '', component: HomePageComponent },
            { path: 'home', component: HomePageComponent },
            { path: 'catalog', component: CatalogPageComponent },
            { path: 'catalog/:id', component: ProductPageComponent }
        ],
    },
    { path: 'silvestre', component: SilvestreComponent },
    {
path: 'soares',
component: SoaresComponent,
children: [
{ path: 'home', component: HomeComponent },
{ path: 'games', component: GamesComponent },
{ path: 'players', component: PlayersModalComponent },
{ path: 'players/:id', component: PlayersModalComponent },
{ path: 'ranking', component: RankingComponent },
{ path: 'statistics', component: StatisticsComponent },
{ path: 'teams', component: TeamsComponent },
{ path: 'quiz', component: QuizComponent },
{ path: '', redirectTo: 'home', pathMatch: 'full' }
]
},
    { path: 'uski', component: UskiComponent },
    { path: 'zanon', component: ZanonComponent },
];
