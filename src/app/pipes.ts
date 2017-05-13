import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
   name: 'keyobject'
})
@Injectable()
export class Keyobject implements PipeTransform {
  transform(value, args: string[]): any {
    const keys = [];

    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        keys.push({key: key, value: value[key]});
      }
    }

    return keys;
  }
}
