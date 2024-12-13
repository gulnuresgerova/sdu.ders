// DOM elementləri
const formModal = document.getElementById("formModal");
const addStudentBtn = document.getElementById("addStudentBtn");
const closeModalBtn = document.querySelector(".close");
const studentForm = document.getElementById("studentForm");
const searchInput = document.querySelector(".search");
const tableBody = document.getElementById("studentTableBody");

let BASE_URL = "//localhost:2000/products";
let studentsData = []; // Global massiv, bütün məlumatlar burada saxlanılır.
let currentStudentId = null; // Edit funksiyası üçün seçilən tələbə ID'si

// Modalı açmaq
addStudentBtn.addEventListener("click", function () {
  currentStudentId = null; // Yeni tələbə əlavə edərkən ID sıfırlanır
  formModal.style.display = "block";
  studentForm.reset(); // Formu sıfırlamaq
});

// Modalı bağlamaq
closeModalBtn.addEventListener("click", function () {
  formModal.style.display = "none";
  studentForm.reset(); // Formu sıfırlamaq
});

// Formu göndərmək
studentForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let studentData = {
    name: document.getElementById("name").value || "-",
    movzuSaati: parseInt(document.getElementById("movzuSaati").value) || 0,
    dersSaati: parseInt(document.getElementById("dersSaati").value) || 0,
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

  if (currentStudentId) {
    // Əgər currentStudentId varsa, mövcud tələbəni yeniləyirik (PUT request)
    axios
      .put(`${BASE_URL}/${currentStudentId}`, studentData)
      .then((response) => {
        console.log("Məlumat uğurla yeniləndi:", response.data);
        fetchData(); // Məlumatları yenidən çəkmək
        formModal.style.display = "none"; // Modalı bağlamaq
      })
      .catch((error) => {
        console.error("Məlumat yenilənərkən xəta baş verdi:", error);
      });
  } else {
    // Yeni tələbə əlavə etmək (POST request)
    axios
      .post(BASE_URL, studentData)
      .then((response) => {
        console.log("Məlumat uğurla əlavə olundu:", response.data);
        fetchData(); // Məlumatları yenidən çəkmək
        formModal.style.display = "none"; // Modalı bağlamaq
      })
      .catch((error) => {
        console.error("Məlumat əlavə olunarkən xəta baş verdi:", error);
      });
  }
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
      console.error("Məlumatları çəkərkən xəta baş verdi:", error);
      tableBody.innerHTML = "<tr><td colspan='21'>Məlumat yüklənə bilmədi.</td></tr>";
    });
}

// Seçimlər və seçilən sahələrin izlənməsi
let selectedFields = {
  mesgele: false,
  kolekfum: false,
  serbest: false,
  davami: false,
  lab: false
};

// Seçimi dəyişdirmək
function toggleSelection(element, field) {
  const isSelected = element.classList.toggle('selected');
  selectedFields[field] = isSelected;
  resetOtherFields(field); // Digər sahələri sıfırlamaq
  calculateAndUpdateTotal();
  renderTable(studentsData); // Cədvəli yeniləyirik
}

// Digər sahələri sıfırlamaq
function resetOtherFields(selectedField) {
  // Seçilməyən sahələrin ballarını sıfırlayırıq
  Object.keys(selectedFields).forEach((field) => {
    if (field !== selectedField) {
      selectedFields[field] = false;
    }
  });
}

// Hesablamalar funksiyası
function calculateDavBal(movzuSaati, dersSaati) {
  if (movzuSaati === 0) return "0.00";
  let davBal = (dersSaati / movzuSaati) * 10;
  return davBal > 10 ? 10 : davBal.toFixed(2); // Maksimum 10 bal ola bilər
}

function calculateMesBal(mesgele1, mesgele2, mesgele3, max = 3) {
  let mesBal = (mesgele1 + mesgele2 + mesgele3) / max;
  return mesBal.toFixed(2); // Orta balı hesabla və yuvarlaqlaşdır
}

function calculateKolekBal(kollekfum1, kollekfum2, kollekfum3, max = 3) {
  let kolekBal = (kollekfum1 + kollekfum2 + kollekfum3) / max;
  return kolekBal.toFixed(2);
}

function calculateLabBal(labIsi, verLabIsi, max = 2) {
  let labBal = (labIsi + verLabIsi) / max;
  return labBal.toFixed(2);
}

function calculateSerbestBal(serbest1, serbest2, serbest3, max = 3) {
  let serbestBal = (serbest1 + serbest2 + serbest3) / max;
  return serbestBal.toFixed(2);
}

