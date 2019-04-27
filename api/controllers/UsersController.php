<?php
   namespace controllers;
   
   class UsersController
   {
        private $_params;
        
        public function __construct($params = [], $endpoint2 = null, $payload = [])
        {
            $this->params = $params;
        }   
        
        public function get($id = null)
        {
            $service = new \data\service\userservice();
            if ($id == null)
                return $service->findAll();
            return $service->findOne($id);
        }
   }