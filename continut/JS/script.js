
function sectiune1() {
    var result = new Date();

    // afișează data curentă
    let = document.getElementById("ora").innerHTML = "Data: " + result;
    // afișează URL-ul curent
    document.getElementById("url").innerHTML = "URL: " + window.location.href;
    // afișează informații despre browser
    document.getElementById("browser").innerHTML = "Browser: " + navigator.appCodeName + "<br/>Versiune: " + navigator.appVersion;
    document.getElementById("os").innerHTML = "SO: " + navigator.platform;
}
//Desenare canvas
var x1 = -1, y1 = -1;
function sectiune2(e) {

    let x = e.offsetX;
    let y = e.offsetY;
    if (x1 == -1) {
        x1 = x;
        y1 = y;
    }
    else {
        var c = document.getElementById("canvas");
        var ctx = c.getContext("2d");
        var color = document.getElementById("color1").value;
        ctx.fillStyle = color;
        x1 = Math.min(x1, x);
        y1 = Math.min(y1, y);
        ctx.fillRect(x1, y1, Math.abs(x - x1), Math.abs(y - y1));
        x1 = -1;
        y1 = -1;
    }

}

function insertRow() {
    var table = document.getElementById("myTable");
    var rowPos = document.getElementById("insertRowPosition").value;
    var color = document.getElementById("rowColor").value;
    var row = table.insertRow(rowPos);
    for (var i = 0; i < table.rows[0].cells.length; i++) {
        var cell = row.insertCell(i);
        cell.style.backgroundColor = color;
    }
}


function sectiunea1L() {
    var position = navigator.geolocation.getCurrentPosition(showPosition);
}

function showPosition(position) {

    document.getElementById("locatie").innerHTML = "Locație curentă: <br>" + "Latitudine: " + position.coords.latitude +
        "<br>Longitudine: " + position.coords.longitude;
}

function schimbaContinut(resursa, jsFisier, jsFunctie) {

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("continut").innerHTML = this.responseText;
            
            if (jsFisier) {
                var elementScript = document.createElement('script');
                elementScript.onload = function () {
                    console.log("hello");
                    if (jsFunctie) {
                        window[jsFunctie]();
                    }
                };
                elementScript.src = jsFisier;
                document.head.appendChild(elementScript);
            } else {
                if (jsFunctie) {
                    window[jsFunctie]();
                }
            }
        }

    };
    xhttp.open("GET", resursa + ".html", true);
    xhttp.send();
}

function validare() {

  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      
      var users = JSON.parse(this.responseText);
      var found = false;

      for (var i = 0; i < users.length; i++) {
        if (users[i].numeUser == username && users[i].parola == password) {
          found = true;
          break;
        }
      }
      if (found) {
        document.getElementById("rezultat").innerHTML = "Login successful!";
      } else {
        document.getElementById("rezultat").innerHTML = "Invalid username or password.";
      }
    }
  };
  xhttp.open("GET", "./resurse/utilizatori.json", true);
  xhttp.send();
}

function inregistreazaUtilizator(event) {
   event.preventDefault(); // oprește comportamentul implicit al formularului
  
  // construiește corpul mesajului din valorile câmpurilor formularului
  const data = {
    numeUser: document.getElementById("numeUser").value,
    parola: document.getElementById("parola").value,
    nume: document.getElementById("nume").value,
    prenume: document.getElementById("prenume").value,
    email: document.getElementById("email").value,
    telefon: document.getElementById("telefon").value,
    sex: document.getElementById("sex").value,
    supliment: document.getElementById("supliments").value,
    culoare: document.getElementById("culoare").value,
    data: document.getElementById("data").value,
    varsta: document.getElementById("varsta").value,
    addr: document.getElementById("addr").value,
    descriere: document.getElementById("descriere").value
  };
  
  // trimite cererea către server
  fetch('/api/utilizatori', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (response.ok) {
      console.log('Cererea a fost procesată cu succes.');
      //location.reload(); // reîncarcă pagina pentru a afișa utilizatorii actualizați
    } else {
      console.log('Cererea a eșuat.');
    }
  })
  .catch(error => console.error(error));

}

function insertColumn()
{
    var tab = document.getElementById("myTable");
    var poz=document.getElementById("insertColumnPosition").value;
    var col=document.getElementById("columnColor").value;
    for(var i=0;i<tab.rows.length;i++)
    {
        var coloana=tab.rows[i].insertCell(poz);
        coloana.style.backgroundColor=col;
    }
}