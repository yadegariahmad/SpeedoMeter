import { Injectable } from '@angular/core';
import { UnitConvertorProvider } from '../unit-convertor/unit-convertor';

@Injectable()
export class DistanceCalculationProvider
{

  constructor(private unitConv: UnitConvertorProvider) { }

  /**
   * Calculates distance between two points on eath
   * and returns result in meter unit.
   * @param {number} lat1 latitude of point number 1
   * @param {number} lon1 longitude of point number 1
   * @param {number} lat2 latitude of point number 2
   * @param {number} lon2 longitude of point number 2
   */
  calcDistance(lat1: number, lon1: number, lat2: number, lon2: number)
  {
    let retVal: number;

    const earthRadius = 6371000;

    let delta_lat = this.unitConv.degreeToRadiant(lat2 - lat1);
    let delta_lon = this.unitConv.degreeToRadiant(lon2 - lon1);

    let a = Math.sin(delta_lat / 2) * Math.sin(delta_lat / 2)
      + Math.cos(this.unitConv.degreeToRadiant(lat1)) * Math.cos(this.unitConv.degreeToRadiant(lat2)) 
      * Math.sin(delta_lon / 2) * Math.sin(delta_lon / 2);

    let c = 2 * Math.asin(Math.sqrt(a));
    retVal = Math.round(earthRadius * c);

    return retVal;
  }

}
