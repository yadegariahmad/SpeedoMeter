import { Injectable } from '@angular/core';

declare var OpenLayers: any;

@Injectable()
export class MapProvider
{
  olInteractions = {
    doubleClickZoom: false,
    dragAndDrop: false,
    dragPan: false,
    keyboardPan: false,
    keyboardZoom: false,
    mouseWheelZoom: false,
    pointer: false,
    select: false
  };

  olControls = {
    attribution: false,
    zoom: false
  };

  constructor() { }

  plotActivity(lat: number, long: number, map: any)
  {

    let lonLat = new OpenLayers.LonLat(long, lat)
      .transform(
        new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
        map.getProjectionObject() // to Spherical Mercator Projection
      );

    let zoom = 16;

    let markers = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(markers);

    markers.addMarker(new OpenLayers.Marker(lonLat));

    map.setCenter(lonLat, zoom);

  }

}