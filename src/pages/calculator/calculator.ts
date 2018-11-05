import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { Geolocation } from '@ionic-native/geolocation';
import { Insomnia } from '@ionic-native/insomnia';
import { DistanceCalculationProvider, DatabaseProvider, UnitConvertorProvider, MapProvider } from '../../providers';
import * as moment from 'moment-jalaali';

export interface DistanceTime
{
  distance: number,
  time: number
}

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
  distanceTimeArr: Array<DistanceTime> = new Array<DistanceTime>();

  map: any;
  timer: any;

  lat1: number;
  lon1: number;
  lat2: number;
  lon2: number;

  s_lat: number;
  s_lon: number;
  d_lat: number;
  d_lon: number;

  time1 = 0;
  time2 = 0;
  totalTime = 0;

  constructor(public navCtrl: NavController, private diagnostic: Diagnostic, private alertCtrl: AlertController, private insomnia: Insomnia,
    private openSettings: OpenNativeSettings, private gps: Geolocation, private distCal: DistanceCalculationProvider,
    private loading: LoadingController, private db: DatabaseProvider, private unitConv: UnitConvertorProvider, private mapProvider: MapProvider
  ) { }

  ionViewDidLoad()
  {
    this, this.insomnia.keepAwake()
      .then(() => { });

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
              this.lat1 = this.lat2 = this.s_lat = data.coords.latitude;
              this.lon1 = this.lon2 = this.s_lon = data.coords.longitude;

              this.map = this.mapProvider.initMap(this.lat1, this.lon1);

              loading.dismiss();
              this.startCalculation();
            })
            .catch(error =>
            {
              loading.dismiss();
            });
        } else
        {
          this.createAlert();
        }
      });
  }

  startCalculation()
  {
    this.distanceCovered = 0;
    this.speed = 0;
    this.calculating = true;
    this.timer = setInterval(() =>
    {
      this.totalTime += 1;
    }, 1000);
    this.calculateSpeed();
  }

  stopCalculation()
  {
    this.calculating = false;
    clearInterval(this.timer);

    this.d_lat = this.lat2;
    this.d_lon = this.lon2;

    let date = moment().format('jYYYY/jMM/jDD');
    this.totalTime = +this.unitConv.secondToMinute(Math.floor(this.totalTime)).toFixed(2);

    const averageSpeed = +this.calculateAverageSpeed(this.distanceTimeArr).toFixed(2);
    this.addRecord(this.s_lon, this.s_lat, this.d_lon, this.d_lat, this.totalTime, this.distanceCovered, averageSpeed, date);
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

          this.mapProvider.setMap(this.lat2, this.lon2, this.map);

          this.time1 = this.time2;
          this.time2 = date.getTime();

          let distance = this.distCal.calcDistance(this.lat1, this.lon1, this.lat2, this.lon2);

          let duration = 0;

          let timeDiffer = this.time2 - this.time1;
          duration = this.unitConv.msToSecond(timeDiffer);

          this.distanceTimeArr.push({ distance: distance, time: duration }); // distance in meter, time in second

          this.speed = +this.unitConv.mPerSecondToKmPerHour(Math.floor(distance / duration)).toFixed(1);
          distance = distance / 1000;


          this.distanceCovered += distance;
          this.distanceCovered = +this.distanceCovered.toFixed(2);

          this.calculateSpeed();
        });
    }
  }

  createAlert()
  {
    let alert = this.alertCtrl.create({
      title: 'فعال نیست GPS',
      message: 'لطفا موقعیت یاب دستگاه خود را روشن کنید',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () =>
          {
            this.navCtrl.pop();
          }
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

  addRecord(s_lon: number, s_lat: number, d_lon: number, d_lat: number, time: number, distance: number, averageSpeed: number, date: string)
  {
    this.db.addRecord(s_lon, s_lat, d_lon, d_lat, time, distance, averageSpeed, date)
      .then(() => { })
      .catch((e) =>
      {
        console.log(e);
      });
  }

  calculateAverageSpeed(input: DistanceTime[])
  {
    let totalD = 0;
    let totalT = 0;
    let average = 0;

    for (let i = 0; i < input.length; i++)
    {
      totalT += input[i].time;
      totalD += input[i].distance;
    }

    average = this.unitConv.mPerSecondToKmPerHour(totalD / totalT);
    return average;
  }

  ionViewDidLeave()
  {
    if (this.calculating)
    {
      this.stopCalculation();
    }
  }
}
