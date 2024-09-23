// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("openModalBtn");

// Get the <span> element that closes the modal
var span = document.getElementById("closeModalBtn");

// When the user clicks the button, open the modal 
btn.onclick = function() {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
}

// When the user clicks anywhere outside of the modal content, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    }
}