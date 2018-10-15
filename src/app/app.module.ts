import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { DistanceCalculationProvider } from '../providers/distance-calculation/distance-calculation';
import { DigitConvertorProvider } from '../providers/digit-convertor/digit-convertor';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    // Native
    StatusBar,
    SplashScreen,
    Diagnostic,
    Geolocation,
    OpenNativeSettings,
    LocationAccuracy,

    // Providers
    DistanceCalculationProvider,

    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DigitConvertorProvider,
  ]
})
export class AppModule {}
