<?php
    namespace data\service;
    
    class actionitemservice extends service 
    {    
        protected function _getMapper()
        {
            $db = $this->db()->getHandle();
            return new \data\mapper\actionitems($db);
        }

        public function findOne($id)
        {
            $mapper = $this->_getMapper();
            $params = array('actionitemid' => $id);
            return $mapper->findOne($params);   
        }
    }