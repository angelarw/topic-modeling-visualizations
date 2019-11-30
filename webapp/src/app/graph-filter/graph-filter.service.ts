import { Injectable } from '@angular/core';
import { Link, Node } from "../d3/models";
import { Filter } from "../visuals/filter/filter";

@Injectable({
  providedIn: 'root'
})
export class GraphFilterService {

  constructor() { }

  filterGraph(nodes: Node[], links: Link[], filter: Filter): [Node[], Link[]] {
    let filterStrings = filter.terms;
    if (filterStrings.length === 0){
      filterStrings = ['']
    }

    let nodeIds = new Set(nodes.filter(node => {
      return filterStrings.some(s => node.name.includes(s));
    }).map(node => node.id));

    for (let i=0; i<filter.depth; i++) {
      let neighboringNodeIds = new Set();
      links.forEach(link => {
        if (nodeIds.has(link.getSourceId()) || nodeIds.has(link.getTargetId())) {
          neighboringNodeIds.add(link.getSourceId());
          neighboringNodeIds.add(link.getTargetId());
        }
      });
      neighboringNodeIds.forEach(id => {
        nodeIds.add(id);
      });
    }

    let filteredNodes = nodes.filter(node => nodeIds.has(node.id));
    let filteredLinks = links.filter(link => nodeIds.has(link.getSourceId()) && nodeIds.has(link.getTargetId()));

    return [filteredNodes, filteredLinks];
  };
}
