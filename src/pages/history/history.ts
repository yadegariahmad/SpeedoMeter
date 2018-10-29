import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';

@IonicPage({ name: 'history-page' })
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage
{
  history: any[] = [];

  constructor(public navCtrl: NavController, private db: DatabaseProvider, private loading: LoadingController) { }

  ionViewDidLoad()
  {
    const loader = this.loading.create({
      content: 'لطفا صبر کنید ...'
    });

    this.db.retrieveRecords()
      .then((records) =>
      {
        this.history = records;
        console.log(this.history)
        loader.dismiss();
      })
      .catch((e) =>
      {
        console.log(e);
        loader.dismiss();
      });
  }

}
