import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, signal, SimpleChanges, ViewChild } from '@angular/core';
import {
  ChartComponent as CC,
  NgApexchartsModule
} from "ng-apexcharts";
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { ListProperty } from '../../models/chart.model'
import { ScrollingModule } from '@angular/cdk/scrolling';
import { VIEW_CHARTS, data } from './chart-view-config'
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CHART_TABLE_VIEWS } from './chart-table-views'
import { ChartOptions } from '../../models/chart.model'


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgApexchartsModule, MatTableModule, MatListModule, MatDividerModule, ScrollingModule, MatExpansionModule, CommonModule]
})
export class ChartComponent implements OnInit, OnChanges {
  @Input({ required: true }) current_row_type: string = 'pod';
  @Input({ required: true }) list!: any;
  @Input({ required: true }) current_row!: any;
  @ViewChild("chart", { static: false }) chart!: CC;

  // tables in charts
  tableViews = CHART_TABLE_VIEWS;
  displayedColumns: string[] = [''];
  dataSource = new MatTableDataSource<any>();

  // Used to cache table data and columns to prevent infinite cycles
  tableDataCache: Map<string, any[]> = new Map();
  tableColumnsCache: Map<string, string[]> = new Map();
  tableDisplayColumnsCache: Map<String, string[]> = new Map();
  // list properties
  views = VIEW_CHARTS;

  // expand objects and arrays
  readonly panelOpenState = signal(false);

  public activeOptionButton = "all";
  public chartOptions!: ChartOptions;
  properties: ListProperty[] = [];

  /*                               Changes & ngOn*                               */
  constructor(private cdr: ChangeDetectorRef) { }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['current_row'] && this.list && this.current_row != null) {
      const rowData = this.list[this.current_row];
      const view = this.views[this.current_row_type];
      this.properties = view.map(field => (
        {
          label: field.label,         // label determines the property name to be displayed
          value: rowData[field.key],  // key must match the naming in backend api
          type: field.type            // tabular ? stat ?  etc..
        }
      ));

      // Pre-calculate table data after properties update
      this.updateTableCaches();

      // Force change detection
      this.cdr.markForCheck();
    }
  }

  ngOnInit() {
    // Initialize caches
    this.updateTableCaches();

    // chart options
    this.chartOptions = {
      series: [
        {
          name: 'Data',
          data: data
        }
      ],
      chart: {
        type: "area",
        height: 200
      },
      annotations: {
        yaxis: [
          {
            y: 30,
            borderColor: "blue",
            label: {
              text: "Time",
              style: {
                color: "#fff",
                background: "#000"
              }
            }
          }
        ],
        xaxis: [
          {
            x: new Date("14 Nov 2012").getTime(),
            borderColor: "#fff",
            label: {
              text: "Consumption",
              style: {
                color: "#fff",
                background: "#000"
              }
            }
          }
        ]
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0
      },
      xaxis: {
        type: "datetime",
        min: new Date("01 Mar 2012").getTime(),
        tickAmount: 6,
        labels: {
          style: {
            colors: "#7B858E"
          }
        }
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return val.toFixed(2);
          },
          style: {
            colors: "#7B858E"
          }
        }
      },
      tooltip: {
        theme: "dark",
        x: {
          format: "dd MMM yyyy"
        },
        style: {
          fontSize: '14px',
          fontFamily: undefined
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100]
        }
      },
      stroke: {
        curve: 'smooth',
        width: 2,
        colors: ['#E8EBE4']
      },
      colors: ['#222427']

    };
  }


  /*                               Object Manipulation                               */
  isObject(value: any): boolean {
    return value && typeof value === 'object' && !Array.isArray(value);
  }

  isArrayOfObjects(value: any): boolean {
    return Array.isArray(value) && value.every(item => typeof item === 'object' && item !== null);
  }

  objectLength(obj: any): number {
    return obj && typeof obj === 'object' ? Object.keys(obj).length : 0;
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }


  /*                               Status                                     */
  getStatusClass(value: any): string {
    if (value === 'Running' || value === 'Available')
      return 'running'
    else
      return 'error-stat'
  }


  /*                               Table Update                               */
  updateTableCaches() {
    // Clear previous caches
    this.tableDataCache.clear();
    this.tableColumnsCache.clear();
    this.tableDisplayColumnsCache.clear();


    // Pre-compute for each property that might need it
    this.properties.forEach(property => {
      if (property.type === 'tabular') {
        const propName = property.label.toLowerCase();

        // get Columns that matches data 
        const columns = this.getColumnsByPropName(propName);
        this.tableColumnsCache.set(propName, columns);

        // get displayed columns (header)
        const displayedColumns = this.getDisplayedColumnsByPropName(propName);
        this.tableDisplayColumnsCache.set(propName, displayedColumns);

        const mapFn = this.dataMapper[propName];
        const data = mapFn ? property.value?.map(mapFn) : [];
        this.tableDataCache.set(propName, data);
      }
    });
  }
  // A Record/dictionnary, composed of object of key value pairs
  // key will be a string = the name of the property ex: tolerations, volumes etc..
  // value will be a mapper function ((item:any)=> object:any) 
  private dataMapper: Record<string, (item: any) => any> = {
    tolerations: (item: any) => (
      {
        key: item.key,
        operator: item.operator,
        value: item.value,
        effect: item.effect,
        seconds: item.seconds
      }),
    volumes: (item: any) => (
      {
        name: item.name,
        defaultMountMode: item.defaultMountMode,
        sources: item.sources,
      })
  }

  getColumnsByPropName(propName: string): string[] {
    return this.tableViews.find(p => p.label.toLowerCase() === propName)?.columns || [];
  }
  getDisplayedColumnsByPropName(propName: string): string[] {
    return this.tableViews.find(p => p.label.toLowerCase() === propName)?.displayedColumns || [];
  }


  /*                               Option Update                               */
  updateOptions(option: keyof typeof this.updateOptionsData): void {
    this.activeOptionButton = option;
    this.chart.updateOptions(this.updateOptionsData[option], false, true, true);
  }

  public updateOptionsData = {
    "1m": {
      xaxis: {
        min: new Date("28 Jan 2013").getTime(),
        max: new Date("27 Feb 2013").getTime()
      }
    },
    "6m": {
      xaxis: {
        min: new Date("27 Sep 2012").getTime(),
        max: new Date("27 Feb 2013").getTime()
      }
    },
    "1y": {
      xaxis: {
        min: new Date("27 Feb 2012").getTime(),
        max: new Date("27 Feb 2013").getTime()
      }
    },
    "1yd": {
      xaxis: {
        min: new Date("01 Jan 2013").getTime(),
        max: new Date("27 Feb 2013").getTime()
      }
    },
    all: {
      xaxis: {
        min: undefined,
        max: undefined
      }
    }
  };

}