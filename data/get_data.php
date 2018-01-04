<?php
  $url = "http://example.com/results.csv";
  $user = 'my_user';
  $pw = 'my_password';

  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_USERPWD, $user . ":" . $pw);
  curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
   
  echo curl_exec($ch);
  curl_close($ch);
?>