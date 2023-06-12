function incarcaPersoane() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var xmlDoc = this.responseXML;
      var tabel = "<table><tr><th>Nume</th><th>Prenume</th><th>Vârsta</th><th>Adresă</th><th>Job</th><th>Studii</th><th>Stare civilă</th></tr>";
      var persoane = xmlDoc.getElementsByTagName("persoana");
      for (var i = 0; i < persoane.length; i++) {
        var nume = persoane[i].getElementsByTagName("nume")[0].childNodes[0].nodeValue;
        var prenume = persoane[i].getElementsByTagName("prenume")[0].childNodes[0].nodeValue;
        var varsta = persoane[i].getElementsByTagName("varsta")[0].childNodes[0].nodeValue;
        var tara = persoane[i].getElementsByTagName("tara")[0].childNodes[0].nodeValue;
        var judet = persoane[i].getElementsByTagName("judet")[0].childNodes[0].nodeValue;
        var localitate = persoane[i].getElementsByTagName("localitate")[0].childNodes[0].nodeValue;
        var strada = persoane[i].getElementsByTagName("strada")[0].childNodes[0].nodeValue;
        var numar = persoane[i].getElementsByTagName("numar")[0].childNodes[0].nodeValue;
        var adresa = tara + ", " + judet + ", " + localitate + ", " + strada + ", " + numar;
        var job = persoane[i].getElementsByTagName("job")[0].childNodes[0].nodeValue;
        var universitate = persoane[i].getElementsByTagName("universitate")[0].childNodes[0].nodeValue;
        var liceu = persoane[i].getElementsByTagName("liceu")[0].childNodes[0].nodeValue;
        var studii = universitate + ", " + liceu;
        var stareCivila = persoane[i].getElementsByTagName("stareCivila")[0].childNodes[0].nodeValue;
        tabel += "<tr><td>" + nume + "</td><td>" + prenume + "</td><td>" + varsta + "</td><td>" + adresa + "</td><td>" + job + "</td><td>" + studii + "</td><td>" + stareCivila + "</td></tr>";
      }
      tabel += "</table>";
      document.getElementById("loading").style.display = "none";
      document.getElementById("tabel-container").innerHTML = tabel;
    }
  };
  xhttp.open("GET", "./resurse/persoana.xml", true);
  xhttp.send();
}