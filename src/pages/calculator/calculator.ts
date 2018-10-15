import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs/subscription'
import { Diagnostic } from '@ionic-native/diagnostic';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
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

  lat1: number;
  lon1: number;
  lat2: number;
  lon2: number;

  time1: number;
  time2: number;

  history: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public diagnostic: Diagnostic, public alertCtrl: AlertController,
    public openSettings: OpenNativeSettings, public gps: Geolocation, public distCal: DistanceCalculationProvider,
    public accuracy: LocationAccuracy, public storage: Storage) { }

  startCalculation()
  {
    this.distanceCovered = 0;
    this.speed = 0;

    this.diagnostic.isGpsLocationEnabled()
      .then(status =>
      {
        if (status)
        {
          this.optimizeLocationAccuracy();
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
    this.storage.set('history', this.history);
  }

  optimizeLocationAccuracy()
  {
    this.accuracy.canRequest().then(canRequest =>
    {
      if (canRequest)
      {
        this.accuracy.request(this.accuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => this.calculateSpeed(),
          (error) => { console.log(error); this.calculateSpeed() }
        );
      } else
      {
        this.calculateSpeed();
      }
    });
  }

  calculateSpeed()
  {
    let date = new Date();
    this.calculating = true;

    this.gps.getCurrentPosition().then(data =>
    {
      this.lat1 = this.lat2 = data.coords.latitude;
      this.lon1 = this.lon2 = data.coords.longitude;

      console.log('1: ', this.lat1, ' ', this.lon1);

      this.time1 = this.time2 = date.getTime();

      this.watch = this.gps.watchPosition().subscribe(data =>
      {
        this.lat1 = this.lat2;
        this.lon1 = this.lon2;

        this.lat2 = data.coords.latitude;
        this.lon2 = data.coords.longitude;

        this.time1 = this.time2;
        this.time2 = new Date().getTime();

        let distance = this.distCal.calcDistance(this.lat1, this.lon1, this.lat2, this.lon2);
        console.log('2: ', distance);

        let duration = 0;

        let timeDiffer = this.time2 - this.time1;
        duration = Math.floor(this.msToTime(timeDiffer, 'second'));
        console.log('3: ', timeDiffer, ' ', duration);

        switch (this._moveType)
        {
          case this.Type.walk:
            this.speed = Math.floor(distance / duration);
            break;

          case this.Type.car:
            this.speed = this.mPerSecondToKmPerHour(Math.floor(distance / duration));
            distance = distance / 1000;
            break;

          default:
            break;
        }

        this.distanceCovered += Math.floor(distance);

        this.history.push({
          distance: distance,
          duration: duration,
          speed: this.speed,
          distCover: this.distanceCovered
        });
      });
    }).catch(error =>
    {
      console.log(error);
    });
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
