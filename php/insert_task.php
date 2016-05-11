<?php
require_once('DB.php');
if(isset($_POST['items'])) {
	$jsonData = json_decode($_POST['items'], true);
	require_once('DB.php');
	$resultSelect_task = DB::query("select id from tasks WHERE day=? AND month=? AND year=?", array("iii"), array($_COOKIE['day'], $_COOKIE['month'], $_COOKIE['year']));
	if(count($resultSelect_task) > 0) {
		DB::query("UPDATE tasks SET tasks=? WHERE id=?", array("si"), array(serialize($jsonData['items']), $resultSelect_task[0]["id"]));
	} else {
		DB::query("INSERT INTO tasks (day, month, year, tasks) VALUES(?, ?, ?, ?)", array("iiis"), array($_COOKIE['day'], $_COOKIE['month'], $_COOKIE['year'], serialize($jsonData['items'])));
	}
}
?>
