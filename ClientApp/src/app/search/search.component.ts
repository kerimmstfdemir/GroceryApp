import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchTerm: string = '';

  @Output() searchEvent: EventEmitter<string> = new EventEmitter<string>();

  search() {
    this.searchEvent.emit(this.searchTerm);
  }
}
