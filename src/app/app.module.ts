import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { Insomnia } from '@ionic-native/insomnia';
import { SQLite } from '@ionic-native/sqlite';

import { MyApp } from './app.component';
import { DistanceCalculationProvider } from '../providers/distance-calculation/distance-calculation';
import { DigitConvertorProvider } from '../providers/digit-convertor/digit-convertor';
import { DatabaseProvider } from '../providers/database/database';
import { UnitConvertorProvider } from '../providers/unit-convertor/unit-convertor';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    // Native
    StatusBar,
    SplashScreen,
    Diagnostic,
    Geolocation,
    OpenNativeSettings,
    Insomnia,
    SQLite,

    // Providers
    DistanceCalculationProvider,
    DigitConvertorProvider,
    DatabaseProvider,

    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UnitConvertorProvider,
  ]
})
export class AppModule {}
