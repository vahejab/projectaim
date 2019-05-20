<?php
   namespace controllers; 
   
   class RiskConfigController
   { 
        private $_params;
        
        public function __construct($params = [], $endpoint2 = null, $payload = [])
        {
            $this->params = $params;
            $this->payload = $payload;
        } 
        
        public function get($id = null)
        {
            $service = new \data\service\riskconfigservice();
            // ($id == null)
            //  return $service->findAll();
            return $service->getConfig();
        }

        /*public function post($id = null)
        {
            $service = new \data\service\riskconfigservice();
            return $service->createOne($this->payload);
        }*/ 
        
        public function put($id = null)
        {
            $service = new \data\service\riskconfigservice();
            return $service->updateAll($this->payload);
        }
   }
   