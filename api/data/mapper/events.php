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
             if ($riskid == 'first')
                $whereStr = "where riskid = (select min(riskid) from risks)";
             else if ($riskid == 'last')
                $whereStr = "where riskid = (select max(riskid) from risks)";
             else
                $whereStr = "where riskid = :riskid";
                
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
                        from riskevents " . $whereStr . " order by eventid asc";
           
            try
            {
                $statement  = $this->db->prepare($sql);
                if ($riskid != 'first' && $riskid != 'last')
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
                $statement->execute();
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
             
                $statement = $this->db->prepare("delete from riskevents where riskid = :riskid and eventid > :lasteventid");
                $statement->bindValue(':riskid' , $params['riskid']);
                $statement->bindValue(':lasteventid' , $params['events'][count($params['events'])-1]['eventid']);
                $statement->execute();
                
                foreach ($params['events'] as $event) 
                {  
                    $statement = $this->db->prepare("update riskevents set
                                                            eventtitle =:eventtitle,
                                                            eventownerid = :eventownerid,
                                                            
                                                            actualdate = :actualdate,
                                                            actuallikelihood = :actuallikelihood,
                                                            actualtechnical = :actualtechnical,
                                                            actualschedule = :actualschedule,
                                                            actualcost = :actualcost,
                                                            
                                                            baselinedate = :baselinedate,
                                                            baselinelikelihood = :baselinelikelihood,
                                                            baselinetechnical = :baselinetechnical,
                                                            baselineschedule = :baselineschedule,
                                                            baselinecost = :baselinecost,
                                                            
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
                   
                    
                    $statement->bindValue(':actualdate', $event['actualdate']);
                    $statement->bindValue(':baselinedate', $event['baselinedate']);
                    $statement->bindValue(':scheduledate', $event['scheduledate']);
                    
                    $statement->bindValue(':actuallikelihood' , $event['actuallikelihood']);
                    $statement->bindValue(':actualtechnical', $event['actualtechnical']);
                    $statement->bindValue(':actualschedule', $event['actualschedule']); 
                    $statement->bindValue(':actualcost', $event['actualcost']);                 
                    
                    $statement->bindValue(':baselinelikelihood' , $event['baselinelikelihood']);
                    $statement->bindValue(':baselinetechnical', $event['baselinetechnical']);
                    $statement->bindValue(':baselineschedule', $event['baselineschedule']); 
                    $statement->bindValue(':baselinecost', $event['baselinecost']);                 
                        
                    $statement->bindValue(':scheduledlikelihood' , $event['scheduledlikelihood']);
                    $statement->bindValue(':scheduledtechnical', $event['scheduledtechnical']);
                    $statement->bindValue(':scheduledschedule', $event['scheduledschedule']); 
                    $statement->bindValue(':scheduledcost', $event['scheduledcost']);     
                    
                    
                    
                    $statement->execute();
                   

                    $statement = $this->db->prepare("insert into riskevents( 
                                                        riskid,
                                                        eventid,
                                                        eventtitle,
                                                        eventownerid,
                                                        actualdate,
                                                        actuallikelihood,
                                                        actualtechnical,
                                                        actualschedule,
                                                        actualcost,
                                                        baselinedate,
                                                        baselinetechnical,
                                                        baselineschedule,
                                                        baselinecost,
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
                                                            :actuallikelihood,
                                                            :actualtechnical,
                                                            :actualschedule,
                                                            :actualcost,
                                                            :baselinedate,
                                                            :baselinetechnical,
                                                            :baselineschedule,
                                                            :baselinecost,
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
                    
                    $statement->bindValue(':baselinedate', $event['baselinedate']);
           
                    $statement->bindValue(':scheduledate', $event['scheduledate']);
                    
                    $statement->bindValue(':actuallikelihood' , $event['actuallikelihood']);
                    $statement->bindValue(':actualtechnical', $event['actualtechnical']);
                    $statement->bindValue(':actualschedule', $event['actualschedule']); 
                    $statement->bindValue(':actualcost', $event['actualcost']);                 
             
                    $statement->bindValue(':baselinelikelihood' , $event['baselinelikelihood']);
                    $statement->bindValue(':baselinetechnical', $event['baselinetechnical']);
                    $statement->bindValue(':baselineschedule', $event['baselineschedule']); 
                    $statement->bindValue(':baselinecost', $event['baselinecost']);                 
                    
                    $statement->bindValue(':scheduledlikelihood' , $event['scheduledlikelihood']);
                    $statement->bindValue(':scheduledtechnical', $event['scheduledtechnical']);
                    $statement->bindValue(':scheduledschedule', $event['scheduledschedule']); 
                    $statement->bindValue(':scheduledcost', $event['scheduledcost']);                 
                  
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
