import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';

declare var OpenLayers: any;

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
    // this.retrieveRecords();
    let map = new OpenLayers.Map('map');
    map.addLayer(new OpenLayers.Layer.OSM());
    var lonLat = new OpenLayers.LonLat(-0.1279688, 51.5077286)
      .transform(
        new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
        map.getProjectionObject() // to Spherical Mercator Projection
      );

    var zoom = 16;

    var markers = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(markers);

    markers.addMarker(new OpenLayers.Marker(lonLat));

    map.setCenter(lonLat, zoom);
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
