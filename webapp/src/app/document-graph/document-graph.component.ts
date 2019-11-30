import {Component, OnInit} from '@angular/core';
import {Node, Link} from '../d3';

import {Filter} from "../visuals/filter/filter";
import {GraphFilterService} from "../graph-filter/graph-filter.service";
import {DataService} from "../data-service/data.service";
import {EntityQuery} from "../query/entityQuery";
import CONFIG from "../topic-graph/topic-graph.config";

@Component({
  selector: 'app-root',
  templateUrl: './document-graph.component.html',
  styleUrls: ['./document-graph.component.scss']
})


export class DocumentGraphComponent {
  private _nodes: Node[] = [];
  private _links: Link[] = [];
  nodes: Node[] = [];
  links: Link[] = [];
  showLoader: boolean = false;

  constructor(private graphFilterService: GraphFilterService, private dataService: DataService) {
  }

  onFilterUpdate(value: Filter) {
    let [nodes, links] = this.graphFilterService.filterGraph(this._nodes, this._links, value);
    this.nodes = nodes;
    this.links = links;
  }

  onQueryUpdate(value: EntityQuery) {
    this.showLoader = true;
    this.dataService.getTopDocuments(value.terms, value.limit)
      .then((data: any) => {
        // console.log(data);
        this._nodes = data['nodes'].map(n => new Node(n.id, n.name, n.group, n.type, n.relavanceScore));

        this._links = data['links'].map(l => new Link(l.source, l.target, l.value, (weight) => {
          if (weight < 1) {
            return Math.max(Math.log(10 * weight), CONFIG.MIN_LINE_WIDTH)
          } else {
            return 0.6
          }
        }));
        this.nodes = this._nodes;
        this.links = this._links;
        this.showLoader = false;
      });
  }
}
