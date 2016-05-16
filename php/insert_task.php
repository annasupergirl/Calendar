<?php
require_once('DB.php');
DB::query("INSERT INTO tasks (day, month, year, task, date_of_creation) VALUES(?, ?, ?, ?, ?)", array("sssss"), array($_GET['day'], $_GET['month'], $_GET['year'], $_GET['task'], date("Y-m-d H:i:s")));
?>
