<?php

if(!empty($_GET['404']) || empty($_GET['type']) || !in_array($_GET['type'],array('playlist','songs'))) {
	fail(404);
}

try {
	// db connection
	$servername = "localhost";
	$username = "jb_theschool";
	$password = "s@+kLnA%bAAv";
	$dbname = "jb_theschool";
	$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
  // set the PDO error mode to exception
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	// operate request
	if(isset($_GET['type']) && $_GET['type']=='playlist') {
		// playlist
		if(isset($_GET['id'])) {
			playlist_item($_GET['id']);
		}
		else {
			playlists();
		}
	}
	else {
		// songs
		if(isset($_GET['id'])){playlist_songs($_GET['id']);}

	}
}
catch(PDOException $e) {
  fail(422);
}

// ----- helpers

function playlist_item($id) {
	global $conn;
	switch($_SERVER['REQUEST_METHOD']) {
		case 'GET':
			$data = array();
			$stmt = $conn->prepare("SELECT id,name,image FROM playlists WHERE id=:id");
			if ($stmt->execute(array('id' => $id))) {
				$data = $stmt->fetch(PDO::FETCH_ASSOC);
			}
			response(TRUE,$data,TRUE);
		break;
		case 'POST':
			$p =& $_POST;
			$update = array();
			if(!empty($p['name'])) $update['name'] = $p['name'];
			if(!empty($p['image'])) $update['image'] = $p['image'];
			if( empty($update) ) {
				response();
			}
			else {
				$update['id'] = $id;
				$stmt = $conn->prepare('UPDATE playlists SET '.implode(", ", array_map(function($v){ return "{$v}=:{$v}"; }, array_keys($update))).' WHERE id=:id');
				$stmt->execute($update);
				response(TRUE);
			}
		break;
		case 'DELETE':
			$stmt = $conn->prepare("DELETE FROM playlists WHERE id=:id");
			$stmt->execute(array(
				'id' => $id
			));
			response(TRUE);
		break;
		default:
			fail(404);
	}
}

function playlists() {
	global $conn;
	switch($_SERVER['REQUEST_METHOD']) {
		case 'GET':
			$data = array();
			$stmt = $conn->prepare("SELECT id,name,image FROM playlists");
			if($stmt->execute()){
				while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
						$data[] = $row;
				}
			}
			response(TRUE,$data,TRUE);
		break;
		case 'POST':
		  $okresult = false;
			$data = NULL;
			$p =& $_POST;
			if( !empty($p['name']) && !empty($p['image']) && !empty($p['songs']) && is_array($p['songs']) ) {
				$okresult = true;
				$c = count($p['songs']);
				for($i=0;$i<$c && $okresult;$i++) {
					$okresult = !empty($p['songs'][$i]['name']) && !empty($p['songs'][$i]['url']);
				}
				if($okresult) {
					$stmt = $conn->prepare("INSERT INTO playlists(name,image,songs) VALUES(:name, :image, :songs)");
					$stmt->execute(array(
						'name' => $p['name'],
						'image' => $p['image'],
						'songs' => json_encode($p['songs'],TRUE)
					));
					$data = [
						'id' => $conn->lastInsertId()
					];
				}
			}
			response($okresult,$data);
		break;
		default:
			fail(404);
		break;
	}
}
function playlist_songs($id) {
	global $conn;
	switch($_SERVER['REQUEST_METHOD']) {
		case 'GET':
			$data = array();
			$stmt = $conn->prepare("SELECT id,songs FROM playlists WHERE id=:id");
			if ($stmt->execute(array('id' => $id))) {
				$data = $stmt->fetch(PDO::FETCH_ASSOC);
			}
			response(TRUE,[
					'songs' => empty($data['songs']) ? [] : json_decode($data['songs'],TRUE)
			]);
		break;
		case 'POST':
		  $okresult = false;
			$p =& $_POST;
			if( !empty($p['songs']) && is_array($p['songs']) ) {
				$okresult = true;
				$c = count($p['songs']);
				for($i=0;$i<$c && $okresult;$i++) {
					$okresult = !empty($p['songs'][$i]['name']) && !empty($p['songs'][$i]['url']);
				}
				if($okresult) {
					$stmt = $conn->prepare('UPDATE playlists SET songs=:songs WHERE id=:id');
					$stmt->execute(array(
							'songs' => json_encode($p['songs']),
							'id' => $id));
				}
			}
			response($okresult);
			break;
		default:
				fail(404);
	}
}

function response($success=FALSE,$payload=array(),$forceResult=FALSE) {
	$status = $success ? 200 : 400;
	$ret = array('success' => $success);
	if($payload || $forceResult) { $ret['data'] = $payload; }
	header('Content-Type: application/json');
	http_response_code($status);
	echo json_encode($ret);
}

function fail($code) {
	header('Content-Type: application/html');
	http_response_code($code);
}
