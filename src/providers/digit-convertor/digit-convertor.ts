import { Injectable } from '@angular/core';

@Injectable()
export class DigitConvertorProvider
{

  constructor() { }

  convertDigit(input: any, language: string)
  {
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

    let retVal = '';

    if (input != undefined)
    {
      if (typeof input === 'number')
      {
        input = input.toString();
      }

      switch (language)
      {
        case 'ar':
          retVal = input.replace(/[0-9]/g, (i) =>
          {
            return arabicDigits[i];
          });
          break;

        case 'fa':
          retVal = input.replace(/[0-9]/g, (i) =>
          {
            return farsiDigits[i];
          });
          break;

        default:
          retVal = input;
          break;
      }
    }

    return retVal;
  }

}
