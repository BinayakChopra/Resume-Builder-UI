<!DOCTYPE html>
<html>
<head>
  <title>Resume Builder | Binayak Chopra</title>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    /* Background & base text */
    body {
      margin: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #EDE7F6; /* Pale Lavender Grey */
      color: #2E2E3E; /* Dark Slate Grey */
    }

    /* Top header bar */
    .hub-top {
      position: fixed;
      top: 0;
      width: 100%;
      height: 100px;
      background-color: #4B4E6D; /* Deep Indigo Blue */
      color: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 40px;
      z-index: 10;
      box-shadow: 0 4px 12px rgba(75, 78, 109, 0.3);
    }

    .logo i {
      font-size: 48px;
      margin-right: 15px;
      color: #C1C4D6; /* lighter indigo */
    }

    .logoname {
      font-size: 22px;
      font-weight: bold;
      color: white;
    }

    /* User login section */
    .login img {
      width: 50px;
      border-radius: 50%;
      border: 2px solid #3ECF8E; /* Vibrant Mint Green */
      box-shadow: 0 0 10px #3ECF8E;
    }

    .login {
      text-align: right;
      color: white;
      font-weight: 600;
    }

    .login small {
      display: block;
      margin-top: 6px;
      font-size: 14px;
      color: #FF6B6B; /* Soft Coral Pink */
    }

    .login button {
      background-color: #3ECF8E; /* Vibrant Mint Green */
      border: none;
      color: white;
      padding: 6px 12px;
      font-size: 12px;
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
      position: fixed;
      top: 100px;
      left: 0;
      width: 200px;
      height: 100%;
      background: #4B4E6D; /* Deep Indigo Blue */
      color: white;
      padding: 20px 10px;
      box-shadow: 2px 0 10px rgba(75,78,109,0.5);
    }

    .dashboard ul {
      list-style: none;
      padding: 0;
    }

    .dashboard ul li {
      padding: 12px 16px;
      margin-bottom: 10px;
      background-color: #60738c; /* softer indigo */
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.3s;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .dashboard ul li:hover {
      background-color: #3ECF8E; /* Vibrant Mint Green */
      color: #2E2E3E; /* Dark Slate Grey */
      font-weight: 700;
    }

    .dashboard ul li i {
      font-size: 16px;
    }

    .dashboard ul a {
      color: inherit;
      text-decoration: none;
      display: block;
    }
    .dashboard ul a:hover {
      text-decoration: none;
    }

    /* Main content area */
    .main {
      margin-left: 220px;
      padding: 140px 40px 40px;
      max-width: 900px;
    }

    /* Panels */
    .panel {
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(75, 78, 109, 0.1);
      border: none;
      background-color: white;
      color: #2E2E3E;
    }

    .panel-heading {
      background-color: #EDE7F6 !important; /* Pale Lavender Grey */
      border-color: #EDE7F6 !important;
      padding: 20px 30px;
      border-radius: 10px 10px 0 0;
    }

    .panel-title a {
      text-decoration: none;
      color: #4B4E6D; /* Deep Indigo Blue */
      font-weight: 700;
      font-size: 1.3rem;
    }

    .panel-title a:hover {
      color: #3ECF8E; /* Vibrant Mint Green */
    }

    .panel-body {
      padding: 25px 30px;
      font-size: 1.1rem;
      color: #2E2E3E;
    }

    .panel-body p strong {
      color: #4B4E6D; /* Deep Indigo Blue */
    }

    /* Accordion styling */
    .panel-group .panel-heading {
      padding: 15px 30px;
      background-color: #f4f6fb;
      border-bottom: 1px solid #dcdde1;
      cursor: pointer;
      color: #4B4E6D;
      font-weight: 600;
      font-size: 1.1rem;
      border-radius: 0;
    }

    .panel-group .panel-heading:hover {
      background-color: #3ECF8E; /* Vibrant Mint Green */
      color: #ffffff;
    }

    /* Panel collapse body */
    .panel-collapse .panel-body h4,
    .panel-collapse .panel-body h2 {
      color: #4B4E6D;
      margin: 0;
    }

    /* Footer */
    footer {
      text-align: center;
      color: white;
      background-color: #4B4E6D; /* Deep Indigo Blue */
      padding: 15px;
      position: fixed;
      bottom: 0;
      width: 100%;
      font-weight: 600;
      font-size: 0.9rem;
      box-shadow: 0 -2px 10px rgba(75, 78, 109, 0.4);
    }
  </style>
</head>
<body>
  <div class="hub-top">
    <div class="logo">
      <i class="fas fa-cloud"></i>
      <span class="logoname">Resume Builder</span>
    </div>
    <div class="login">
      <img src="photo/user.png" alt="User">
      <small>Binayak Chopra</small><br>
      <a href="setting.php"><button class="btn btn-sm btn-light">Settings</button></a>
    </div>
  </div>

  <div class="dashboard">
    <ul>
      <a href="index.php"><li><i class="fa fa-home"></i> Home</li></a>
      <a href="newCv.php"><li><i class="fa fa-edit"></i> Build New CV</li></a>
      <a href="savedCv.php"><li><i class="fa fa-folder"></i> Saved CVs</li></a>
      <a href="contactUs.php"><li><i class="fa fa-phone"></i> Contact Us</li></a>
      <a href="setting.php"><li><i class="fa fa-gear"></i> Account</li></a>
      <a href="logout.php"><li><i class="fa fa-sign-out"></i> Logout</li></a>
    </ul>
  </div>

  <div class="main">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">Welcome to Resume Builder</h4>
      </div>
      <div class="panel-body">
        <p><strong>Created by:</strong> Binayak Chopra</p>
        <p>This platform helps students, especially from Tier-2 and Tier-3 colleges, design clean and professional resumes without any design skills. You can build, customize, and download resumes easily from anywhere.</p>
      </div>
    </div>

    <br>

    <div class="panel-group" id="accordion">
      <div class="panel panel-default">
        <div class="panel-heading" data-toggle="collapse" data-parent="#accordion" href="#collapse1" aria-expanded="true" aria-controls="collapse1">
          <h4 class="panel-title">
            1. Select Theme
          </h4>
        </div>
        <div id="collapse1" class="panel-collapse collapse in">
          <div class="panel-body">
            <h4>Choose your preferred resume template, then customize layout and colors as needed.</h4>
          </div>
        </div>
      </div>

      <div class="panel panel-default">
        <div class="panel-heading collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapse2" aria-expanded="false" aria-controls="collapse2">
          <h4 class="panel-title">
            2. Enter Details
          </h4>
        </div>
        <div id="collapse2" class="panel-collapse collapse">
          <div class="panel-body">
            <h4>Fill in your personal, education, and experience information using our guided form.</h4>
          </div>
        </div>
      </div>

      <div class="panel panel-default">
        <div class="panel-heading collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapse3" aria-expanded="false" aria-controls="collapse3">
          <h4 class="panel-title">
            3. Download CV
          </h4>
        </div>
        <div id="collapse3" class="panel-collapse collapse">
          <div class="panel-body">
            <h2>Done!</h2>
            <h4>Download your resume instantly in PDF or shareable format.</h4>
          </div>
        </div>
      </div>
    </div>
  </div>

  <footer>
    &copy; 2025 Binayak Chopra | Resume Builder
  </footer>

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
</body>
</html>
