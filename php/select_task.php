<?php
require_once('DB.php');
$resultSelect_task = DB::query("select tasks from tasks WHERE day=? AND month=? AND year=?", array("iii"), array($_COOKIE['day'], $_COOKIE['month'], $_COOKIE['year']));
if(count($resultSelect_task) > 0) {
	$res = unserialize($resultSelect_task[0]["tasks"]);
	echo json_encode($res);
} else {
	echo false;
}
?>
