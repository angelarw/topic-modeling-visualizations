import {
  Component,
  Input,
  ChangeDetectorRef,
  HostListener,
  ChangeDetectionStrategy,
  OnInit,
  AfterViewInit,
  OnChanges
} from '@angular/core';
import { D3Service, ForceDirectedGraph, Node } from '../../d3';

@Component({
  selector: 'app-graph',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, AfterViewInit, OnChanges {
  @Input('nodes') nodes: Node[] = [];
  @Input('links') links = [];
  @Input('showTooltip') showTooltip: boolean = false;
  @Input('nodeDisplayType') nodeDisplayType: 'circle' | 'text' = 'circle';
  @Input('forceCollision') forceCollision: number;
  @Input('forceCharge') forceCharge: number;

  graph: ForceDirectedGraph;
  private _options: { width, height, forceCollision?, forceCharge?} = { width: 600, height: 600 };
  tooltipVisibility: boolean = false;
  tooltipText: string = '';
  tooltipPosition: {x: number, y: number} = {x: 0, y: 0};
  // tooltipNode: Node;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.graph.initSimulation(this.options);
  }


  constructor(private d3Service: D3Service, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    /** Receiving an initialized simulated graph from our custom d3 service */
    this.graph = this.d3Service.getForceDirectedGraph(this.nodes, this.links, this.options);

    /** Binding change detection check on each tick
     * This along with an onPush change detection strategy should enforce checking only when relevant!
     * This improves scripting computation duration in a couple of tests I've made, consistently.
     * Also, it makes sense to avoid unnecessary checks when we are dealing only with simulations data binding.
     */
    this.graph.ticker.subscribe((d) => {
      this.ref.markForCheck();
    });
  }

  ngAfterViewInit() {
    this.graph.initSimulation(this.options);
  }

  ngOnChanges(changes) {
    this.graph = this.d3Service.getForceDirectedGraph(this.nodes, this.links, this.options);
    this.graph.ticker.subscribe((d) => {
      this.ref.markForCheck();
    });
    this.graph.initSimulation(this.options);
  }

  get options() {
    return this._options = {
      width: window.innerWidth / 2,
      height: window.innerHeight / 2,
      forceCollision: this.forceCollision,
      forceCharge: this.forceCharge,
    };
  }

  onTooltipVisibilityChange(tooltipVisibility: boolean) {
    this.tooltipVisibility = tooltipVisibility;
  }

  onTooltipTextChange(tooltipText: string) {
    this.tooltipText = tooltipText;
  }

  onTooltipPositionChange(tooltipPosition: MouseEvent) {
    this.tooltipPosition = {
      x: tooltipPosition.layerX + 10,
      y: tooltipPosition.layerY + 10,
    };
  }

  onTooltipNodeChange(tooltipNode: Node) {
    // this.tooltipNode = tooltipNode;
  }
}
