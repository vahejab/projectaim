<?php
    namespace data\mapper;
    class riskconfig extends mapper
    { 
        public function mapFromArray($array, $array2, \data\model\risklevels $risklevel = null, \data\model\riskmatrixthreshold $riskmatrixthreshold = null)
        {
            if (!is_null($array))
            {
                if ( is_null($risklevel)) $risklevel = new \data\model\risklevels();
                if (!is_null($array['RiskMaximum'])) $risklevel->riskmaximum = $array['RiskMaximum'];
                if (!is_null($array['RiskHigh'])) $risklevel->riskhigh = $array['RiskHigh'];         
                if (!is_null($array['RiskMedium'])) $risklevel->riskmedium = $array['RiskMedium'];
                if (!is_null($array['RiskMinimum'])) $risklevel->riskminimum = $array['RiskMinimum'];
                return $risklevel;
            } 
            else if (!is_null($array2))
            {
                if ( is_null($riskmatrixthreshold)) $riskmatrixthreshold = new \data\model\riskmatrixthreshold();
                if (!is_null($array2['CellID'])) $riskmatrixthreshold->cellid  = $array2['CellID'];
                if (!is_null($array2['Likelihood'])) $riskmatrixthreshold->likelihood  = $array2['Likelihood'];
                if (!is_null($array2['Consequence'])) $riskmatrixthreshold->consequence  = $array2['Consequence'];
                if (!is_null($array2['Level'])) $riskmatrixthreshold->level = $array2['Level'];
                return $riskmatrixthreshold;
            }              
        }
         
        public function findAll($params = [])
        {
         
            $sqlLevels = "select
                        RiskMaximum,
                        RiskHigh,
                        RiskMedium,
                        RiskMinimum
                    from risklevels
                    order by RiskLevelID";
            
            $sqlThresholds = "select
                                CellID,
                                Likelihood,
                                Consequence,
                                COALESCE(Level, '') as Level
                              from riskmatrixthresholds
                              order by CellID asc";
            
            
            try
            {
                $statement  = $this->db->prepare($sqlLevels);
                $statement->execute();
                $results = $statement->fetchAll();
                
                
                $statement2  = $this->db->prepare($sqlThresholds);
                $statement2->execute();
                $results2 = $statement2->fetchAll();
               
                return(["Succeeded" => true, "Result" => [
                           'Levels' => $this->_populateFromCollection($results, null),
                           'Thresholds' => $this->_populateFromCollection(null, $results2) 
                       ]
                ]);
            }
            catch(PDOException $e)
            {
                return ["Succeeded" => false, "Result" => $e->getMessage(0)];    
            }
            
        }

        /*public function createOne($params = [])
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
        } */
        
        public function updateAll($params = [])
        {
            $sql = "update
                    risklevels
                    set
                        riskmaximum = :riskmaximum,
                        riskhigh = :riskhigh,
                        riskmedium = :riskmedium,
                        riskminimum = :riskminimum
                    where risklevelid = 1";
                    
            $sql2 = "update
                     riskmatrixthresholds
                     set 
                        level = :level
                     where likelihood = :likelihood
                     and consequence = :consequence";
            try
            {    
                $this->db->beginTransaction();  
                $statement = $this->db->prepare($sql);
                $statement->bindValue(':riskmaximum', $params['Levels']['riskmaximum']);
                $statement->bindValue(':riskhigh' , $params['Levels']['riskhigh']);
                $statement->bindValue(':riskmedium' , $params['Levels']['riskmedium']);
                $statement->bindValue(':riskminimum' , $params['Levels']['riskminimum']);
                              
                $statement->execute(); 
                               
                for ($l = 1; $l <= 5; $l++)
                {
                    for($c = 1; $c <= 5; $c++)
                    {
                        $threshold = $params['Thresholds'][$l][$c];
                        $statement2 = $this->db->prepare($sql2);  
                        $statement2->bindValue(':level', $threshold);
                        $statement2->bindValue(':likelihood', $l);
                        $statement2->bindValue(':consequence', $c);
                        $statement2->execute();
                    }
                }
                $this->db->commit();
                 
                return ["Succeeded" => true, "Result" => "Risk Configuration Updated!"];
            }
            catch (\PDOException $e)
            {
                return ["Succeeded" => false, "Result" => $e->getMessage()];
            }
        }
    }
