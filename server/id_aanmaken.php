<?php
ob_implicit_flush(true);
header('Content-Type: application/json');
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




function isUnique($id){
$db_connection = pg_connect("host='".DB_HOST."' port='".DB_PORT."' dbname='ophopingslijn' user='".DB_USER."' password='".DB_PASS."'");


$result=pg_query($db_connection, "SELECT COUNT(*) FROM (SELECT distinct on (id) id, locatie, tijd FROM gebruikers WHERE id = ".$id." group by tijd, id, locatie order by id, tijd desc) as total");
$data=pg_fetch_assoc($result);
if ($data['count'] != 0){
	return False;
}

else{
	return True;
}

}

function generateID() {
    $ip = ip2long($_SERVER['REMOTE_ADDR']) + 1;
	$id = $ip;
    return $id;
}

$identificator = generateID();
while (isUnique($identificator) == False){
	$identificator = generateID();
}
	echo('{"id":'.$identificator.'}');



 