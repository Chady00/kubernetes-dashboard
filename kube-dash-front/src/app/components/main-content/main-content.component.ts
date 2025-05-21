import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { DropdownComponent } from '../dropdown/dropdown.component'
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { TerminalComponent } from '../terminal/terminal.component'
import { TableData } from '../../models/table.model';
import { dropdownItem } from '../../models/dropDownItem.model';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TableService } from '../../services/table.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { ChartComponent } from "../chart/chart.component";
import { ViewConfig, VIEW_CONFIGS, columnClassConfig } from './view-config';
import { CommonModule } from '@angular/common';
import { SwitchResourceViewService } from '../../services/switch-resource-view.service';

import { ResizeHelper } from './resize-helper'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { DialogAnimationComponent } from '../dialog-animation/dialog-animation.component';


@Component({
  selector: 'app-main-content',
  imports: [DropdownComponent, MatTableModule, MatCheckboxModule,
    TerminalComponent, MatProgressBarModule, MatButtonModule, MatSidenavModule, ChartComponent, CommonModule, MatFormFieldModule, MatInputModule,
    MatMenuModule, MatIconModule],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainContentComponent implements OnInit {

  // Dropdown menu items (temp)
  contents: dropdownItem[] = []
  originalData: any[] = [];

  //api calls
  views: ViewConfig[] = VIEW_CONFIGS;
  selectedView: ViewConfig = this.views[0];
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  selection = new SelectionModel<any>(true, []);
  actions: any;
  private resizeHelper = new ResizeHelper();

  //chart
  chartData: any;
  selected_row: any;
  @ViewChild('drawer') drawer: MatDrawer | undefined;

  // dialog menu 
  @ViewChild(TerminalComponent) terminal!: TerminalComponent;

  //constructor
  constructor(private tableService: TableService, private sharedService: SwitchResourceViewService, private dialog: MatDialog) { }
  ngOnInit(): void {
    this.switchView(this.selectedView);
    if (this.sharedService && this.sharedService.data$) {
      this.sharedService.data$.subscribe(data => {
        const foundView = this.views.find(v => v.label.toLowerCase() === data) || this.selectedView;
        this.switchView(foundView);
      });
    }
  }


  /*                                  View Handling                            */
  switchView(view: ViewConfig): void {
    this.handleDrawerToggleIfNeeded(view);
    this.setViewMetadata(view);
    this.loadDataAndPrepareUI(view);
  }
  private handleDrawerToggleIfNeeded(view: ViewConfig): void {
    if (this.drawer?.opened && this.selectedView.label !== view.label) {
      this.drawer.toggle();
    }
  }

  private setViewMetadata(view: ViewConfig): void {
    this.selectedView = view;
    this.displayedColumns = ['select', ...view.displayedColumns, 'actions'];
    this.actions = view.actions;
  }

  private loadDataAndPrepareUI(view: ViewConfig): void {
    this.tableService.getData(view.apiEndpoint as String).subscribe(data => {
      this.chartData = data;
      this.dataSource.data = data.map(view.mapFn);
      this.originalData = this.dataSource.data;
      this.contents = this.buildDropdownContents(this.dataSource.data);
    });
  }

  private buildDropdownContents(data: any[]): dropdownItem[] {
    const uniqueNamespaces = Array.from(
      new Set(
        data
          .filter(row => 'Namespace' in row && row.Namespace)
          .map(row => row.Namespace)
      )
    );

    const items = uniqueNamespaces.map(ns => ({
      value: ns,
      viewValue: ns,
    }));

    return [{ value: 'allNamespaces', viewValue: 'All Namespaces' }, ...items];
  }


  /*                                  Dropdown Handling                            */

  handleDropdownSelection(selected: string[]) {
    if (selected.includes('allNamespaces')) {
      this.dataSource.data = [...this.originalData];
      return;
    }
    this.dataSource.data = this.originalData.filter(row =>
      selected.includes(row.Namespace)
    );
  }


  /*                                  Resize Handling                            */

  //drag terminal resizing
  initResize(event: MouseEvent) {
    this.resizeHelper.initResize(event, '.table-container', '.grow-tile');
  }
  // column resizing
  startResize(event: MouseEvent, column: string): void {
    this.resizeHelper.startColumnResize(event, column);
  }


  /*                                  Row handling                                */
  // filter which columns can toggle chart on row click
  handleRowClick(event: MouseEvent, row: any, index: number): void {
    const td = (event.target as HTMLElement).closest('td[data-column]');
    const clickedColumn = td?.getAttribute('data-column');

    if (clickedColumn === 'select' || clickedColumn === 'actions') {
      return;
    }

    this.toggleChart(row, index);
  }
  toggleChart(row: any, index: number) {
    this.selected_row = this.dataSource.data.indexOf(row);
    if (this.drawer)
      this.drawer.toggle();
  }
  // allow to toggle all rows
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }
  // to be removed XXX
  clickedwhichcell(row: any) {
    //console.log(row);
  }
  // returns which column was pressed
  getRowClass(row: any, column: any): string {
    const res = columnClassConfig[column.toLowerCase()]
    return res ? res(row[column]) : ''
  }
  // check if all rows are selected
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  checkboxLabel(row?: TableData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Name + 1}`;
  }


  /*                                  Filter                                */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  // reset all filters
  resetFilters() {
    this.dataSource.filter = '';
  }


  /*                                Dialog Box Selection                    */
  async onMenuActionClick(action: any, row: any) {
    const resourceName = row.Name;
    const resourceNamespace = row.Namespace;
    const resourceType = this.selectedView.value;

    console.log()
    let command: string;

    console.log('action', action);

    switch (action.action) {
      case 'Logs':
        command = `kubectl logs ${resourceName} -n ${resourceNamespace}`;
        this.terminal.executeCommand(command);
        break;

      case 'Edit':
        command = `kubectl edit ${resourceType} ${resourceName} -n ${resourceNamespace}`;
        this.terminal.executeCommand(command);
        break;

      case 'Delete': {
        const dialogRef = this.dialog.open(DialogAnimationComponent, {
          width: '300px',
          enterAnimationDuration: '300ms',
          exitAnimationDuration: '200ms',
          data: {
            title: 'Confirm Deletion',
            message: `Are you sure you want to ${action.action.toLowerCase()} ${resourceType} "${resourceName}" in ${resourceNamespace} namespace?`,
          },
        });

        const result = await dialogRef.afterClosed().toPromise();

        if (result) {
          command = `kubectl delete ${resourceType} ${resourceName} -n ${resourceNamespace}`;
          this.terminal.executeCommand(command);
        }
        break;
      }

      case 'Evict': {
        const dialogRef = this.dialog.open(DialogAnimationComponent, {
          width: '300px',
          enterAnimationDuration: '300ms',
          exitAnimationDuration: '200ms',
          data: {
            title: 'Confirm Eviction',
            message: `Are you sure you want to ${action.action.toLowerCase()} ${resourceType} "${resourceName}" in ${resourceNamespace} namespace?`,
          },
        });

        const result = await dialogRef.afterClosed().toPromise();

        if (result) {
          command = `kubectl evict ${resourceType} ${resourceName} -n ${resourceNamespace} --force`;
          this.terminal.executeCommand(command);
        }
        break;
      }
      case 'Share Link': {
        command = `kubectl exec -i -n ${resourceNamespace} ${resourceName} -c storage-provisioner -- sh -c "cls; (bash || ash || sh)"`;
        this.terminal.executeCommand(command);
        break;
      }
      default:
        break;
    }
  }

}
