<?php
   namespace controllers;
   
   class ActionItemsController
   {
        private $_params;
        
        public function __construct($params = [], $endpoint2 = null, $payload = [])
        {
            $this->params = $params;
            $this->payload = $payload;
        }      
        
        public function get($id = null)
        {
            $service = new \data\service\actionitemservice();
            if ($id == null)
                return $service->findAll();
            return $service->findOne($id);
        }

        public function post($id = null)
        {
            $service = new \data\service\actionitemservice();
            return $service->createOne($this->payload);
        } 
        
        public function put($id = null)
        {
            $service = new \data\service\actionitemservice();
            return $service->updateOne($this->payload);
        }
   }