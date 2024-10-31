document.addEventListener("DOMContentLoaded", function () {
    const studentForm = document.getElementById("studentForm");
    const studentTableBody = document.getElementById("studentTableBody");
    const addStudentBtn = document.getElementById("addStudentBtn");
    const formModal = document.getElementById("formModal");
    const closeModal = document.getElementsByClassName("close")[0];

    // Modal açılması
    addStudentBtn.onclick = function () {
        formModal.style.display = "block";
        studentForm.reset(); // Formu sıfırla
    };

    // Modalı bağlama
    closeModal.onclick = function () {
        formModal.style.display = "none";
    };

    // Yerli saxlanmada məlumatları oxumaq
    loadStudents();

    // Form təqdim edildikdə
    studentForm.onsubmit = function (e) {
        e.preventDefault(); // Default təqdim olunmağı dayandır

        // Formdan məlumatları topla
        const name = document.getElementById("name").value;
        const movzuSaati = document.getElementById("movzuSaati").value;
        const dersSaati = document.getElementById("dersSaati").value;
        const davBal = document.getElementById("davBal").value;
        const mesgele1 = document.getElementById("mesgele1").value;
        const mesgele2 = document.getElementById("mesgele2").value;
        const mesgele3 = document.getElementById("mesgele3").value;
        const kollekfum1 = document.getElementById("kollekfum1").value;
        const kollekfum2 = document.getElementById("kollekfum2").value;
        const kollekfum3 = document.getElementById("kollekfum3").value;
        const labIsi = document.getElementById("labIsi").value;
        const verLabIsi = document.getElementById("verLabIsi").value;
        const serbest1 = document.getElementById("serbest1").value;
        const serbest2 = document.getElementById("serbest2").value;
        const serbest3 = document.getElementById("serbest3").value;

        // Yeni sətir yaradılması
        const newRow = {
            name,
            movzuSaati,
            dersSaati,
            davBal,
            mesgele1,
            mesgele2,
            mesgele3,
            kollekfum1,
            kollekfum2,
            kollekfum3,
            labIsi,
            verLabIsi,
            serbest1,
            serbest2,
            serbest3
        };

        // Məlumatı yerli saxlanmaya əlavə et
        saveStudent(newRow);

        // Modalı bağla və formu sıfırla
        formModal.style.display = "none";
        studentForm.reset();
    };

    function saveStudent(student) {
        const students = getStudents();
        students.push(student);
        localStorage.setItem("students", JSON.stringify(students));
        appendStudentRow(student);
    }

    function getStudents() {
        const students = localStorage.getItem("students");
        return students ? JSON.parse(students) : [];
    }

    function loadStudents() {
        const students = getStudents();
        students.forEach(student => {
            appendStudentRow(student);
        });
    }

    function appendStudentRow(student) {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${student.name}</td>
            <td>${student.movzuSaati}</td>
            <td>${student.dersSaati}</td>
            <td></td>
            <td>${student.mesgele1}</td>
            <td>${student.mesgele2}</td>
            <td>${student.mesgele3}</td>
            <td></td>
            <td>${student.kollekfum1}</td>
            <td>${student.kollekfum2}</td>
            <td>${student.kollekfum3}</td>
            <td></td>
            <td>${student.labIsi}</td>
            <td>${student.verLabIsi}</td>
            <td></td>
            <td>${student.serbest1}</td>
            <td>${student.serbest2}</td>
            <td>${student.serbest3}</td>
            <td></td>
            <td></td>
            <td>
                <button class="editBtn">🖉</button>
                <button class="deleteBtn">🗑️</button>
            </td>
        `;
        studentTableBody.appendChild(newRow);

        // Edit düyməsinə basıldıqda
        newRow.querySelector(".editBtn").onclick = function () {
            fillFormWithStudentData(student);
        };

        // Delete düyməsinə basıldıqda
        newRow.querySelector(".deleteBtn").onclick = function () {
            deleteStudent(student);
        };
    }
  

    function deleteStudent(student) {
        let students = getStudents();
        // Silinmək istənilən tələbənin adını istifadə edərək silirik
        students = students.filter(s => s.name !== student.name);
        localStorage.setItem("students", JSON.stringify(students));
        loadStudents(); // Cədvəli yeniləyirik
    }

    function fillFormWithStudentData(student) {
        // Formu tələbənin məlumatları ilə doldururuq
        document.getElementById("name").value = student.name;
        document.getElementById("movzuSaati").value = student.movzuSaati;
        document.getElementById("dersSaati").value = student.dersSaati;
        document.getElementById("davBal").value = student.davBal;
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

        // Modalı aç
        formModal.style.display = "block";
        
        // Formu yeniləyirik
        studentForm.onsubmit = function (e) {
            e.preventDefault(); // Default təqdim olunmağı dayandır
            // Məlumatları toplayırıq
            const updatedStudent = {
                name: student.name, // Adı dəyişmirik, çünki onu unikal olaraq saxlayırıq
                movzuSaati: document.getElementById("movzuSaati").value,
                dersSaati: document.getElementById("dersSaati").value,
                davBal: document.getElementById("davBal").value,
                mesgele1: document.getElementById("mesgele1").value,
                mesgele2: document.getElementById("mesgele2").value,
                mesgele3: document.getElementById("mesgele3").value,
                kollekfum1: document.getElementById("kollekfum1").value,
                kollekfum2: document.getElementById("kollekfum2").value,
                kollekfum3: document.getElementById("kollekfum3").value,
                labIsi: document.getElementById("labIsi").value,
                verLabIsi: document.getElementById("verLabIsi").value,
                serbest1: document.getElementById("serbest1").value,
                serbest2: document.getElementById("serbest2").value,
                serbest3: document.getElementById("serbest3").value
            };

            // Yeni tələbəni yerli saxlanmaya əlavə edirik
            updateStudent(updatedStudent);
            
            // Modalı bağlayırıq
            formModal.style.display = "none";
            studentForm.reset();
        };
    }

    function updateStudent(updatedStudent) {
        let students = getStudents();
        // Tələbəni tapıb, məlumatlarını yeniləyirik
        const index = students.findIndex(s => s.name === updatedStudent.name);
        if (index !== -1) {
            students[index] = updatedStudent; // Yenilənmiş məlumatları saxlayırıq
        }
        localStorage.setItem("students", JSON.stringify(students)); // Yenilənmiş siyahını saxlayırıq
        loadStudents(); // Cədvəli yeniləyirik
    }
});
