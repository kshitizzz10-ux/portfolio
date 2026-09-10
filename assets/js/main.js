/**
 * Main Interactive Logic for Kshitiz Goyal's Data Portfolio
 * Minimal, Fast & Responsive
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Typing Animation
  const typingElement = document.getElementById('typewriter');
  if (typingElement) {
    const roles = [
      'Data Engineer & Analytics Specialist',
      'Demand Forecasting & Inventory Systems Builder',
      'Medallion Lakehouse Architect',
      'Power BI & Business Intelligence Developer'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function type() {
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 45;
      } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 85;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typingSpeed = 2200; // Pause at end of text
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 350;
      }

      setTimeout(type, typingSpeed);
    }
    type();
  }

  // 2. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // 3. Project Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-amber-500/20', 'text-amber-400', 'border-amber-500/60');
        b.classList.add('bg-slate-900/60', 'text-slate-400', 'border-slate-800');
      });
      btn.classList.remove('bg-slate-900/60', 'text-slate-400', 'border-slate-800');
      btn.classList.add('bg-amber-500/20', 'text-amber-400', 'border-amber-500/60');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 40);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.classList.add('hidden');
          }, 180);
        }
      });
    });
  });

  // 4. Modal System for Project Deep Dives
  window.openModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = 'auto';
    }
  };

  // Close modals when clicking outside modal box
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.add('hidden');
        backdrop.classList.remove('flex');
        document.body.style.overflow = 'auto';
      }
    });
  });

  // Close on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.classList.add('hidden');
        backdrop.classList.remove('flex');
      });
      document.body.style.overflow = 'auto';
    }
  });

  // 5. Copy to Clipboard Utility
  window.copyToClipboard = function (text, message) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(message || `Copied "${text}" to clipboard!`);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  // Toast Function
  function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'show';
    setTimeout(() => {
      toast.className = toast.className.replace('show', '');
    }, 2800);
  }

  // 6. Contact Form Simulated Submit
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const message = document.getElementById('contact-message').value;

      const mailtoUrl = `mailto:kshitiz.goyal1003@gmail.com?subject=${encodeURIComponent('Portfolio Inquiry from ' + name)}&body=${encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')')}`;
      
      showToast('Opening email client to send message to Kshitiz...');
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 700);
    });
  }

  // 7. Interactive Architecture Tab Explorer
  const archTabs = document.querySelectorAll('.arch-tab-btn');
  const archPanels = document.querySelectorAll('.arch-panel');

  archTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target');
      
      archTabs.forEach(t => {
        t.classList.remove('border-amber-500', 'text-amber-400', 'bg-amber-950/40', 'border-sky-500', 'text-sky-400', 'bg-sky-950/40');
        t.classList.add('border-transparent', 'text-slate-400', 'hover:text-slate-200');
      });
      tab.classList.add('border-amber-500', 'text-amber-400', 'bg-amber-950/40');
      tab.classList.remove('border-transparent', 'text-slate-400');

      archPanels.forEach(panel => {
        if (panel.id === target) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      });
    });
  });

  // 8. Navbar Active State on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 130;
      const sectionHeight = section.clientHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-amber-400', 'bg-slate-800/40');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('text-amber-400', 'bg-slate-800/40');
      }
    });
  });
});
