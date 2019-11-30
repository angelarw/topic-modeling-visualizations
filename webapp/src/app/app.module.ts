import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatTableModule} from '@angular/material/table';
import {
  MatToolbarModule, MatTooltipModule, MatFormFieldModule,
  MatInputModule, MatButtonModule, MatListModule
} from "@angular/material";
import {MatChipsModule} from '@angular/material/chips';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';

import {AmplifyAngularModule, AmplifyService} from "aws-amplify-angular";
import {D3Service, D3_DIRECTIVES} from './d3';
import {PapaParseModule} from 'ngx-papaparse';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {TopicGraphComponent} from './topic-graph/topic-graph.component';
import {GraphComponent} from './visuals/graph/graph.component';
import {SHARED_VISUALS} from "./visuals/shared";
import {DocumentGraphComponent} from "./document-graph/document-graph.component";
import {TableComponent} from "./visuals/table/table.component";
import {FilterComponent} from './visuals/filter/filter.component';
import {TooltipComponent} from './tooltip/tooltip.component';
import {LoginComponent} from './login/login.component';
import {QueryComponent} from './query/query.component';
import {NavbarComponenet} from './nav-bar/navbar.componenet';
import {DocDetailsComponent} from "./visuals/doc-details/doc-details.component";

@NgModule({
  declarations: [
    AppComponent,
    TopicGraphComponent,
    DocumentGraphComponent,
    TableComponent,
    DocDetailsComponent,
    GraphComponent,

    ...SHARED_VISUALS,
    ...D3_DIRECTIVES,
    FilterComponent,
    TooltipComponent,
    LoginComponent,
    QueryComponent,
    NavbarComponenet,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonToggleModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule,
    MatDialogModule,
    PapaParseModule,
    AmplifyAngularModule,
  ],
  entryComponents: [
    DocDetailsComponent,
  ],
  providers: [D3Service, AmplifyService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
