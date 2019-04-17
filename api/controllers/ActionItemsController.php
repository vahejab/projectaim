<?php

   class ActionItemsController
   {
        private $_params;
        
        public function __construct($params = [], $endpoint2 = null)
        {
            $this->params = $params;
        }   
        
        public function get($id = null)
        {
            $actionitems = new actionitems();
            return $actionitems->get($id);
        }
   }