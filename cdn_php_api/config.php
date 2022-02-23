<?php
$servername = "88.99.252.254";
$username = "subiblio_su_library_archive";
$password = "4wgfnJzHukhMM4Pq";
$dbname = "subiblio_su-library-archive";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

