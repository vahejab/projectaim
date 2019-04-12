<?php
    require_once 'api.class.php';
    require_once 'vendor/autoloader.php';
            
    class MyAPI extends api
    { 
        public function  __construct($request){
            parent::__construct($request);
        }
      
        public function getactionitems() {
            
            
            if ($this->method == 'GET') {
                echo "\n";
                echo json_encode((new actionitem())->getResults(), JSON_PRETTY_PRINT);
            } else {
                return "Only accepts GET requests";
            }
        }
    }

    $api = new MyAPI($_REQUEST);
    $api->processAPI();
    $api->getactionitems();