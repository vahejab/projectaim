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
  
        protected function  _populateFromCollection($results = null, $results2 = null)
        {
            $return = [];  
            
            if ($results != null)
            {
                foreach($results as $result)
                {
                    $return[] = $this->mapFromArray($result, null);
                }
            }
            else if ($results2 != null)
            {
                foreach($results2 as $result2)
                {
                    $return[] = $this->mapFromArray(null, $result2);
                }
            }
        
            return $return;
        }
      
        public function findOne($params = [])
        {
            $collection = $this->findAll($params);

            if (count($collection['Result']) > 1)
            {
                throw new \Exception("More than one result found");
            }

            $returnOne = null;
            if (!empty($collection['Result']))
            {
                $returnOne = array_shift($collection['Result']);
            }
            return ['Succeeded'=>true, 'Results' => $returnOne];
        }
  }
