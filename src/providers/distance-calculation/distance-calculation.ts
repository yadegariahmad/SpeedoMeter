import { Injectable } from '@angular/core';

@Injectable()
export class DistanceCalculationProvider {

  constructor() { }

  calcDistance(lat1, lon1, lat2, lon2) {
    let retVal: number;

    const earthRadius = 6371;
    lat1 = this.toRadians(lat1);
    lat2 = this.toRadians(lat2);

    let delta_lat = this.toRadians(lat2 - lat1);
    let delta_lon = this.toRadians(lon2 - lon1);

    let a = Math.sin(delta_lat / 2) * Math.sin(delta_lat / 2) +
      Math.sin(delta_lon / 2) * Math.sin(delta_lon / 2) * Math.cos(lat1) * Math.cos(lat2);

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    retVal = earthRadius * c;

    return retVal;
  }

  toRadians(degree: number) {
    let retVal: number;
    retVal = degree * Math.PI / 180.0;

    return retVal;
  }

}
