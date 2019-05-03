<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<title>ProjectAIM Suite</title>
 <link rel="stylesheet" href="/app/css/bootstrap/bootstrap.min.css "/>
 <link rel="stylesheet" href="/app/js/bootstrap-sortable/Contents/bootstrap-sortable.css" />
 <script src="/app/js/webix-ui/codebase/webix.js" type="text/javascript"></script>
 <link rel="stylesheet" href="/app/js/webix-ui/codebase/webix.css" type="text/css" /> 
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
    div.ui-view *{
        text-align: center;
        margin: 0 auto;
    }
    table *{
        text-align: left !important;
    }
        
     
       
    @media only screen and (max-width: 700px) {
        /* Force table to not be like tables anymore */    
        table:not(.grid),
        table:not(.grid) thead,
        table:not(.grid) tbody,
        table:not(.grid) tr,
        table:not(.grid) th,
        table:not(.grid) td,
        table:not(.grid) td .webix_view,
        table:not(.grid) td .webix_el_box,
        table:not(.grid) td .webix_inp_static{
            display: block !important;
            width: 100% !important;
        }
        
        div.ui-view form{
            width: 95% !important;
        }                           
         
        table#details tr:not(:first-child) td.label{
            height: 23px !important;
        }  
    } 
    @media only screen and (min-width: 700px){
 
        table#details tr:not(:first-child) td > div:not(.filterinput):not(.cell)
        {
            height: 94px !important;
        }

        table#details tr:not(:first-child) td.label
        {
            padding: 1px;
            height: 93px;
            width: 200px;
        }


        table#details td:nth-child(1){
            width: 150px;
        }

        table#information tr td
        {
            height:  23px !important;
        }
        table#categories tr td
        {
            height: 23px !important;
        }
                          
        table#summary td.locked
        {
            vertical-align: middle !important;
            color: black;
            width: 140px !important;
        }

        table:not(.grid)#summary td.locked .webix_view,
        table:not(.grid)#summary td.locked .webix_el_box,
        table:not(.grid)#summary td.locked .webix_inp_static,
        {
            width: 130px !importamnt;
        }

        table#details td.locked{
            width: 500px;
        }


        table#summary td.label,
        table#details td.label {
            background-color: #0038a8 !important;
            font-weight: bold !important;
            font-style: italic !important;
            color: white !important;
            text-align: left !important;
            width: 150px;
        }

        table#details tr:not(:first-child) .webix_el_textarea{
            height: 100px !important;
        }

        table#details tr:not(:first-child) td.locked{
            height: 100px !important;
        }
                                                             
        table#details{
            width: 650px;
            max-width: 750px !important;
        }

        table#summary:not(.grid){
            width: 650px;
            max-width: 750px !important;
        }
    }     
 </style>
 <!--link rel="stylesheet" href="/app/js/kendoui-2019.1.220/styles/kendo.common.min.css"  />
 <link rel="stylesheet" href="/app/js/kendoui-2019.1.220/styles/kendo.material.min.css"  />
 <link rel="stylesheet" href="/app/css/kendo-ui/kendo/custom.css" /-->  
</head>
<body ng-app="Main" ng-controller="MainController" ng-init="init()">
    <div class="site-wrapper">
        <a class="nav-link" ui-sref="main" ui-sref-active="active">
            <img id="logo" src="/app/assets/images/ProjectAIM.png" />
        </a>      

            <a href="/#!/action/create" name="create">
                Create Action Item
            </a>
            <a href="/#!/action/summary" name="summary">
                Action Item Summary
            </a>
            <!-- these require actual routing with ui-router or ng-route, so they
            won't work in the demo
            <md-nav-item md-nav-href="#page4" name="page5">Page Four</md-nav-item>
            <md-nav-item md-nav-sref="app.page5" name="page4">Page Five</md-nav-item>
            You can also add options for the <code>ui-sref-opts</code> attribute.
            <md-nav-item md-nav-sref="page6" sref-opts="{reload:true, notify:true}">
                Page Six
            </md-nav-item>
            -->
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