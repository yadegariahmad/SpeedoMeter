import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ModalController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';

@IonicPage({ name: 'history-page' })
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage
{
  history: any[] = [];

  constructor(public navCtrl: NavController, private db: DatabaseProvider, private loading: LoadingController, private modalCtrl: ModalController) { }

  ionViewDidLoad()
  {
    const loader = this.loading.create({
      content: 'لطفا صبر کنید ...'
    });
    loader.present();

    this.db.retrieveRecords()
      .then((records) =>
      {
        this.history = records;
        loader.dismiss();
      })
      .catch((e) =>
      {
        console.log(e);
        loader.dismiss();
      });
  }

  clearHistory()
  {
    this.db.deleteAllRecords()
      .then(() =>
      {
        this.history = [];
      });
  }

  showMap(lat: number, lon: number)
  {
    let data = { lat: lat, lon: lon };
    let modalPage = this.modalCtrl.create('map-modal', data);
    modalPage.present();
  }
}
