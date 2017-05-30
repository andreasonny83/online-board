import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
   name: 'keyobject'
})
@Injectable()
export class Keyobject implements PipeTransform {
  transform(value, args: string[]): any[] {
    const keys = [];

    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        keys.push({key: key, value: value[key]});
      }
    }

    return keys;
  }
}

@Pipe({
   name: 'filterColumn'
})
@Injectable()
export class FilterColumn implements PipeTransform {
  transform(post, column: number): any[] {
    const posts = [];

    for (const key in post) {
      if (post.hasOwnProperty(key) &&
          post[key].hasOwnProperty('value') &&
          post[key].value.hasOwnProperty('col')) {
        if (post[key].value.col === column) {
          posts.push(post[key]);
        }
      }
    }

    return posts;
  }
}
