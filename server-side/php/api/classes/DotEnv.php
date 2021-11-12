<?php
  class DotEnv {
    protected $path;

    public function __construct($path) {
      $this->path = $path;
    }

    public function load(): void {
      $path = $this->path;
      $file = fopen('../../' . $path, 'r') or die('Unable to open file ' . $path);
      $i = 1;
      while(!feof($file)) {
        $line = fgets($file);
        $line = trim($line);
        if ($line == '') {
          break;
        }
        if (strpos($line, '#') === 0) {
          continue;
        }

        $data = explode('=', $line);
        if (count($data) != 2) {
          die($path . 'Syntax incorrect in ' . $path . 'line ' . $i);
        }
        $name = trim($data[0]);
        $value = trim($data[1]);
        putenv($name . '=' . $value);
        $_ENV[$name] = $value;
        $_SERVER[$name] = $value;

        $i++;
      }
    }

    public function change_path($path) {
      $this->path = $path;
    }
  }
?>
