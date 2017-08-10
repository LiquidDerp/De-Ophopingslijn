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

$lat =  $_GET['lat'];
$lon = $_GET['lon'];
$rad = $_GET['rad'];


$db_connection = pg_connect("host='".DB_HOST."' port='".DB_PORT."' dbname='ophopingslijn' user='".DB_USER."' password='".DB_PASS."'");
if($db_connection) {
  echo "";
    } else {
        echo 'error';
    } 

function getDrukte($hlatitude, $hlongitude){
  $date = date('Y-m-d H:i:s', time());
$date = $date . '+00';
$db_connection = pg_connect("host='".DB_HOST."' port='".DB_PORT."' dbname='ophopingslijn' user='".DB_USER."' password='".DB_PASS."'");
$result=pg_query($db_connection, "SELECT COUNT(*) FROM (SELECT distinct on (id) id, locatie, tijd FROM gebruikers WHERE abs(EXTRACT(EPOCH FROM (tijd - '".$date."'::timestamptz)))<600 AND ST_distance( ST_transform(ST_SetSRID(locatie, 4326), 31300), ST_transform( ST_GeometryFromText('POINT(".$hlongitude." ".$hlatitude.")', 4326), 31300))<2.5 group by tijd, id, locatie order by id, tijd desc) as total");
$data=pg_fetch_assoc($result);
return $data['count'];
}

$result = pg_query($db_connection, "SELECT id, naam, ST_AsText(locatie) FROM halte WHERE ST_distance( ST_transform(ST_SetSRID(locatie, 4326), 31300), ST_transform( ST_GeometryFromText('POINT(".$lon." ".$lat.")', 4326), 31300))<".$rad."ORDER BY ST_distance( ST_transform(ST_SetSRID(locatie, 4326), 31300), ST_transform( ST_GeometryFromText('POINT(".$lon." ".$lat.")', 4326), 31300))"); 

$rows = array();
while($r = pg_fetch_assoc($result)) {
    $rows[] = $r;
}
$data = array_values(pg_fetch_all($result));
echo '{"Stations":[';
$len = count($data);
$i = 0;
 foreach($data as $item):
  if ($i == $len - 1) {
      echo '{"id":"'.$item['id'].'",';
      echo '"name":"'.$item['naam'].'",';
      $coords = substr ($item['st_astext'],6,-1);
      $latlonlist = explode(" ", $coords);
      echo '"drukte":"'.getDrukte($latlonlist[1],$latlonlist[0]).'",';
      echo '"latitude":"'.$latlonlist[1].'",';
      echo '"longitude":"'.$latlonlist[0].'"}';
    }
    else {
            echo '{"id":"'.$item['id'].'",';
      echo '"name":"'.$item['naam'].'",';
      $coords = substr ($item['st_astext'],6,-1);
      $latlonlist = explode(" ", $coords);
      echo '"drukte":"'.getDrukte($latlonlist[1],$latlonlist[0]).'",';
      echo '"latitude":"'.$latlonlist[1].'",';
      echo '"longitude":"'.$latlonlist[0].'"},';
    }
    $i++;
      
 endforeach;
 echo "]}";




 