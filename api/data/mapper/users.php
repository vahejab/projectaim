<?php
    namespace data\mapper;
    class users extends mapper {
        
        public function mapFromArray($array, \data\model\user $user = null)
        {
            if ( is_null($user)) $user = new \data\model\user();
            if (!is_null($array['id'])) $user->id = $array['id'];
            if (!is_null($array['userid'])) $user->userid = $array['userid'];
            if (!is_null($array['lastname'])) $user->lastname = $array['lastname'];
            if (!is_null($array['firstname'])) $user->firstname = $array['firstname'];         
            if (!is_null($array['title'])) $user->title = $array['title'];
            if (!is_null($array['email'])) $user->email = $array['email'];
            if (!is_null($array['phone'])) $user->phone = $array['phone'];
            if (!is_null($array['extension'])) $user->extension = $array['extension'];
            if (!is_null($array['department'])) $user->department = $array['department']; 
            if (!is_null($array['lastname']) 
            ||  !is_null($array['firstname'])) $user->name = $user->getUserLastFirst(); 
            return $user;
        }
       
        public function findAll($params = [])
        {
            $whereStrings = [];
            $whereParams = [];
            
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
                
                if (isset($params['id']))
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
 
 
            if (isset($params['id']))
            {
                $whereStrings[] = 'id = ?';
                $whereParams[] = $params['id'];   
            }
            
            $sql = "select 
                    id as 'id',
                    userid as 'userid',
                    lastname as 'lastname',
                    firstname as 'firstname',
                    title as 'title',
                    email as 'email',
                    phone as 'phone',
                    extension as 'extension',
                    department as 'department'
                    from users";
                    
            if (!empty($whereStrings))
            {
                $sql .= " where " . implode(' AND ' , $whereStrings);
            }
            if (isset($params['limit']))
            {
                $sql .= " limit " . intval($params['limit']);
            }
            
            try
            {
                $statement  = $this->db->prepare($sql);
                $statement->execute($whereParams);
                $results = $statement->fetchAll();
                return ["Succeeded" => true, "Result" => $this->_populateFromCollection($results)];
            }
            catch (\PDOException $e)
            {
                return ["Succeeded" => false, "Result" => $e->getMessage()];
            }
        }
    }