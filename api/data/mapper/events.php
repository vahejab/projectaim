<?php
    namespace data\mapper;
    class events extends mapper
    { 
        public function mapFromArray($array, \data\model\event $event = null)
        {
            if (is_null($event)) $event = new \data\model\event();
            
            if (!is_null($array['RiskID'])) $event->riskid = $array['RiskID'];
            if (!is_null($array['EventID'])) $event->eventid = $array['EventID'];     
            if (!is_null($array['EventOwnerID'])) $event->ownerid = $array['EventOwnerID'];   
            if (!is_null($array['EventTitle'])) $event->eventtitle = $array['EventTitle'];

            if (!is_null($array['ActualDate'])) $event->actualdate = $array['ActualDate'];
            if (!is_null($array['ScheduleDate'])) $event->scheduledate = $array['ScheduleDate'];
            if (!is_null($array['BaselineDate'])) $event->baselinedate = $array['BaselineDate'];

            if (!is_null($array['ActualLikelihood'])) $event->actuallikelihood = $array['ActualLikelihood'];
            if (!is_null($array['ActualTechnical'])) $event->actualtechnical = $array['ActualTechnical'];
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
        
        public function findAllByRisk($riskid)
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
                    where riskid = :riskid
                    order by eventid asc";
            try
            {
                $statement  = $this->db->prepare($sql);
                $statement->bindParam(':riskid' , $riskid);
                $statement->execute();
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
                    $statement = $this->db->prepare("update riskevents set
                                                            eventtitle =:eventtitle,
                                                            eventownerid = :eventownerid,
                                                            actualdate = :actualdate,
                                                            scheduledate = :scheduledate,
                                                            scheduledlikelihood = :scheduledlikelihood,
                                                            scheduledtechnical = :scheduledtechnical,
                                                            scheduledschedule = :scheduledschedule,
                                                            scheduledcost = :scheduledcost
                                                        where riskid = :riskid and eventid = :eventid");  
                     
                    $statement->bindValue(':riskid' , $params['riskid']);
                    $statement->bindValue(':eventid' , $event['eventid']);
                    $statement->bindValue(':eventtitle' , $event['eventtitle']);
                    $statement->bindValue(':eventownerid' , $event['ownerid']);
                   
                   /* $statement->bindValue(':actuallikelihood' , $event['actuallikelihood']);
                    $statement->bindValue(':actualtechnical', $event['actualtechnical']);
                    $statement->bindValue(':actualschedule', $event['actualschedule']); 
                    $statement->bindValue(':actualcost', $event['actualcost']);                 
                     */
                    
                    $statement->bindValue(':actualdate', $event['actualdate']);
                    $statement->bindValue(':scheduledate', $event['scheduledate']);
                    
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
                    $statement->execute();
                   

                    $statement = $this->db->prepare("insert into riskevents( 
                                                        riskid,
                                                        eventid,
                                                        eventtitle,
                                                        eventownerid,
                                                        actualdate,
                                                        scheduledate,  
                                                        scheduledlikelihood,
                                                        scheduledtechnical,
                                                        scheduledschedule,
                                                        scheduledcost
                                                        )
                                                        select
                                                            :riskid,
                                                            :eventid,
                                                            :eventtitle,
                                                            :eventownerid,
                                                            :actualdate,
                                                            :scheduledate,
                                                            :scheduledlikelihood,
                                                            :scheduledtechnical,
                                                            :scheduledschedule,
                                                            :scheduledcost
                                                        having (select count(*) from riskevents where riskid = :riskid and eventid = :eventid) = 0");
                
                   
                    $statement->bindValue(':riskid' , $riskid);
                    $statement->bindValue(':eventid' , $event['eventid']);
                    $statement->bindValue(':eventtitle' , $event['eventtitle']);
                    $statement->bindValue(':eventownerid' , $event['ownerid']);
                   
                         
                    $statement->bindValue(':actualdate', $event['actualdate']);
                    $statement->bindValue(':scheduledate', $event['scheduledate']);
                    
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
