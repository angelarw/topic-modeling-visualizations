import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {DocDetailsComponent} from "../doc-details/doc-details.component";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})


export class TableComponent implements OnInit {
  @Input('nodes') nodes;
  @Input('tableType') tableType: 'topic' | 'docs';


  columnsToDisplay = []

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
    if (this.tableType == 'topic') {
      this.columnsToDisplay = ['name', 'type']
      console.log(this.columnsToDisplay)
    } else {
      this.columnsToDisplay = ['name', 'type', 'score']
      console.log(this.columnsToDisplay)
    }
  }

  openDialog(docName) {
    this.dialog.open(DocDetailsComponent, {
      data: {
        name: docName
      }
    });
  }

}

