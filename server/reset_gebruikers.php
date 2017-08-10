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




//simple check
$result = pg_query($db_connection, "TRUNCATE gebruikers");

echo('{"Succes":True}');
