<?php
    namespace data\model;
    
    class actionitem
    {
        public $id;
        public $actionitemid;
        public $ownerId;
        public $assignorId;
        public $altownerId;
        public $approverId;
        public $actionitemtitle;
        public $criticality;
        public $actionitemstatement;
        public $closurecriteria;
        public $closurestatement;
        public $rejectionjustification;
        public $ownernotes;
        public $approvercomments;
        public $notes;
        
        public $ownerlastname;
        public $ownerfirstname;
        public $assignorlastname;
        public $assignorfirstname;
        public $altownerlastname;
        public $altownerfirstname;
        public $approverlastname;
        public $approverfirstname;
        
        public function getOwnwerFullName()
        {
             return trim($this->ownerlastname, ', ', $this->ownerfirst);
        }

        public function getAssignorFullName()
        {
             return trim($this->assignorlastname, ', ', $this->assignorfirstname);
        }
        
        public function getAltOwnerLastName()
        {
             return trim($this->altownerlastname, ', ', $this->altownerlastname);
        }
        
        public function getApproverFirstName()
        {
             return trim($this->approverlastname, ', ', $this->approverfirstname);
        }
    }