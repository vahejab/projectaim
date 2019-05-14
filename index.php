<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<title>ProjectAIM Suite</title>
 <link rel="stylesheet" href="/app/css/bootstrap/bootstrap.min.css "/>
 <!--link rel="stylesheet" href="/app/js/bootstrap-sortable/Contents/bootstrap-sortable.css" /-->
 <script src="/app/js/webix-6.3.2/codebase/webix.js" type="text/javascript"></script>
 <link rel="stylesheet" href="/app/js/webix-6.3.2/codebase/webix.css" type="text/css" /> 
 <!--link rel="stylesheet" href="/app/js/kendoui-2019.1.220/styles/kendo.common.min.css"  />
 <link rel="stylesheet" href="/app/js/kendoui-2019.1.220/styles/kendo.material.min.css"  />
 <link rel="stylesheet" href="/app/css/kendo-ui/kendo/custom.css" /-->  
  <link rel="stylesheet" href="/app/assets/styles/style.css" />
  <style>
    .ui-view > div.webix_view{
        width: 100vw !important;
    }
    body{
        width: 100vw;
    } 
  </style>
</head>
<body ng-app="Main" ng-controller="MainController" ng-init="init()">
        <a class="nav-link">
            <img id="logo" src="/app/assets/images/ProjectAIM.png" />
        </a>      

            <a href="/#!/action/create" name="createaction">
                Create Action Item
            </a>
            <a href="/#!/action/summary" name="actionsummary">
                Action Item Summary
            </a>
            <a href="/#!/risk/create" name="createrisk">
                Create Risk
            </a>
        <div class="ui-view">
            
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
    <!--script src="/app/js/bootstrap-4.0.0/bootstrap.js"></script-->
    <script src="/app/js/bootstrap-sortable/Scripts/moment.min.js"></script>
    <script src="/app/js/angularjs-1.7.8/angular-route.min.js"></script>
    <script src="/app/js/angularjs-1.7.8/angular-ui-router.js"></script>
    <script src="/app/js/angularjs-1.7.8/statehelper.js"></script>
    <script src="/app/js/ocLazyLoad/ocLazyLoad.js"></script>
    <script src="/app/route-config.js"></script> 
    <script src="/app/app.js"></script>
   </body>
</html>