import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { TranslateModule } from './translate/translate.module';
import { TutorialModule } from './tutorial/tutorial.module';
import { XliffModule } from './xliff/xliff.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SidebarModule,
    TranslateModule,
    HomeModule,
    XliffModule,
    TutorialModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
