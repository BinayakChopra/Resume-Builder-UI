<?php
$some = $_REQUEST['data'];

$some2 = "<head><style>
  .cover {
    padding: 11px;
  }
  .cvBody {
    border: 1px solid #4B4E6D; /* Deep Indigo Blue border */
    min-height: 100%;
    max-height: 100%;
    background: #EDE7F6; /* Pale Lavender Grey background */
    color: #2E2E3E; /* Dark Slate Grey text */
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  .cv-head {
    background: #4B4E6D; /* Deep Indigo Blue */
    width: 30%;
    padding: 10px;
    float: left;
    color: white;
    border-radius: 8px 0 0 8px;
  }
  .photo {
    background: #3ECF8E; /* Vibrant Mint Green */
    height: 222px;
    border-radius: 50%;
    margin-bottom: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  .photo img {
    max-height: 100%;
    border-radius: 50%;
  }
  .cv-content {
    background: #FAF2EF; /* Very soft off-white */
    padding: 15px;
    float: right;
    width: 65%;
    border-radius: 0 8px 8px 0;
    color: #2E2E3E; /* Dark Slate Grey */
  }
  .center {
    text-align: center;
  }
  #cvname {
    font-size: 16pt;
    font-weight: 700;
    color: #4B4E6D; /* Deep Indigo Blue */
    margin-bottom: 5px;
  }
  .circle {
    border-radius: 50%;
  }
  .flex {
    display: inline-flex;
  }
  .about-tab {
    background: #4B4E6D; /* Deep Indigo Blue */
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 15px;
  }
  .about-head {
    color: #FF6B6B; /* Soft Coral Pink */
    font-size: 12pt;
    font-variant: small-caps;
    margin: 5px 2px;
    font-weight: 600;
  }
  .about-details {
    color: white;
    padding: 5px 10px;
    font-family: Calibri, sans-serif;
    font-size: 9pt;
    list-style-type: none;
    margin: 0;
  }
  .about-details li {
    margin: 6px 0;
  }
  .body-item {}
  .body-head {
    font-size: 14pt;
    font-family: 'Algerian', serif;
    font-weight: bold;
    color: #3ECF8E; /* Vibrant Mint Green */
    margin-bottom: 8px;
  }
  .body-details {
    padding-left: 22px;
    font-size: 10pt;
    color: #2E2E3E;
  }
  .detail-item,
  .info-item {
    margin-top: 6px;
  }
  .detail-item-head {
    font-size: 9pt;
    font-family: Calibri, sans-serif;
    font-weight: bold;
    color: #4B4E6D; /* Deep Indigo Blue */
  }
  .detail-item-body {
    font-size: 9pt;
    color: #2E2E3E;
  }
  .info-item-head {
    width: 150px;
    font-size: 11pt;
    float: left;
    font-weight: 600;
    color: #FF6B6B; /* Soft Coral Pink */
  }
  .info-item-body {
    width: 220px;
    font-size: 11pt;
    float: right;
    color: #2E2E3E;
  }
  .detail-item-text {
    font-size: 11pt;
  }
</style></head>";

// Example personal details to include on CV header (replace as needed)
$personalInfo = '
<div class="cv-head center">
  <div class="photo">
    <img src="photo/user.png" alt="Profile Photo" />
  </div>
  <h1 id="cvname">Binayak Chopra</h1>
  <ul class="about-details">
    <li>Email: binayakchopra34@gmail.com</li>
    <li>Mobile: 9409838000</li>
    <li>Location: India</li>
  </ul>
</div>
';

$some3 = $some2 . $personalInfo . '<div class="cv-content">' . $some . '</div>';

include('converter/mpdf.php');
// $mpdf = new mPDF();
$mpdf->WriteHTML($some3);
echo $mpdf->Output('Resume_BinayakChopra.pdf', 'D');
?>
