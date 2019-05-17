<?php
    namespace data\model;
    
    class risk
    {
        public $riskid;          
        public $risktitle;
        public $riskstatement;
        public $context;
        public $approverid;
        public $ownerid;
        public $creatorid;
        public $assessmentdate;
        public $likelihood;
        public $technical;
        public $schedule;
        public $cost;
        
        public $creatorlastname = '';
        public $cratorfirstname = '';
        public $ownerlastname = '';
        public $ownerfirstname = '';
    
    
    
        public function getCreatorFullName()
        {
             return trim(join(', ', [$this->creatorlastname, $this->creatorfirstname]), ', ');
        }
        
        public function getOwnerFullName()
        {
             return trim(join(', ', [$this->ownerlastname, $this->ownerfirstname]), ', ');
        }
        
        public function getApproverFullName()
        {
             return trim(join(', ', [$this->ownerlastname, $this->ownerfirstname]), ', ');
        }
    }