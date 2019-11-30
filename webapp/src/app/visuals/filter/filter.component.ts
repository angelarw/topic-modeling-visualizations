import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Filter} from "./filter";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from '@angular/material/chips';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  filter: Filter = new Filter();
  @Output() filterUpdateEvent = new EventEmitter<Filter>();

  constructor() {
  }

  ngOnInit() {
  }

  onUpdate(value: Filter) {
    this.filterUpdateEvent.emit(value)
  }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our filter term
    if ((value || '').trim()) {
      this.filter.terms.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.filterUpdateEvent.emit(this.filter)
  }

  remove(term: string): void {
    const index = this.filter.terms.indexOf(term);

    if (index >= 0) {
      this.filter.terms.splice(index, 1);
    }

    this.filterUpdateEvent.emit(this.filter)
  }

}


