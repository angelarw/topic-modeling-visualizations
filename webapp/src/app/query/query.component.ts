import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {EntityQuery} from "./entityQuery";

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})
export class QueryComponent implements OnInit {
  @Output() queryUpdateEvent = new EventEmitter<EntityQuery>();
  query: EntityQuery = new EntityQuery('005', 10);

  constructor() {
  }

  ngOnInit() {
    this.queryUpdateEvent.emit(this.query)
  }

  onUpdate(value: EntityQuery) {
    this.queryUpdateEvent.emit(value)
  }

}
