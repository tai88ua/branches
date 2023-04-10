<?php

include_once __DIR__ . "/config.php";

$pdo = new PDO(
    'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME,
    DB_USER,
    DB_PASS
);

spl_autoload_register(static function ($class) {
    $path = str_replace('\\', '/', $class);
    include_once(__DIR__ . "/" . $path . ".php");
});

$method = $_SERVER['REQUEST_METHOD'];
$pathInfo = $_SERVER['PATH_INFO'];

$pathInfo = str_replace('/', '',  $pathInfo);

$view = new View();
$controller = new Controller\Main($pdo, $view);

if (method_exists($controller,$pathInfo)) {
    $controller->$pathInfo();
} else {
    $response = [
        'msg' => 'bad path: ' . $pathInfo,
        'error' => true,
    ];
    $view->view($response);
}
