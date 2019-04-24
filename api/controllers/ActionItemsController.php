<?php
   namespace controllers;
   
   class ActionItemsController
   {
        private $_params;
        
        public function __construct($params = [], $endpoint2 = null)
        {
            $this->params = $params;
        }   
        
        public function get($id = null)
        {
            $service = new \data\service\actionitemservice();
            if ($id == null)
                return $service->findAll();
            return $service->findOne($id);
        }
   }