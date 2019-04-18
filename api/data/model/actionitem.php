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
        public $actionitemtitle = '';
        public $criticality = '';
        public $actionitemstatement = '';
        public $closurecriteria = '';
        public $closurestatement = '';
        public $rejectionjustification = '';
        public $ownernotes = '';
        public $approvercomments = '';
        public $notes = '';
        
        public $ownerlastname = '';
        public $ownerfirstname = '';
        public $assignorlastname = '';
        public $assignorfirstname = '';
        public $altownerlastname = '';
        public $altownerfirstname = '';
        public $approverlastname = '';
        public $approverfirstname = '';
        
        public $owner = '';
        public $approver = '';
        public $altowner = '';
        public $assignor = '';
        
        public function getOwnerFullName()
        {
             return trim(join(', ', [$this->ownerlastname, $this->ownerfirstname]), ', ');
        }

        public function getAssignorFullName()
        {
             return trim(join(', ', [$this->assignorlastname, $this->assignorfirstname]), ', ');
        }
        
        public function getAltOwnerFullName()
        {
             return trim(join(', ', [$this->altownerlastname, $this->altownerfirstname]), ', ');
        }
        
        public function getApproverFullName()
        {
             return trim(join(', ', [$this->approverlastname, $this->approverfirstname]), ', ');
        }
    }