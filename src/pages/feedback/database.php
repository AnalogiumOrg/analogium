<?php

// Host de la base de datos
$servername = "nebula4.our-space.xyz";
// Usuario
$username = "cbtisL_cb50d530";
// Contraseña
$password = "NHS6z3DUZUA3spMB";
// Nombre de la base de datos (mismo que usuario)
$dbname = "cbtisL_cb50d530";
// Nombre de la tabla
$tablename = "FEEDBACK";

// Creamos una conexión
$conn = new mysqli($servername, $username, $password);

// Revisamos que la conexión funciona
if ($conn->connect_error) {
	die("Conexión fallida: " . $conn->connect_error);
}
/* Campos:
  id: int, autoincremental, llave primaria
  name: varchar(255)
  lastname: varchar(255)
  email: varchar(255)
  type: varchar(255)
  feedback: varchar(255)
*/

// Creamos la tabla si no existe
$sql = "CREATE TABLE IF NOT EXISTS $dbname.$tablename (
	id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(255) NOT NULL,
	lastname VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	feedback VARCHAR(255) NOT NULL
)";

if ($conn->query($sql) === FALSE) {
	echo "Error creando la tabla: " . $conn->error;
	exit;
}

?>