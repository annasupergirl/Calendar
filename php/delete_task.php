<?php
require_once('DB.php');
$resultId_tasks = DB::query("DELETE FROM tasks where task=?", array("s"), array($_GET['task']));
?>
