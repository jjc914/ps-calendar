function createSecret() {
  let xHttp = new XMLHttpRequest();
  let email = document.getElementById('emailInput').value;
  let params = 'email=' + encodeURIComponent(email);

  xHttp.onreadystatechange = function() {
    if (xHttp.readyState == 4) {
      if (xHttp.status == 200) {
        document.getElementById('confirmationText').innerHTML = 'Confirmation email sent!';
      }
      else if (xHttp.status == 500) {
        document.getElementById('confirmationText').innerHTML = 'Register failed. Please use your school account.';
      }
    }
  }
  xHttp.open('POST', config['SERVER_ROOT'] + 'php/api/index.php/student/requestemail', true);
  xHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xHttp.send(params);
}

document.getElementById("submitInput").addEventListener("click", () => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(document.getElementById('emailInput').value)) {
    createSecret();
  } else {
    document.getElementById('confirmationText').innerHTML = 'Invalid email.';
  }
}, false);
