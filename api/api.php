<?php
    require_once 'vendor/autoloader.php';
    require_once 'api.class.php';

    class MyAPI extends api
    { 
        public function  __construct($request){
            parent::__construct($request);
        }
    }

    $api = new MyAPI($_REQUEST);
    echo $api->processRequest();