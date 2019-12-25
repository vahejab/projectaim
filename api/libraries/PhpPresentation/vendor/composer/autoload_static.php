<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitc0ee5fe8efbe74640b5c56e56996c2eb
{
    public static $prefixLengthsPsr4 = array (
        'Z' => 
        array (
            'Zend\\Escaper\\' => 13,
        ),
        'P' => 
        array (
            'PhpOffice\\PhpWord\\' => 18,
            'PhpOffice\\PhpPresentation\\' => 26,
            'PhpOffice\\Common\\' => 17,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Zend\\Escaper\\' => 
        array (
            0 => __DIR__ . '/..' . '/zendframework/zend-escaper/src',
        ),
        'PhpOffice\\PhpWord\\' => 
        array (
            0 => __DIR__ . '/..' . '/phpoffice/phpword/src/PhpWord',
        ),
        'PhpOffice\\PhpPresentation\\' => 
        array (
            0 => __DIR__ . '/..' . '/phpoffice/phppresentation/src/PhpPresentation',
        ),
        'PhpOffice\\Common\\' => 
        array (
            0 => __DIR__ . '/..' . '/phpoffice/common/src/Common',
        ),
    );

    public static $classMap = array (
        'PclZip' => __DIR__ . '/..' . '/pclzip/pclzip/pclzip.lib.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitc0ee5fe8efbe74640b5c56e56996c2eb::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitc0ee5fe8efbe74640b5c56e56996c2eb::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInitc0ee5fe8efbe74640b5c56e56996c2eb::$classMap;

        }, null, ClassLoader::class);
    }
}
