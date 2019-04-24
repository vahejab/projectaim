<?php
    namespace data\mapper;
    class users extends mapper {
        
        public function mapFromArray($array, \data\model\user $user = null)
        {
            if ( is_null($user)) $user = new \data\model\user();
            //if (!is_null($array['user.id'])) $user->id = $array['user.id'];
            if (!is_null($array['user.userid'])) $user->userid = $array['user.userid'];
            if (!is_null($array['user.lastname'])) $user->lastname = $array['user.lastname'];
            if (!is_null($array['user.firstname'])) $user->firstname = $array['user.firstname'];         
            if (!is_null($array['user.title'])) $user->title = $array['user.title'];
            if (!is_null($array['user.email'])) $user->email = $array['user.email'];
            if (!is_null($array['user.phone'])) $user->phone = $array['user.phone'];
            if (!is_null($array['user.extension'])) $user->extension = $array['user.extension'];
            if (!is_null($array['user.department'])) $user->department = $array['user.department']; 
            if (!is_null($array['user.lastname']) 
            ||  !is_null($array['user.firstname'])) $user->name = $user->getUserLastFirst(); 
            return $user;
        }
       
        public function findAll($params = [])
        {
            $whereStrings = [];
            $whereParams = [];
            
            if (isset($params['Keyword'])){
                
                $searchCols = 
                   [
                    //'id',
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
 
 
            if (isset($params['userid']))
            {
                $whereStrings[] = 'userid = ?';
                $whereParams[] = $params['userid'];   
            }
            
            $sql = "select 
                    id as 'user.id',
                    userid as 'user.userid',
                    lastname as 'user.lastname',
                    firstname as 'user.firstname',
                    title as 'user.title',
                    email as 'user.email',
                    phone as 'user.phone',
                    extension as 'user.extension',
                    department as 'user.department'
                    from users user";
                    
            if (!empty($whereStrings))
            {
                $sql .= " where " . implode(' AND ' , $whereStrings);
            }
            if (isset($params['limit']))
            {
                $sql .= " limit " . intval($params['limit']);
            }
    
            $statement  = $this->db->prepare($sql);
            $statement->execute($whereParams);
            $results = $statement->fetchAll();
            return $this->_populateFromCollection($results);
        }
    }