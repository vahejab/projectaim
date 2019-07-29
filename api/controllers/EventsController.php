<?php
   namespace controllers; 
   
   class EventsController
   { 
        private $_params;
        
        public function __construct($params = [], $endpoint2 = null, $payload = [])
        {
            $this->params = $params;
            $this->payload = $payload;
        } 
        
        public function get($id = null)
        {   
            $service = new \data\service\eventservice();
            return $service->findAllByRisk($this->payload['riskid']);
        }

        public function post($id = null)
        {
            $service = new \data\service\eventservice();
            return $service->createOne($this->payload);
        } 
        
        public function put($id = null)
        {
            $service = new \data\service\eventservice();
            return $service->updateAllByRisk($this->payload);
        }
   }
   