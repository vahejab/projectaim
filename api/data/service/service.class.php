<?php
  namespace data\service;
   
  abstract class service
  {
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
        return new \data\mapper\mapper($db);
    } 
  }
