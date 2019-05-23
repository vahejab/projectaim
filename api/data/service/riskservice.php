<?php
    namespace data\service;

    class riskservice extends service
    {   
        protected function _getMapper()
        {
            $db = $this->db()->getHandle();  
            return new \data\mapper\risks($db);
        } 
        
        public function findOne($id)
        {
            $mapper = $this->_getMapper();
            $params = array('riskid' => $id);
            return $mapper->findOne($params);   
        } 
    }