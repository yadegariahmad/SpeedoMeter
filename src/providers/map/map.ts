import { Injectable } from '@angular/core';

import * as L from 'leaflet';

@Injectable()
export class MapProvider
{
  marker: any;

  constructor() { }

  initMap(lat: number, long: number)
  {
    let map = L.map('map').setView([lat, long], 18);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoieWFkZWdhcmlhaG1hZCIsImEiOiJjam5xNGZtYWIxbGtxM2ttcXFraGFyYmpxIn0.1HaKpJpaDTwweiHTGwg1lQ'
    }).addTo(map);

    // this.disableIntractions(map);

    this.setMap(lat, long, map);

    return map;
  }

  setMap(lat: number, long: number, map: any)
  {
    if (this.marker)
    {
      map.removeLayer(this.marker);
    }

    this.marker = L.marker([lat, long]).addTo(map);
  }

  disableIntractions(map)
  {
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    if (map.tap) map.tap.disable();
  }

}