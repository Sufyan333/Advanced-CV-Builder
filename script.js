const { jsPDF } = window.jspdf;

// Dynamic Education & Experience sections
const educationList = document.getElementById('educationList');
const experienceList = document.getElementById('experienceList');
const addEducationBtn = document.getElementById('addEducationBtn');
const addExperienceBtn = document.getElementById('addExperienceBtn');

function createSectionInput(type) {
  const div = document.createElement('div');
  div.className = 'section-group';

  const input = document.createElement('textarea');
  input.placeholder = type === 'education' ? 
    'Degree, Institution, Year' : 
    'Job Title, Company, Years worked';

  div.appendChild(input);

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'remove-btn';
  removeBtn.textContent = '×';
  removeBtn.title = 'Remove';
  removeBtn.onclick = () => div.remove();

  div.appendChild(removeBtn);
  return div;
}

addEducationBtn.onclick = () => {
  educationList.appendChild(createSectionInput('education'));
};
addExperienceBtn.onclick = () => {
  experienceList.appendChild(createSectionInput('experience'));
};

// Add one input initially for user convenience
addEducationBtn.click();
addExperienceBtn.click();

// Profile photo preview
const profilePicInput = document.getElementById('profilePic');
const profilePreview = document.getElementById('profilePreview');
let profileImgDataUrl = '';

profilePicInput.addEventListener('change', function() {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      profileImgDataUrl = e.target.result;
      profilePreview.src = profileImgDataUrl;
      profilePreview.style.display = 'block';
      updatePreview();
    };
    reader.readAsDataURL(file);
  } else {
    profilePreview.style.display = 'none';
    profileImgDataUrl = '';
    updatePreview();
  }
});

// Preview update
const preview = document.getElementById('preview');
const form = document.getElementById('cvForm');

function getMultipleValues(container) {
  const values = [];
  container.querySelectorAll('textarea').forEach(t => {
    if (t.value.trim()) values.push(t.value.trim());
  });
  return values;
}

function updatePreview() {
  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();
  const education = getMultipleValues(educationList);
  const experience = getMultipleValues(experienceList);
  const skills = document.getElementById('skills').value.trim();

  let text = '';
  if (fullName) text += fullName + '\n\n';
  if (email) text += `Email: ${email}\n`;
  if (phone) text += `Phone: ${phone}\n`;
  if (address) text += `Address: ${address}\n\n`;

  if (education.length) {
    text += 'Education:\n';
    education.forEach((e, i) => text += ` ${i + 1}. ${e}\n`);
    text += '\n';
  }
  if (experience.length) {
    text += 'Experience:\n';
    experience.forEach((e, i) => text += ` ${i + 1}. ${e}\n`);
    text += '\n';
  }
  if (skills) {
    text += 'Skills:\n';
    text += skills + '\n';
  }

  preview.textContent = text || '(Fill the form to see preview here)';
}

form.addEventListener('input', updatePreview);
educationList.addEventListener('input', updatePreview);
experienceList.addEventListener('input', updatePreview);

updatePreview();

// PDF generation
form.addEventListener('submit', function(e) {
  e.preventDefault();

  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();
  const education = getMultipleValues(educationList);
  const experience = getMultipleValues(experienceList);
  const skills = document.getElementById('skills').value.trim();

  const doc = new jsPDF();

  // Add profile photo if exists
  if (profileImgDataUrl) {
    // Add image in PDF (position x=150,y=10, width=40, height=40)
    doc.addImage(profileImgDataUrl, 'JPEG', 150, 10, 40, 40);
  }

  doc.setFontSize(22);
  doc.setTextColor('#0070f3');
  doc.text(fullName, 20, 20);

  doc.setFontSize(12);
  doc.setTextColor('#000');
  doc.text(`Email: ${email}`, 20, 30);
  if (phone) doc.text(`Phone: ${phone}`, 20, 37);
  if (address) doc.text(`Address: ${address}`, 20, 44);

  let y = 60;

  if (education.length) {
    doc.setFontSize(16);
    doc.setTextColor('#0070f3');
    doc.text("Education", 20, y);
    y += 7;
    doc.setFontSize(12);
    doc.setTextColor('#000');
    education.forEach((e, i) => {
      doc.text(`- ${e}`, 20, y);
      y += 7;
    });
    y += 5;
  }

  if (experience.length) {
    doc.setFontSize(16);
    doc.setTextColor('#0070f3');
    doc.text("Experience", 20, y);
    y += 7;
    doc.setFontSize(12);
    doc.setTextColor('#000');
    experience.forEach((e, i) => {
      doc.text(`- ${e}`, 20, y);
      y += 7;
    });
    y += 5;
  }

  if (skills) {
    doc.setFontSize(16);
    doc.setTextColor('#0070f3');
    doc.text("Skills", 20, y);
    y += 7;
    doc.setFontSize(12);
    doc.setTextColor('#000');
    const splitSkills = doc.splitTextToSize(skills, 170);
    doc.text(splitSkills, 20, y);
  }

  doc.save(`${fullName}_CV.pdf`);
});
