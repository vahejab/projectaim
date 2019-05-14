<?php
    namespace autoloader;
    class autoloader
    {
        private $directoryName;
        
        public function __construct($directoryName)  
        {
            $this->directoryName = $directoryName;
        }  
        
        public function autoload()
        {
            foreach (glob("{$this->directoryName}/*.class.php") as $filename)
            {
                include_once $filename;           
            }
         
            foreach (glob("{$this->directoryName}/*.php") as $filename)
            {
                include_once $filename;           
            }
        }    
    }
    
    # nullify any existing autoloads
    spl_autoload_register(null, false);

    # instantiate the autoloader object
    $classes = [
                    new autoloader('config'),
                    new autoloader('controllers'), 
                    new autoloader('models'),
                    new autoloader('data')
    ];

    # register the loader functions
    foreach ($classes as $class)
        spl_autoload_register(array($class, 'autoload'));