import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { AlcaldeComponent } from './entregas/alcalde/component/alcaldeComponent/alcaldeComponent';
import { AlcanyizComponent } from './entregas/alcanyiz/component/alcanyizComponent/alcanyizComponent';
import { AlfonsoComponent } from './entregas/alfonso/component/alfonsoComponent/alfonsoComponent';
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
    { path: 'castanyera', component: CastanyeraComponent },
    { path: 'contreras', component: ContrerasComponent },
    { path: 'fernandez', component: FernandezComponent },
    { path: 'garcia', component: GarciaComponent },
    { path: 'pallas', component: PallasComponent },
    { path: 'palomares', component: PalomaresComponent },
    { path: 'pavon', component: PavonComponent },
    { path: 'reyna', component: ReynaComponent },
    { path: 'salinas', component: SalinasComponent },
    { path: 'sempertegui', component: SemperteguiComponent },
    { path: 'silvestre', component: SilvestreComponent },
    { path: 'soares', component: SoaresComponent },
    { path: 'uski', component: UskiComponent },
    { path: 'zanon', component: ZanonComponent },
];
