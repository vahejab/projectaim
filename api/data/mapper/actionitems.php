<?php
    class actionitems {
        
        private $db = null;
        
        public function __construct(PDO $db){
            $this->db = $db;
        }
        
        protected function _populateFromCollection($results){
            $return = array();
            
            foreach($results as $result){
                $return = $this->mapFromArray($result);
            }
            
            return $return;
        }
        
        public function mapFromArray($array, \data\model\actionitem $actionitem = null){
            if (is_null($actionitem)) $actionitem = new data\model\actionitem();
            if (is_null($array['assignor.lastname'])) $actionitem->assignorlastname = $array['assignor.lastname'];
            if (is_null($array['assignor.firstname'])) $actionitem->assignorfirstname = $array['assignor.firstname'];
            if (is_null($array['owner.lastname'])) $actionitem->ownerlastname = $array['owner.lastname'];
            if (is_null($array['owner.firstname'])) $actionitem->ownerfirstname = $array['owner.firstname'];
            if (is_null($array['altowner.lastname'])) $actionitem->altownerlastname = $array['altowner.lastname'];
            if (is_null($array['altowner.firstname'])) $actionitem->altownerfirstname = $array['altowner.firstname'];
            if (is_null($array['approver.lastname'])) $actionitem->altownerlastname = $array['approver.lastname'];
            if (is_null($array['approver.firstname'])) $actionitem->approverfirstname = $array['approver.firstname'];
            if (is_null($array['actionitemtitle'])) $actionitem->actionitemtitle = $array['actionitemtitle'];
            if (is_null($array['criticality'])) $actionitem->criticality = $array['crtitcality'];
            if (is_null($array['actionitemstatement'])) $actionitem->actionitemstatement = $array['actionitemstatement'];
            if (is_null($array['closurecriteria'])) $actionitem->closurecriteria = $array['closurecriteria'];
            if (is_null($array['closurestatement'])) $actionitem->closurestatement = $array['closurestatement'];
            if (is_null($array['rejectionjustification'])) $actionitem->rejectionjustification = $array['rejectionjustification'];
            if (is_null($array['ownernotes'])) $actionitem->ownernotes = $array['ownernotes'];
            if (is_null($array['approvercomments'])) $actionitem->aprovercomments = $array['aprovercomments'];
            if (is_null($array['notes'])) $actionitem->notes = $array['notes'];                
        }
        
        public function get($id){
        
        }
        
        public function getAll($params = [])
        {
            $whereStrings = $whereParams = array();
            
            if (isset($params['Keyword'])){
                
                $searchCols = 
                   [
                    'assignor.lastname',
                    'assignor.firstname',
                    'owner.lastname',
                    'owner.firstname',
                    'altowner.lastname',
                    'altowner.firstname',
                    'approver.lastname',
                    'approver.firstname',
                    'actionitemtitle',
                    'criticality',
                    'actionitemstatement',
                    'closurecriteria',
                    'closurestatement',
                    'rejectionjustification',
                    'ownernotes',
                    'approvercomments',
                    'notes'
                    ];

                
                foreach ($searchCols as $col){
                    $whereStrings[] = "$col like ?";
                    $whereParams[] = $params['Keyword'];
                }
            }    
 
            $sql = "select
                        assignor.lastname  AS assignorlastname,
                        assignor.firstname AS assignorfirstname,
                        owner.lastname  AS ownerlastname,
                        owner.firstname AS ownerfirstname,
                        altowner.lastname  AS altownerlastname,
                        altowner.firstname AS altownerfirstname,
                        approver.lastname  AS approverlastname,
                        approver.firstname AS approverfistname,
                        a.*
                    from actionitems a
                    inner join users assignor
                        ON a.assignorid = assignor.userid
                    inner join users owner
                        ON a.approverid = owner.userid
                    inner join users altowner
                        ON a.altownerid = altowner.userid
                    inner join users approver
                        ON a.approverid = approver.userid";
                    
            if (!empty($whereStrings)){
                $sql .= " where " . implode(' AND ' . $whereStrings);
            }
            if (isset($params['limit'])){
                $sql .= " limit " . intval($params['limit']);
            }
            
            $statement  = $this->db->prepare($sql);
            $statement->execute($whereParams);
            $resuls = $statement->fetchAll();
            return $this->_populateFromCollection($results);
        }
    }