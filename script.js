// PATF Landing Page JavaScript

const API_URL = 'https://patf-api-production.up.railway.app';

// Background Music Controller
const bgMusic = document.getElementById('bgMusic');
const audioToggle = document.getElementById('audioToggle');

bgMusic.volume = 0.3;

audioToggle.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play();
    audioToggle.classList.add('playing');
  } else {
    bgMusic.pause();
    audioToggle.classList.remove('playing');
  }
});

// Signup Form Handler
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;

  // Loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
      <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"/>
    </svg>
    Creating your account...
  `;

  const name = document.getElementById('businessName').value;
  const email = document.getElementById('email').value;

  try {
    const response = await fetch(`${API_URL}/api/v1/business/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email })
    });

    const data = await response.json();

    if (data.success) {
      // Show success state
      document.getElementById('signupForm').style.display = 'none';
      document.getElementById('signupSuccess').style.display = 'block';

      // Display API key
      document.getElementById('apiKeyDisplay').textContent = data.business.apiKey;

      // Display integration code
      document.getElementById('integrationCode').innerHTML =
        `&lt;script src="https://cdn.patf.io/v1/patf.js"&gt;&lt;/script&gt;\n` +
        `&lt;script&gt;PATF.init('${data.business.apiKey}');&lt;/script&gt;`;

    } else {
      throw new Error(data.error || 'Registration failed');
    }

  } catch (error) {
    alert(error.message || 'Something went wrong. Please try again.');
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
});

// Copy API Key
function copyApiKey() {
  const apiKey = document.getElementById('apiKeyDisplay').textContent;
  navigator.clipboard.writeText(apiKey).then(() => {
    const btn = document.querySelector('.copy-btn');
    btn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
        <path d="M22 4L12 14.01l-3-3"/>
      </svg>
    `;
    btn.style.color = '#fbbf24';

    setTimeout(() => {
      btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
        </svg>
      `;
      btn.style.color = '';
    }, 2000);
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add animation on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.step, .value-card, .problem-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Add spinning animation CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .spin {
    animation: spin 1s linear infinite;
  }
`;
document.head.appendChild(style);
