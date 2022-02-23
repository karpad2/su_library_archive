<?php
include "config.php";

// Check connection

if(isset($_GET["mode"]))
{
    if($_GET["mode"]=="query")
    {
        $query="SELECT profiles, id, chapter_id,page FROM pdfs where pagetext like '%".mysqli_real_escape_string($conn, $_GET["query"])."%'";
        $result=mysqli_query($conn,$query);
        echo "[";


        while ($row = mysqli_fetch_assoc($result)) {
            echo "{";
            echo '"profiles":'.$row["profiles"];
            echo '"id":'.$row["id"];
            echo '"chapter_id":'.$row["chapter_id"];
            echo '"page":'.$row["page"];
            echo "},";
        }
        echo "]";
    }
}
else if(isset($_POST["mode"]))
{
    if($_POST["mode"=="set"])
    {
        if($_POST["pass"]==$password)
        {
        $query="insert into pdfs (profile,id,chapter_id,page,text) values ('".mysqli_real_escape_string($conn, $_POST["profile"])."','".mysqli_real_escape_string($conn, $_POST["id"])."','".mysqli_real_escape_string($conn, $_POST["chapter_id"])."','".mysqli_real_escape_string($conn, $_POST["page"])."','".mysqli_real_escape_string($conn, $_POST["profile"])."')";
        $result=mysqli_query($conn,$query);
        }
    }
    else 
    echo "{"status":\"parse error\"}";
}
else
echo "{"status":\"online\"}";
