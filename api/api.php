<?php
    require_once 'vendor/autoloader.php';
    require_once 'api.class.php';

    class MyAPI extends api
    { 
        public function  __construct($request){
            parent::__construct($request);
        }
      
        public function getactionitems() {
        
            if ($this->method == 'GET') {
                echo json_encode((new actionitem()), JSON_PRETTY_PRINT);
            } else {
                return "Only accepts GET requests";
            }
        }
    }

    $api = new MyAPI($_REQUEST);
    $api->processRequest();
    $api->getactionitems();