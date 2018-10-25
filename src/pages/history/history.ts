import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';

@IonicPage({ name: 'history-page' })
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage
{
  history: any[] = [];

  constructor(public navCtrl: NavController, private db: DatabaseProvider) { }

  ionViewDidLoad()
  {
    this.retrieveRecords();
  }

  retrieveRecords()
  {
    this.db.retrieveRecords()
      .then((records: any) =>
      {
        this.history = records;
      })
      .catch((e) =>
      {
        console.log(e)
      });
  }

}
