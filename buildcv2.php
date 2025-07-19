


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
    box-sizing: border-box;
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
    background: #FAF2EF; /* Soft off-white */
    padding: 15px;
    float: right;
    width: 65%;
    border-radius: 0 8px 8px 0;
    color: #2E2E3E;
    box-sizing: border-box;
  }
  .center {
    text-align: center;
  }
  #cvname {
    font-size: 16pt;
    font-weight: 700;
    color: #4B4E6D; /* Deep Indigo Blue */
    margin-bottom: 5px;
    text-align: center;
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
    color: white;
  }
  .about-head {
    color: #FF6B6B; /* Soft Coral Pink */
    font-size: 16pt;
    text-align: center;
    padding: 11px;
    font-family: 'Arial Rounded MT', Arial, sans-serif;
    font-variant: small-caps;
    margin: 5px 0;
    background: #3ECF8E; /* Vibrant Mint Green */
    border-radius: 8px;
    position: relative;
    z-index: 1;
    width: 220px;
    margin-left: auto;
    margin-right: auto;
  }
  .about-details {
    font-family: 'Calibri Light', Calibri, sans-serif;
    font-size: 9pt;
    padding: 4px 0;
    list-style-type: none;
    margin: 0;
    color: white;
    text-align: center;
  }
  .about-details li {
    margin: 5px 0;
  }
  .body-item {}
  .body-head {
    font-size: 17pt;
    text-align: center;
    color: #4B4E6D; /* Deep Indigo Blue */
    font-family: 'Arial Rounded MT', Arial, sans-serif;
    font-variant: small-caps;
    margin-bottom: 10px;
  }
  .body-details {
    padding-left: 22px;
    color: #2E2E3E;
  }
  .detail-item,
  .info-item {
    margin-top: 6px;
    text-align: center;
    color: #CB9A5A; /* Golden Accent */
  }
  .detail-item-head {
    font-size: 9pt;
    font-family: 'Calibri Light', Calibri, sans-serif;
    font-weight: bold;
    color: #4B4E6D; /* Deep Indigo Blue */
  }
  .detail-item-body {
    font-size: 9pt;
    color: #2E2E3E;
  }
  .info-item-head {
    width: 144px;
    font-size: 10pt;
    float: left;
    font-weight: 600;
    color: #FF6B6B; /* Soft Coral Pink */
  }
  .info-item-body {
    width: 200px;
    font-size: 10pt;
    float: right;
    color: #2E2E3E;
  }
  .detail-item-text {
    font-size: 10pt;
  }
</style></head>";

// Compose final HTML with your data inside .cv-content container
$some3 = $some2 . '<div class="cvBody">' . $some . '</div>';

include('converter/mpdf.php');

// Initialize mpdf if not already done
// $mpdf = new \Mpdf\Mpdf(); // Uncomment if needed depending on your mpdf version

$mpdf->SetDisplayMode('fullpage');
$mpdf->list_indent_first_level = 0;
$mpdf->WriteHTML($some3);

echo $mpdf->Output('Resume_BinayakChopra.pdf', 'D');
?>
