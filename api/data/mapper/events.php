<?php
    namespace data\mapper;
    class events extends mapper
    { 
        public function mapFromArray($array, \data\model\event $event = null)
        {
            if (is_null($event)) $event = new \data\model\event();
            
            if (!is_null($array['RiskID'])) $event->riskid = $array['RiskID'];
            if (!is_null($array['EventID'])) $event->riskeventid = $array['RiskEventID'];     
            if (!is_null($array['EventOwnerID'])) $event->ownerid = $array['OwnerID'];
            if (!is_null($array['ApproverID'])) $event->approverid = $array['ApproverID'];
            if (!is_null($array['EventTitle'])) $event->eventtitle = $array['EventTitle'];

            if (!is_null($array['ActualDate'])) $event->actualdate = $array['ActualDate'];
            if (!is_null($array['ScheduleDate'])) $event->actualdate = $array['ScheduleDate'];
            if (!is_null($array['BaselineDate'])) $event->actualdate = $array['BaselineDate'];

            if (!is_null($array['ActualLikelihood'])) $event->actuallikelihood = $array['ActualLikelihood'];
            if (!is_null($array['ActalTechnical'])) $event->actualtechnical = $array['ActualTechnical'];
            if (!is_null($array['ActualSchedule'])) $event->actualschedule = $array['ActualSchedule'];
            if (!is_null($array['ActualCost'])) $event->actualcost = $array['ActualCost'];
            
            if (!is_null($array['ScheduledLikelihood'])) $event->scheduledlikelihood = $array['ScheduledLikelihood'];
            if (!is_null($array['ScheduledTechnical'])) $event->scheduledtechnical = $array['ScheduledTechnical'];
            if (!is_null($array['ScheduledSchedule'])) $event->scheduledschedule = $array['ScheduledSchedule'];
            if (!is_null($array['ScheduledCost'])) $event->scheduledcost = $array['ScheduledCost'];
            
            if (!is_null($array['BaselineLikelihood'])) $event->baselinelikelihood = $array['BaselineLikelihood'];
            if (!is_null($array['BaselineTechnical'])) $event->baselinetechnical = $array['BaselineTechnical'];
            if (!is_null($array['BaselineSchedule'])) $event->baselineschedule = $array['BaselineSchedule'];
            if (!is_null($array['BaselineCost'])) $event->baselinecost = $array['BaselineCost'];
            return $event;               
        }
        
        public function findAllByRisk($params = [])
        {
            $whereStrings = [];
            $whereParams = [];
            
            if (isset($params['riskid']))
            {
                $whereStrings[] = 'riskid = ?';
                $whereParams[] = $params['riskid'];   
            }
 
            $sql = "select
                        EventID,
                        RiskID,
                        EventTitle,
                        EventOwnerID,
                        ActualDate,
                        ScheduleDate,
                        BaselineDate,
                        ActualLikelihood,
                        ActualTechnical,
                        ActualSchedule,
                        ActualCost,
                        ScheduledLikelihood,
                        ScheduledTechnical,
                        ScheduledSchedule,
                        ScheduledCost,
                        BaselineLikelihood,
                        BaselineTechnical,
                        BaselineSchedule,
                        BaselineCost    
                    from riskevents
                    ";
 
            if (!empty($whereStrings))
            {
                $sql .= " where " . implode(' AND ' , $whereStrings);
            }
                       
            $sql .= " order by eventid asc";
            
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
        
        
        public function findAll($params = [])
        {
            $sql = "select
                        EventID,
                        RiskID,
                        EventTitle,
                        EventOwnerID,
                        ActualDate,
                        ScheduleDate,
                        BaselineDate,
                        ActualLikelihood,
                        ActualTechnical,
                        ActualSchedule,
                        ActualCost,
                        ScheduledLikelihood,
                        ScheduledTechnical,
                        ScheduledSchedule,
                        ScheduledCost,
                        BaselineLikelihood,
                        BaselineTechnical,
                        BaselineSchedule,
                        BaselineCost    
                    from riskevents
                    ";
          
            $sql .= " order by id asc";
            
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

        public function updateAllByRisk($params = [])
        {                         
            try
            {
                $riskid = $params['riskid'];
                $this->db->beginTransaction();     
                foreach ($params['events'] as $event) 
                {  
                    $statement = $this->db->prepare($sql);
                    $statement->bindValue(':riskid' , $riskid);
                    $statement->bindValue(':eventid' , $event['eventid']);
                    $statement->bindValue(':eventtitle' , $event['eventtitle']);
                    $statement->bindValue(':eventownerid' , $event['eventownerid']);
                   
                   /* $statement->bindValue(':actuallikelihood' , $event['actuallikelihood']);
                    $statement->bindValue(':actualtechnical', $event['actualtechnical']);
                    $statement->bindValue(':actualschedule', $event['actualschedule']); 
                    $statement->bindValue(':actualcost', $event['actualcost']);                 
                     */
                    $statement->bindValue(':scheduledlikelihood' , $event['scheduledlikelihood']);
                    $statement->bindValue(':scheduledtechnical', $event['scheduledtechnical']);
                    $statement->bindValue(':scheduledschedule', $event['scheduledschedule']); 
                    $statement->bindValue(':scheduledcost', $event['scheduledcost']);                 
                    /*
                    $statement->bindValue(':baselinelikelihood' , $event['baselinelikelihood']);
                    $statement->bindValue(':baselinetechnical', $params['baselinetechnical']);
                    $statement->bindValue(':baselineschedule', $params['baselineschedule']); 
                    $statement->bindValue(':baselinecost', $params['baselinecost']);                 
                      */
                      
                      
                    $statement = $this->db->prepare("update events set
                                                            eventtitle =:eventtitle,
                                                            eventownerid = :eventownerid,
                                                            scheduledlikelihood = :scheduledlikelihood,
                                                            scheduledtechnical = :scheduledtechnical,
                                                            scheduledschedule = :scheduledschedule,
                                                            scheduledcost = :scheduledcost
                                                        where riskid = :riskid and eventid = :eventid");  
                    $statement->execute();
                     
                    $statement = $this->db->prepare("insert into events( 
                                                        riskid,
                                                        eventid,
                                                        eventtitle,
                                                        eventownerid,  
                                                        scheduledlikelihood,
                                                        scheduledtechncial,
                                                        scheduledschedule,
                                                        scheduledcost
                                                        )
                                                        select
                                                            :riskid,
                                                            :eventid,
                                                            :eventtitle,
                                                            :eventownerid,
                                                            :scheduledlikelihood,
                                                            :scheduledtechnical,
                                                            :scheduledschedule,
                                                            :scheduledcost
                                                        where riskid = :riskid and eventid = :eventid
                                                        having count(*) = 0");
                
                    $statement->execute();
                }    
                $this->db->commit();
                return ["Succeeded" => true, "Result" => "Event Created!"];
            }
            catch (\PDOException $e)
            {
                return ["Succeeded" => false, "Result" => $e->getMessage()];
            }
        }
    }
