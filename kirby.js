// kirby.js - interactions for Kirby.html
document.addEventListener('DOMContentLoaded', () => {
  const avatar = document.getElementById('kirbyAvatar');
  // Ensure image path exists; fallback to a placeholder if not found
  function setAvatar(src) {
    const img = new Image();
    img.onload = () => avatar.src = src;
    img.onerror = () => avatar.src = 'assets/images/default-avatar.png';
    img.src = src;
  }
  setAvatar('assets/images/kirby.jpg');

  // Clicking avatar opens the full portfolio (same page) or can open a modal
  avatar.addEventListener('click', () => {
    // Navigate to the same page anchor or reveal more info; keep simple: scroll to projects
    document.querySelector('.projects').scrollIntoView({behavior:'smooth'});
  });

  // Optional: wire resume download (replace URL with your resume file)
  const resumeBtn = document.getElementById('viewResume');
  if (resumeBtn) resumeBtn.href = 'assets/files/Kirby_Resume.pdf';
});
