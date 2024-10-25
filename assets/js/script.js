


// Modal elementləri
// Modal elementləri
const modal = document.getElementById("formModal");
const btn = document.getElementById("addStudentBtn");
const span = document.getElementsByClassName("close")[0];

// Düyməyə basıldıqda modalı göstər
btn.onclick = function() {
    modal.style.display = "block";
}

// Modalı bağlamaq üçün X işarəsinə basıldıqda
span.onclick = function() {
    modal.style.display = "none";
}

// Modalı bağlamaq üçün istənilən yerdə basıldıqda
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
