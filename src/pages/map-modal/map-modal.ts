import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { MapProvider } from '../../providers';

@IonicPage({ name: 'map-modal' })
@Component({
  selector: 'page-map-modal',
  templateUrl: 'map-modal.html',
})
export class MapModalPage
{

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private map: MapProvider) { }

  ionViewDidLoad()
  {
    let lat = this.navParams.get('lat');
    let lon = this.navParams.get('lon');
    this.map.initMap(lat, lon);
  }

  closeModal()
  {
    this.viewCtrl.dismiss();
  }

}
