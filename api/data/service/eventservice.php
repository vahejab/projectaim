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
            if ($id == null)
                return $mapper->findAll();
            return $mapper->findAllByRisk($id);   
        }
        
        public function updateAllByRisk($params)
        {
            $mapper = $this->_getMapper();
            $events = array('riskid' => $params['riskid'], 'events' => $params['events']);
            return $mapper->updateAllByRisk($events);   
        }  
    }