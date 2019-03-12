import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { MappingComponent } from './components/layout/mapping/mapping.component';
import { OverviewComponent } from './components/layout/overview/overview.component';
import { VocabularyComponent } from './components/layout/vocabulary/vocabulary.component';


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
