import { Pipe, PipeTransform } from '@angular/core';
import { DigitConvertorProvider } from '../../providers';

@Pipe({ name: 'convertdigit' })
export class ConvertdigitPipe implements PipeTransform
{
  constructor(private digitConvertor: DigitConvertorProvider) { }

  transform(input: any, language = 'fa')
  {
    return this.digitConvertor.convertDigit(input, language);
  }
}
