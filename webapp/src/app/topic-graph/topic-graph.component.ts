import {Component} from '@angular/core';
import {Node, Link} from '../d3';
import {Filter} from "../visuals/filter/filter";
import {GraphFilterService} from "../graph-filter/graph-filter.service";
import {HttpClient} from "@angular/common/http";
import {Papa} from 'ngx-papaparse';
import CONFIG from './topic-graph.config'
import {Storage} from 'aws-amplify';
import {DataService} from "../data-service/data.service";


@Component({
  selector: 'app-root',
  templateUrl: './topic-graph.component.html',
  styleUrls: ['./topic-graph.component.scss']
})

export class TopicGraphComponent {
  private _nodes: Node[] = [];
  private _links: Link[] = [];
  nodes: Node[] = [];
  links: Link[] = [];

  constructor(private graphFilterService: GraphFilterService,
              private httpClient: HttpClient,
              private dataService: DataService,
              private papa: Papa) {


    this.dataService.getTopicTerms().then((data: any) => {
      this._nodes = data.nodes.map(n => new Node(n.id, n.name, n.group, n.type, 0));
      this._links = data.links.map(l => new Link(l.source, l.target, l.value, (weight) => {
        return Math.max(Math.log(100 * weight), CONFIG.MIN_LINE_WIDTH)
      }));
      this.nodes = this._nodes;
      this.links = this._links;

    })
  }

  onFilterUpdate(value: Filter) {
    let [nodes, links] = this.graphFilterService.filterGraph(this._nodes, this._links, value);
    this.nodes = nodes;
    this.links = links;
  }

  transformTopicsListToGraph(topicData) {
    const topicSet: Set<string> = new Set(topicData.map(t => t['topic']));
    const topicNodes = {};
    topicSet.forEach(topicName => {
      topicNodes[topicName] = {name: topicName, id: topicName, type: 'topic', group: 0};
    });

    const termsSet: Set<string> = new Set(topicData.map(t => t['term']));
    const termNodes = {};
    termsSet.forEach(termName => {
      termNodes[termName] = {name: termName, id: termName, type: 'term', group: 1};
    });

    const nodes = Object.values(topicNodes).concat(Object.values(termNodes));
    const links = topicData.map(t => ({source: t['topic'], target: t['term'], weight: Number(t['weight'])}));

    return {nodes: nodes, links: links};


  }
}
