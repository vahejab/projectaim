<?php
  namespace data\service;
   
  abstract class service
  {
    public function db()
    {
        return new \data\provider\database();
    }
   
    public function findAll($params = [])
    {
        $mapper = $this->_getMapper();
        return $mapper->findAll($params);  
    }

    public function createOne($params = [])
    {
        $mapper = $this->_getMapper();
        return $mapper->createOne($params);
    }

    public function updateOne($params = [])
    {
        $mapper = $this->_getMapper();
        return $mapper->updateOne($params);
    }
   
    protected function _getMapper()
    {
        $db = $this->db()->getHandle();
        return new \data\mapper\mapper($db);
    } 
  }
