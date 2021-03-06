<?php
use Doctrine\Common\Annotations\AnnotationRegistry;
use Destiny\Common\Config;
use Destiny\Common\Routing\Route;
use Doctrine\DBAL\DriverManager;
use Doctrine\Common\Cache\RedisCache;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Destiny\Common\Application;
use Destiny\Common\Routing\Router;
use Destiny\Common\ControllerAnnotationLoader;
use Destiny\Common\DirectoryClassIterator;
use Doctrine\Common\Annotations\AnnotationReader;

// This should be in the server config
ini_set ( 'date.timezone', 'UTC' );

// Used when the full path is needed to the base directory
define ( '_BASEDIR', realpath ( __DIR__ . '/../' ) );
define ( 'PP_CONFIG_PATH', _BASEDIR . '/config/' );
$loader = require _BASEDIR . '/vendor/autoload.php';

Config::load ( array_replace_recursive ( 
    require _BASEDIR . '/config/config.php', 
    require _BASEDIR . '/config/config.local.php', 
    json_decode ( file_get_contents ( _BASEDIR . '/package.json' ), true )
) );
set_include_path(get_include_path() . PATH_SEPARATOR . Config::$a['tpl']['path']);

AnnotationRegistry::registerLoader ( array ($loader, 'loadClass') );

$app = Application::instance();
$app->setLoader ( $loader );

$log = new Logger ( 'web' );
$log->pushHandler ( new StreamHandler ( Config::$a ['log'] ['path'] . 'web.log', Logger::CRITICAL ) );
$log->pushProcessor ( new Monolog\Processor\WebProcessor () );
$app->setLogger ( $log );

$app->setConnection ( DriverManager::getConnection ( Config::$a ['db'] ) );

$redis = new Redis ();
$redis->connect ( Config::$a ['redis'] ['host'], Config::$a ['redis'] ['port'] );
$redis->select ( Config::$a ['redis'] ['database'] );
$app->setRedis ( $redis );

$cache = new RedisCache ();
$cache->setRedis ( $app->getRedis () );
$cache->setNamespace( Config::$a['cache']['namespace'] );
$app->setCacheDriver ( $cache );

$router = new Router();
$app->setRouter ($router);
$app->setAnnotationReader ( new Doctrine\Common\Annotations\CachedReader(new AnnotationReader(), $cache, $debug = false) );
ControllerAnnotationLoader::loadClasses ( new DirectoryClassIterator ( _BASEDIR . '/lib/', 'Destiny/Controllers/' ), $app->getAnnotationReader (), $router );

foreach (Config::$a['links'] as $path => $url) {
    $router->addRoute(new Route([
        'path' => $path,
        'url'  => $url
    ]));
}