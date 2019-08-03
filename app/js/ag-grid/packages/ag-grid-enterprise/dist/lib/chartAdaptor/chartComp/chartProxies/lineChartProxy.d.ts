// ag-grid-enterprise v21.1.1
import { ChartProxy, ChartProxyParams, UpdateChartParams } from "./chartProxy";
export declare class LineChartProxy extends ChartProxy {
    private readonly chartOptions;
    constructor(params: ChartProxyParams);
    update(params: UpdateChartParams): void;
    private defaultOptions;
}
