<?php
    class autoloader
    {
        private $directoryName;
        
        public function __construct($directoryName)  
        {
            $this->directoryName = $directoryName;
        }  
        
        public function autoload($className)
        {
            $fileName = strtolower($className).'.php';
            
            $file = $this->$directoryName.'/'.$fileName;

            if (file_exists($file) == false)
            {
                return false;
            }
            include ($file);
        }    
    }
    
    # nullify any existing autoloads
    spl_autoload_register(null, false);

    # instantiate the autoloader object
    $classes = [
                    new autoloader('config'),
                    new autoloader('data'), 
                    new autoloader('models'), 
                    new autoloader('controllers')
    ];

    # register the loader functions
    foreach ($classes as $class)
        spl_autoload_register(array($class, 'autoload'));   