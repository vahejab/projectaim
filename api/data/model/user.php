<?php
    namespace data\model;
    
    class user {
        public $id;
        public $userid;
        public $title;
        public $phone;
        public $firstname;
        public $lastname; 
        public $email;
        public $department;
        
        //Property Function 2
        public function getUserLastFirst(){
             return trim($this->firstname, ', ', $this->lastname);
        }
    }
