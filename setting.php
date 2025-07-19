<?php
session_start();
if (!isset($_SESSION['userId'])) {
  header('location:login.php');
}
?>
<!DOCTYPE html>
<html>
<head>
  <title>Account Settings - Resume Builder</title>
  <?php require 'assets/function.php'; ?>
  <?php require 'assets/autoloader.php'; ?>
  <style>
    body {
      background-color: #EDE7F6;
      font-family: 'KoHo', sans-serif;
      color: #2E2E3E;
    }

    .hub-top {
      position: fixed;
      top: 0;
      z-index: 20;
      width: 100%;
      height: 111px;
      background: #4B4E6D;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
    }

    .logo span {
      color: white;
      font-size: 24pt;
    }

    .dashboard {
      background: #4B4E6D;
      position: fixed;
      height: 100%;
      width: 17%;
      padding-top: 120px;
    }

    .dashboard span {
      color: white;
      font-size: 20px;
      padding: 10px 20px;
      display: block;
    }

    .dashboard ul {
      list-style: none;
      padding: 0;
    }

    .dashboard ul li {
      color: white;
      padding: 12px 20px;
      font-size: 14pt;
      transition: 0.3s ease;
      background-color: transparent;
    }

    .dashboard ul li:hover {
      background-color: #FF6B6B;
      color: white;
      cursor: pointer;
    }

    .dashboard ul li i {
      float: right;
    }

    .panel {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .panel-heading h3 {
      color: #4B4E6D;
    }

    label {
      color: #4B4E6D;
      font-weight: bold;
    }

    input.form-control {
      margin-bottom: 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    .btn-primary {
      background-color: #3ECF8E;
      border: none;
    }

    .btn-primary:hover {
      background-color: #2ea973;
    }

    .panel-body {
      background: #EDE7F6;
    }

    .well {
      background: transparent;
      border: none;
    }
  </style>
</head>
<body>

<div class="hub-top">
  <div class="logo">
    <span>Resume Builder</span>
  </div>
  <div class="login">
    <img src="photo/user.png" style="width:50px;">
    <div>
      <span><?php echo userName(); ?></span><br>
      <a href="setting.php"><button class="btn btn-success btn-sm">Setting</button></a>
    </div>
  </div>
</div>

<div class="dashboard">
  <span>Dashboard</span>
  <ul>
    <a href="index.php"><li><i class="fa fa-home fa-fw"></i> Home</li></a>
    <a href="newCv.php"><li><i class="fa fa-edit fa-fw"></i> Build New CV</li></a>
    <a href="savedCv.php"><li><i class="fa fa-user-circle fa-fw"></i> Saved CVs</li></a>
    <a href="contactUs.php"><li><i class="fa fa-phone fa-fw"></i> Contact Us</li></a>
    <a href="setting.php"><li style="background: #3ECF8E;"><i class="fa fa-gear fa-fw"></i> Account Setting</li></a>
    <a href="logout.php"><li><i class="fa fa-sign-out fa-fw"></i> Logout</li></a>
  </ul>
</div>

<div class="well" style="margin-left: 18%; padding-top: 140px;">
  <div class="panel" style="width: 77%; margin:auto;">
    <div class="panel-heading text-center"><h3>Change Account Setting</h3></div>
    <div class="panel-body text-center">
      <form method="POST">
        <label>Name</label> 
        <input type="text" name="name" id="name-set" value="<?php echo userName(); ?>" class='form-control' style='width: 55%; margin:auto' required>

        <label>Username</label> 
        <input type="text" name="username" id="username-set" value="<?php echo user(); ?>" class='form-control' style='width: 55%; margin:auto' required>

        <label>Password</label>
        <input type="text" name="password" id="pass-set" value="<?php echo pass(); ?>" class='form-control' style='width: 55%; margin:auto' required>  

        <button id="update" class="btn btn-primary btn-block" style="width: 55%; margin:auto; margin-top:12px;" type="submit" name="update">Update</button>
      </form>
    </div>
  </div>
</div>

<script>
  $(document).ready(function() {
    $("#update").click(function() {
      var name = $("#name-set").val();
      var uname = $("#username-set").val();
      var pass = $("#pass-set").val();
      if(name != "" && uname != "" && pass != "") {
        $.ajax({
          type: "POST",
          url: "updateprof.php",
          data: { names: name, unames: uname, passs: pass },
          success: function(response) {
            alert(response);
          }
        });
      }
    });
  });
</script>

</body>
</html>
