<?php
session_start();
if (!isset($_SESSION['userId'])) {
  header('location:login.php');
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Online Resume Builder</title>
  <?php require 'assets/function.php'; ?>
  <?php require 'assets/autoloader.php'; ?>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Quicksand', sans-serif;
    }

    body {
      background-color: #EDE7F6;
      color: #2E2E3E;
    }

    .hub-top {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100px;
      background: #4B4E6D;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 30px;
      z-index: 10;
      color: white;
    }

    .logo {
      display: flex;
      align-items: center;
      font-size: 28px;
      font-weight: bold;
    }

    .logo i {
      margin-right: 10px;
      font-size: 34px;
      color: #3ECF8E;
    }

    .login {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .login img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 2px solid #3ECF8E;
    }

    .login span {
      font-weight: bold;
      color: #FF6B6B;
    }

    .dashboard {
      position: fixed;
      top: 100px;
      left: 0;
      width: 230px;
      height: calc(100% - 100px);
      background: #4B4E6D;
      padding: 20px 0;
      color: white;
    }

    .dashboard ul {
      list-style: none;
      padding: 0;
    }

    .dashboard ul li {
      padding: 15px 30px;
      color: white;
      font-size: 16px;
      cursor: pointer;
      transition: 0.3s;
    }

    .dashboard ul li:hover,
    .dashboard ul li.active {
      background: #3ECF8E;
      color: #2E2E3E;
      font-weight: bold;
    }

    .dashboard ul li i {
      float: right;
    }

    .content {
      margin-left: 230px;
      padding: 130px 40px 40px;
    }

    .panel {
      background: #fff;
      border-radius: 16px;
      padding: 25px 30px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.05);
      margin-bottom: 30px;
    }

    .panel-heading {
      font-size: 22px;
      color: #4B4E6D;
      font-weight: bold;
      margin-bottom: 15px;
    }

    .panel-body {
      font-size: 16px;
      line-height: 1.7;
      color: #2E2E3E;
    }

    .btn {
      background: #3ECF8E;
      color: white;
      padding: 6px 14px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
      transition: 0.3s;
    }

    .btn:hover {
      background: #34b97c;
    }

    a {
      text-decoration: none;
    }

    @media (max-width: 768px) {
      .dashboard {
        width: 100%;
        position: relative;
        height: auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
      }

      .content {
        margin-left: 0;
        padding: 140px 20px;
      }

      .hub-top {
        flex-direction: column;
        height: auto;
        padding: 20px;
        text-align: center;
      }
    }
  </style>
</head>
<body>

<div class="hub-top">
  <div class="logo">
    <i class="glyphicon glyphicon-cloud"></i> Online Resume Builder
  </div>
  <div class="login">
    <img src="photo/user.png" alt="User">
    <div>
      <span><?php echo userName(); ?></span><br>
      <a href="setting.php"><button class="btn">Setting <i class="fa fa-gear fa-fw"></i></button></a>
    </div>
  </div>
</div>

<div class="dashboard">
  <ul>
    <a href="index.php"><li><i class="fa fa-home"></i> Home</li></a>
    <a href="newCv.php"><li><i class="fa fa-edit"></i> Build New CV</li></a>
    <a href="savedCv.php"><li><i class="fa fa-save"></i> Saved CV's</li></a>
    <a href="contactUs.php"><li class="active"><i class="fa fa-phone"></i> Contact Us</li></a>
    <a href="setting.php"><li><i class="fa fa-gear"></i> Account Setting</li></a>
    <a href="logout.php"><li><i class="fa fa-sign-out"></i> Logout</li></a>
  </ul>
</div>

<div class="content">
  <div class="panel">
    <div class="panel-heading">About Us</div>
    <div class="panel-body">
      We are the people who are very innovative in presence of mind. Our job is to make people adapt a hassle-free lifestyle by making them connect with technologies.
      <br><br>
      <strong>Easy way of handling chores.</strong>
    </div>
  </div>

  <div class="panel">
    <div class="panel-heading">Address and Phone Number</div>
    <div class="panel-body">
      <strong><i class="fa fa-phone"></i> 9409838000</strong><br><br>
      <strong><i class="fa fa-envelope"></i> binayakchopra34@gmail.com</strong>
    </div>
  </div>
</div>

</body>
</html>
