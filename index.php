<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<title>ProjectAIM Suite</title>
<link rel="stylesheet" href="/app/css/bootstrap/bootstrap.min.css" />                
<link rel="stylesheet" href="/app/css/animate-css/animate.css" />
<link rel="stylesheet" href="/app/js/ag-grid/dist/styles/ag-grid.css">
<link rel="stylesheet" href="/app/js/ag-grid/dist/styles/ag-theme-blue.css"/>
<link rel="stylesheet" href="/app/js/ui-select/dist/select.css" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/select2/3.4.5/select2.css">    
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.8.5/css/selectize.default.css">

<link rel="stylesheet" href="/app/js/dc.js-3.1.9/dc.css" />
<link rel="stylesheet" href="/app/js/angular-gridster/dist/angular-gridster.min.css"/>
<!--link rel="stylesheet" href="/app/js/air-datepicker-2.2.3/dist/css/datepicker.css" /-->
<!--script src="/app/js/air-datepicker-2.2.3/dist/js/datepicker.js"></script-->
<!--script src="/app/js/air-datepicker-2.2.3/dist/js/i18n/datepicker.en.js"></script-->
<!-- Light package of effect.css It is optional --><!-- Latest compiled and minified CSS on head of your page -->
<!-- VENDORS -->
<!-- Required for Datepicker Component -->

 <link rel="stylesheet" href="/app/assets/styles/style.css" />
  <style>
    .ui-view > div.webix_view{
        width: 100vw !important;
    }
    body{
        width: 99vw;
        margin: 0px;
        background-image: url(/app/assets/images/custom_back.gif) !important;
    }
  </style>
</head>
<body ng-app="Main"> 
        <a class="nav-link">
            <img id="logo" src="/app/assets/images/ProjectAIM.png" />
        </a>      

            <a href="/#!/action/create" name="createaction">
                Create Action Item
            </a>
            <a href="/#!/action/summary" name="actionsummary">
                Action Item Summary
            </a>
            <a href="/#!/risk/dashboard" name="dashboard">
                Risk Dashboard
            </a>
            <a href="/#!/risk/create" name="createrisk">
                Create Risk
            </a>
             <a href="/#!/risk/summary" name="risksummary">
                Risk Summary
            </a>
             <a href="/#!/risk/config" name="riskmatrixconfig">
                Risk Matrix Config
            </a>
        <div class="ui-view">
            
        </div> 
   <!--script src="/app/js/kendoui-2019.1.220/js/jquery.min.js"></script-->  
    <!--script src="/app/js/kendoui-2019.1.220/js/kendo.datepicker.min.js"></script>
    <script src="/app/js/kendoui-2019.1.220/js/kendo.ui.core.min.js"></script-->
    <!--script src="/app/js/jquery-latest/jquery-latest.js"></script-->
    
    
    <script src="/app/js/requirejs/require.js"></script>   
    <script src="/app/js/universe/src/universe.js"></script>
    <!--cript src="/app/app.js"></script-->  <!--app.js contents moved to body of universe.-->
   </body>
</html>