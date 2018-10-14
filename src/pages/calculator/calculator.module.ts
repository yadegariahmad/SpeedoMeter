import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalculatorPage } from './calculator';

import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    CalculatorPage,
  ],
  imports: [
    IonicPageModule.forChild(CalculatorPage),
    PipesModule
  ]
})
export class CalculatorPageModule { }
