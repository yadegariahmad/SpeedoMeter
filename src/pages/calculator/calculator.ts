import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Diagnostic } from '@ionic-native/diagnostic';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { Geolocation } from '@ionic-native/geolocation';
import { DistanceCalculationProvider } from '../../providers';

@IonicPage({ name: 'calculation-page' })
@Component({
  selector: 'page-calculator',
  templateUrl: 'calculator.html',
})
export class CalculatorPage
{
  calculating = false;
  distanceCovered: number;
  speed: number;

  lat1: number;
  lon1: number;
  lat2: number;
  lon2: number;

  time1 = 0;
  time2 = 0;

  history: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public diagnostic: Diagnostic, public alertCtrl: AlertController,
    public openSettings: OpenNativeSettings, public gps: Geolocation, public distCal: DistanceCalculationProvider, public storage: Storage,
    public loading: LoadingController) { }

  ionViewDidLoad()
  {
    this.diagnostic.isGpsLocationEnabled()
      .then(status =>
      {
        if (status)
        {
          let loading = this.loading.create({
            content: 'درحال دریافت موقعیت مکانی شما',
          });
          loading.present();

          this.gps.getCurrentPosition({ enableHighAccuracy: true })
            .then(data =>
            {
              this.lat1 = this.lat2 = data.coords.latitude;
              this.lon1 = this.lon2 = data.coords.longitude;

              loading.dismiss();
              this.startCalculation();
            })
            .catch(error =>
            {
              loading.dismiss();
              this.alertCtrl.create({ message: error });
            });
        } else
        {
          let alert = this.alertCtrl.create({
            title: 'فعال نیست GPS',
            message: 'لطفا موقعیت یاب دستگاه خود را روشن کنید',
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => { }
              },
              {
                text: 'Ok',
                handler: () =>
                {
                  this.navCtrl.pop();
                  this.openSettings.open('location');
                }
              }
            ]
          });
          alert.present();
        }
      });
  }

  startCalculation()
  {
    this.distanceCovered = 0;
    this.speed = 0;
    this.calculating = true;
    this.calculateSpeed();
  }

  stopCalculation()
  {
    this.calculating = false;
    this.storage.set('history', this.history);
  }

  calculateSpeed()
  {
    let date = new Date();

    if (this.calculating)
    {
      this.gps.getCurrentPosition({ enableHighAccuracy: true })
        .then(data =>
        {
          this.lat1 = this.lat2;
          this.lon1 = this.lon2;

          this.lat2 = data.coords.latitude;
          this.lon2 = data.coords.longitude;

          this.time1 = this.time2;
          this.time2 = date.getTime();

          let distance = this.distCal.calcDistance(this.lat1, this.lon1, this.lat2, this.lon2);

          let duration = 0;

          let timeDiffer = this.time2 - this.time1;
          duration = this.msToTime(timeDiffer, 'second');

          this.speed = this.mPerSecondToKmPerHour(Math.floor(distance / duration));
          distance = distance / 1000;

          this.distanceCovered += distance;

          this.calculateSpeed();

          this.history.push({
            lat: data.coords.latitude,
            lon: data.coords.longitude,
            time: date.getTime()
            // distance: this.aaa,
            // duration: timeDiffer,
            // speed: this.speed,
            // distCover: this.distanceCovered
          });
        });
    }
  }

  msToTime(duration, type: string)
  {
    let retVal = 0;

    switch (type)
    {
      case 'second':
        retVal = (duration / 1000);
        break;

      case 'minute':
        retVal = (duration / (1000 * 60));
        break;

      case 'hour':
        retVal = (duration / (1000 * 60 * 60));
        break;

      default:
        break;
    }

    return retVal;
  }

  mPerSecondToKmPerHour(speed)
  {
    return speed * 3.6;
  }

}
