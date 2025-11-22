const API_URL = "https://6921a4d9512fb4140be0e215.mockapi.io/Students";
const tbody = document.getElementById("tbody-data");

const addBtn = document.getElementById("add-btn");
const cancelBtn = document.getElementById("cancel-btn");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const nameInp = document.getElementById("name");
const ageInp = document.getElementById("age");
const gradeInp = document.getElementById("grade");
const saveBtn = document.getElementById("save-btn");
let editId = null;

/////////////// open dialog ///////////////
addBtn.addEventListener("click", () => {
  modalTitle.textContent = "Add Student";
  nameInp.value = "";
  ageInp.value = "";
  gradeInp.value = "";
  modal.style.display = "flex";
});

cancelBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

/////////////// get data and render in table ///////////////
async function fetchStudents() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    renderTable(data);
  } catch (error) {
    console.error("Error when fetch students");
  }
}

function renderTable(students) {
  tbody.innerHTML = "";
  if (students.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align:center; color:red;">No Students Yet...</td></tr>';
  } else {
    students.forEach((student) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.age}</td>
                <td>${student.grade}</td>
                <td>
                    <button onclick="editStudent('${student.id}')">✍ Edit</button>
                    <button onclick="deleteStudent('${student.id}')"  style="background-color:red;">⛔ Delete</button>
                </td>
            `;
      tbody.appendChild(row);
    });
  }
}

/////////////// delete student ///////////////
async function deleteStudent(id) {
  if (confirm("Are you sure delete student with id " + id)) {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchStudents();
    } catch (error) {
      console.error("Failed to delete student: " + error);
    }
  }
}

/////////////// edit student ///////////////
async function editStudent(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const studentData = await res.json();
    modalTitle.textContent = "Edit Student";
    nameInp.value = studentData.name;
    ageInp.value = studentData.age;
    gradeInp.value = studentData.grade;
    editId = id;
    modal.style.display = "flex";
  } catch (error) {
    console.error("Failed to fetch student: " + error);
  }
}

/////////////// handle save button when add and edit ///////////////
saveBtn.addEventListener("click", async () => {
  const name = nameInp.value;
  const age = ageInp.value;
  const grade = gradeInp.value;
  saveBtn.disabled = true;
  if (!name || !age || !grade) {
    alert("Please Fill All Fields");
    saveBtn.disabled = false;
    return;
  }
  const student = { name, age, grade };
  try {
    //// edit student
    if (editId) {
      await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });
      ////  add student
    } else {
      await fetch(`${API_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });
    }
    modal.style.display = "none";
    editId = null;
    fetchStudents();
  } catch (error) {
    console.error("Failed to Add student: " + error);
  } finally {
    saveBtn.disabled = false;
  }
});

fetchStudents();




