/* ============================================================
   MY FITNESS – Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // === NAVBAR SCROLL ===
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // === HAMBURGER / MOBILE NAV ===
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  // Close on link click
  navLinks?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // === SCROLL REVEAL ===
  const fadeEls = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => observer.observe(el));

  // === PROGRESS BARS ===
  const progressFills = document.querySelectorAll('.progress-fill');
  const progressNums = document.querySelectorAll('.progress-num');
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const target = parseInt(fill.dataset.width);
        fill.style.width = target + '%';

        // Animate number
        const numEl = fill.closest('.progress-item')?.querySelector('.progress-num');
        if (numEl) {
          let current = 0;
          const step = target / 60;
          const interval = setInterval(() => {
            current = Math.min(current + step, target);
            numEl.textContent = Math.round(current) + '%';
            if (current >= target) clearInterval(interval);
          }, 20);
        }

        progressObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });

  progressFills.forEach(el => progressObserver.observe(el));

  // === COUNTER ANIMATION ===
  const statNums = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        let current = 0;
        const duration = 1800;
        const startTime = performance.now();

        const animate = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          current = Math.round(eased * target);

          // Format 4000 as 4
          if (target === 4000) {
            el.textContent = Math.round(eased * 4);
          } else {
            el.textContent = current;
          }

          if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));

  // === SLIDER DOTS ===
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      dots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });

  // === HERO SLIDER (auto) ===
  const heroSlides = [
    {
      img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80',
      title: 'MY FITNESS',
      subtitle: 'We Are The Best Fitness<br/>Studio In Town'
    },
    {
      img: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1600&q=80',
      title: 'MY FITNESS',
      subtitle: 'Grow Your<br/><span style="color:var(--accent)">Strength</span><br/>With My Fitness'
    },
    {
      img: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=1600&q=80',
      title: 'MY FITNESS',
      subtitle: 'Transform<br/>Your Body Today'
    }
  ];

  let currentSlide = 0;
  const heroImg = document.querySelector('.hero-img');
  const heroSubtitle = document.querySelector('.hero-subtitle');

  function goToSlide(idx) {
    currentSlide = (idx + heroSlides.length) % heroSlides.length;
    if (heroImg) {
      heroImg.style.opacity = '0';
      heroImg.style.transition = 'opacity 0.5s';
      setTimeout(() => {
        heroImg.src = heroSlides[currentSlide].img;
        heroImg.style.opacity = '1';
      }, 500);
    }
    if (heroSubtitle) heroSubtitle.innerHTML = heroSlides[currentSlide].subtitle;
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  document.querySelector('.next-btn')?.addEventListener('click', () => goToSlide(currentSlide + 1));
  document.querySelector('.prev-btn')?.addEventListener('click', () => goToSlide(currentSlide - 1));

  // Auto slide
  setInterval(() => goToSlide(currentSlide + 1), 5000);

  // === CONTACT FORM ===
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const status = document.getElementById('formStatus');

    // Loading state
    btn.classList.add('btn-loading');
    btn.textContent = 'Sending';
    if (status) status.className = 'form-status';

    const data = {
      name: contactForm.name.value,
      email: contactForm.email.value,
      phone: contactForm.phone.value,
      message: contactForm.message.value
    };

    try {
      const res = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        if (status) {
          status.className = 'form-status success';
          status.textContent = '✓ Message sent successfully! We\'ll be in touch soon.';
        }
        contactForm.reset();
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      if (status) {
        status.className = 'form-status error';
        status.textContent = '✗ Something went wrong. Please try again or email us directly.';
      }
    } finally {
      btn.classList.remove('btn-loading');
      btn.textContent = 'Send Message';
    }
  });

  // === SMOOTH PARALLAX for CTA / Hero ===
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroImg = document.querySelector('.hero-img');
    if (heroImg && scrolled < window.innerHeight) {
      heroImg.style.transform = `scale(1.08) translateY(${scrolled * 0.15}px)`;
    }
  });

});
