<?php
  class DatabaseController {
    private $params;
    private $errorheader;

    protected $dbconnection;
    protected $rqmethod;
    protected $results;

    public function __construct($database, $rqmethod) {
      $this->dbconnection = new DatabaseConnection($database);
      $this->rqmethod = $rqmethod;

      $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
      $uri = explode( '/', $uri );
      $this->params = array_slice($uri, array_search('index.php', $uri) + 1);
    }

    protected function process_get_request() {
      switch ($this->params[0]) {
        case 'student':
          $this->process_student_get_request();
          break;
        case 'course':
          $this->process_course_get_request();
          break;
        case 'calendar':
          $this->process_calendar_get_request();
          break;
        default:
          $this->errorheader = $_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found';
          break;
      }
    }

    protected function process_student_get_request() {
      switch ($this->params[1]) {
        case 'email':
          $output = $this->dbconnection->get_id_from_email($_GET['email']);
          break;
        case 'courses':
          $output = $this->dbconnection->get_courses($_GET['id'], $_GET['secret']);
          break;
        case 'calendarid':
          $output = $this->dbconnection->get_student_calendar_id($_GET['id'], $_GET['secret']);
          break;
        default:
          $this->errorheader = $_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found';
          break;
      }
      $this->results = $output;
    }

    protected function process_course_get_request() {
      switch ($this->params[1]) {
        case 'days':
          $output = $this->dbconnection->get_course_days($_GET['id']);
          break;
        default:
          $this->errorheader = $_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found';
          break;
      }
      $this->results = $output;
    }

    protected function process_calendar_get_request() {
      switch ($this->params[1]) {
        case 'days':
          $output = $this->dbconnection->get_calendar_days();
          break;
        default:
          $this->errorheader = $_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found';
          break;
      }
      $this->results = $output;
    }

    protected function process_post_request() {
      switch ($this->params[0]) {
        case 'student':
          $this->process_student_post_request();
          break;
        case 'course':
          $this->process_course_post_request();
          break;
        case 'calendar':
          $this->process_calendar_post_request();
          break;
        case 'delete':
          $this->process_post_delete_request();
          break;
        default:
          $this->errorheader = $_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found';
          break;
      }
    }

    protected function process_student_post_request() {
      if (count($this->params) < 2) {
        array_push($this->params, NULL);
      }
      switch ($this->params[1]) {
        case NULL:
          $this->dbconnection->post_add_student($_POST['adminuser'], $_POST['adminpass'], $_POST['data']);
          break;
        case 'course':
          $this->dbconnection->post_add_student_course($_POST['adminuser'], $_POST['adminpass'], $_POST['data']);
          break;
        case 'requestemail':
          $this->dbconnection->post_send_request_email($_POST['email']);
          break;
        case 'login':
          $this->dbconnection->post_verify_login($_POST['id'], $_POST['secret']);
          break;
        case 'logout':
          $this->dbconnection->post_logout($_POST['id'], $_POST['secret']);
          break;
        case 'calendarid':
          $this->dbconnection->post_student_calendar_id($_POST['id'], $_POST['secret'], $_POST['calendarid']);
          break;
        default:
          $this->errorheader = $_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found';
          break;
      }
    }

    protected function process_course_post_request() {
      if (count($this->params) < 2) {
        array_push($this->params, NULL);
      }
      switch ($this->params[1]) {
        case NULL:
          $this->dbconnection->post_add_course($_POST['adminuser'], $_POST['adminpass'], $_POST['data']);
          break;
        case 'day':
          $this->dbconnection->post_add_course_day($_POST['adminuser'], $_POST['adminpass'], $_POST['data']);
          break;
        default:
          $this->errorheader = $_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found';
          break;
      }
    }

    protected function process_calendar_post_request() {
      if (count($this->params) < 2) {
        array_push($this->params, NULL);
      }
      switch ($this->params[1]) {
        case NULL:
          $this->dbconnection->post_add_calendar($_POST['adminuser'], $_POST['adminpass'], $_POST['data']);
          break;
        default:
          $this->errorheader = $_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found';
      }
    }

    protected function process_post_delete_request() {
      switch ($this->params[1]) {
        case 'student':
          $this->dbconnection->post_delete_student($_POST['adminuser'], $_POST['adminpass']);
          break;
        case 'course':
          $this->dbconnection->post_delete_course($_POST['adminuser'], $_POST['adminpass']);
          break;
        case 'calendar':
          $this->dbconnection->post_delete_calendar($_POST['adminuser'], $_POST['adminpass']);
          break;
        default:
          $this->errorheader = $_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found';
      }
    }

    public function process_request() {
      try {
        switch ($this->rqmethod) {
          case 'GET':
            $this->process_get_request();
            break;
          case 'POST':
            $this->process_post_request();
            break;
          default:
            $this->errorheader = $_SERVER['SERVER_PROTOCOL'] . ' 400 Bad Request';
            break;
        }
      }
      catch (SQLTableException $e) {
        $this->errorheader = $_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error';
      }
      catch (NotPermittedException $e) {
        $this->errorheader = $_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found';
      }
    }

    public function send_results() {
      if ($this->errorheader == '') {
        $httpheader = $_SERVER['SERVER_PROTOCOL'] . ' 200 OK';
      }
      else {
        $httpheader = $this->errorheader;
      }
      header_remove('Set-Cookie');
      header($httpheader, true, 500);
      echo $this->results;
    }
  }
 ?>
