import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { MappingComponent } from './components/pages/mapping/mapping.component';
import { OverviewComponent } from './components/pages/overview/overview.component';
import { VocabularyComponent } from './components/pages/vocabulary/vocabulary.component';


const routes: Routes = [
  { path: 'mapping', component: MappingComponent},
  { path: 'overview', component: OverviewComponent},
  { path: 'vocabulary', component: VocabularyComponent},
  { path: '**', component: MappingComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
