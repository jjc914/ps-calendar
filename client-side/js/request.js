function createSecret() {
  let xHttp = new XMLHttpRequest();
  let url = config['SERVER_ROOT'] + '/php/api/index.php/student';
  let email = document.getElementById('emailInput').value;
  let params = 'email=' + email;
  xHttp.open('POST', url, true);
  xHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  xHttp.onreadystatechange = function() {
    if (xHttp.readyState == 4) {
      if (xHttp.status == 200) {
        document.getElementById('confirmationText').innerHTML = 'Confirmation email sent!';
        alert(xHttp.responseText);
      }
      else if (xHttp.status == 500) {
        document.getElementById('confirmationText').innerHTML = 'Register failed.';
      }
    }
  }
  xHttp.send(params);
}

document.getElementById("submitInput").addEventListener("click", () => { createSecret(); }, false);
