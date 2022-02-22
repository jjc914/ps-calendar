var config = {};

let req = new XMLHttpRequest();
req.open('GET', '../.config', false);
req.send();
if (req.status == 200) {
  load(req.response);
} else {
  alert('.config not found.');
}

function load(text) {
  lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].replace(/^\s+|\s+$/g, '');
    if (line == '') continue;
    if (line.charAt(0) == '#') continue;
    let data = line.split('=');
    config[data[0].replace(/^\s+|\s+$/g, '')] = data[1].replace(/^\s+|\s+$/g, '');
  }
}
