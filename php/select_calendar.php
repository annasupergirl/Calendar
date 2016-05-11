<?php
require_once('DB.php');
$resultSelect_task = DB::query("select day from tasks WHERE month=? AND year=?", array("ii"), array($_GET['month'], $_GET['year']));
if(count($resultSelect_task) > 0) {
	$res = $resultSelect_task;
	echo json_encode($res);
} else {
	echo false;
}
?>
