import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Subscription } from 'rxjs/subscription'
import { Diagnostic } from '@ionic-native/diagnostic';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { Geolocation } from '@ionic-native/geolocation';
import { DistanceCalculationProvider, MoveType } from '../../providers';

@IonicPage({ name: 'calculation-page' })
@Component({
  selector: 'page-calculator',
  templateUrl: 'calculator.html',
})
export class CalculatorPage
{
  Type = MoveType;
  calculating = false;
  _moveType = 1;
  distanceCovered: number;
  speed: number;
  watch: Subscription;
  aaa = 0;

  lat1: number;
  lon1: number;
  lat2: number;
  lon2: number;

  time1: number;
  time2: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public diagnostic: Diagnostic, public alertCtrl: AlertController,
    public openSettings: OpenNativeSettings, public gps: Geolocation, private distCal: DistanceCalculationProvider) { }

  startCalculation()
  {
    this.distanceCovered = 0;
    this.speed = 0;

    this.diagnostic.isGpsLocationEnabled()
      .then(status =>
      {
        if (status)
        {
          this.calculateSpeed();
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
                  this.openSettings.open('location');
                }
              }
            ]
          });
          alert.present();
        }
      })
  }

  stopCalculation()
  {
    this.calculating = false;
    this.watch.unsubscribe();
  }

  calculateSpeed()
  {
    let date = new Date();
    this.calculating = true;

    this.gps.getCurrentPosition().then(data =>
    {
      this.lat1 = this.lat2 = data.coords.latitude;
      this.lon1 = this.lon2 = data.coords.longitude;

      this.time1 = this.time2 = date.getTime();

      this.watch = this.gps.watchPosition().subscribe(data =>
      {
        this.lat1 = this.lat2;
        this.lon1 = this.lon2;

        this.lat2 = data.coords.latitude;
        this.lon2 = data.coords.longitude;

        let distance = this.distCal.calcDistance(this.lat1, this.lon1, this.lat2, this.lon2);
        let duration = 0;
        this.time1 = this.time2;
        this.time2 = new Date().getTime();

        let timeDiffer = this.aaa = this.time2 - this.time1;

        switch (this._moveType)
        {
          case this.Type.walk:
            distance = distance * 1000; // convert km to m;
            duration = this.msToTime(timeDiffer, 'second');
            break;

          case this.Type.car:
            duration = this.msToTime(timeDiffer, 'hour')

          default:
            break;
        }
        this.distanceCovered += distance;
        this.speed = distance / duration;
      });
    }).catch(error =>
    {
      this.aaa = error;
    });
  }

  msToTime(duration, type: string)
  {
    let retVal = 0;

    switch (type)
    {
      case 'second':
        retVal = (duration / 1000) % 60;
        break;

      case 'minute':
        retVal = (duration / (1000 * 60)) % 60;
        break;

      case 'hour':
        retVal = (duration / (1000 * 60 * 60)) % 24;
        break;

      default:
        break;
    }

    // let milliseconds = (duration % 1000) / 100;




    // hours = (hours < 10) ? "0" + hours : hours;
    // minutes = (minutes < 10) ? "0" + minutes : minutes;
    // seconds = (seconds < 10) ? "0" + seconds : seconds;

    // return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    return retVal;
  }

}
