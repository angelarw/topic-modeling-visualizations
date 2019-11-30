import APP_CONFIG from '../../app.config';
import * as d3 from 'd3';

// const scale = d3.scaleOrdinal(APP_CONFIG.SPECTRUM);

export class Node implements d3.SimulationNodeDatum {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number;
  x?: number = 0;
  y?: number = 0;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  group: number;
  name?: string;
  type?: string;
  weightSum?: number;
  selected: boolean = false;
  // url?: string;
  id: string;

  // linkCount: number = 0;

  constructor(id, name, group, type, weightSum) {
    this.id = id;
    this.name = name;
    this.group = group;
    this.type = type;
    this.weightSum = weightSum;
    // if (this.type === 'document') {
    //   this.url = `https://console.aws.amazon.com/s3/object/angelaw-topic-modeling/20_newsgroups/${encodeURI(this.name)}?region=us-east-1&tab=overview`
    // }
  }

  get r() {
    return 5;
  }

  get fontSize() {
    return (10) + 'px';
  }

  get color() {
    return APP_CONFIG.SPECTRUM[this.group];
  }
}
