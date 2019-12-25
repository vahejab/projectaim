<?php
   namespace controllers; 
   
   class ReportController
   { 
        private $_params;
        
        public function __construct($params = [], $endpoint2 = null, $payload = [])
        {
            $this->params = $params;
            $this->payload = $payload;
        } 
        
        public function get($id = null, $goto = null)
        {
            $service = new \data\service\reportservice\report();
            if ($id == null)
                return $service->findAll();
            return $service->riskreport($id);
        }
   }
   