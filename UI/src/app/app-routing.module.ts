import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MappingComponent } from 'src/app/components/pages/mapping/mapping.component';
import { OverviewComponent } from 'src/app/components/pages/overview/overview.component';
import { VocabularyComponent } from 'src/app/components/pages/vocabulary/vocabulary.component';
import { ComfyComponent } from './components/comfy/comfy.component';

const routes: Routes = [
  { path: '',
    redirectTo: '/comfy',
    pathMatch: 'full'
  },
  { path: 'comfy', component: ComfyComponent },
  { path: 'mapping', component: MappingComponent},
  { path: 'overview', component: OverviewComponent},
  { path: 'vocabulary', component: VocabularyComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
