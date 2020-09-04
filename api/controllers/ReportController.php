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
            
            $riskservice = new \data\service\riskservice();
            $risk = new \data\model\risk();
            $risk = $riskservice->findOne($id)['Result'];
            return $service->riskreport($id, $risk->risktitle, $risk->owner, $risk->riskstate);
        }
   }
   