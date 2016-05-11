<?php
require_once('DB.php');
$resultId_tasks = DB::query("DELETE FROM tasks where day=? AND month=? AND year=?", array("iii"), array($_COOKIE['day'], $_COOKIE['month'], $_COOKIE['year']));
?>
