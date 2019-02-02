import { Injectable } from '@angular/core';

@Injectable()
export class UnitConvertorProvider
{

  constructor() { }

  msToSecond(milisecond: number)
  {
    let retVal = 0;
    retVal = milisecond / 1000;

    return retVal;
  }

  secondToMinute(second: number)
  {
    let retVal = 0;
    retVal = second / 60;

    return retVal;
  }

  mPerSecondToKmPerHour(speed: number)
  {
    let retVal = 0;
    retVal = speed * 3.6;

    return retVal;
  }

  /**
   * Converts degree to radiant
   * @param {number} degree angle in degree
   */
  degreeToRadiant(degree: number)
  {
    let retVal: number;
    retVal = degree * Math.PI / 180.0;

    return retVal;
  }

}
