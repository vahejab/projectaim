<?php
   namespace controllers; 
   
   class RisksController
   { 
        private $_params;
        
        public function __construct($params = [], $endpoint2 = null, $payload = [])
        {
            $this->params = $params;
            $this->payload = $payload;
        } 
        
        public function get($id = null, $goto = null)
        {
            $service = new \data\service\riskservice();
            if ($id == null)
                return $service->findAll();
            return $service->findOne($id, $goto);
        }

        public function post($id = null)
        {
            $service = new \data\service\riskservice();
            return $service->createOne($this->payload);
        } 
        
        public function put($id = null)
        {
            $service = new \data\service\riskservice();
            return $service->updateOne($this->payload);
        }
   }
   