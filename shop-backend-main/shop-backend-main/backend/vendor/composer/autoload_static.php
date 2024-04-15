<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit34dcc4ff77e19a8c40b0469f93358e02
{
    public static $prefixLengthsPsr4 = array (
        'F' => 
        array (
            'Firebase\\JWT\\' => 13,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Firebase\\JWT\\' => 
        array (
            0 => __DIR__ . '/..' . '/firebase/php-jwt/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit34dcc4ff77e19a8c40b0469f93358e02::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit34dcc4ff77e19a8c40b0469f93358e02::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit34dcc4ff77e19a8c40b0469f93358e02::$classMap;

        }, null, ClassLoader::class);
    }
}