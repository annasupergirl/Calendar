<?php
global $errLog;
$errLog = fopen("err.log", "a+");
class DB {
	private static $connection = null;

	public static function query($query, $params_types, $param) {
		self::check_connection();
		$stmt = self::$connection->prepare($query);
		$result = array_merge($params_types, $param);
		$values = array();

		foreach ($result as $key => $value) {
			$values[$key] = &$result[$key]; 
		}

		call_user_func_array(array($stmt, "bind_param"), $values);

		if (!$stmt->execute()) {
			$err = "Не удалось выполнить запрос: (" . $stmt->errno . ") " . $stmt->error;
			fwrite($errLog, $err);
			exit();
		} else {
//select
			if(mysqli_affected_rows(self::$connection) === -1) {
				$parameters = array();
				$row = array();
				$meta = $stmt->result_metadata();
				while ($field = $meta->fetch_field()) { 
					$row[$field->name] = null;
					$parameters[] = &$row[$field->name];
				}
				call_user_func_array(array($stmt, 'bind_result'), $parameters);
				$resultParam = array();
				while($stmt->fetch()) { 
					$res = array();
					foreach ($row as $key => $val) {
						$res[$key] = $val;
					}
					array_push($resultParam, $res);
				}
				$stmt->close();
				return $resultParam;
			} else {
// INSERT/UPDATE/DELETE
				$result = self::$connection->affected_rows;
				$stmt->close();
				return $result;
			}
		}
	}

	private static function check_connection() {
		if(self::$connection === null) {
			self::$connection = mysqli_connect('localhost', 'root', '', 'annad');

			if (self::$connection->connect_errno) {
				$err = "Не удалось подключиться к MySQL: (" . self::$connection->connect_errno . ") " . self::$connection->connect_error;
				fwrite($errLog, $err);
				exit();
			}
		}
	}
}
fclose($errLog);
?>
