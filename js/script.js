// =====================
// Resume Builder Script
// =====================

// Live Preview on Input Change
function initLivePreview() {
  const mappings = [
    { input: "fullName", preview: "prevName", placeholder: "Your Name" },
    { input: "email", preview: "prevContact", type: "email" },
    { input: "phone", preview: "prevContact", type: "phone" },
    { input: "linkedin", preview: "prevContact", type: "linkedin" },
    { input: "degree", preview: "prevEdu", type: "edu" },
    { input: "college", preview: "prevEdu", type: "edu" },
    { input: "year", preview: "prevEdu", type: "edu" },
    { input: "role", preview: "prevRole" },
    { input: "company", preview: "prevCompany" },
    { input: "duration", preview: "prevDuration" },
    { input: "expDesc", preview: "prevDesc" }
  ];

  mappings.forEach(map => {
    const inputEl = document.getElementById(map.input);
    if (inputEl) {
      inputEl.addEventListener("input", () => {
        updatePreview(map);
      });
    }
  });
}

function updatePreview({ input, preview, type, placeholder }) {
  const value = document.getElementById(input).value.trim();
  const previewEl = document.getElementById(preview);

  if (!value && placeholder) {
    previewEl.textContent = placeholder;
    return;
  }

  if (type === "contact") {
    previewEl.textContent = `${document.getElementById("email").value} | ${document.getElementById("phone").value} | ${document.getElementById("linkedin").value}`;
  } else if (type === "edu") {
    const degree = document.getElementById("degree").value;
    const college = document.getElementById("college").value;
    const year = document.getElementById("year").value;
    previewEl.textContent = `${degree} at ${college} (${year})`;
  } else if (type === "email" || type === "phone" || type === "linkedin") {
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const linkedin = document.getElementById("linkedin").value;
    document.getElementById("prevContact").textContent = `${email} | ${phone} | ${linkedin}`;
  } else {
    previewEl.textContent = value || placeholder || '';
  }
}

// Validate Form Fields
function validateForm() {
  const requiredFields = ["fullName", "email", "phone"];
  let isValid = true;

  requiredFields.forEach(fieldId => {
    const el = document.getElementById(fieldId);
    if (!el.value.trim()) {
      el.classList.add("is-invalid");
      isValid = false;
    } else {
      el.classList.remove("is-invalid");
    }
  });

  return isValid;
}

// Generate Resume
function generateResume() {
  if (!validateForm()) {
    alert("Please fill in all required fields.");
    return;
  }
  updateAll();
}

// Update All Fields in Preview
function updateAll() {
  const event = new Event("input");
  document.querySelectorAll("input, textarea").forEach(input => {
    input.dispatchEvent(event);
  });
}

// Download Resume as PDF
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "pt", "a4");

  const resumeElement = document.getElementById("resumePreview");
  const resumeText = resumeElement.innerText;
  const lines = doc.splitTextToSize(resumeText, 500);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(12);
  doc.text(lines, 40, 60);

  doc.save("resume.pdf");
}

// Reset Form and Preview
function resetResume() {
  document.getElementById("resumeForm").reset();
  document.getElementById("resumePreview").innerHTML = `
    <h2 id="prevName">Your Name</h2>
    <p id="prevContact">Email | Phone | LinkedIn</p>
    <div class="section">
      <h4>Education</h4>
      <p id="prevEdu">Degree at College (Year)</p>
    </div>
    <div class="section">
      <h4>Experience</h4>
      <p><strong id="prevRole">Role</strong> at <span id="prevCompany">Company</span> (<span id="prevDuration">Duration</span>)</p>
      <p id="prevDesc">Experience description here.</p>
    </div>`;
  initLivePreview(); // Rebind listeners
}

// Theme Toggle
function toggleTheme() {
  document.body.classList.toggle("dark-mode");

  const themeBtn = document.getElementById("themeBtn");
  if (document.body.classList.contains("dark-mode")) {
    themeBtn.textContent = "Switch to Light Mode";
  } else {
    themeBtn.textContent = "Switch to Dark Mode";
  }
}

// Initialize Everything
window.onload = function () {
  initLivePreview();

  // Add Reset Button
  const resetBtn = document.createElement("button");
  resetBtn.textContent = "Reset";
  resetBtn.className = "btn btn-danger ms-2";
  resetBtn.onclick = resetResume;
  document.getElementById("downloadBtn").after(resetBtn);

  // Add Theme Button
  const themeBtn = document.createElement("button");
  themeBtn.textContent = "Switch to Dark Mode";
  themeBtn.id = "themeBtn";
  themeBtn.className = "btn btn-secondary ms-2";
  themeBtn.onclick = toggleTheme;
  resetBtn.after(themeBtn);

  // Add Dark Mode Styles
  const style = document.createElement("style");
  style.innerHTML = `
    .dark-mode {
      background-color: #121212 !important;
      color: #e0e0e0 !important;
    }
    .dark-mode input, .dark-mode textarea {
      background-color: #1e1e1e;
      color: #e0e0e0;
      border-color: #333;
    }
    .dark-mode .resume-preview {
      background-color: #1c1c1c;
      border-color: #444;
    }
  `;
  document.head.appendChild(style);
};
