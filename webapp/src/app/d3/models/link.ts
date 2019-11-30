import {Node} from "./node";

export class Link implements d3.SimulationLinkDatum<Node> {
  index?: number;
  source: Node | string;
  target: Node | string;
  weight: number;

  linkWidthFunction: Function;

  constructor(source, target, weight, linkWidthFunction) {
    this.source = source;
    this.target = target;
    this.weight = weight;
    this.linkWidthFunction = linkWidthFunction;
  }

  getSourceId(): string {
    if (typeof this.source == 'string') {
      return this.source;
    } else {
      return this.source.id;
    }
  }

  getTargetId(): string {
    if (typeof this.target == 'string') {
      return this.target;
    } else {
      return this.target.id;
    }
  }

  get getLinkWidth(): number {
    let linkWidth = this.linkWidthFunction.apply(this, [this.weight]);
    return linkWidth;
  }
}
