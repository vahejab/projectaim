import {ChartBuilder} from "../../builder/chartBuilder";
import {AreaChartOptions, AreaSeriesOptions, ChartType} from "ag-grid-community";
import {AreaSeries} from "../../../charts/chart/series/areaSeries";
import {ChartProxy, ChartProxyParams, UpdateChartParams} from "./chartProxy";
import {CartesianChart} from "../../../charts/chart/cartesianChart";
import {CategoryAxis} from "../../../charts/chart/axis/categoryAxis";
import {ChartModel} from "../chartModel";

export class AreaChartProxy extends ChartProxy {
    private readonly chartType: ChartType;
    private readonly chartOptions: AreaChartOptions;

    public constructor(params: ChartProxyParams) {
        super(params);

        this.chartType = params.chartType;

        this.chartOptions = this.getChartOptions(params.chartType, this.defaultOptions()) as AreaChartOptions;
        this.chart = ChartBuilder.createAreaChart(this.chartOptions);

        this.setAxisPadding(this.chart as CartesianChart);

        const areaSeries = ChartBuilder.createSeries(this.chartOptions.seriesDefaults as AreaSeriesOptions);
        if (areaSeries) { this.chart.addSeries(areaSeries); }
    }

    private setAxisPadding(chart: CartesianChart) {
        const xAxis = chart.xAxis;
        if (xAxis instanceof CategoryAxis) {
            xAxis.scale.paddingInner = 1;
            xAxis.scale.paddingOuter = 0;
        }
    }

    public update(params: UpdateChartParams): void {

        if (this.chartType === ChartType.Area) {
            // area charts have multiple series
            this.updateAreaChart(params);

        } else {
            // stacked and normalized has a single series
            const areaSeries = this.chart.series[0] as AreaSeries;

            areaSeries.data = params.data;
            areaSeries.xField = params.categoryId;
            areaSeries.yFields = params.fields.map(f => f.colId);
            areaSeries.yFieldNames = params.fields.map(f => f.displayName);

            const palette = this.overriddenPalette ? this.overriddenPalette : this.chartProxyParams.getSelectedPalette();

            areaSeries.fills = palette.fills;
            areaSeries.strokes = palette.strokes;
        }

        // always set the label rotation of the default category to 0 degrees
        const chart = this.chart as CartesianChart;
        if (params.categoryId === ChartModel.DEFAULT_CATEGORY) {
            chart.xAxis.labelRotation = 0;
        } else {
            chart.xAxis.labelRotation = this.chartOptions.xAxis.labelRotation as number;
        }
    }

    private updateAreaChart(params: UpdateChartParams) {
        if (params.fields.length === 0) {
            this.chart.removeAllSeries();
            return;
        }

        const lineChart = this.chart as CartesianChart;
        const fieldIds = params.fields.map(f => f.colId);

        const existingSeriesMap: { [id: string]: AreaSeries } = {};

        const updateSeries = (areaSeries: AreaSeries) => {
            const id = areaSeries.yFields[0] as string;
            const seriesExists = fieldIds.indexOf(id) > -1;
            seriesExists ? existingSeriesMap[id] = areaSeries : lineChart.removeSeries(areaSeries);
        };

        lineChart.series.map(series => series as AreaSeries).forEach(updateSeries);

        params.fields.forEach((f: { colId: string, displayName: string }, index: number) => {
            const seriesOptions = this.chartOptions.seriesDefaults as AreaChartOptions;

            const existingSeries = existingSeriesMap[f.colId];
            const areaSeries = existingSeries ? existingSeries : ChartBuilder.createSeries(seriesOptions) as AreaSeries;

            if (areaSeries) {
                areaSeries.yFieldNames = [f.displayName];
                areaSeries.data = params.data;
                areaSeries.xField = params.categoryId;
                areaSeries.yFields = [f.colId];

                const palette = this.overriddenPalette ? this.overriddenPalette : this.chartProxyParams.getSelectedPalette();

                const fills = palette.fills;
                areaSeries.fills = [fills[index % fills.length]];

                const strokes = palette.strokes;
                areaSeries.strokes = [strokes[index % strokes.length]];

                if (!existingSeries) {
                    lineChart.addSeries(areaSeries);
                }
            }
        });
    }

    private defaultOptions(): AreaChartOptions {
        const palette = this.chartProxyParams.getSelectedPalette();

        return {
            parent: this.chartProxyParams.parentElement,
            width: this.chartProxyParams.width,
            height: this.chartProxyParams.height,
            background: {
                fill: this.getBackgroundColor()
            },
            padding: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20
            },
            xAxis: {
                type: 'category',
                labelFontStyle: undefined,
                labelFontWeight: undefined,
                labelFontSize: 12,
                labelFontFamily: 'Verdana, sans-serif',
                labelColor: this.getLabelColor(),
                labelRotation: 0,
                tickSize: 6,
                tickWidth: 1,
                tickPadding: 5,
                lineColor: 'rgba(195, 195, 195, 1)',
                lineWidth: 1,
                gridStyle: [{
                    stroke: this.getAxisGridColor(),
                    lineDash: [4, 2]
                }]
            },
            yAxis: {
                type: 'number',
                labelFontStyle: undefined,
                labelFontWeight: undefined,
                labelFontSize: 12,
                labelFontFamily: 'Verdana, sans-serif',
                labelColor: this.getLabelColor(),
                labelRotation: 0,
                tickSize: 6,
                tickWidth: 1,
                tickPadding: 5,
                lineColor: 'rgba(195, 195, 195, 1)',
                lineWidth: 1,
                gridStyle: [{
                    stroke: this.getAxisGridColor(),
                    lineDash: [4, 2]
                }]
            },
            legend: {
                enabled: true,
                labelFontStyle: undefined,
                labelFontWeight: undefined,
                labelFontSize: 12,
                labelFontFamily: 'Verdana, sans-serif',
                labelColor: this.getLabelColor(),
                itemPaddingX: 16,
                itemPaddingY: 8,
                markerPadding: 4,
                markerSize: 14,
                markerStrokeWidth: 1
            },
            seriesDefaults: {
                type: 'area',
                fills: palette.fills,
                strokes: palette.strokes,
                fillOpacity: this.chartProxyParams.chartType === ChartType.Area ? 0.7 : 1,
                normalizedTo: this.chartProxyParams.chartType === ChartType.NormalizedArea ? 100 : undefined,
                strokeWidth: 3,
                marker: true,
                markerSize: 6,
                markerStrokeWidth: 1,
                tooltipEnabled: true,
                tooltipRenderer: undefined,
                showInLegend: true,
                shadow: undefined
            }
        };
    }
}
