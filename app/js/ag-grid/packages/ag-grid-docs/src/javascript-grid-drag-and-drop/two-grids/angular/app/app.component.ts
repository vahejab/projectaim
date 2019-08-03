import {Component} from '@angular/core';
import {GridOptions} from "ag-grid-community";

@Component({
    selector: 'my-app',
    template: `
        <div class="outer">
            <div style="height: 100%;" class="inner-col" (dragover)="gridDragOver($event)"
                 (drop)="gridDrop($event,'left')">
                <ag-grid-angular
                        style="height: 100%"
                        class="ag-theme-balham"
                        [gridOptions]="leftGridOptions"
                        [columnDefs]="columnDefs"
                        (firstDataRendered)="onFirstDataRendered($event)">
                </ag-grid-angular>
            </div>

            <div class="inner-col factory-panel">
                <span id="eBin" (dragover)="binDragOver($event)" (drop)="binDrop($event)" class="factory factory-bin">
                    <i class="fas fa-trash"><span class="filename"> Trash - </span></i>
                    Drop target to destroy row
                </span>
                <span draggable="true" (dragstart)="dragStart($event,'Red')" class="factory factory-red">
                    <i class="fas fa-plus-square"><span class="filename"> Create - </span></i>
                    Drag source for new red item
                </span>
                <span draggable="true" (dragstart)="dragStart($event,'Green')" class="factory factory-green">
                    <i class="fas fa-plus-square"><span class="filename"> Create - </span></i>
                    Drag source for new green item
                </span>
                <span draggable="true" (dragstart)="dragStart($event,'Blue')" class="factory factory-blue">
                    <i class="fas fa-plus-square"><span class="filename"> Create - </span></i>
                    Drag source for new blue item
                </span>
            </div>

            <div style="height: 100%;" class="inner-col" (dragover)="gridDragOver($event)"
                 (drop)="gridDrop($event,'right')">
                <ag-grid-angular
                        style="height: 100%"
                        class="ag-theme-balham"
                        [gridOptions]="rightGridOptions"
                        [columnDefs]="columnDefs"
                        (firstDataRendered)="onFirstDataRendered($event)">
                </ag-grid-angular>
            </div>
        </div>
    `
})
export class AppComponent {
    rowIdSequence = 100;

    columnDefs = [
        {field: "id", dndSource: true},
        {field: "color"},
        {field: "value1"},
        {field: "value2"}
    ];

    leftGridOptions: GridOptions = {
        defaultColDef: {
            width: 80,
            sortable: true,
            filter: true,
            resizable: true
        },
        rowClassRules: {
            "red-row": 'data.color == "Red"',
            "green-row": 'data.color == "Green"',
            "blue-row": 'data.color == "Blue"',
        },
        getRowNodeId: function (data) {
            return data.id
        },
        rowData: this.createLeftRowData(),
        rowDragManaged: true,
        animateRows: true
    };

    rightGridOptions: GridOptions = {
        defaultColDef: {
            width: 80,
            sortable: true,
            filter: true,
            resizable: true
        },
        rowClassRules: {
            "red-row": 'data.color == "Red"',
            "green-row": 'data.color == "Green"',
            "blue-row": 'data.color == "Blue"',
        },
        getRowNodeId: function (data) {
            return data.id
        },
        rowData: [],
        rowDragManaged: true,
        animateRows: true
    };

    createLeftRowData() {
        let data = [];
        ['Red', 'Green', 'Blue'].forEach((color) => {
            data.push(this.createDataItem(color));
        });
        return data;
    }

    createDataItem(color) {
        return {
            id: this.rowIdSequence++,
            color: color,
            value1: Math.floor(Math.random() * 100),
            value2: Math.floor(Math.random() * 100)
        };
    }

    binDragOver(event) {
        var dragSupported = event.dataTransfer.types.indexOf('application/json') >= 0;
        if (dragSupported) {
            event.dataTransfer.dropEffect = "move";
            event.preventDefault();
        }
    }

    binDrop(event) {
        var jsonData = event.dataTransfer.getData("application/json");
        var data = JSON.parse(jsonData);

        // if data missing or data has no id, do nothing
        if (!data || data.id == null) {
            return;
        }

        var transaction = {
            remove: [data]
        };

        var rowIsInLeftGrid = !!this.leftGridOptions.api.getRowNode(data.id);
        if (rowIsInLeftGrid) {
            this.leftGridOptions.api.updateRowData(transaction);
        }

        var rowIsInRightGrid = !!this.rightGridOptions.api.getRowNode(data.id);
        if (rowIsInRightGrid) {
            this.rightGridOptions.api.updateRowData(transaction);
        }
    }

    dragStart(event, color) {
        var newItem = this.createDataItem(color);
        var jsonData = JSON.stringify(newItem);
        event.dataTransfer.setData('application/json', jsonData);
    }

    gridDragOver(event) {
        var dragSupported = event.dataTransfer.types.indexOf('application/json') >= 0;
        if (dragSupported) {
            event.dataTransfer.dropEffect = "copy";
            event.preventDefault();
        }
    }

    gridDrop(event, grid) {
        var jsonData = event.dataTransfer.getData("application/json");
        var data = JSON.parse(jsonData);

        // if data missing or data has no it, do nothing
        if (!data || data.id == null) {
            return;
        }

        var gridApi = grid == 'left' ? this.leftGridOptions.api : this.rightGridOptions.api;

        // do nothing if row is already in the grid, otherwise we would have duplicates
        var rowAlreadyInGrid = !!gridApi.getRowNode(data.id);
        if (rowAlreadyInGrid) {
            console.log('not adding row to avoid duplicates in the grid');
            return;
        }

        var transaction = {
            add: [data]
        };
        gridApi.updateRowData(transaction);
    }

    onFirstDataRendered(params) {
        params.api.sizeColumnsToFit();
    };

}
