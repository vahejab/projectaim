<?php
    require_once 'autoloader/autoloader.php';
    require_once 'api.class.php';

    class MyAPI extends api
    { 
        public function  __construct($request){
            parent::__construct($request);
        }
    }

    $api = new MyAPI($_REQUEST); 
    echo $api->processRequest();