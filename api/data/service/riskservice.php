<?php
    namespace data\service;

    class riskservice extends service
    {   
        protected function _getMapper()
        {
            $db = $this->db()->getHandle();  
            return new \data\mapper\risks($db);
        } 
        
        public function findOne($id, $goto = null)
        {
            $mapper = $this->_getMapper();         
            
            if (strtolower($id) == 'first')
                return $mapper->first();
            if (strtolower($id) == 'last')
                return $mapper->last();
            if (strtolower($goto) == 'first')
                return $mapper->first();
            if (strtolower($goto) == 'prev')
                return $mapper->prev($id);
            if (strtolower($goto) == 'next')
                return $mapper->next($id);
            if (strtolower($goto) == 'last')
                return $mapper->last();
                
            $params = array('riskid' => $id);
            return $mapper->findOne($params);   
        } 
    }