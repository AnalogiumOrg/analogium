<?php
//Checamos que sea un POST (envío de formuario)
$metodo = $_SERVER['REQUEST_METHOD'];
if ($metodo != 'POST') {
	echo "Error: Se esperaba un POST, se recibió un $metodo";
	exit;
}

// Incluimos la base de datos, esto nos deja usar la variable $conn, $dbname y $tablename
include 'database.php';

/* Campos:
  id: int, autoincremental, llave primaria
  name: varchar(255)
  lastname: varchar(255)
  email: varchar(255)
  type: varchar(255)
  feedback: varchar(255)
*/

// Verificamos los campos (no vacíos, no muy largos, email válido)
$campos = array('name', 'lastname', 'email', 'type', 'feedback');
foreach ($campos as $campo) {
	if (!isset($_POST[$campo])) {
		echo "Error: No se recibió el campo $campo";
		exit;
	}
	switch ($campo) {
		case 'name':
			if (strlen($_POST[$campo]) > 255) {
				echo "Error: El campo $campo es demasiado largo";
				exit;
			}
			break;
		case 'lastname':
			if (strlen($_POST[$campo]) > 255) {
				echo "Error: El campo $campo es demasiado largo";
				exit;
			}
			break;
		case 'email':
			if (strlen($_POST[$campo]) > 255) {
				echo "Error: El campo $campo es demasiado largo";
				exit;
			}
			if (!filter_var($_POST[$campo], FILTER_VALIDATE_EMAIL)) {
				echo "Error: El campo $campo no es un email válido";
				exit;
			}
			break;
		case 'type':
			if (strlen($_POST[$campo]) > 255) {
				echo "Error: El campo $campo es demasiado largo";
				exit;
			}
			break;
		case 'feedback':
			if (strlen($_POST[$campo]) > 255) {
				echo "Error: El campo $campo es demasiado largo";
				exit;
			}
			break;
	}
}

// Obtenemos los campos
$name = $_POST['name'];
$lastname = $_POST['lastname'];
$email = $_POST['email'];
$type = $_POST['type'];
$feedback = $_POST['feedback'];

// Insertamos los datos
$conn->query("INSERT INTO $dbname.$tablename (name, last, email, type, feedback) VALUES ('$name', '$lastname', '$email', '$type', '$feedback')");
if ($conn->error) {
	echo "Error insertando los datos: " . $conn->error;
	exit;
}

// Redirigimos a la página de éxito
header('Location: success');
?>