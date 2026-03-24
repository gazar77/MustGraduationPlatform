import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByTitle'
})
export class FilterByTitlePipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    
    searchText = searchText.toLowerCase();
    
    return items.filter(it => {
      // Check common title fields
      const title = it.title || it.name || it.projectName || it.label || '';
      return title.toLowerCase().includes(searchText);
    });
  }
}
