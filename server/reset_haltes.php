<?php
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
echo('DE OPHOPINGSLIJN - IRPRO 1 - 2016-2017 - TABEL B AANMAKEN<br>');
if($db_connection) {
       echo('[OK] Connection Succesfull<br>');
    } else {
        echo '[WARNING] Unexpected Error: Please check database<br>';
    } 



$url="https://data.irail.be/DeLijn/Stations.json";
$json = file_get_contents($url);
$data = json_decode($json, TRUE);
//simple check

$del = pg_query($db_connection, "TRUNCATE halte");
echo('[OK] Truncated Table<br>');
echo('[WAITING] Waiting while adding ' . sizeof($data['Stations']) . ' tables to db "halte"<br>') ;


foreach ($data['Stations'] as &$value) {
$naam = pg_escape_string($value['name']);

//simple check
$result = pg_query($db_connection, "INSERT INTO halte
    VALUES (".$value['id'].",'".$naam."', ST_GeomFromText('POINT(".$value['longitude']." ".$value['latitude'].")'))");

}
echo('[OK] Addition succesful!<br>') ;
// $arr is now array(2, 4, 6, 8)
unset($value); // break the reference with the last element



 