import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit {
  @Input() visible: boolean = true;
  @Input() text: string = '';
  @Input() x: number = 0;
  @Input() y: number = 0;
  constructor() { }

  ngOnInit() {
  }

}
