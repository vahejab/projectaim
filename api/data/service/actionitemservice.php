<?php
    namespace data\service;
    
    class actionitemservice extends service 
    {    
        public function findOne($id)
        {
            $mapper = $this->_getMapper();
            $params = array('actionitemid' => $id);
            return $mapper->findOne($params);   
        }
        public function findAll($params = [])
        {
            $mapper = $this->_getMapper();
            return $mapper->findAll($params);  
        }

        public function db()
        {
            return new \data\provider\database();
        }

        protected function _getMapper()
        {
            $db = $this->db()->getHandle();
            return new \data\mapper\actionitems($db);
        } 
    }