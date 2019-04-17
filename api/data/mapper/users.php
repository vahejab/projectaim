<?php
    namespace data\mapper;
    class users {
        
        private $db = null;
        
        public function __construct(PDO $db)
        {
            $this->db = $db;
        }
        
        protected function _populateFromCollection($results)
        {
            $return = array();
            
            foreach($results as $result)
            {
                $return[] = $this->mapFromArray($result);
            }
            
            return $return;
        }
        
        public function mapFromArray($array, \data\model\user $user = null)
        {
            if (is_null($user)) $user = new \data\model\user();
            if (is_null($array['id'])) $user->id = $array['id'];
            if (is_null($array['userid'])) $user->userid = $array['userid'];
            if (is_null($array['lastname'])) $user->lastname = $array['lastname'];
            if (is_null($array['firstname'])) $user->firstname = $array['firstname'];         
            if (is_null($array['title'])) $user->title = $array['title'];
            if (is_null($array['email'])) $user->email = $array['email'];
            if (is_null($array['phone'])) $user->phone = $array['phone'];
            if (is_null($array['extension'])) $user->extension = $array['extension'];
            if (is_null($array['department'])) $user->department = $array['department'];  
            return $user;
        }
        
        public function get($id)
        {
        
        }
        
        public function getAll($params = [])
        {
            $whereStrings = $whereParams = array();
            
            if (isset($params['Keyword'])){
                
                $searchCols = 
                   [
                    'id',
                    'userid',
                    'lastname',
                    'firstname',
                    'title',
                    'email',
                    'phone',
                    'extension',
                    'department'
                    ];
                
                if (isset($params['userid']))
                {
                    $whereStrings[] = 'id = ?';
                    $whereParams[] = $params['id'];   
                }
                
                if (isset($params['lastname']))
                {
                    $whereStrings[] = 'lastname = ?';
                    $whereParams[] = $params['lastname'];   
                }
                
                if (isset($params['firstname']))
                {
                    $whereStrings[] = 'firstname = ?';
                    $whereParams[] = $params['firstname'];   
                }
            }    
 
            $sql = "select *
                    from users";
                    
            if (!empty($whereStrings))
            {
                $sql .= " where " . implode(' AND ' . $whereStrings);
            }
            if (isset($params['limit']))
            {
                $sql .= " limit " . intval($params['limit']);
            }
            
            $statement  = $this->db->prepare($sql);
            $statement->execute($whereParams);
            $resuls = $statement->fetchAll();
            return $this->_populateFromCollection($results);
        }
    }