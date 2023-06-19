<?php
//Checamos que sea un POST (envío de formuario)
$metodo = $_SERVER['REQUEST_METHOD'];
if ($metodo != 'POST') {
	echo "Error: Se esperaba un POST, se recibió un $metodo";
	exit;
}

// Incluimos la base de datos, esto nos deja usar la variable $conn, $dbusername y $tableusername
include 'base_de_datos.php';

/* Campos:
  id: int, autoincremental, llave primaria
  nombre: varchar(255)
  apellidos: varchar(255)
  email: varchar(255)
  estudios: varchar(255)
  dia: varchar(255)
  comentario: varchar(255)
*/

// Verificamos los campos (no vacíos, no muy largos, email válido)
$campos = array('username', 'lastname', 'email', 'feedtype', 'feedback');
foreach ($campos as $campo) {
	if (!isset($_POST[$campo])) {
		echo "Error: No se recibió el campo $campo";
		exit;
	}
	switch ($campo) {
		case 'username':
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
		case 'feedtype':
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
$username = $_POST['username'];
$lastname = $_POST['lastname'];
$email = $_POST['email'];
$feedtype = $_POST['feedtype'];
$feedback = $_POST['feedback'];

// Insertamos los datos
$conn->query("INSERT INTO $dbname.$tablname (username, last, email, feedtype, feedback) VALUES ('$username', '$lastname', '$email', '$feedtype', '$feedback')");
if ($conn->error) {
	echo "Error insertando los datos: " . $conn->error;
	exit;
}

// Redirigimos a la página de éxito
header('Location: exito.html');
?>