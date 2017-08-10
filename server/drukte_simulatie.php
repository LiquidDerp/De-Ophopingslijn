<?php

header('Content-Type: application/json');

ob_implicit_flush(true);

// Haltes Toevoegen
// Insert haltes into database
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

define('DB_HOST', getenv('OPENSHIFT_POSTGRESQL_DB_HOST'));
define('DB_PORT',getenv('OPENSHIFT_POSTGRESQL_DB_PORT'));
define('DB_USER',getenv('OPENSHIFT_POSTGRESQL_DB_USERNAME'));
define('DB_PASS',getenv('OPENSHIFT_POSTGRESQL_DB_PASSWORD'));
define('DB_NAME',getenv('OPENSHIFT_GEAR_NAME'));



$db_connection = pg_connect("host='".DB_HOST."' port='".DB_PORT."' dbname='ophopingslijn' user='".DB_USER."' password='".DB_PASS."'");

if($db_connection) {

    } else {

    } 


date_default_timezone_set('Europe/Brussels');
$date = date('Y-m-d H:i:s', time());
$date = $date . '+01';

$d = $_GET['number'];
$i = 0;
while($i <= $d){
//simple check
$result = pg_query($db_connection, "INSERT INTO gebruikers
    VALUES (".rand(1, 2131344510).",'".$date."', ST_GeomFromText('POINT(".$_GET['lon']." ".$_GET['lat'].")'))");
$i++;
}
echo('{"Succes":True}');



 