// Balın ümumi hesablanması
function calculateAndUpdateTotal() {
  let totalBal = 0;

  if (selectedFields.mesgele) {
    totalBal += calculateMesBal(20);  // Məşğələ üçün 20 bal
  }

  if (selectedFields.kolekfum) {
    totalBal += calculateKolekBal(10);  // Kollektiv İş üçün 10 bal
  }

  if (selectedFields.serbest) {
    totalBal += calculateSerbestBal(10);  // Serbest İş üçün 10 bal
  }

  if (selectedFields.davami) {
    totalBal += calculateDavBal(10);  // Davamiyyət üçün 10 bal
  }

  if (selectedFields.lab) {
    totalBal += calculateLabBal(10);  // Laboratoriya üçün 10 bal
  }

  totalBal = Math.min(totalBal, 50);  // Maksimum bal 50
  document.getElementById("totalBalDisplay").innerText = `Ümumi Bal: ${totalBal}`;
}

// Cədvəli yaratmaq
function renderTable(students) {
  tableBody.innerHTML = "";

  if (!students || students.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='21'>Heç bir məlumat tapılmadı.</td></tr>";
    return;
  }

  students.forEach((student) => {
    // Hesablamalar
    let davBal = calculateDavBal(student.movzuSaati, student.dersSaati);
    let mesBal = calculateMesBal(student.mesgele1, student.mesgele2, student.mesgele3);
    let kolekBal = calculateKolekBal(student.kollekfum1, student.kollekfum2, student.kollekfum3);
    let labBal = calculateLabBal(student.labIsi, student.verLabIsi);
    let serbestBal = calculateSerbestBal(student.serbest1, student.serbest2, student.serbest3);

    // Cəmi balı hesabla
    let totalBal = (
      parseFloat(davBal) +
      parseFloat(mesBal) +
      parseFloat(kolekBal) +
      parseFloat(labBal) +
      parseFloat(serbestBal)
    ).toFixed(2);

    // Cədvəl sətirini doldur
    let row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.name || "-"}</td>
      <td>${student.movzuSaati || "-"}</td>
      <td>${student.dersSaati || "-"}</td>
      <td>${davBal}</td>
      <td>${student.mesgele1 || "-"}</td>
      <td>${student.mesgele2 || "-"}</td>
      <td>${student.mesgele3 || "-"}</td>
      <td>${mesBal}</td>
      <td>${student.kollekfum1 || "-"}</td>
      <td>${student.kollekfum2 || "-"}</td>
      <td>${student.kollekfum3 || "-"}</td>
      <td>${kolekBal}</td>
      <td>${student.labIsi || "-"}</td>
      <td>${student.verLabIsi || "-"}</td>
      <td>${labBal}</td>
      <td>${student.serbest1 || "-"}</td>
      <td>${student.serbest2 || "-"}</td>
      <td>${student.serbest3 || "-"}</td>
      <td>${serbestBal}</td>
      <td>${totalBal}</td>
    `;
    
    // Create edit button
    let editCell = document.createElement("td");
    let editBtn = document.createElement("button");
    editBtn.textContent = "Dəyişdir";
    editBtn.addEventListener("click", function () {
      editStudent(student);
    });
    editCell.appendChild(editBtn);
    
    // Create delete button
    let deleteCell = document.createElement("td");
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Sil";
    deleteBtn.addEventListener("click", function () {
      deleteStudent(student.id);
    });
    deleteCell.appendChild(deleteBtn);
    
    row.appendChild(editCell);
    row.appendChild(deleteCell);
    tableBody.appendChild(row);
  });
}

// Şagirdi silmək
function deleteStudent(studentId) {
  if (!studentId) {
    console.error("Şagird ID-si düzgün deyil.");
    return;
  }

  console.log("Deleting student with ID:", studentId);  // Log student ID
  axios
    .delete(`${BASE_URL}/${studentId}`)
    .then((response) => {
      console.log("Şagird silindi:", response.data);
      fetchData(); // Cədvəli yenilə
    })
    .catch((error) => {
      console.error("Şagirdi silərkən xəta baş verdi:", error);
    });
}

// Şagirdin məlumatlarını formda göstərmək
function editStudent(student) {
  currentStudentId = student.id;  // Seçilən tələbənin ID'sini saxla
  document.getElementById("name").value = student.name;
  document.getElementById("movzuSaati").value = student.movzuSaati;
  document.getElementById("dersSaati").value = student.dersSaati;
  document.getElementById("mesgele1").value = student.mesgele1;
  document.getElementById("mesgele2").value = student.mesgele2;
  document.getElementById("mesgele3").value = student.mesgele3;
  document.getElementById("kollekfum1").value = student.kollekfum1;
  document.getElementById("kollekfum2").value = student.kollekfum2;
  document.getElementById("kollekfum3").value = student.kollekfum3;
  document.getElementById("labIsi").value = student.labIsi;
  document.getElementById("verLabIsi").value = student.verLabIsi;
  document.getElementById("serbest1").value = student.serbest1;
  document.getElementById("serbest2").value = student.serbest2;
  document.getElementById("serbest3").value = student.serbest3;
  
  formModal.style.display = "block";  // Modalı aç
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
