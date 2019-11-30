import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TopicGraphComponent} from "./topic-graph/topic-graph.component";
import {DocumentGraphComponent} from "./document-graph/document-graph.component";
import {AuthGuard} from "./auth/auth.guard";
import {LoginComponent} from "./login/login.component";


const routes: Routes = [
  {path: '', redirectTo: '/topics', pathMatch: 'full', canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'topics', component: TopicGraphComponent, canActivate: [AuthGuard]},
  {path: 'documents', component: DocumentGraphComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
