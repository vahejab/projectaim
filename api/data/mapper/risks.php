<?php
    namespace data\mapper;
    class risks extends mapper
    { 
        public function mapFromArray($array, \data\model\risk $risk = null)
        {
            if (is_null($risk)) $risk = new \data\model\risk();

            if (!is_null($array['RiskID'])) $risk->riskid = $array['RiskID'];     
            if (!is_null($array['CreatorID'])) $risk->creatorid = $array['CreatorID'];
            if (!is_null($array['OwnerID'])) $risk->ownerid = $array['OwnerID'];
            if (!is_null($array['AssessmentDate'])) $risk->assessmentdate = $array['AssessmentDate'];
            
            if (!is_null($array['creator.lastname'])) $risk->creatorlastname = $array['creator.lastname'];
            if (!is_null($array['creator.firstname'])) $risk->creatorlastname = $array['creator.firstname'];
            if (!is_null($array['owner.lastname'])) $risk->ownerlastname = $array['owner.lastname'];
            if (!is_null($array['owner.firstname'])) $risk->ownerfirstname = $array['owner.firstname'];

            if (!is_null($array['creator.lastname']) 
            ||  !is_null($array['creator.firstname'])) $risk->altowner = $risk->getAltOwnerFullName();
            if (!is_null($array['owner.lastname']) 
            ||  !is_null($array['owner.firstname'])) $risk->owner = $risk->getOwnerFullName();
            
            
            if (!is_null($array['RiskTitle'])) $risk->risktitle = $array['RiskTitle'];
            if (!is_null($array['RiskStatement']))  $risk->riskstatement = $array['RiskStatement'];
            if (!is_null($array['Context'])) $risk->context = $array['Context'];
            if (!is_null($array['ClosureCriteria'])) $risk->closurecriteria = $array['ClosureCriteria'];  
            if (!is_null($array['Likelihood'])) $risk->likelihood = $array['Likelihood'];
            if (!is_null($array['Technical'])) $risk->technical = $array['Technical'];
            if (!is_null($array['Schedule'])) $risk->schedule = $array['Schedule'];
            if (!is_null($array['Cost'])) $risk->cost = $array['Cost'];
            return $risk;               
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
                        r.riskid as 'RiskID', r.lilelihood as 'Likelihood',
                        r.technical as 'Technical', r.schedule as 'Schedule',
                        r.cost as 'Cost,
                        r.creationdate as 'CreationDate',
                        r.risktitle as 'RiskTitle', r.riskstatement as 'RiskStatement',
                        r.context as 'Context', r.closurecriteria as 'ClosureCriteria'
                    from risks r
                    left join users creator
                        ON r.creatorid = creator.userid
                    left join users owner
                        ON r.ownerid = owner.userid
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
            $sql = "insert
                    into risks( 
                            assessmentdate,
                            risktitle,
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
                            :risktitle,
                            :riskstatement,
                            :closurecriteria,
                            :context,
                            :likelihood,
                            :technical,
                            :schedule,
                            :cost
                    )";
            try
            { 
                $this->db->beginTransaction();     
                $statement = $this->db->prepare($sql);
                //$statement->bindValue(':creatorid', $params['creator']);
                //$statement->bindValue(':ownerid' , $params['owner']);
                $statement->bindValue(':risktitle' , $params['risktitle']);
                $statement->bindValue(':riskstatement' , $params['riskstatement']);
                $statement->bindValue(':closurecriteria' , $params['closurecriteria']);
                $statement->bindValue(':context', $params['context']);
                $statement->bindValue(':likelihood', $params['likelihood']); 
                $statement->bindValue(':technical', $params['technical']); 
                $statement->bindValue(':schedule', $params['schedule']);
                $statement->bindValue(':cost', $params['cost']);                       
                $statement->execute();
                $statement = $this->db->prepare("update risks set riskid = id where riskid is null");
                $statement->execute();
                $this->db->commit();
                return ["Succeeded" => true, "Result" => "Risk Created!"];
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
                        creatorid = :creatorid,
                        ownerid = :ownerid,
                        risktitle = :risktitleid,
                        riskstatement = :riskstatementid,
                        assessmentdate = :assessmentdate,
                        closurecriteria = :closurecriteria,
                        context = :context,
                        likelihood = :likelihood,
                        technical = :technical,
                        scheudle = :schedule,
                        cost = :cost
                    where
                        risk = :riskid";
            try
            {      
                $statement = $this->db->prepare($sql);
                $statement->bindValue(':creatorid', $params['creator']);
                $statement->bindValue(':ownerid' , $params['owner']);
                $statement->bindValue(':risktitle' , $params['risktitle']);
                $statement->bindValue(':riskstatement' , $params['riskstatement']);
                $statement->bindValue(':assessmentdate' , $params['assessmentdate']);
                $statement->bindValue(':closurecriteria' , $params['closurecriteria']);  
                $statement->bindValue(':context', $params['context']);  
                $statement->bindValue(':likelihood' , $params['likelihood']);
                $statement->bindValue(':technical' , $params['technical']);
                $statement->bindValue(':schedule' , $params['schedule']);  
                $statement->bindValue(':cost', $params['cost']);                    
                $statement->execute();
                
                return ["Succeeded" => true, "Result" => "Risk Updated!"];
            }
            catch (\PDOException $e)
            {
                return ["Succeeded" => false, "Result" => $e->getMessage()];
            }
        }
    }
