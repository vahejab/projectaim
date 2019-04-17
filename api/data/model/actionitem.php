<?php
    namespace data\model;
    
    class actionitem{
        public $actionitemid;
        public $ownerid;
        public $assignorid;
        public $altownerid;
        public $approverid;
        public $actionitemtitle;
        public $criticality;
        public $actionitemstatement;
        public $closurecriteria;
        public $closurestatement;
        public $rejectionjustification;
        public $ownernotes;
        public $approvercomments;
        public $notes;
        public $users = [];
        
        public function getAssignorLastFirstName() : \data\model\user {
            /** @var \data\model\user $user */
            $user = $this->users[$this->assignorid];
            return $user->getUserLastFirst();
        }
        
        public function getOwnwerLastFirstName() : \data\model\user {
            /** @var \data\model\user $user */
            $user = $this->users[$this->ownerid];
            return $user->getUserLastFirst();
        }
        
        public function getAltOwnwerLastFirstName() : \data\model\user {
            /** @var \data\model\user $user */
            $user = $this->users[$this->altownerid];
            return $user->getUserLastFirst();
        }
        
        public function getApproverLastFirstName() : \data\model\user {
            /** @var \data\model\user $user */
            $user = $this->users[$this->approverid];
            return $user->getUserLastFirst();
        }
    }