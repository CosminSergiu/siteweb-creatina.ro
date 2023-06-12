self.addEventListener("message", (event) => {
    console.log("Web Worker a primit mesajul: ", event.data);
    self.postMessage("Produs adăugat cu succes!");
});