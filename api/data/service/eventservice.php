<?php
    namespace data\service;

    class eventservice extends service
    {   
        protected function _getMapper()
        {
            $db = $this->db()->getHandle();  
            return new \data\mapper\events($db);
        } 
        
        public function findOne($id)
        {
            $mapper = $this->_getMapper();
            $params = array('eventid' => $id);
            return $mapper->findOne($params);
        }
        
        public function findAllByRisk($id)
        {
            $mapper = $this->_getMapper();
            $params = array('riskid' => $id);
            return $mapper->findAllByRisk($params);   
        }
        
        public function updateAllByRisk($id)
        {
            $mapper = $this->_getMapper();
            $params = array('riskid' => $id);
            return $mapper->updateAllByRisk($params);   
        }  
    }