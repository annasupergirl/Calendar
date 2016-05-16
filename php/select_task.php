<?php
require_once('DB.php');
$resultSelect_task = DB::query("select task from tasks WHERE day=? AND month=? AND year=?", array("sss"), array($_GET['day'], $_GET['month'], $_GET['year']));
if(count($resultSelect_task) > 0) {
	$res = $resultSelect_task;
	echo json_encode($res);
} else {
	echo false;
}
?>
