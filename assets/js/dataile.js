
// DOM elementləri
const formModal = document.getElementById("formModal");
const addStudentBtn = document.getElementById("addStudentBtn");
const closeModalBtn = document.querySelector(".close");
const studentForm = document.getElementById("studentForm");
const searchInput = document.querySelector(".search");
const tableBody = document.getElementById("studentTableBody");

let BASE_URL = "//localhost:2000/products";
let studentsData = []; // Global massiv, bütün məlumatlar burada saxlanılır.

// Modalı açmaq
addStudentBtn.addEventListener("click", function () {
  formModal.style.display = "block";
});

// Modalı bağlamaq
closeModalBtn.addEventListener("click", function () {
  formModal.style.display = "none";
});

// Formu göndərmək
studentForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let studentData = {
    name: document.getElementById("name").value,
    movzuSaati: parseInt(document.getElementById("movzuSaati").value) || 0,
    dersSaati: parseInt(document.getElementById("dersSaati").value) || 0,
    davBal: parseInt(document.getElementById("davBal").value) || 0,
    mesgele1: parseInt(document.getElementById("mesgele1").value) || 0,
    mesgele2: parseInt(document.getElementById("mesgele2").value) || 0,
    mesgele3: parseInt(document.getElementById("mesgele3").value) || 0,
    kollekfum1: parseInt(document.getElementById("kollekfum1").value) || 0,
    kollekfum2: parseInt(document.getElementById("kollekfum2").value) || 0,
    kollekfum3: parseInt(document.getElementById("kollekfum3").value) || 0,
    labIsi: parseInt(document.getElementById("labIsi").value) || 0,
    verLabIsi: parseInt(document.getElementById("verLabIsi").value) || 0,
    serbest1: parseInt(document.getElementById("serbest1").value) || 0,
    serbest2: parseInt(document.getElementById("serbest2").value) || 0,
    serbest3: parseInt(document.getElementById("serbest3").value) || 0,
  };

  // Axios ilə məlumatı göndərmək
  axios
    .post(BASE_URL, studentData)
    .then((response) => {
      console.log("Məlumat uğurla əlavə olundu:", response.data);
      fetchData(); // Məlumatları yenidən çəkmək
      formModal.style.display = "none"; // Modalı bağlamaq
    })
    .catch((error) => {
      console.error("Xəta baş verdi:", error);
    });
});

// Məlumatları çəkmək
function fetchData(data = null) {
  let url = BASE_URL;
  if (data) studentsData = data;

  axios
    .get(url)
    .then((response) => {
      studentsData = response.data;
      renderTable(studentsData);
    })
    .catch((error) => {
      console.error("Xəta baş verdi:", error);
    });
}

// Cədvəli yaratmaq
function renderTable(students) {
  tableBody.innerHTML = "";

  students.forEach((student) => {
    let totalBal =
      (student.davBal || 0) +
      (student.mesgele1 || 0) +
      (student.mesgele2 || 0) +
      (student.mesgele3 || 0) +
      (student.kollekfum1 || 0) +
      (student.kollekfum2 || 0) +
      (student.kollekfum3 || 0) +
      (student.labIsi || 0) +
      (student.verLabIsi || 0) +
      (student.serbest1 || 0) +
      (student.serbest2 || 0) +
      (student.serbest3 || 0);

    let row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.name || "-"}</td>
      <td>${student.movzuSaati || "-"}</td>
      <td>${student.dersSaati || "-"}</td>
     
      <td>${student.davBal || "-"}</td>
      <td>${student.mesgele1 || "-"}</td>
      <td>${student.mesgele2 || "-"}</td>
      <td>${student.mesgele3 || "-"}</td>
       <td></td>
      <td>${student.kollekfum1 || "-"}</td>
      <td>${student.kollekfum2 || "-"}</td>
      <td>${student.kollekfum3 || "-"}</td>
       <td></td>
      <td>${student.labIsi || "-"}</td>
      <td>${student.verLabIsi || "-"}</td>
       <td></td>
      <td>${student.serbest1 || "-"}</td>
      <td>${student.serbest2 || "-"}</td>
      <td>${student.serbest3 || "-"}</td>
       <td></td>
      <td>${totalBal}</td>
      <td><button onclick="deleteStudent(${student.id})">Sil</button></td>
    `;
    tableBody.appendChild(row);
  });
}

// Şagirdi silmək
function deleteStudent(studentId) {
  axios
    .delete(`${BASE_URL}/${studentId}`)
    .then((response) => {
      console.log("Şagird silindi:", response.data);
      fetchData(); // Cədvəli yenilə
    })
    .catch((error) => {
      console.error("Xəta baş verdi:", error);
    });
}

// Axtarış funksiyası
searchInput.addEventListener("input", function (e) {
  let query = e.target.value.toLowerCase();
  let filtered = studentsData.filter((student) =>
    student.name.toLowerCase().includes(query)
  );
  renderTable(filtered);
});

// Səhifə yüklənəndə məlumatları çəkmək
window.onload = fetchData;
