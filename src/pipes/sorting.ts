import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: "filter",
  pure: false
})
export class Sorting implements PipeTransform {
   
   transform(items: Array<any>, conditions: {[field: string]: any}): Array<any> {
        return items.filter(item => {
            for (let field in conditions) {
                if (item[field] !== conditions[field]) {
                    return false;
                }
            }
            return true;
        });
}
}







 
 
