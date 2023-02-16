<?php
function alphanumericize(string $str)
{
    return preg_replace("/[^a-zA-Z0-9]+/", "", $str);
}
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $post_status = "success";
    if (!isset($_POST['name']) || !isset($_POST['feedback'])) {
        $post_status = "One or more required parameters are unset";
    }
    $name = $_POST['name'];
    if (alphanumericize($_POST['name']) != $_POST['name']) {
        $post_status = "Name must be purely alphanumerical";
    }
    $blacklist = array('\n', '\\', '/', '.');
    $name = str_replace($blacklist, "", basename(alphanumericize(basename($_POST['name']))));
    if (strlen($name) > 0x20 || strlen($name) < 5) {
        $post_status = "Name is too small or large";
    }

    if (file_exists("Feedback/$name.txt")) {
        $post_status = "Someone with that name already left a comment";
    }

    $feedback = $_POST['feedback'];
    if (strlen($feedback) > 0x100) {
        $post_status = "Feedback is too large";
    }
    $email = "[not provided]";
    if (isset($_POST['email'])) {
        $email = $_POST['email'];
    }
    $info = [
        'email' => $email,
        'name' => $name,
        'feedback' => $feedback
    ];
    $data = json_encode($info);
    if ($post_status == "success") {
        file_put_contents('Feedback/' . $name . ".txt", "$data", LOCK_EX);
    }
    echo "<html><head><meta http-equiv=\"refresh\" content=\"0;URL=about.html?post_status=$post_status#article4\" /></head></html>";
    exit(0);
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Feedback</title>
    <style>
        html {
            font-size: larger;
        }

        h1 {
            text-align: center;
        }

        td,
        th,
        tr {
            border: 1px solid black
        }

        textarea {
            font-family: serif;
        }
    </style>

</head>

<body>
    <h1>User Feedback</h1>
    <hr>
    <center>
        <table>
            <?php
            echo "<th>Name</th>
            <th>E-mail</th>
            <th>Feedback</th>";
            $path = "./Feedback/";
            $files = opendir($path);
            while (($file = readdir($files)) !== false) {
                if ('.' === $file || '..' === $file) continue;
                $file_contents = json_decode(file_get_contents("$path$file"));
                echo "<tr>";
                echo "<td>" . htmlentities($file_contents->name) . "</td>";
                echo "<td>" . htmlentities($file_contents->email) . "</td>";
                echo "<td><textarea rows=\"5\" cols=\"30\" readonly>" . $file_contents->feedback . "</textarea></td>";
                echo "</tr>";
            }
            closedir($files);
            ?>
        </table>
    </center>
</body>

</html>