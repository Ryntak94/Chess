import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ChessBoardComponent } from './components/chess-board/chess-board.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChessService } from './services/chess.service';

@NgModule({
  declarations: [
    AppComponent,
    ChessBoardComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule
  ],
  providers: [ChessService],
  bootstrap: [AppComponent]
})
export class AppModule { }
