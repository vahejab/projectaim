<?php
    namespace data\mapper;
    class actionitems
    {    
        private $db = null;
        
        public function __construct(\PDO $db)
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
        
        public function mapFromArray($array, \data\model\actionitem $actionitem = null)
        {
            if (is_null($actionitem)) $actionitem = new \data\model\actionitem();
            if (!is_null($array['ID'])) $actionitem->id = $array['ID'];
            if (!is_null($array['ActionItemID'])) $actionitem->actionitemid = $array['ActionItemID'];
            if (!is_null($array['assignor.lastname'])) $actionitem->assignorlastname = $array['assignor.lastname'];
            if (!is_null($array['assignor.firstname'])) $actionitem->assignorfirstname = $array['assignor.firstname'];
            if (!is_null($array['owner.lastname'])) $actionitem->ownerlastname = $array['owner.lastname'];
            if (!is_null($array['owner.firstname'])) $actionitem->ownerfirstname = $array['owner.firstname'];
            if (!is_null($array['altowner.lastname'])) $actionitem->altownerlastname = $array['altowner.lastname'];
            if (!is_null($array['altowner.firstname'])) $actionitem->altownerfirstname = $array['altowner.firstname'];
            if (!is_null($array['approver.lastname'])) $actionitem->altownerlastname = $array['approver.lastname'];
            if (!is_null($array['approver.firstname'])) $actionitem->approverfirstname = $array['approver.firstname'];
            if (!is_null($array['ActionItemTitle'])) $actionitem->actionitemtitle = $array['ActionItemTitle'];
            if (!is_null($array['Criticality'])) $actionitem->criticality = $array['Criticality'];
            if (!is_null($array['ActionItemStatement'])) $actionitem->actionitemstatement = $array['ActionItemStatement'];
            if (!is_null($array['ClosureCriteria'])) $actionitem->closurecriteria = $array['ClosureCriteria'];
            if (!is_null($array['ClosureStatement'])) $actionitem->closurestatement = $array['ClosureStatement'];
            if (!is_null($array['RejectionJustification'])) $actionitem->rejectionjustification = $array['RejectionJustification'];
            if (!is_null($array['OwnerNotes'])) $actionitem->ownernotes = $array['OwnerNotes'];
            if (!is_null($array['ApproverComments'])) $actionitem->aprovercomments = $array['ApproverComments'];
            if (!is_null($array['Notes'])) $actionitem->notes = $array['Notes']; 
        
            return $actionitem;               
        }
        
        public function findOne($params = [])
        {
            $collection = $this->findAll($params);
            
            if (count($collection) > 1)
            {
                throw new Exception("More than one result found");
            }
            
            $returnOne = null;
            if (!empty($collection))
            {
                $returnOne = array_shift($collection);
            }
            return $returnOne;
        }
        
        public function findAll($params = [])
        {
            $whereStrings = $whereParams = array();
            
            if (isset($params['Keyword']))
            {
                
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

                
                foreach ($searchCols as $col)
                {
                    $whereStrings[] = "$col like ?";
                    $whereParams[] = $params['keyword'];
                }

                if (isset($params['actionitemid']))
                {
                    $whereStrings[] = 'actionitemid = ?';
                    $whereParams[] = $params['actionitemid'];   
                }
                
            }    
 
            $sql = "select
                        assignor.lastname as 'assignor.lastname',
                        assignor.firstname as 'assignor.firstname',
                        owner.lastname as 'owner.lastname',
                        owner.firstname as 'owner.firstname',
                        altowner.lastname as 'altowner.lastname',
                        altowner.firstname as 'altowner.firstname',
                        approver.lastname as 'approver.lastname',
                        approver.firstname as 'approver.firstname',
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
            $results = $statement->fetchAll();
            return $this->_populateFromCollection($results);
        }
    }