<?php
    namespace data\service;

    class riskconfigservice extends service
    {   
        protected function _getMapper()
        {
            $db = $this->db()->getHandle();  
            return new \data\mapper\riskconfig($db);
        }  
        
        public function updateAll($params = [])
        {
            $mapper = $this->_getMapper();
            return $mapper->updateAll($params);
        }
        
        public function getConfig()
        {
            $mapper = $this->_getMapper();
            return $mapper->findOne();   
        }
    }