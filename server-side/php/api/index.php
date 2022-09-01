<?php
  ini_set('display_errors', 'On');
  error_reporting(E_ALL);
  mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
  require 'classes/DotEnv.php';

  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json; charset=UTF-8');
  header('Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE');
  header('Access-Control-Max-Age: 3600');
  header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

  $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
  $uri = explode( '/', $uri );
  $params = array_slice($uri, array_search('index.php', $uri) + 1);

  if (!isset($params[0])) {
    header($_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found', true, 500);
    die();
  }

  $dotenv = new DotEnv('.env');
  $dotenv->load();

  require 'classes/DatabaseController.php';
  require 'classes/DatabaseConnection.php';
  require 'classes/exceptions/SQLTableException.php';
  require 'classes/exceptions/NotPermittedException.php';

  $controller = new DatabaseController('powerschool_data', $_SERVER['REQUEST_METHOD']);
  $controller->process_request();
  $controller->send_results();
?>
