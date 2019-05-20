<?php
    namespace data\mapper;
    class riskconfig extends mapper
    { 
        public function mapFromArray($array, \data\model\risklevels $risklevel = null)
        {
            /*if (is_null($riskmatrixthresholds)) $riskmatrixthresolds = [];
            $idx = 0;
            for ($r = 0; $r < count($array['cells']); $r++)
            {
                for ($c = 0; $c < count($array['cells']); $c++)
                {
                    $row = $r+1;
                    $col = $c+1;
                    $riskmatrixthresholds[] = new \data\model\riskmatrixthresold();
                    $riskmatrixthresholds[$idx]->row = $row;
                    $riskmatrixthresholds[$idx]->col = $col;
                    $idx++;
                }

            }
            return $risk;*/
            
            if ( is_null($risklevel)) $risklevel = new \data\model\risklevels();
            if (!is_null($array['RiskMaximum'])) $risklevel->riskmaximum = $array['RiskMaximum'];
            if (!is_null($array['RiskHigh'])) $risklevel->riskhigh = $array['RiskHigh'];         
            if (!is_null($array['RiskMedium'])) $risklevel->riskmedium = $array['RiskMedium'];
            if (!is_null($array['RiskMinimum'])) $risklevel->riskminimum = $array['RiskMinimum'];
            return $risklevel;
                           
        }
        
        public function findAll($params = []){
        }
        
        public function findOne($params = [])
        {
            $whereStrings = [];
            $whereParams = [];
        
            $sql = "select
                        RiskMaximum,
                        RiskHigh,
                        RiskMedium,
                        RiskMinimum
                    from risklevels
                    ";

            $sql .= " order by RiskLevelID";
            
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
