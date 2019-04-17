<?php
    $cls = []; 
    # instantiate the autoloader object
       # instantiate the autoloader object
    $cls = [
                    new \autoloader\autoloader('data\service'),
                    new \autoloader\autoloader('data\mapper'),
                    new \autoloader\autoloader('data\model'), 
                    new \autoloader\autoloader('data\provider')
    ];
    
    # register the loader functions
    foreach ($cls as $class)
    {
        spl_autoload_register(array($class, 'autoload')); 
    }