import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MappingComponent } from 'src/app/pages/mapping/mapping.component';
import { OverviewComponent } from 'src/app/pages/overview/overview.component';
import { VocabularyComponent } from 'src/app/pages/vocabulary/vocabulary.component';

const routes: Routes = [
  { path: '',
    redirectTo: '/mapping',
    pathMatch: 'full'
  },
  { path: 'mapping', component: MappingComponent},
  { path: 'overview', component: OverviewComponent},
  { path: 'vocabulary', component: VocabularyComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
