import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {Node} from '../../../d3';

@Component({
  selector: '[nodeVisual]',
  templateUrl: './node-visual.component.html',
  styleUrls: ['./node-visual.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NodeVisualComponent {
  @Input('nodeVisual') node: Node;
  @Input('nodeDisplayType') nodeDisplayType: 'circle' | 'text' = 'circle';
  @Output() tooltipVisibilityChange = new EventEmitter<boolean>();
  @Output() tooltipTextChange = new EventEmitter<string>();
  @Output() tooltipPositionChange = new EventEmitter<MouseEvent>();
  @Output() tooltipNodeChange = new EventEmitter<Node>();

  charWidth = 6
  padding = 4

  calculateX() {
    return 0 - this.charWidth / 2 * (this.node.name.length) - this.padding / 2
  }

  calculateWidth() {
    return this.charWidth * (this.node.name.length) + this.padding
  }

  onMouseover(node: Node) {
    node.selected = true;
    this.tooltipVisibilityChange.emit(true);
    this.tooltipTextChange.emit(node.name)
  }

  onMousemove(event: MouseEvent) {
    this.tooltipPositionChange.emit(event);
  }

  onMouseout(node: Node) {
    node.selected = false;
    this.tooltipVisibilityChange.emit(false);
  }

  onMousedown(node: Node) {
    this.tooltipNodeChange.emit(node);
  }
}
