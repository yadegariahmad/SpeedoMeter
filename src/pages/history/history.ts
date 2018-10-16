import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage({ name: 'history-page' })
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage
{
  history: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage)
  {
    storage.get('history').then(data =>
    {
      this.history = data;
    });
  }

}
