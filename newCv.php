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
  <?php require "assets/autoloader.php" ?>
  <style type="text/css">
    /* Reset & Base */
    body {
      margin: 0;
      font-family: 'KoHo', sans-serif;
      background: #EDE7F6; /* Pale Lavender Grey */
      color: #2E2E3E; /* Dark Slate Grey */
    }

    /* Container and layout */
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
    }

    .logo {
      display: flex;
      align-items: center;
      color: white;
      padding-left: 22px;
    }

    .logo i {
      font-size: 77pt;
      color: #C1C4D6; /* lighter indigo */
    }

    .logoname {
      font-size: 22pt;
      color: white;
      padding-left: 11px;
      font-weight: 700;
    }

    /* Login user area */
    .login {
      margin: 11px;
      color: white;
      text-align: center;
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

    /* Main content */
    body > div[style].flex {
      margin-left: 18%;
      padding-top: 122px;
      gap: 33px;
    }

    /* The theme card containers */
    .well {
      background-color: rgba(75, 78, 109, 0.7); /* Semi-transparent Deep Indigo */
      border-radius: 10px;
      padding: 15px;
      opacity: 1 !important;
      color: white;
      box-shadow: 0 4px 15px rgba(62, 207, 142, 0.4); /* mint green glow */
      transition: box-shadow 0.3s ease;
      cursor: pointer;
    }

    .well:hover {
      box-shadow: 0 0 30px #3ECF8E;
    }

    .well h4.center {
      font-family: 'Acme', sans-serif;
      font-size: 1.4rem;
      margin-bottom: 15px;
      color: #FF6B6B; /* Soft Coral Pink */
      text-align: center;
      font-weight: 700;
    }

    .well img.img-responsive {
      width: 100%;
      border-radius: 8px;
    }

    /* Buttons */
    .btn-primary {
      font-family: 'KoHo', sans-serif;
      background-color: #3ECF8E; /* Vibrant Mint Green */
      border: none;
      font-weight: 700;
      font-size: 1rem;
      transition: background-color 0.3s ease;
    }

    .btn-primary:hover {
      background-color: #34b77a;
      border: none;
      color: white;
    }
  </style>
</head>
<body>

<div class="hub-top">
  <div class="logo flex pull-left">
    <div><i class="glyphicon glyphicon-cloud"></i></div>
    <div class="logoname treb"><span>Online Resume Builder</span></div>
  </div>

  <div class="login pull-right" style="margin-right: 44px">
    <div><img src="photo/user.png" class="img-responsive" style="width: 55px; margin:auto;"></div>
    <div class="treb name" style="text-align: center;"><?php echo userName(); ?><br>
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
    <a href="newCv.php"><li style="background:#739099"><i class="fa fa-edit fa-fw"></i> Build New CV</li></a>
    <a href="savedCv.php"><li><i class="fa fa-user-circle fa-fw"></i> Saved CV's</li></a>
    <a href="contactUs.php"><li><i class="fa fa-phone fa-fw"></i> Contact Us</li></a>
    <a href="setting.php"><li><i class="fa fa-gear fa-fw"></i> Account Setting</li></a>
    <a href="logout.php"><li><i class="fa fa-sign-out fa-fw"></i> Logout</li></a>
  </ul>
</div>

<div style="margin-left: 18%; padding-top: 122px" class="flex">
  <div class="well" style="width: 47%;" id="mydiv">
    <div class="well well-sm" style="background-color: rgba(0, 0, 0, 0.4); font-family: 'Acme', sans-serif; opacity: inherit; color: white;">
      <h4 class="center">Theme1</h4>
    </div>
    <img src="photo/theme1.png" class="img-responsive" alt="Theme 1"><br><br>
    <a href="theme1.php">
      <button class="btn btn-primary btn-block" style="font-family: 'KoHo', sans-serif;">Get Start</button>
    </a>
  </div>

  <div class="well" id="mydiv" style="width: 47%; margin-left: 33px; background-color: rgba(0, 0, 0, 0.4); opacity: inherit;">
    <div class="well well-sm" style="background-color: rgba(0, 0, 0, 0.4); font-family: 'Acme', sans-serif; opacity: inherit; color: white;">
      <h4 class="center">Theme2</h4>
    </div>
    <img src="photo/theme2.png" class="img-responsive" style="height: 666px" alt="Theme 2"><br><br>
    <a href="theme2.php">
      <button class="btn btn-primary btn-block" style="font-family: 'KoHo', sans-serif;">Get Start</button>
    </a>
  </div>
</div>

</body>
</html>
