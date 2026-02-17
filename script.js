(function(){
  if (typeof emailjs !== 'undefined') emailjs.init('YxgJ-vqlDwKCrBFbE');
})();

(function() {
  const root    = document.documentElement;
  const btn     = document.getElementById('theme-toggle');
  const STORAGE = 'pn-theme';

  const saved = localStorage.getItem(STORAGE);
  const theme = saved || 'light';
  root.setAttribute('data-theme', theme);

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    localStorage.setItem(STORAGE, t);
  }

  if (btn) {
    btn.addEventListener('click', function() {
      const current = root.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
})();

function toast(msg, type) {
  const el = document.getElementById('toast');
  document.getElementById('toast-icon').textContent = type === 'ok' ? '✓' : '✕';
  document.getElementById('toast-msg').textContent  = msg;
  el.className = 'toast ' + type + ' show';
  setTimeout(() => el.classList.remove('show'), 5200);
}

document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn  = document.getElementById('form-btn');
  const orig = btn.innerHTML;
  btn.disabled = true;
  btn.textContent = 'Sending…';

  if (typeof emailjs === 'undefined') {
    toast('Email service unavailable. Please reach out directly.', 'err');
    btn.disabled = false; btn.innerHTML = orig; return;
  }

  emailjs.sendForm('service_hx80yg9', 'template_w5vfbsf', this)
    .then(() => { toast("Message sent! I'll get back to you soon.", 'ok'); this.reset(); })
    .catch(() => toast('Failed to send. Please email me directly.', 'err'))
    .finally(() => { btn.disabled = false; btn.innerHTML = orig; });
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const t = document.querySelector(this.getAttribute('href'));
    if (!t) return; e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 68, behavior: 'smooth' });
  });
});

const io = new IntersectionObserver((entries) => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

const navAs = document.querySelectorAll('.nav-links a[href^="#"]');
const secs  = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const y = scrollY + 90;
  secs.forEach(s => {
    if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) {
      navAs.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + s.id ? 'var(--cyan)' : '';
      });
    }
  });
}, { passive: true });

const navEl = document.querySelector('nav');
window.addEventListener('scroll', () => {
  navEl.style.boxShadow = scrollY > 10 ? '0 1px 28px var(--shadow)' : 'none';
}, { passive: true });
