class Produs {
    constructor(id, nume, cantitate) {
        this.id = id;
        this.nume = nume;
        this.cantitate = cantitate;
    }
}

//salvare produse pe local storage
function salveazaProduse(produse) {
    localStorage.setItem("produse", JSON.stringify(produse));
}

function adaugaProduse() {
    //preluam date din html
    const nume = document.getElementById("nume").value;
    const cantitate = document.getElementById("cantitate").value;
    const lista = document.getElementById("listaCumparaturiBody");

    if (!nume || !cantitate) {
        alert("Vă rugăm să completați toate câmpurile!");
        return;
    }

    // Obținem lista de produse din localStorage, dacă există
    let produse = JSON.parse(localStorage.getItem("produse")) || [];

    //id-ul noului produs
    const id = produse.length + 1;
    const produs = new Produs(id, nume, cantitate);
    produse.push(produs);

    lista.innerHTML += `
      <tr>
        <td>${id}</td>
        <td>${nume}</td>
        <td>${cantitate}</td>
      </tr>
    `;

    salveazaProduse(produse);
    //reset
    document.getElementById("nume").value = "";
    document.getElementById("cantitate").value = "";

   // Notificăm Web Worker-ul că s-a adăugat un produs
    if (Worker !== "undefined") {

        const worker = new Worker("/JS/worker.js");
        worker.postMessage("S-a adăugat un produs în lista de cumpărături.");

        worker.onmessage = (event) => {
            console.log("Mesaj primit de la Web Worker: ", event.data);
        };
    } else {
        console.log("Browser-ul nu suportă Web Workers.");
    }
}


function afiseazaProduse() {
    const lista = document.getElementById("listaCumparaturiBody");
    const produse = JSON.parse(localStorage.getItem("produse")) || [];

    lista.innerHTML = "";
    for (let i = 0; i < produse.length; i++) {
        const produs = produse[i];
        lista.innerHTML += `
      <tr>
        <td>${produs.id}</td>
        <td>${produs.nume}</td>
        <td>${produs.cantitate}</td>
      </tr>
    `;
    }
}

