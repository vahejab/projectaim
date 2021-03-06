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
        
        public function get($id = null, $id2 = null)
        {   
            $service = new \data\service\eventservice();
            if ($id2 == null)
                return $service->findAllByRisk($id);
            else if ($id2 != null)
                return $service->findOneByRisk($id, $id2);
        }
        
        public function post($id = null)
        {
            $service = new \data\service\eventservice();
            return $service->createOneByRisk($id, $this->payload);
        } 
        
        public function put($id = null)
        {
            $service = new \data\service\eventservice();
            return $service->updateAllByRisk($this->payload);
        }
   }
   