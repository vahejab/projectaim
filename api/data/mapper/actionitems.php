<?php
    namespace data\mapper;
    class actionitems extends mapper
    { 
        public function mapFromArray($array, \data\model\actionitem $actionitem = null)
        {
            if (is_null($actionitem)) $actionitem = new \data\model\actionitem();

            if (!is_null($array['ActionItemID'])) $actionitem->actionitemid = $array['ActionItemID'];     
            if (!is_null($array['AssignorID'])) $actionitem->assignorId = $array['AssignorID'];
            if (!is_null($array['ApproverID'])) $actionitem->approverId = $array['ApproverID'];
            if (!is_null($array['OwnerID'])) $actionitem->ownerId = $array['OwnerID'];
            if (!is_null($array['AltOwnerID'])) $actionitem->altownerId = $array['AltOwnerID'];
            
            if (!is_null($array['assignor.lastname'])) $actionitem->assignorlastname = $array['assignor.lastname'];
            if (!is_null($array['assignor.firstname'])) $actionitem->assignorfirstname = $array['assignor.firstname'];
            if (!is_null($array['owner.lastname'])) $actionitem->ownerlastname = $array['owner.lastname'];
            if (!is_null($array['owner.firstname'])) $actionitem->ownerfirstname = $array['owner.firstname'];
            if (!is_null($array['altowner.lastname'])) $actionitem->altownerlastname = $array['altowner.lastname'];
            if (!is_null($array['altowner.firstname'])) $actionitem->altownerfirstname = $array['altowner.firstname'];
            if (!is_null($array['approver.lastname'])) $actionitem->approverlastname = $array['approver.lastname'];
            if (!is_null($array['approver.firstname'])) $actionitem->approverfirstname = $array['approver.firstname'];
            
            if (!is_null($array['assignor.lastname']) 
            ||  !is_null($array['assignor.firstname'])) $actionitem->assignor = $actionitem->getAssignorFullName();
            if (!is_null($array['approver.lastname']) 
            ||  !is_null($array['approver.firstname'])) $actionitem->approver = $actionitem->getApproverFullName();
            if (!is_null($array['altowner.lastname']) 
            ||  !is_null($array['altowner.firstname'])) $actionitem->altowner = $actionitem->getAltOwnerFullName();
            if (!is_null($array['owner.lastname']) 
            ||  !is_null($array['owner.firstname'])) $actionitem->owner = $actionitem->getOwnerFullName();
            
            
            if (!is_null($array['ActionItemTitle'])) $actionitem->actionitemtitle = $array['ActionItemTitle'];
            if (!is_null($array['Criticality']))  $actionitem->criticality = $array['Criticality'];
            if (!is_null($array['ActionItemStatement'])) $actionitem->actionitemstatement = $array['ActionItemStatement'];
            if (!is_null($array['ClosureCriteria'])) $actionitem->closurecriteria = $array['ClosureCriteria'];
            if (!is_null($array['ClosureStatement'])) $actionitem->closurestatement = $array['ClosureStatement'];
            if (!is_null($array['RejectionJustification'])) $actionitem->rejectionjustification = $array['RejectionJustification'];
            if (!is_null($array['OwnerNotes'])) $actionitem->ownernotes = $array['OwnerNotes'];
            if (!is_null($array['ApproverComments'])) $actionitem->approvercomments = $array['ApproverComments'];
            if (!is_null($array['AssignedDate'])) $actionitem->assigneddate = $array['AssignedDate'];
            if (!is_null($array['DueDate'])) $actionitem->duedate = $array['DueDate']; 
            if (!is_null($array['ECD'])) $actionitem->ecd = $array['ECD']; 
            if (!is_null($array['CompletionDate'])) $actionitem->completiondate = $array['CompletionDate']; 
            if (!is_null($array['ClosedDate'])) $actionitem->closeddate = $array['ClosedDate']; 

            return $actionitem;               
        }
        
        public function findAll($params = [])
        {
            $whereStrings = [];
            $whereParams = [];
            
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
                        'notes',
                        'assigneddate',    
                        'ecd',
                        'duedate',
                        'completiondate',
                        'closeddate'
                    ];

                
                foreach ($searchCols as $col)
                {
                    $whereStrings[] = "$col like ?";
                    $whereParams[] = $params['keyword'];
                }            
            }    
            if (isset($params['actionitemid']))
            {
                $whereStrings[] = 'actionitemid = ?';
                $whereParams[] = $params['actionitemid'];   
            }
 
            $sql = "select
                        assignor.userid as 'AssignorID',
                        owner.userid as 'OwnerID',
                        altowner.userid as 'AltOwnerID',
                        approver.userid as 'ApproverID',
                        assignor.lastname as 'assignor.lastname',
                        assignor.firstname as 'assignor.firstname',
                        owner.lastname as 'owner.lastname',
                        owner.firstname as 'owner.firstname',
                        altowner.lastname as 'altowner.lastname',
                        altowner.firstname as 'altowner.firstname',
                        approver.lastname as 'approver.lastname',
                        approver.firstname as 'approver.firstname',
                        a.actionitemid as 'ActionItemID', a.criticality+0 as 'Criticality',
                        a.completiondate as 'CompletionDate',
                        a.duedate as 'DueDate', a.closeddate as 'ClosedDate', a.ecd as 'ECD', a.assigneddate as 'AssignedDate',
                        a.actionitemtitle as 'ActionItemTitle', a.actionitemstatement as 'ActionItemStatement',
                        a.closurecriteria as 'ClosureCriteria', a.closurestatement as 'ClosureStatement', 
                        a.ownernotes as 'OwnerNotes', a.rejectionjustification as 'RejectionJustification', a.approvercomments as 'ApproverComments'
                    from actionitems a
                    left join users assignor
                        ON a.assignorid = assignor.userid
                    left join users owner
                        ON a.ownerid = owner.userid
                    left join users altowner
                        ON a.altownerid = altowner.userid
                    left join users approver
                        ON a.approverid = approver.userid  
                    ";
 
            if (!empty($whereStrings))
            {
                $sql .= " where " . implode(' AND ' , $whereStrings);
            }
            
            if (isset($params['limit']))
            {
                $sql .= " limit " . intval($params['limit']);
            }
            
            $sql .= " order by a.actionitemid desc";
            
            try
            {
                $statement  = $this->db->prepare($sql);
                $statement->execute($whereParams);
                $results = $statement->fetchAll();
                return(["Succeeded" => true, "Result" => $this->_populateFromCollection($results)]);
            }
            catch(PDOException $e)
            {
                return ["Succeeded" => false, "Result" => $e->getMessage(0)];    
            }
            
        }

        public function createOne($params = [])
        {                         
            $sql = "insert
                    into actionitems(   
                            assignorid,
                            ownerid,
                            altownerid,
                            assigneddate,
                            duedate,
                            ecd,
                            criticality,
                            actionitemtitle,
                            actionitemstatement,
                            closurecriteria
                    )
                    values(  
                            :assignorid,
                            :ownerid,
                            :altownerid,
                            NOW(),
                            :duedate,
                            :ecd,
                            :criticality,
                            :actionitemtitle,
                            :actionitemstatement,
                            :closurecriteria
                    )";
            try
            { 
                $this->db->beginTransaction();     
                $statement = $this->db->prepare($sql);
                $statement->bindValue(':assignorid', $params['assignor']);
                $statement->bindValue(':ownerid' , $params['owner']);
                $statement->bindValue(':altownerid' , $params['altowner']);
                $statement->bindValue(':duedate' , $params['duedate']);
                $statement->bindValue(':ecd' , $params['ecd']);      
                $statement->bindValue(':criticality' , $params['criticality']);
                $statement->bindValue(':actionitemtitle' , $params['actionitemtitle']);
                $statement->bindValue(':actionitemstatement' , $params['actionitemstatement']);
                $statement->bindValue(':closurecriteria', $params['closurecriteria']);                        
                $statement->execute();
                $statement = $this->db->prepare("update actionitems set actionitemid = id where actionitemid is null");
                $statement->execute();
                $this->db->commit();
                return ["Succeeded" => true, "Result" => "Action Item Created!"];
            }
            catch (\PDOException $e)
            {
                return ["Succeeded" => false, "Result" => $e->getMessage()];
            }
        }
        
        public function updateOne($params = [])
        {
            $sql = "update
                    actionitems
                    set
                        assignorid = :assignorid,
                        ownerid = :ownerid,
                        altownerid = :altownerid,
                        approverid = :approverid,
                        assigneddate = :assigneddate,
                        duedate = :duedate,
                        completiondate = :completiondate,
                        ecd = :ecd,
                        closeddate = :closeddate,
                        criticality = :criticality,
                        actionitemtitle = :actionitemtitle,
                        actionitemstatement = :actionitemstatement,
                        closurecriteria = :closurecriteria,
                        ownernotes = :ownernotes,
                        approvercomments = :approvercomments
                    where
                        actionitemid = :actionitemid";
            try
            {      
                $statement = $this->db->prepare($sql);
                $statement->bindValue(':assignorid', $params['assignor']);
                $statement->bindValue(':ownerid' , $params['owner']);
                $statement->bindValue(':altownerid' , $params['altowner']);
                $statement->bindValue(':approverid' , $params['approver']);
                $statement->bindValue(':assigneddate' , $params['assigneddate']);
                $statement->bindValue(':duedate' , $params['duedate']);
                $statement->bindValue(':completiondate' , $params['completiondate']);
                $statement->bindValue(':ecd' , $params['ecd']);  
                $statement->bindValue(':closeddate', $params['closeddate']);  
                $statement->bindValue(':criticality' , $params['criticality']);
                $statement->bindValue(':actionitemtitle' , $params['actionitemtitle']);
                $statement->bindValue(':actionitemstatement' , $params['actionitemstatement']);
                $statement->bindValue(':closurecriteria', $params['closurecriteria']); 
                $statement->bindValue(':ownernotes' , $params['ownernotes']); 
                $statement->bindValue(':approvercomments' , $params['approvercomments']);
                $statement->bindValue(':actionitemid' , $params['actionitemid']);                        
                $statement->execute();
                
                return ["Succeeded" => true, "Result" => "Action Item Updated!"];
            }
            catch (\PDOException $e)
            {
                return ["Succeeded" => false, "Result" => $e->getMessage()];
            }
        }
    }