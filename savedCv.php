<?php
session_start();
// $_SESSION['userId'] = '1';
if(!isset($_SESSION['userId']))
{
  header('location:login.php');
}
?>

<!DOCTYPE html>
<html>
<head>
  <title>Online Resume Builder</title>
  <?php require 'assets/function.php'; ?>
  <?php require "assets/autoloader.php"; ?>
  <style type="text/css">
    /* Base and body */
    body {
      margin: 0;
      font-family: 'KoHo', sans-serif;
      background: #EDE7F6; /* Pale Lavender Grey */
      color: #2E2E3E; /* Dark Slate Grey */
    }

    /* Flex helper */
    .flex {
      display: flex;
    }

    /* Top header */
    .hub-top {
      position: fixed;
      top: 0;
      z-index: 20;
      width: 100%;
      background-color: #4B4E6D; /* Deep Indigo Blue */
      height: 111px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 22px;
      box-shadow: 0 4px 12px rgba(75, 78, 109, 0.3);
      color: white;
    }

    .logo {
      display: flex;
      align-items: center;
    }

    .logo i {
      font-size: 77pt;
      color: #C1C4D6; /* lighter indigo */
    }

    .logoname {
      font-size: 22pt;
      font-weight: 700;
      color: white;
      padding-left: 11px;
    }

    /* Login user area */
    .login {
      margin: 11px;
      text-align: center;
      color: white;
      font-weight: 600;
    }

    .login img {
      width: 55px;
      border-radius: 50%;
      border: 2px solid #3ECF8E; /* Vibrant Mint Green */
      box-shadow: 0 0 10px #3ECF8E;
      margin: 0 auto;
      display: block;
    }

    .login button {
      background-color: #3ECF8E; /* Vibrant Mint Green */
      border: none;
      color: white;
      padding: 3px 12px;
      font-size: 8pt;
      border-radius: 5px;
      margin-top: 6px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .login button:hover {
      background-color: #34b77a; /* Darker Mint Green */
    }

    /* Sidebar dashboard */
    .dashboard {
      background-color: #4B4E6D; /* Deep Indigo Blue */
      opacity: 0.95;
      position: fixed;
      height: 100%;
      width: 17%;
      padding-top: 111px;
      box-shadow: 2px 0 10px rgba(75, 78, 109, 0.5);
      color: white;
    }

    .dashboard .dbname {
      font-size: 20px;
      letter-spacing: 1px;
      padding: 11px 22px;
      display: block;
      font-weight: 700;
    }

    .dashboard ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .dashboard ul li {
      font-size: 14pt;
      padding: 10px 22px;
      margin-top: 3px;
      background-color: #60738c; /* softer indigo */
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 1px 1px 2px black;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      transition: background-color 0.3s, color 0.3s;
    }

    .dashboard ul li:hover {
      background-color: #3ECF8E; /* Vibrant Mint Green */
      color: #2E2E3E; /* Dark Slate Grey */
      box-shadow: 1px 1px 5px #3ECF8E;
      font-weight: 700;
    }

    .dashboard ul li i {
      font-size: 16px;
      padding-top: 5px;
    }

    .dashboard ul a {
      color: inherit;
      text-decoration: none;
      display: block;
    }

    .dashboard ul a:hover {
      text-decoration: none;
    }

    /* Highlight current page */
    .dashboard ul li[style] {
      background-color: #739099; /* Slightly muted Indigo */
    }

    /* Main content wrapper */
    .well {
      margin-left: 18%;
      padding-top: 122px;
      background-color: rgba(0, 0, 0, 0.4);
      opacity: inherit;
      border: none;
      font-family: 'Itim', cursive;
      color: white;
      max-width: 900px;
    }

    /* Table styles */
    table.table {
      width: 100%;
      border-collapse: collapse;
      color: white;
      font-size: 16px;
    }

    table.table thead tr th {
      background-color: #4B4E6D; /* Deep Indigo Blue */
      padding: 15px;
      font-weight: 700;
      text-align: center;
      border: 1px solid #3ECF8E;
    }

    table.table tbody tr td {
      background-color: #60738c; /* softer indigo */
      padding: 12px;
      text-align: center;
      border: 1px solid #3ECF8E;
    }

    table.table tbody tr:nth-child(even) td {
      background-color: #739099; /* Slightly muted Indigo */
    }

    table.table tbody tr:hover td {
      background-color: #3ECF8E; /* Vibrant Mint Green */
      color: #2E2E3E;
      font-weight: 700;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
  </style>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.js"></script>
  <script>
    $(document).ready(function(){
      $(document).on("click", "#download-button", function(e){
        e.preventDefault();
        var file = $(this).data("file");
        var name = $(this).data("name");
        alert(file);

        $.ajax({
          type: "POST",
          url: "download.php",
          data: {pdf_file: file},
          success: function (response) {
            var opt = {
              margin: 1,
              filename: `${name}.pdf`,
              image: { type: 'jpeg', quality: 0.98 },
              html2canvas: { scale: 2 },
              jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
            };
            html2pdf().from(response).set(opt).save();
          }
        });
      });

      $(document).on("click", "#edit-resume", function(){
        var fileedit = $(this).data("file");
        var theme = $(this).data("theme");
        // Your editing logic here
      });
    });
  </script>
</head>
<body>

<div class="background-image"></div>

<div class="hub-top">
  <div class="logo flex pull-left">
    <div><i class="glyphicon glyphicon-cloud"></i></div>
    <div class="logoname treb"><span>Online Resume Builder</span></div>
  </div>

  <div class="login pull-right" style="margin-right: 44px;">
    <div><img src="photo/user.png" class="img-responsive" style="width: 55px; margin:auto;"></div>
    <div class="treb name" style="text-align: center;">
      <span><?php echo userName(); ?></span><br>
      <a href="setting.php">
        <button class="btn btn-success btn-sm" style="padding: 1px 11px; font-size: 8pt;">
          Setting <i class="fa fa-gear fa-fw"></i>
        </button>
      </a>
    </div>
  </div>
</div>

<div class="dashboard treb" style="background-color:transparent; opacity: inherit;">
  <span class="dbname">Dashboard</span>
  <ul>
    <a href="index.php"><li><i class="fa fa-home fa-fw"></i> Home</li></a>
    <a href="newCv.php"><li><i class="fa fa-edit fa-fw"></i> Build New CV</li></a>
    <a href="savedCv.php"><li style="background:#739099"><i class="fa fa-user-circle fa-fw"></i> Saved CV's</li></a>
    <a href="contactUs.php"><li><i class="fa fa-phone fa-fw"></i> Contact Us</li></a>
    <a href="setting.php"><li><i class="fa fa-gear fa-fw"></i> Account Setting</li></a>
    <a href="logout.php"><li><i class="fa fa-sign-out fa-fw"></i> Logout</li></a>
  </ul>
</div>

<div class="well well-sm">
  <table class="table table-bordered table-hover">
    <thead>
      <tr>
        <th colspan="3"><h3>Your Saved CV's</h3></th>
      </tr>
      <tr>
        <th>CV Name</th>
        <th style="width: 222px;">Saved Date</th>
        <th style="width: 322px;">Action</th>
      </tr>
    </thead>
    <tbody>
      <?php savedCV(); ?>
    </tbody>
  </table>
</div>

</body>
</html>
