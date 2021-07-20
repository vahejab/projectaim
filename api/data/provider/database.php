<?php
    namespace data\provider;
    
    class database
    {
        protected $dbh;

        function __construct()
        {      
            try
            {
                $dbname = 'projectaim';  
                $username = 'root';
                $password = 'pass';   
     
                $this->dbh = new \PDO("mysql:host=localhost;dbname=$dbname", $username, $password);
                $this->dbh->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            }
            catch (PDOException $e)
            {
                die("Error in establishing connection to database!: " . $e->message);
            }
        }
        
        public function getHandle()
        {
            return $this->dbh;    
        }
    }