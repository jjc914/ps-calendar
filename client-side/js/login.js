function checkSecret() {
  // let urlData = window.location.search;
  //
  // let xHttp = new XMLHttpRequest();
  // let url = 'http://localhost:8888/server-side/php/api/index.php/student/login';
  // let email = document.getElementById('emailInput').value;
  // xHttp.open('POST', url, true);
  // xHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  //
  // xHttp.onreadystatechange = function() {
  //   if (xHttp.readyState == 4) {
  //     changePage(xHttp);
  //   }
  // }
  // xHttp.send(urlData.substring(1));
  changePage({ status: 200 });
}

function changePage(resultHttp) {
  if (resultHttp.status == 200) {
    // window.onbeforeunload = logout;
    let xHttp = new XMLHttpRequest();

    xHttp.onreadystatechange = function (e) {
      if (xHttp.readyState == 4 && xHttp.status == 200) {
        setInnerHTML(document.getElementById('content'), xHttp.responseText);
      }
    }

    xHttp.open("GET", "http://localhost:8888/client-side/html/dashboard.html", true);
    xHttp.setRequestHeader('Content-type', 'text/html');
    xHttp.send();
  }
  else if (resultHttp.status == 500) {
    document.getElementById('emailInput').innerHTML = 'Failed login. Perhaps you\'re already logged in on another device? Try logging in again with a new link.';
  }
}

function logout() {
  let urlData = window.location.search;

  let xHttp = new XMLHttpRequest();
  let url = 'http://localhost:8888/server-side/php/api/index.php/student/logout';
  xHttp.open('POST', url, true);
  xHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xHttp.onreadystatechange = function() {
    if (xHttp.status == 200 && xHttp.readyState == 4) {
    }
  }
  xHttp.send(urlData.substring(1));
  return '';
}

function setInnerHTML(elm, html) {
  elm.innerHTML = html;
  Array.from(elm.querySelectorAll("script")).forEach( oldScript => {
    const newScript = document.createElement("script");
    Array.from(oldScript.attributes)
      .forEach( attr => newScript.setAttribute(attr.name, attr.value) );
    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}

// function decodeQuery(query) {
//   query = query.substring(1);
//   let dict = {};
//   let params = query.split('&');
//   for (let i = 0; i < params.length; i++) {
//     let pair = params[i].split('=');
//     dict[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
//   }
//   return dict;
// }

window.onload = checkSecret;
