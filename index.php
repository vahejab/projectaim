<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<title>ProjectAIM Suite</title>
 <link rel="stylesheet" href="/app/css/bootstrap/bootstrap.min.css "/>
 <!--link rel="stylesheet" href="/app/js/bootstrap-sortable/Contents/bootstrap-sortable.css" /-->
 <script src="/app/js/webix-ui/codebase/webix.js" type="text/javascript"></script>
 <link rel="stylesheet" href="/app/js/webix-ui/codebase/webix.css" type="text/css" /> 
 <style>
    /*html{
        overflow-y: overlay !important;
    }*/
   
    body{
        background-color: rgb(250, 253, 252) !important;  
    }

    label, span{
        color: black !important;
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
    div.ui-view *{
        text-align: center;
        margin: 0 auto;
    }
    table *{
        text-align: left !important;
    }
    
    th:hover{
        cursor: pointer !important;
    }
 </style>
 <!--link rel="stylesheet" href="/app/js/kendoui-2019.1.220/styles/kendo.common.min.css"  />
 <link rel="stylesheet" href="/app/js/kendoui-2019.1.220/styles/kendo.material.min.css"  />
 <link rel="stylesheet" href="/app/css/kendo-ui/kendo/custom.css" /-->  
  <link rel="stylesheet" href="/app/assets/styles/style.css" /> 
</head>
<body ng-app="Main" ng-controller="MainController" ng-init="init()">
    <div class="site-wrapper">
        <a class="nav-link">
            <img id="logo" src="/app/assets/images/ProjectAIM.png" />
        </a>      

            <a href="/#!/action/create" name="create">
                Create Action Item
            </a>
            <a href="/#!/action/summary" name="summary">
                Action Item Summary
            </a>
        <div class="ui-view">
            
        </div>
        <set-margin />
    </div>
   <!--script src="/app/js/kendoui-2019.1.220/js/jquery.min.js"></script-->  
    <!--script src="/app/js/kendoui-2019.1.220/js/kendo.datepicker.min.js"></script>
    <script src="/app/js/kendoui-2019.1.220/js/kendo.ui.core.min.js"></script-->
    <!--script src="/app/js/jquery-latest/jquery-latest.js"></script-->
    <script src="/app/js/angularjs-1.7.8/angular.js"></script>
    <script src="/app/js/angularjs-1.7.8/angular-resource.js"></script>
    <script src="/app/js/angularjs-1.7.8/angular-aria.js"></script>
    <script src="/app/js/angularjs-1.7.8/angular-animate.js"></script>
    <script src="/app/js/angularjs-1.7.8/angular-messages.js"></script>
    <script src="/app/js/angularjs-1.7.8/angular-sanitize.js"></script> 
    <script src="/app/js/angular-webix/angular-webix.js"></script>
    <script src="/app/js/popper-1.12.9/popper.min.js"></script>
    <script src="/app/js/bootstrap-4.0.0/bootstrap.min.js"></script>
    <script src="/app/js/bootstrap-sortable/Scripts/moment.min.js"></script>
    <script src="/app/js/angularjs-1.7.8/angular-route.min.js"></script>
    <script src="/app/js/angularjs-1.7.8/angular-ui-router.js"></script>
    <script src="/app/js/angularjs-1.7.8/statehelper.js"></script>
    <script src="/app/js/ocLazyLoad/ocLazyLoad.js"></script>
    <script src="/app/route-config.js"></script> 
    <script src="/app/app.js"></script>
</body>
</html>