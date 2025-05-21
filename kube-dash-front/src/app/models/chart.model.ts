
import {
    ApexChart,
    ApexAxisChartSeries,
    ApexTitleSubtitle,
    ApexDataLabels,
    ApexFill,
    ApexYAxis,
    ApexXAxis,
    ApexTooltip,
    ApexMarkers,
    ApexAnnotations,
    ApexStroke,
} from "ng-apexcharts";

export interface ListProperty {
    label: String,
    value: any,
    type?: String
}
export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    markers: ApexMarkers;
    title?: ApexTitleSubtitle;
    fill: ApexFill;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    annotations: ApexAnnotations;
    colors?: any;
    toolbar?: any;
};