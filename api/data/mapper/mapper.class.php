<?php
  namespace data\mapper;
  
  abstract class mapper
  {
        protected $db = null;
        
        public function __construct(\PDO $db)
        {
            $this->db = $db;
        }
        
        abstract public function findAll($params = []);
  
        protected function _populateFromCollection($results)
        {
            $return = [];
            
            foreach($results as $result)
            {
                $return[] = $this->mapFromArray($result, null);
            }
            
            return $return;
        }
      
        public function findOne($params = [])
        {
            $collection = $this->findAll($params);
            if (count($collection) > 1)
            {
                throw new \Exception("More than one result found");
            }

            $returnOne = null;
            if (!empty($collection))
            {
                $returnOne = array_shift($collection);
            }
            return $returnOne;
        }
  }
