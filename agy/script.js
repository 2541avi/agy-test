/**
 * ==========================================================================
 * MINDFUL SPACE - ONLINE COUNSELLING SERVICE
 * Main JavaScript File (script.js)
 * Clean, accessible, modular vanilla JavaScript.
 * Easy to read and understand for beginners.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. ACTIVE NAVIGATION LINK DETECTION
     Highlights the current page in the navigation bar automatically.
     -------------------------------------------------------------------------- */
  function setupActiveNavLinks() {
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop() || 'index.html';

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const linkHref = link.getAttribute('href');
      // Normalize link href to compare filename
      const targetPage = linkHref ? linkHref.split('#')[0] : '';
      
      if (targetPage === pageName || (pageName === '' && targetPage === 'index.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  /* --------------------------------------------------------------------------
     2. STICKY HEADER SCROLL SHADOW
     Adds subtle elevation to the header as the user scrolls down.
     -------------------------------------------------------------------------- */
  function setupHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     3. MOBILE NAVIGATION MENU & ACCESSIBLE DRAWER
     Handles opening/closing the mobile menu with backdrop and Esc key.
     -------------------------------------------------------------------------- */
  function setupMobileMenu() {
    const toggleBtn = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (!toggleBtn || !mainNav) return;

    // Create backdrop element if not already in DOM
    let backdrop = document.querySelector('.nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'nav-backdrop';
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.appendChild(backdrop);
    }

    function openMenu() {
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.setAttribute('aria-label', 'Close mobile navigation menu');
      mainNav.classList.add('open');
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeMenu() {
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-label', 'Open mobile navigation menu');
      mainNav.classList.remove('open');
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close when clicking the backdrop
    backdrop.addEventListener('click', closeMenu);

    // Close when clicking any nav link
    const links = mainNav.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 820) {
          closeMenu();
        }
      });
    });

    // Close when pressing Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        closeMenu();
        toggleBtn.focus();
      }
    });

    // Reset styles on resize back to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 820 && mainNav.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  /* --------------------------------------------------------------------------
     4. BACK-TO-TOP BUTTON
     Shows a smooth floating button when scrolled down.
     -------------------------------------------------------------------------- */
  function setupBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      // Move focus back to the skip link or top of page for screen readers
      const skipLink = document.querySelector('.skip-link');
      if (skipLink) skipLink.focus();
    });
  }

  /* --------------------------------------------------------------------------
     5. FAQ ACCORDION COMPONENT (faq.html)
     Keyboard accessible, smooth accordion with expand/collapse all controls.
     -------------------------------------------------------------------------- */
  function setupFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
      const button = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      if (!button || !answer) return;

      button.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Toggle state
        if (isOpen) {
          item.classList.remove('active');
          button.setAttribute('aria-expanded', 'false');
          answer.setAttribute('aria-hidden', 'true');
        } else {
          item.classList.add('active');
          button.setAttribute('aria-expanded', 'true');
          answer.setAttribute('aria-hidden', 'false');
        }
      });
    });

    // Expand All / Collapse All controls
    const expandAllBtn = document.getElementById('expand-all-faqs');
    const collapseAllBtn = document.getElementById('collapse-all-faqs');

    if (expandAllBtn) {
      expandAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        faqItems.forEach(item => {
          item.classList.add('active');
          const btn = item.querySelector('.faq-question');
          const ans = item.querySelector('.faq-answer');
          if (btn) btn.setAttribute('aria-expanded', 'true');
          if (ans) ans.setAttribute('aria-hidden', 'false');
        });
      });
    }

    if (collapseAllBtn) {
      collapseAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        faqItems.forEach(item => {
          item.classList.remove('active');
          const btn = item.querySelector('.faq-question');
          const ans = item.querySelector('.faq-answer');
          if (btn) btn.setAttribute('aria-expanded', 'false');
          if (ans) ans.setAttribute('aria-hidden', 'true');
        });
      });
    }
  }

  /* --------------------------------------------------------------------------
     6. BLOG SEARCH, CATEGORY FILTERING & MODAL READER (blog.html)
     Filters sample articles dynamically and opens an accessible modal.
     -------------------------------------------------------------------------- */
  function setupBlogFeatures() {
    const blogCards = document.querySelectorAll('.blog-card');
    const searchInput = document.getElementById('blog-search-input');
    const filterButtons = document.querySelectorAll('.category-filters .filter-btn');
    const countDisplay = document.getElementById('blog-count-display');
    const emptyState = document.getElementById('blog-empty-state');
    const modal = document.getElementById('article-modal');

    // If we're not on the blog page, skip this setup
    if (blogCards.length === 0) return;

    let currentCategory = 'all';
    let currentSearchTerm = '';

    function filterArticles() {
      let visibleCount = 0;

      blogCards.forEach(card => {
        const title = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
        const excerpt = card.querySelector('.blog-excerpt') ? card.querySelector('.blog-excerpt').textContent.toLowerCase() : '';
        const category = card.getAttribute('data-category') || '';

        const matchesCategory = (currentCategory === 'all' || category === currentCategory);
        const matchesSearch = (title.includes(currentSearchTerm) || excerpt.includes(currentSearchTerm));

        if (matchesCategory && matchesSearch) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Update count text
      if (countDisplay) {
        countDisplay.textContent = `Showing ${visibleCount} article${visibleCount === 1 ? '' : 's'}`;
      }

      // Empty state
      if (emptyState) {
        if (visibleCount === 0) {
          emptyState.style.display = 'block';
        } else {
          emptyState.style.display = 'none';
        }
      }
    }

    // Category button click handling
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        currentCategory = btn.getAttribute('data-category') || 'all';
        filterArticles();
      });
    });

    // Search input handling (with gentle debounce)
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.trim().toLowerCase();
        filterArticles();
      });
    }

    // Article Modal Reader Setup
    if (modal) {
      const modalTitle = modal.querySelector('#modal-article-title');
      const modalMeta = modal.querySelector('#modal-article-meta');
      const modalBody = modal.querySelector('#modal-article-content');
      const modalClose = modal.querySelector('.modal-close-btn');

      // Attach click listeners to all "Read Article" buttons
      const readButtons = document.querySelectorAll('.read-article-btn');
      let previousActiveElement = null;

      readButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          previousActiveElement = document.activeElement;

          const card = button.closest('.blog-card');
          if (!card) return;

          const title = card.querySelector('h3') ? card.querySelector('h3').textContent : 'Sample Article';
          const category = card.querySelector('.blog-category') ? card.querySelector('.blog-category').textContent : 'General';
          const date = card.querySelector('.blog-date') ? card.querySelector('.blog-date').textContent : 'Recent';
          const readTime = card.querySelector('.read-time') ? card.querySelector('.read-time').textContent : '5 min read';
          const fullContent = card.querySelector('.article-full-content');

          if (modalTitle) modalTitle.textContent = title;
          if (modalMeta) modalMeta.textContent = `${category} • ${date} • ${readTime}`;
          if (modalBody && fullContent) {
            modalBody.innerHTML = fullContent.innerHTML;
          }

          // Open dialog
          if (typeof modal.showModal === 'function') {
            modal.showModal();
          } else {
            modal.setAttribute('open', '');
          }
          document.body.style.overflow = 'hidden';

          if (modalClose) modalClose.focus();
        });
      });

      function closeModal() {
        if (typeof modal.close === 'function') {
          modal.close();
        } else {
          modal.removeAttribute('open');
        }
        document.body.style.overflow = '';
        if (previousActiveElement) previousActiveElement.focus();
      }

      if (modalClose) {
        modalClose.addEventListener('click', closeModal);
      }

      // Close if clicking outside the modal dialog box
      modal.addEventListener('click', (e) => {
        const dialogDimensions = modal.getBoundingClientRect();
        if (
          e.clientX < dialogDimensions.left ||
          e.clientX > dialogDimensions.right ||
          e.clientY < dialogDimensions.top ||
          e.clientY > dialogDimensions.bottom
        ) {
          closeModal();
        }
      });

      // Handle Escape key
      modal.addEventListener('cancel', (e) => {
        e.preventDefault();
        closeModal();
      });
    }
  }

  /* --------------------------------------------------------------------------
     7. CONTACT & APPOINTMENT REQUEST FORM VALIDATION (contact.html)
     Validates inputs, restricts past dates, and renders demo confirmation card.
     -------------------------------------------------------------------------- */
  function setupBookingForm() {
    const bookingForm = document.getElementById('booking-form');
    if (!bookingForm) return;

    const dateInput = document.getElementById('session-date');
    if (dateInput) {
      // Set minimum date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dd = String(tomorrow.getDate()).padStart(2, '0');
      dateInput.min = `${yyyy}-${mm}-${dd}`;
    }

    const successCard = document.getElementById('booking-success-card');
    const successDetails = document.getElementById('booking-success-summary');

    function showError(fieldId, errorMsg) {
      const field = document.getElementById(fieldId);
      const errEl = document.getElementById(`${fieldId}-error`);
      if (field) {
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
      }
      if (errEl) {
        errEl.textContent = errorMsg;
        errEl.classList.add('visible');
      }
    }

    function clearError(fieldId) {
      const field = document.getElementById(fieldId);
      const errEl = document.getElementById(`${fieldId}-error`);
      if (field) {
        field.classList.remove('error');
        field.removeAttribute('aria-invalid');
      }
      if (errEl) {
        errEl.textContent = '';
        errEl.classList.remove('visible');
      }
    }

    // Real-time error clearing on input
    ['client-name', 'client-email', 'session-type', 'session-date', 'demo-consent'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => clearError(id));
        el.addEventListener('change', () => clearError(id));
      }
    });

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      const nameInput = document.getElementById('client-name');
      if (!nameInput || nameInput.value.trim().length < 2) {
        showError('client-name', 'Please enter your full name (at least 2 characters).');
        isValid = false;
      } else {
        clearError('client-name');
      }

      // Validate Email
      const emailInput = document.getElementById('client-email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
        showError('client-email', 'Please provide a valid email address.');
        isValid = false;
      } else {
        clearError('client-email');
      }

      // Validate Session Type
      const typeSelect = document.getElementById('session-type');
      if (!typeSelect || !typeSelect.value) {
        showError('session-type', 'Please select a session type.');
        isValid = false;
      } else {
        clearError('session-type');
      }

      // Validate Session Date
      if (!dateInput || !dateInput.value) {
        showError('session-date', 'Please choose a preferred session date.');
        isValid = false;
      } else {
        clearError('session-date');
      }

      // Validate Demo Consent Checkbox
      const consentBox = document.getElementById('demo-consent');
      if (!consentBox || !consentBox.checked) {
        showError('demo-consent', 'You must acknowledge that this is an illustrative demo form.');
        isValid = false;
      } else {
        clearError('demo-consent');
      }

      if (isValid) {
        // Collect submitted data for friendly confirmation summary
        const clientName = nameInput.value.trim();
        const clientEmail = emailInput.value.trim();
        const sessionTypeName = typeSelect.options[typeSelect.selectedIndex].text;
        const sessionDate = dateInput.value;
        const timeOfDay = document.querySelector('input[name="preferred-time"]:checked')?.value || 'Flexible';
        const sessionFormat = document.querySelector('input[name="session-format"]:checked')?.value || 'Online Video';

        if (successDetails) {
          successDetails.innerHTML = `
            <p><strong>Client Name:</strong> ${escapeHTML(clientName)}</p>
            <p><strong>Contact Email:</strong> ${escapeHTML(clientEmail)}</p>
            <p><strong>Service Category:</strong> ${escapeHTML(sessionTypeName)}</p>
            <p><strong>Session Type:</strong> ${escapeHTML(sessionFormat)}</p>
            <p><strong>Preferred Timing:</strong> ${escapeHTML(sessionDate)} &bull; ${escapeHTML(timeOfDay)}</p>
            <p><strong>Time Zone:</strong> IST — India Standard Time</p>
          `;
        }

        if (successCard) {
          successCard.classList.add('visible');
          successCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        bookingForm.reset();
      }
    });
  }

  /* --------------------------------------------------------------------------
     8. NEWSLETTER SUBSCRIPTION FORM VALIDATION (newsletter.html & footer)
     Client-side email check, interest selection, and demo notification card.
     -------------------------------------------------------------------------- */
  function setupNewsletterForms() {
    const fullNewsletterForm = document.getElementById('newsletter-full-form');
    if (fullNewsletterForm) {
      const nameInput = document.getElementById('subscriber-name');
      const emailInput = document.getElementById('subscriber-email');
      const successCard = document.getElementById('newsletter-success-card');
      const successText = document.getElementById('newsletter-success-text');

      fullNewsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Name check
        if (!nameInput || nameInput.value.trim().length < 2) {
          const err = document.getElementById('subscriber-name-error');
          if (err) {
            err.textContent = 'Please provide your first or preferred name.';
            err.classList.add('visible');
          }
          if (nameInput) nameInput.classList.add('error');
          valid = false;
        } else {
          const err = document.getElementById('subscriber-name-error');
          if (err) err.classList.remove('visible');
          if (nameInput) nameInput.classList.remove('error');
        }

        // Email check
        if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
          const err = document.getElementById('subscriber-email-error');
          if (err) {
            err.textContent = 'Please provide a valid email address.';
            err.classList.add('visible');
          }
          if (emailInput) emailInput.classList.add('error');
          valid = false;
        } else {
          const err = document.getElementById('subscriber-email-error');
          if (err) err.classList.remove('visible');
          if (emailInput) emailInput.classList.remove('error');
        }

        if (valid) {
          const subName = nameInput.value.trim();
          if (successText) {
            successText.innerHTML = `Warm welcome, <strong>${escapeHTML(subName)}</strong>! Your interest has been received. Remember: This is a frontend demo and no real emails are sent.`;
          }
          if (successCard) {
            successCard.classList.add('visible');
            successCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          fullNewsletterForm.reset();
        }
      });
    }

    // Simple inline footer or home page newsletter form
    const inlineForms = document.querySelectorAll('.newsletter-inline-form');
    inlineForms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const feedback = form.parentElement.querySelector('.newsletter-feedback');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!input || !emailRegex.test(input.value.trim())) {
          alert('Please enter a valid email address.');
          return;
        }

        if (feedback) {
          feedback.style.display = 'block';
          feedback.innerHTML = `<span style="color: var(--color-primary-dark); font-weight: 600;">✓ Thank you! (Demo mode: no actual subscription was recorded).</span>`;
        } else {
          alert('Thank you! This is a demo form, so no emails will be stored or sent.');
        }

        form.reset();
      });
    });
  }

  /* --------------------------------------------------------------------------
     HELPER: Escape HTML to avoid XSS when rendering user input dynamically
     -------------------------------------------------------------------------- */
  function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* --------------------------------------------------------------------------
     INITIALIZE ALL MODULES
     -------------------------------------------------------------------------- */
  setupActiveNavLinks();
  setupHeaderScroll();
  setupMobileMenu();
  setupBackToTop();
  setupFaqAccordion();
  setupBlogFeatures();
  setupBookingForm();
  setupNewsletterForms();
});
