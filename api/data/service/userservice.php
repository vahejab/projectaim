<?php
    namespace data\service;
    
    class userservice extends service 
    {    
        public function findOne($id)
        {
            $mapper = $this->_getMapper();
            $params = array('id' => $id);
            return $mapper->findOne($params);   
        }

        protected function _getMapper()
        {
            $db = $this->db()->getHandle();
            return new \data\mapper\users($db);
        } 
    }