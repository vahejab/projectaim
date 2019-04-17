<?php
    class Database
    {
        protected $dbh;

        function __construct()
        {      
            try
            {
                $dbname = 'projectaim';  
                $username = 'root';
                $password = '';   
     
                $this->dbh = new PDO("mysql:host=localhost;dbname=$dbname", $username, $password);
            }
            catch (PDOException $e)
            {
                die("Error in establishing connection to database!: " . $e->message);
            }
            
            return $this->dbh;
        }
    }