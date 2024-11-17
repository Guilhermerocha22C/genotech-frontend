document.addEventListener("DOMContentLoaded", function() {
    var modal = document.getElementById("myModal");
    var modalImg = document.getElementById("img01");
    var images = document.querySelectorAll(".card img");
    var span = document.getElementsByClassName("close")[0];

    modal.style.display = "none";

    images.forEach(function(image) {
        image.onclick = function() {
            modal.style.display = "flex"; 
            modalImg.src = this.src; 
        }
    });

    span.onclick = function() {
        modal.style.display = "none"; 
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none"; 
        }
    }
});
