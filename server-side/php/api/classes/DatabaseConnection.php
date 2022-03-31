<?php
  class DatabaseConnection {
    protected $connection;

    public function __construct($database) {
      $host = getenv('DB_HOST');
      $username = getenv('DB_USERNAME');
      $password = getenv('DB_PASSWORD');
      $this->connection = mysqli_connect($host, $username, $password, $database);
    }

    public function get_id_from_email($email) {
      $results = $this->run_statement('SELECT id FROM student WHERE email = ?', 's', $email);

      if (count($results) < 1) {
        throw new SQLTableException('Email not recognized');
      }
      else if (count($results) > 1) {
        throw new SQLTableException('Unexpected amount of table entries found');
      }
      return $results[0]['id'];
    }

    public function get_courses($id, $secret) {
      $this->verify_credentials($id, $secret);

      $results = $this->run_statement('SELECT * FROM student_course WHERE student_id = ?', 'i', $id);
      $courseids = array_column($results, 'course_id');
      $coursedata = $this->run_statement('SELECT * FROM course WHERE id = ' . implode(' OR id = ', array_fill(0, count($courseids), '?')), implode('', array_fill(0, count($courseids), 'i')), ...$courseids);
      return json_encode($coursedata);
    }

    public function post_send_request_email($email) {
      $id = $this->get_id_from_email($email);
      $bytes = random_bytes(16);
      $secret = bin2hex($bytes);

      $results = $this->run_statement('INSERT INTO user (id, secret) VALUES (?, ?) ON DUPLICATE KEY UPDATE
secret = ?, active = 0', 'iss', $id, $secret, $secret);

      $state = new stdClass();
      $state->id = $id;
      $state->secret = $secret;

      $subject = 'test';
      $message = getenv('URL_ROOT') . 'client-side/html/login.html?id=' . $id . '&secret=' . $secret;
      // $message = 'https://accounts.google.com/o/oauth2/v2/auth/identifier?response_type=code&client_id=253727930094-nl6m9igcuk2lhdc4qlva72em4kfuqa01.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A8888%2Fclient-side%2Fhtml%2Flogin.html&scope=openid%20profile%20email&state=' . urlencode(json_encode($state)) . '&nonce=8qsujb9GS0vsnV3WCH6D&flowName=GeneralOAuthFlow';
      $headers = 'from: noreply@chasnov.joshua.com\r\n';
      mail($email, $subject, $message, $headers);
    }

    public function post_verify_login($id, $secret) {
      $results = $this->run_statement('SELECT * FROM user WHERE id = ? AND secret = ? AND active = 0', 'is', $id, $secret);

      if (count($results) < 1) {
        throw new SQLTableException('ID not recognized or secret incorrect');
      } else if (count($results) > 1) {
        throw new SQLTableException('Unexpected amount of table entries found');
      }

      $results = $this->run_statement('UPDATE user SET active = 1 WHERE id = ? AND secret = ?', 'is', $id, $secret);
    }

    public function post_logout($id, $secret) {
      $this->verify_credentials($id, $secret);

      $results = $this->run_statement('UPDATE user SET active = 0, secret = "" WHERE id = ? AND secret = ?', 'is', $id, $secret);
    }

    public function post_student_calendar_id($id, $secret, $calendarid) {
      $this->verify_credentials($id, $secret);

      $results = $this->run_statement('UPDATE user SET calendar_id = ? WHERE id = ? AND secret = ?', 'sis', $calendarid, $id, $secret);
    }

    public function get_cycle_days($courseid) {
      $coursedaymap = $this->run_statement('SELECT * FROM course_day WHERE course_id = ?', 'i', $courseid);
      return json_encode($coursedaymap);
    }

    public function get_calendar_days() {
      $map = $this->run_statement('SELECT * FROM day', '');
      return json_encode($map);
    }

    public function get_student_calendar_id($id, $secret) {
      $results = $this->run_statement('SELECT * FROM user WHERE id = ? AND secret = ?', 'ss', $id, $secret);
      return $results[0]['calendar_id'];
    }

    private function run_statement($query, $paramtype = '', ...$params) {
      $connection = $this->connection;
      $stmt = $connection->prepare($query);
      if (count($params) > 0) {
        $stmt->bind_param($paramtype, ...$params);
      }
      $stmt->execute();

      $results = $stmt->get_result();
      $allresults = NULL;
      if ($results) {
        $allresults = $results->fetch_all(MYSQLI_ASSOC);
      }
      $stmt->close();
      return $allresults;
    }

    private function verify_credentials($id, $secret) {
      $results = $this->run_statement('SELECT id FROM user WHERE id = ? AND secret = ?', 'is', $id, $secret);

      if (count($results) < 1) {
        throw new SQLTableException('ID not recognized or secret incorrect');
      } else if (count($results) > 1) {
        throw new SQLTableException('Unexpected amount of table entries found');
      }
    }
  }
 ?>
