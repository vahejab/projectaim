<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<title>ProjectAIM Suite</title>
 <link rel="stylesheet" href="/app/css/bootstrap/bootstrap.min.css "/>
 <link rel="stylesheet" href="/app/js/bootstrap-sortable/Contents/bootstrap-sortable.css" />
 <!--link rel="stylesheet" href="/app/css/jquery-datatables/jquery.dataTables.min.css" /> 
 <link rel="stylesheet" href="/app/css/datatables-scroller/scroller.dataTables.min.css"/-->
 <link rel="stylesheet" href="/app/css/angular-material/angular-material.min.css"/>
 <link rel="stylesheet" href="/app/assets/styles/style.css"> 
 <style>
    html{
        overflow-y: overlay !important;
    }
   
    body,
    md-content{
        background-color: rgb(250, 253, 252) !important;  
    }

    label, span{
        color: black !important;
    }
    
    :not(div[ng-switch=calendarCtrl.currentView]) .md-input-focused label, 
    :not(div[ng-switch=calendarCtrl.currentView]) .md-input-focused span{
        color: blue !important;
    }
    table.table-condensed thead th {
        background-color: #0038a8 !important;
        font-weight: bold !important;
        font-style: italic !important;
        color: white !important;
        text-align: left !important;
    }

    table.xdebug-error *{
        font-size: 12pt !important;
    }
 </style>
 <script src="/app/js/webix-ui/codebase/webix.js" type="text/javascript"></script>
 <link rel="stylesheet" href="/app/js/webix-ui/codebase/webix.css" type="text/css" /> 
 <!--link rel="stylesheet" href="/app/js/kendoui-2019.1.220/styles/kendo.common.min.css"  />
 <link rel="stylesheet" href="/app/js/kendoui-2019.1.220/styles/kendo.material.min.css"  />
 <link rel="stylesheet" href="/app/css/kendo-ui/kendo/custom.css" /-->  
</head>
<body ng-app="Main" ng-controller="MainController" ng-init="init()">
    <div class="site-wrapper">
        <a class="nav-link" ui-sref="main" ui-sref-active="active">
            <img id="logo" src="/app/assets/images/ProjectAIM.png" />
        </a>
        <md-content class="md-padding">
            <md-nav-bar
            md-no-ink-bar="disableInkBar"
            md-selected-nav-item="currentNavItem"
            nav-bar-aria-label="navigation links">
            <md-nav-item md-nav-href="/#!/action/create" name="create">
                Create Action Item
            </md-nav-item>
            <md-nav-item md-nav-href="/#!/action/summary" name="summary">
                Action Item Summary
            </md-nav-item>
            <!-- these require actual routing with ui-router or ng-route, so they
            won't work in the demo
            <md-nav-item md-nav-href="#page4" name="page5">Page Four</md-nav-item>
            <md-nav-item md-nav-sref="app.page5" name="page4">Page Five</md-nav-item>
            You can also add options for the <code>ui-sref-opts</code> attribute.
            <md-nav-item md-nav-sref="page6" sref-opts="{reload:true, notify:true}">
                Page Six
            </md-nav-item>
            -->
            </md-nav-bar>
        </md-content>
        <div class="ui-view">
            
        </div>
        <set-margin />
    </div>
   <!--script src="/app/js/kendoui-2019.1.220/js/jquery.min.js"></script-->  
    <!--script src="/app/js/kendoui-2019.1.220/js/kendo.datepicker.min.js"></script>
    <script src="/app/js/kendoui-2019.1.220/js/kendo.ui.core.min.js"></script-->
    <script src="/app/js/jquery-latest/jquery-latest.js"></script>
    <script src="/app/js/angularjs-1.6.6/angular.js"></script>
    <script src="/app/js/angularjs-1.6.6/angular-resource.js"></script>
    <script src="/app/js/angularjs-1.6.6/angular-aria.js"></script>
    <script src="/app/js/angularjs-1.6.6/angular-animate.js"></script>
    <script src="/app/js/angularjs-1.6.6/angular-messages.js"></script>
    <script src="/app/js/angularjs-1.6.6/angular-sanitize.js"></script> 
    <script src="/app/js/angular-webix/angular-webix.js"></script>
    <script src="/app/js/angular-material-1.1.12/angular-material.min.js"></script>
    <script src="/app/js/jquery-datatables-1.10.19/jquery.dataTables.min.js" ></script>
    <script src="/app/js/angular-datatables-0.6.2/angular-datatables.js"></script>
    <!--script src="/app/js/datatables-material/dataTables.material.min.js"></script-->
    <script src="/app/js/datatables-fixedheader-3.1.5/dataTables.fixedHeader.min.js"></script>
    <script src="/app/js/angular-datatables-0.6.2/plugins/fixedheader/angular-datatables.fixedheader.min.js"></script>
    <script src="/app/js/angular-datatables-0.6.2/plugins/scroller/angular-datatables.scroller.min.js"></script>
    <script src="/app/js/popper-1.12.9/popper.min.js"></script>
    <script src="/app/js/bootstrap-4.0.0/bootstrap.min.js"></script>
    <script src="/app/js/bootstrap-sortable/Scripts/bootstrap-sortable.js"></script>
    <script src="/app/js/bootstrap-sortable/Scripts/moment.min.js"></script>
    <script src="/app/js/angularjs-1.6.6/angular-route.min.js"></script>
    <script src="/app/js/angularjs-1.6.6/angular-ui-router.js"></script>
    <script src="/app/js/angularjs-1.6.6/statehelper.js"></script>
    <script src="/app/js/ocLazyLoad/ocLazyLoad.js"></script>
    <script src="/app/route-config.js"></script> 
    <script src="/app/app.js"></script>
</body>
</html>