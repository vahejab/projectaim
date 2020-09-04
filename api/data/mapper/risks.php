<?php
    namespace data\mapper;
    class risks extends mapper
    { 
        public function mapFromArray($array, \data\model\risk $risk = null)
        {
            if (is_null($risk)) $risk = new \data\model\risk();

            if (array_key_exists('RiskID', $array) && !is_null($array['RiskID'])) $risk->riskid = $array['RiskID']; 

            if (array_key_exists('CreatorID', $array) && !is_null($array['CreatorID'])) $risk->creatorid = $array['CreatorID'];
            if (array_key_exists('OwnerID', $array) && !is_null($array['OwnerID'])) $risk->ownerid = $array['OwnerID'];
            if (array_key_exists('ApproverID', $array) && !is_null($array['ApproverID'])) $risk->approverid = $array['ApproverID'];
            if (array_key_exists('AssessmentDate', $array) && !is_null($array['AssessmentDate'])) $risk->assessmentdate = $array['AssessmentDate'];
            
            if (array_key_exists('creator.lastname', $array) && !is_null($array['creator.lastname'])) $risk->creatorlastname = $array['creator.lastname'];
            if (array_key_exists('creator.firstname', $array) && !is_null($array['creator.firstname'])) $risk->creatorfirstname = $array['creator.firstname'];
            if (array_key_exists('owner.lastname', $array) && !is_null($array['owner.lastname'])) $risk->ownerlastname = $array['owner.lastname'];
            if (array_key_exists('owner.firstname', $array) && !is_null($array['owner.firstname'])) $risk->ownerfirstname = $array['owner.firstname'];

            if (array_key_exists('approver.lastname', $array) && !is_null($array['approver.lastname'])) $risk->approverlastname = $array['approver.lastname'];
            if (array_key_exists('approver.firstname', $array) && !is_null($array['approver.firstname'])) $risk->approverfirstname = $array['approver.firstname'];
            
            if (array_key_exists('creator.firstname', $array) && array_key_exists('creator.lastname', $array) && (!is_null($array['creator.lastname']) 
            ||  !is_null($array['creator.firstname']))) $risk->creator = $risk->getCreatorFullName();
            
            if (array_key_exists('owner.firstname', $array) && array_key_exists('owner.lastname', $array) && (!is_null($array['owner.lastname']) 
            ||  !is_null($array['owner.firstname']))) $risk->owner = $risk->getOwnerFullName();
            
            
            if (array_key_exists('approver.firstname', $array) && array_key_exists('approver.lastname', $array) && (!is_null($array['approver.lastname']) 
            ||  !is_null($array['approver.firstname']))) $risk->approver = $risk->getApproverFullName();
            
            
            if (array_key_exists('RiskTitle', $array) && !is_null($array['RiskTitle'])) $risk->risktitle = $array['RiskTitle'];
            if (array_key_exists('RiskState', $array) && !is_null($array['RiskState'])) $risk->riskstate = $array['RiskState'];
            if (array_key_exists('RiskStatement', $array) && !is_null($array['RiskStatement']))  $risk->riskstatement = $array['RiskStatement'];
            if (array_key_exists('Context', $array) && !is_null($array['Context'])) $risk->context = $array['Context'];
            if (array_key_exists('ClosureCriteria', $array) && !is_null($array['ClosureCriteria'])) $risk->closurecriteria = $array['ClosureCriteria'];  
            if (array_key_exists('Likelihood', $array) && !is_null($array['Likelihood'])) $risk->likelihood = $array['Likelihood'];
            if (array_key_exists('Technical', $array) && !is_null($array['Technical'])) $risk->technical = $array['Technical'];
            if (array_key_exists('Schedule', $array) && !is_null($array['Schedule'])) $risk->schedule = $array['Schedule'];
            if (array_key_exists('Cost', $array) && !is_null($array['Cost'])) $risk->cost = $array['Cost'];
            return $risk;               
        }
        
        
        public function first()
        {       
            $sql = "select riskid as 'RiskID',
                        creator.userid as 'CreatorID',
                        owner.userid as 'OwnerID',  
                        approver.userid as 'ApproverID', 
                        creator.lastname as 'creator.lastname',
                        creator.firstname as 'creator.firstname',
                        owner.lastname as 'owner.lastname',
                        owner.firstname as 'owner.firstname',
                        approver.lastname as 'approver.lastname',
                        approver.firstname as 'approver.firstname',    
                        r.likelihood as 'Likelihood',
                        r.technical as 'Technical', 
                        r.schedule as 'Schedule',
                        r.cost as 'Cost',
                        r.AssessmentDate as 'AssessmentDate',
                        r.risktitle as 'RiskTitle', 
                        r.riskstatement as 'RiskStatement',
                        r.context as 'Context',
                        r.closurecriteria as 'ClosureCriteria'
                    from risks r
                    left join users creator
                        ON r.creatorid = creator.userid
                    left join users owner
                        ON r.ownerid = owner.userid
                    left join users approver
                        ON r.approverid = approver.userid order by r.riskid asc limit 1";
            
            try
            {
                $statement  = $this->db->prepare($sql);
                $statement->execute();
                $result = $statement->fetchAll();
                return(["Succeeded" => true, "Result" => $this->_populateFromCollection($result)[0]]);
            }
            catch(PDOException $e)
            {
                return ["Succeeded" => false, "Result" => $e->getMessage(0)];    
            }
        }
        
        public function prev($id)
        {      
            $sql = "SELECT riskid AS 'RiskID',
                        creator.userid AS 'CreatorID',
                        owner.userid AS 'OwnerID',  
                        approver.userid AS 'ApproverID', 
                        creator.lastname AS 'creator.lastname',
                        creator.firstname AS 'creator.firstname',
                        owner.lastname AS 'owner.lastname',
                        owner.firstname AS 'owner.firstname',
                        approver.lastname AS 'approver.lastname',
                        approver.firstname AS 'approver.firstname',
                        r.riskstate AS 'RiskState',    
                        r.likelihood AS 'Likelihood',
                        r.technical AS 'Technical', 
                        r.schedule AS 'Schedule',
                        r.cost AS 'Cost',
                        r.AssessmentDate AS 'AssessmentDate',
                        r.risktitle AS 'RiskTitle', 
                        r.riskstatement AS 'RiskStatement',
                        r.context AS 'Context',
                        r.closurecriteria AS 'ClosureCriteria'
                    FROM risks r
                    LEFT JOIN users creator
                        ON r.creatorid = creator.userid
                    LEFT JOIN users OWNER
                        ON r.ownerid = owner.userid
                    LEFT JOIN users approver
                        ON r.approverid = approver.userid
                  WHERE riskid = (SELECT COALESCE(MAX(riskid), 1) FROM risks WHERE riskid < ? ORDER BY riskid ASC LIMIT 1)";
            $whereParams[] = $id; 
            try
            {
                $statement  = $this->db->prepare($sql);
                $statement->execute($whereParams);
                $result = $statement->fetchAll();
                 return(["Succeeded" => true, "Result" => $this->_populateFromCollection($result)[0]]);
            }
            catch(PDOException $e)
            {
                return ["Succeeded" => false, "Result" => $e->getMessage(0)];    
            }
        }
        
        public function next($id)
        {      
            $sql = "SELECT riskid AS 'RiskID',
                        creator.userid AS 'CreatorID',
                        owner.userid AS 'OwnerID',  
                        approver.userid AS 'ApproverID', 
                        creator.lastname AS 'creator.lastname',
                        creator.firstname AS 'creator.firstname',
                        owner.lastname AS 'owner.lastname',
                        owner.firstname AS 'owner.firstname',
                        approver.lastname AS 'approver.lastname',
                        approver.firstname AS 'approver.firstname',  
                        r.riskstate as 'RiskState',  
                        r.likelihood AS 'Likelihood',
                        r.technical AS 'Technical', 
                        r.schedule AS 'Schedule',
                        r.cost AS 'Cost',
                        r.AssessmentDate AS 'AssessmentDate',
                        r.risktitle AS 'RiskTitle', 
                        r.riskstatement AS 'RiskStatement',
                        r.context AS 'Context',
                        r.closurecriteria AS 'ClosureCriteria'
                    FROM risks r
                    LEFT JOIN users creator
                        ON r.creatorid = creator.userid
                    LEFT JOIN users OWNER
                        ON r.ownerid = owner.userid
                    LEFT JOIN users approver
                        ON r.approverid = approver.userid
                  WHERE riskid = (SELECT COALESCE(MIN(riskid), (SELECT MAX(riskid) FROM risks)) FROM risks WHERE riskid > ?) ORDER BY riskid ASC LIMIT 1";
            $whereParams[] = $id; 
            try
            {
                $statement  = $this->db->prepare($sql);
                $statement->execute($whereParams);
                $result = $statement->fetchAll();
                return(["Succeeded" => true, "Result" => $this->_populateFromCollection($result)[0]]);
            }
            catch(PDOException $e)
            {
                return ["Succeeded" => false, "Result" => $e->getMessage(0)];    
            }
        }
        
        public function last()
        {       
            $sql = "select riskid as 'RiskID',
                        creator.userid as 'CreatorID',
                        owner.userid as 'OwnerID',  
                        approver.userid as 'ApproverID', 
                        creator.lastname as 'creator.lastname',
                        creator.firstname as 'creator.firstname',
                        owner.lastname as 'owner.lastname',
                        owner.firstname as 'owner.firstname',
                        approver.lastname as 'approver.lastname',
                        approver.firstname as 'approver.firstname',
                        r.riskstate as 'RiskState',    
                        r.likelihood as 'Likelihood',
                        r.technical as 'Technical', 
                        r.schedule as 'Schedule',
                        r.cost as 'Cost',
                        r.AssessmentDate as 'AssessmentDate',
                        r.risktitle as 'RiskTitle', 
                        r.riskstatement as 'RiskStatement',
                        r.context as 'Context',
                        r.closurecriteria as 'ClosureCriteria'
                    from risks r
                    left join users creator
                        ON r.creatorid = creator.userid
                    left join users owner
                        ON r.ownerid = owner.userid
                    left join users approver
                        ON r.approverid = approver.userid
                    order by r.riskid desc limit 1";
                    
            try
            {
                $statement  = $this->db->prepare($sql);
                $statement->execute();
                $result = $statement->fetchAll();
                return(["Succeeded" => true, "Result" => $this->_populateFromCollection($result)[0]]);
            }
            catch(PDOException $e)
            {
                return ["Succeeded" => false, "Result" => $e->getMessage(0)];    
            }
        }
        
        
        public function findAll($params = [])
        {
            $whereStrings = [];
            $whereParams = [];
            
            if (isset($params['Keyword']))
            {
                
                $searchCols = 
                   [
                        'creator.lastname',
                        'creator.firstname',
                        'owner.lastname',
                        'owner.firstname',
                        'assessmentdate',
                        'risktitle',
                        'riskstatement', 
                        'context',
                        'closurecriteria',
                        'likelihood',
                        'technical',
                        'schedule',
                        'cost',
                    ];

                
                foreach ($searchCols as $col)
                {
                    $whereStrings[] = "$col like ?";
                    $whereParams[] = $params['keyword'];
                }            
            }    
            if (isset($params['riskid']))
            {
                $whereStrings[] = 'riskid = ?';
                $whereParams[] = $params['riskid'];   
            }
 
            $sql = "select
                        creator.userid as 'CreatorID',
                        owner.userid as 'OwnerID',  
                        approver.userid as 'ApproverID', 
                        creator.lastname as 'creator.lastname',
                        creator.firstname as 'creator.firstname',
                        owner.lastname as 'owner.lastname',
                        owner.firstname as 'owner.firstname',
                        approver.lastname as 'approver.lastname',
                        approver.firstname as 'approver.firstname',
                        r.riskState as 'RiskState',    
                        r.riskid as 'RiskID',
                        r.likelihood as 'Likelihood',
                        r.technical as 'Technical', 
                        r.schedule as 'Schedule',
                        r.cost as 'Cost',
                        r.AssessmentDate as 'AssessmentDate',
                        r.risktitle as 'RiskTitle', 
                        r.riskstatement as 'RiskStatement',
                        r.context as 'Context',
                        r.closurecriteria as 'ClosureCriteria'
                    from risks r
                    left join users creator
                        ON r.creatorid = creator.userid
                    left join users owner
                        ON r.ownerid = owner.userid
                    left join users approver
                        ON r.approverid = approver.userid
                    ";
 
            if (!empty($whereStrings))
            {
                $sql .= " where " . implode(' AND ' , $whereStrings);
            }
            
            if (isset($params['limit']))
            {
                $sql .= " limit " . intval($params['limit']);
            }
            
            $sql .= " order by r.riskid desc";
            
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
            try
            {
                $this->db->beginTransaction();     
                $sql = "insert
                    into risks(
                            assessmentdate,
                            ownerid,
                            risktitle,
                            riskstate, 
                            riskstatement,
                            closurecriteria,
                            context,
                            likelihood,
                            technical,
                            schedule,
                            cost
                    )
                    values(
                            NOW(),
                            :ownerid,
                            :risktitle,
                            :riskstate,
                            :riskstatement,
                            :closurecriteria,
                            :context,
                            :likelihood,
                            :technical,
                            :schedule,
                            :cost
                    )";
                $statement = $this->db->prepare($sql);                     
                $statement->bindValue(':ownerid' , $params['ownerid']);
                $statement->bindValue(':risktitle' , $params['risktitle']);
                $statement->bindValue(':riskstate', $params['riskstate']);
                $statement->bindValue(':riskstatement' , $params['riskstatement']);
                $statement->bindValue(':closurecriteria' , $params['closurecriteria']);
                $statement->bindValue(':context', $params['context']);
                $statement->bindValue(':likelihood', $params['likelihood']); 
                $statement->bindValue(':technical', $params['technical']); 
                $statement->bindValue(':schedule', $params['schedule']);
                $statement->bindValue(':cost', $params['cost']);                       
                $statement->execute();  
                $riskid = $this->db->lastInsertId();                          
                $this->db->query("update risks set riskid = id where riskid is null");
                $this->db->commit(); 
                return ["Succeeded" => true, "Result" => "Risk Created!", "RiskID" => $riskid];
            }
            catch (\PDOException $e)
            {
                return ["Succeeded" => false, "Result" => $e->getMessage()];
            }
        }
        
        public function updateState($params = [])
        {
            $sql = "update
                    risks
                    set
                        risksate = :riskstate
                    where riskid = :riskid";
            
            try
            {      
                $statement = $this->db->prepare($sql);              
                $statement->bindValue(':riskstate' , $params['riskstate']);
                $statement->bindValue(':riskid' , $params['riskid']);                   
                $statement->execute();
                
                return ["Succeeded" => true, "Result" => "Risk $params[riskstate]"];
            }
            catch (\PDOException $e)
            {
                return ["Succeeded" => false, "Result" => $e->getMessage()];
            }
            
        }
        
        public function updateOne($params = [])
        {
            $sql = "update
                    risks
                    set
                        ownerid = :ownerid,
                        approverid = :approverid,
                        risktitle = :risktitle,
                        riskstate = :riskstate,
                        riskstatement = :riskstatement,
                        assessmentdate = :assessmentdate,
                        closurecriteria = :closurecriteria,
                        context = :context
                    where
                        riskid = :riskid";
            try
            {      
                $statement = $this->db->prepare($sql);              
                $statement->bindValue(':ownerid' , $params['owner']);
                $statement->bindValue(':approverid' , $params['approver']);
                $statement->bindValue(':risktitle' , $params['risktitle']);
                $statement->bindValue(':riskstate', $params['riskstate']);
                $statement->bindValue(':riskstatement' , $params['riskstatement']);
                $statement->bindValue(':assessmentdate' , $params['assessmentdate']);
                $statement->bindValue(':closurecriteria' , $params['closurecriteria']);  
                $statement->bindValue(':context', $params['context']);
                $statement->bindValue(':riskid', $params['riskid']);                    
                $statement->execute();
                
                return ["Succeeded" => true, "Result" => "Risk Updated!"];
            }
            catch (\PDOException $e)
            {
                return ["Succeeded" => false, "Result" => $e->getMessage()];
            }
        }
    }
