<?php
    namespace data\model;
    
    class user {
        public $id;
        public $userid;
        public $title = '';
        public $phone = '';
        public $extension = '';
        public $firstname = '';
        public $lastname = ''; 
        public $email = '';
        public $department = '';
        public $name = '';
        
        //Property Function 2
        public function getUserLastFirst()
        {
            $this->name = trim(join([$this->lastname, ', ', $this->firstname]), ', ');
            return $this->name;
        }
    }