import {Component, Input, OnChanges, ViewEncapsulation} from '@angular/core';
import { Node } from '../../../d3';

@Component({
  selector: '[legendVisual]',
  templateUrl: './legend-visual.component.html',
  styleUrls: ['./legend-visual.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LegendVisualComponent implements OnChanges {
  @Input('legendVisual') nodes: Node[];
  scale: any = [];

  constructor() {}

  ngOnChanges(changes) {
    console.log("changed")
    this.scale = []
    // if (!this.scale.length) {
      let seen = new Set();
      this.nodes.forEach(node => {
        if (!seen.has(node.type)) {
          seen.add(node.type);
          this.scale.push({color: node.color, text: node.type});
        }
      });
      console.log('this.scale', this.scale)
    // }
  }
}
