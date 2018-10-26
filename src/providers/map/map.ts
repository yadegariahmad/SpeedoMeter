import { Injectable } from '@angular/core';

declare var ol: any;

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
    select: false,
    pinchRotate: false,
    pinchZoom: false
  };

  olControls = {
    attribution: false,
    zoom: false
  };

  constructor() { }

  initMap(lat: number, long: number)
  {
    let map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([long, lat]),
        zoom: 16
      }),
      interactions: ol.interaction.defaults(this.olInteractions),
      controls: ol.control.defaults(this.olControls)
    });

    this.addMarker(lat, long, map);

    return map;
  }

  setMap(lat: number, long: number, map: any)
  {
    this.addMarker(lat, long, map);
    map.getView().setZoom(16);
  }

  addMarker(lat: number, long: number, map: any)
  {
    let marker = new ol.Feature({
      geometry: new ol.geom.Point(
        ol.proj.fromLonLat([long, lat])
      )
    });

    let vectorSource = new ol.source.Vector({
      features: [marker]
    });

    let markerVectorLayer = new ol.layer.Vector({
      source: vectorSource,
    });

    map.addLayer(markerVectorLayer);
  }

}