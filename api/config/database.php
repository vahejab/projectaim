<?php
    class Database
    {
        private static $instance;
        
        private $dbh;
        
        private static $dbengine = 'mysql';
        private static $dbname = 'projectaim';
        private static $dbhost = 'localhost';  
        private static $username = 'root';
        private static $password = 'password';   
     
        function __construct()
        {      
            $dbhost = self::$dbhost;
            $dbengine = self::$dbengine;
            $username = Config::$username;
            $password = Config::$password;
  
            try
            {
                $this->dbh = new PDO("$dbengine:host=$dbhost;dbname=$this->dbname", $username, $password);
            }
            catch (PDOException $e)
            {
                die("Error in establishing connection to database!: " . $e->message);
            }
        }
        
                                        
        public static function getInstance()
        {
            if (!isset(self::$instance))
            {
                $object = __CLASS__;
                self::$instance = new $object();
            }
            return self::$instance;
        }
        
        
        public function getHandle()
        {
            return $this->dbh;
        }
    }