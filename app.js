// PIEL CANELA BRONZE - CORE APPLICATION JAVASCRIPT

// FAQ Accordion logic is registered programmatically inside the DOMContentLoaded listener.

document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.innerWidth <= 768;
    // ----------------------------------------------------
    // 1. PRELOADER & INITIAL LOAD
    // ----------------------------------------------------
    const preloader = document.getElementById('preloader');
    
    // Hide preloader with luxury animation almost immediately on DOMContentLoaded for instant interactive mobile viewport scaling
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('preloader-hidden');
            document.body.classList.remove('loading-state');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 800); // Wait for transition opacity 0.8s to finish
        }, 300); // Short delay to appreciate the entry logo animation
    }

    // ----------------------------------------------------
    // 2. INTERACTIVE PARTICLE CANVAS (GOLD DUST BACKGROUND)
    // ----------------------------------------------------
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        if (isMobile) {
            canvas.style.display = 'none';
        } else {
            const ctx = canvas.getContext('2d');
            let particles = [];
            const particleCount = 60;
            let mouse = { x: null, y: null, radius: 120 };

            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);

            // Track mouse coordinates
            window.addEventListener('mousemove', (e) => {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
            });

            window.addEventListener('mouseout', () => {
                mouse.x = null;
                mouse.y = null;
            });

            // Particle constructor
            class Particle {
                constructor() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.vx = (Math.random() - 0.5) * 0.4;
                    this.vy = (Math.random() - 0.5) * 0.4 - 0.2; // Drift slowly upwards
                    this.size = Math.random() * 1.8 + 0.6;
                    this.alpha = Math.random() * 0.5 + 0.2;
                }

                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(232, 197, 149, ${this.alpha})`;
                    ctx.fill();
                }

                update() {
                    // Standard drift
                    this.x += this.vx;
                    this.y += this.vy;

                    // Re-wrap when out of screen bounds
                    if (this.x < 0) this.x = canvas.width;
                    if (this.x > canvas.width) this.x = 0;
                    if (this.y < 0) this.y = canvas.height;
                    if (this.y > canvas.height) this.y = 0;

                    // Mouse repelling force
                    if (mouse.x !== null && mouse.y !== null) {
                        const dx = this.x - mouse.x;
                        const dy = this.y - mouse.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < mouse.radius) {
                            const force = (mouse.radius - distance) / mouse.radius;
                            // Move away from mouse
                            this.x += (dx / distance) * force * 2;
                            this.y += (dy / distance) * force * 2;
                        }
                    }
                }
            }

            // Initialize particles
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }

            // Animation loop
            function animateParticles() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                particles.forEach(p => {
                    p.update();
                    p.draw();
                });
                
                requestAnimationFrame(animateParticles);
            }
            animateParticles();
        }
    }

    // ----------------------------------------------------
    // 3. MOTION EFFECTS: 3D CARD TILT & MAGNETIC BUTTONS
    // ----------------------------------------------------
    
    // Apply 3D Tilt effect to selector card-tilt elements (desktop only)
    if (!isMobile) {
        const tiltElements = document.querySelectorAll('.card-tilt');
        tiltElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Limit tilt angle (max 8 degrees)
                const rotateX = -((y - centerY) / centerY) * 8;
                const rotateY = ((x - centerX) / centerX) * 8;
                
                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
            });
        });

        // Magnetic Buttons hover mechanics
        const magneticBtns = document.querySelectorAll('.magnetic-btn');
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                // Mouse distance from button center
                const x = e.clientX - (rect.left + rect.width / 2);
                const y = e.clientY - (rect.top + rect.height / 2);
                
                // Pull button slightly (up to 12px)
                btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px) scale(1.05)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0px, 0px) scale(1)';
            });
        });
    }

    // ----------------------------------------------------
    // 4. NAVIGATION, TABS & SERVICE SEARCH FILTERING
    // ----------------------------------------------------
    const catNavItems = document.querySelectorAll('.category-btn');
    const headerNavLinks = document.querySelectorAll('.header-nav-link');
    const sections = document.querySelectorAll('.catalog-section');

    function selectCategory(targetCat) {
        // Update sidebar buttons active states
        catNavItems.forEach(btn => {
            if (btn.getAttribute('data-category') === targetCat) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update header navbar links active states
        headerNavLinks.forEach(link => {
            if (link.getAttribute('data-category') === targetCat) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Toggle visible sections
        sections.forEach(sec => {
            if (sec.id === `section-${targetCat}`) {
                sec.classList.remove('hidden');
            } else {
                sec.classList.add('hidden');
            }
        });
    }

    // Sidebar buttons click handler
    catNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetCat = item.getAttribute('data-category');
            selectCategory(targetCat);
        });
    });

    // Top header nav links click handler
    headerNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetCat = link.getAttribute('data-category');
            selectCategory(targetCat);
            
            // Smooth scroll to target category section in catalog
            const targetSection = document.getElementById(`section-${targetCat}`);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Unified Search Functionality
    const searchInputDesktop = document.getElementById('search-services');
    const searchInputMobile = document.getElementById('search-services-mobile');

    function filterServices(query) {
        const cleanQuery = query.toLowerCase().trim();
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            const name = card.getAttribute('data-name');
            const desc = card.getAttribute('data-desc');
            
            if (name.includes(cleanQuery) || desc.includes(cleanQuery)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });

        // If query is present, show all sections and search results across categories
        if (cleanQuery.length > 0) {
            sections.forEach(sec => sec.classList.remove('hidden'));
        } else {
            // Revert back to active category tab if search empty
            const activeTab = document.querySelector('.category-btn.active').getAttribute('data-category');
            sections.forEach(sec => {
                if (sec.id === `section-${activeTab}`) {
                    sec.classList.remove('hidden');
                } else {
                    sec.classList.add('hidden');
                }
            });
        }
    }

    searchInputDesktop.addEventListener('input', (e) => {
        filterServices(e.target.value);
        if (searchInputMobile) searchInputMobile.value = e.target.value;
    });

    if (searchInputMobile) {
        searchInputMobile.addEventListener('input', (e) => {
            filterServices(e.target.value);
            searchInputDesktop.value = e.target.value;
        });
    }

    // ----------------------------------------------------
    // 5. GALLERY SLIDER CAROUSEL (NATIVE SCROLL SNAP + DOTS)
    // ----------------------------------------------------
    const galleryViewport = document.querySelector('.gallery-viewport');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');
    const galleryDots = document.querySelectorAll('.gallery-dot');

    if (galleryViewport) {
        // Sync active dot on scroll
        galleryViewport.addEventListener('scroll', () => {
            const slideWidth = galleryViewport.clientWidth;
            const scrollLeft = galleryViewport.scrollLeft;
            const activeIndex = Math.round(scrollLeft / slideWidth);
            
            galleryDots.forEach((dot, idx) => {
                if (idx === activeIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }, { passive: true });

        // Tapping a dot scrolls directly to that slide
        galleryDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const targetIndex = parseInt(dot.getAttribute('data-index'), 10);
                const slideWidth = galleryViewport.clientWidth;
                
                galleryViewport.scrollTo({
                    left: targetIndex * slideWidth,
                    behavior: 'smooth'
                });
            });
        });
    }

    if (prevBtn && galleryViewport) {
        prevBtn.addEventListener('click', () => {
            galleryViewport.scrollBy({ left: -galleryViewport.clientWidth, behavior: 'smooth' });
        });
    }
    if (nextBtn && galleryViewport) {
        nextBtn.addEventListener('click', () => {
            galleryViewport.scrollBy({ left: galleryViewport.clientWidth, behavior: 'smooth' });
        });
    }

    // Auto rotate every 8 seconds on desktop only
    if (!isMobile && galleryViewport) {
        setInterval(() => {
            if (galleryViewport.scrollLeft + galleryViewport.clientWidth >= galleryViewport.scrollWidth - 10) {
                galleryViewport.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                galleryViewport.scrollBy({ left: galleryViewport.clientWidth, behavior: 'smooth' });
            }
        }, 8000);
    }

    // ----------------------------------------------------
    // 6. REAL TIME SALON HOURS OPEN STATUS
    // ----------------------------------------------------
    function updateOpeningStatus() {
        const statusEl = document.getElementById('opening-status');
        const now = new Date();
        const day = now.getDay(); // 0 = Sun, 1 = Mon, ...
        const hour = now.getHours();
        const min = now.getMinutes();
        const currentTimeInMinutes = hour * 60 + min;

        let isOpen = false;
        let closingTime = "";

        // Checking hours rules
        if (day >= 1 && day <= 5) { // Mon-Fri
            const morningStart = 10 * 60; // 10:00
            const morningEnd = 15 * 60;   // 15:00
            
            let afternoonStart = 16 * 60; // 16:00
            let afternoonEnd = 20 * 60;   // 20:00 (Tuesday/Friday default)
            
            // Mon, Wed, Thu closes at 20:30
            if (day === 1 || day === 3 || day === 4) {
                afternoonEnd = 20 * 60 + 30; // 20:30
            }

            if (currentTimeInMinutes >= morningStart && currentTimeInMinutes < morningEnd) {
                isOpen = true;
                closingTime = "15:00";
            } else if (currentTimeInMinutes >= afternoonStart && currentTimeInMinutes < afternoonEnd) {
                isOpen = true;
                closingTime = day === 1 || day === 3 || day === 4 ? "20:30" : "20:00";
            }
        } else if (day === 6) { // Sat
            const start = 10 * 60;
            const end = 14 * 60;
            if (currentTimeInMinutes >= start && currentTimeInMinutes < end) {
                isOpen = true;
                closingTime = "14:00";
            }
        }

        if (isOpen) {
            statusEl.textContent = `Abierto ahora (cierra a las ${closingTime})`;
            statusEl.classList.remove('closed');
            statusEl.classList.add('open');
        } else {
            statusEl.textContent = "Cerrado actualmente";
            statusEl.classList.remove('open');
            statusEl.classList.add('closed');
        }
    }
    updateOpeningStatus();
    // Update every minute
    setInterval(updateOpeningStatus, 60000);

    // Dynamic Opening Hours Day Highlighting
    function highlightCurrentDay() {
        const currentDay = new Date().getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
        
        // Remove active class, ping dot and custom styles from all days first
        const dayRows = document.querySelectorAll('.hours-list li');
        dayRows.forEach(row => {
            row.classList.remove('current-day-row');
            const dot = row.querySelector('.ping-dot');
            if (dot) dot.remove();
            
            const dayName = row.querySelector('.day-name');
            const hoursVal = row.querySelector('.hours-val');
            // Do not strip classes from Saturday (data-day="6") as they are hardcoded custom styles (font-bold text-gold)
            if (row.getAttribute('data-day') !== "6") {
                if (dayName) dayName.classList.remove('font-bold');
                if (hoursVal) hoursVal.classList.remove('font-bold');
            }
        });

        // Add class and ping dot to current day
        const activeRow = document.querySelector(`.hours-list li[data-day="${currentDay}"]`);
        if (activeRow) {
            activeRow.classList.add('current-day-row');
            const dayName = activeRow.querySelector('.day-name');
            const hoursVal = activeRow.querySelector('.hours-val');
            
            if (dayName) {
                dayName.classList.add('font-bold');
                // Create and insert ping dot
                if (!dayName.querySelector('.ping-dot')) {
                    const dot = document.createElement('span');
                    dot.className = 'ping-dot';
                    dayName.insertBefore(dot, dayName.firstChild);
                }
            }
            if (hoursVal) {
                hoursVal.classList.add('font-bold');
            }
        }
    }
    highlightCurrentDay();

    // FAQ Accordion programmatic tap/click handlers
    const faqButtons = document.querySelectorAll('.faq-question-btn');
    faqButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const item = button.closest('.faq-item');
            if (!item) return;

            if (item.classList.contains('active')) {
                item.classList.remove('active');
            } else {
                // Close other items
                document.querySelectorAll('.faq-item').forEach(el => {
                    el.classList.remove('active');
                });
                item.classList.add('active');
            }
        });
    });

    // Service Accordion programmatic tap/click handlers
    const serviceCardHeaders = document.querySelectorAll('.service-card-header');
    serviceCardHeaders.forEach(header => {
        header.addEventListener('click', (e) => {
            e.preventDefault();
            const card = header.closest('.service-card');
            if (!card) return;

            const section = card.closest('.catalog-section');
            const isActive = card.classList.contains('active');

            if (isActive) {
                card.classList.remove('active');
            } else {
                // Close other cards in the SAME section to maintain order
                if (section) {
                    section.querySelectorAll('.service-card').forEach(el => {
                        el.classList.remove('active');
                    });
                }
                card.classList.add('active');
                
                // Smoothly scroll the card into view if it goes off screen on mobile
                setTimeout(() => {
                    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 350);
            }
        });
    });

    // ----------------------------------------------------
    // 7. BOOKING SYSTEM LOGIC (MODAL STATE MACHINE)
    // ----------------------------------------------------
    const bookingModal = document.getElementById('booking-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContainer = document.getElementById('modal-container');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalTitleService = document.getElementById('modal-title-service');
    const modalBackBtn = document.getElementById('modal-back-btn');
    const modalNextBtn = document.getElementById('modal-next-btn');

    // Steps containers
    const step1 = document.getElementById('booking-step-1');
    const step2 = document.getElementById('booking-step-2');
    const step3 = document.getElementById('booking-step-3');
    const step4 = document.getElementById('booking-step-4');

    // Indicators
    const ind1 = document.getElementById('step-indicator-1');
    const ind2 = document.getElementById('step-indicator-2');
    const ind3 = document.getElementById('step-indicator-3');

    let currentStep = 1;
    let selectedService = { id: '', name: '', price: '', duration: '' };
    let bookingData = { specialist: 'cualquiera', date: '', time: '', name: '', phone: '', email: '', notes: '' };

    // Calendar variables
    const calendarMonthYear = document.getElementById('calendar-month-year');
    const calendarDays = document.getElementById('calendar-days');
    const timeSlotsContainer = document.getElementById('time-slots-container');
    const noSlotsMessage = document.getElementById('no-slots-message');
    const prevMonthBtn = document.getElementById('calendar-prev-month');
    const nextMonthBtn = document.getElementById('calendar-next-month');
    
    let calendarDate = new Date();
    let currentSelectedDate = null; // Stored as ISO string or Date

    // Open booking modal when "Reservar" clicked
    function initBookingTrigger() {
        const bookBtns = document.querySelectorAll('.book-service-btn');
        bookBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                selectedService.id = btn.getAttribute('data-service-id');
                selectedService.name = btn.getAttribute('data-service-name');
                selectedService.price = btn.getAttribute('data-service-price');
                selectedService.duration = btn.getAttribute('data-service-duration');
                
                openBookingFlow();
            });
        });
    }
    initBookingTrigger();

    // Hero CTA trigger (defaults to Bronceado Sencillo)
    document.getElementById('hero-cta-btn').addEventListener('click', () => {
        selectedService = { id: 'bronceado-sencillo', name: 'Bronceado sencillo', price: '50.00', duration: '45 min' };
        openBookingFlow();
    });

    function openBookingFlow() {
        modalTitleService.textContent = selectedService.name;
        currentStep = 1;
        updateStepUI();
        
        // Reset promo state
        appliedPromo = null;
        const promoInput = document.getElementById('client-promo-code');
        if (promoInput) promoInput.value = '';
        const errorEl = document.getElementById('promo-error');
        if (errorEl) errorEl.style.display = 'none';
        const successEl = document.getElementById('promo-success');
        if (successEl) successEl.style.display = 'none';
        
        bookingModal.classList.add('active');
        // Small timeout to allow active display before sliding animation
        setTimeout(() => {
            modalOverlay.style.opacity = '1';
            modalContainer.style.transform = 'translate(0)';
        }, 50);
    }

    function closeBookingFlow() {
        modalOverlay.style.opacity = '0';
        modalContainer.style.transform = window.innerWidth >= 640 ? 'translateX(100%)' : 'translateY(100%)';
        setTimeout(() => {
            bookingModal.classList.remove('active');
        }, 300);
    }

    closeModalBtn.addEventListener('click', closeBookingFlow);
    modalOverlay.addEventListener('click', closeBookingFlow);

    // STEP 1: Specialist Selection listener
    const specialistItems = document.querySelectorAll('.specialist-item');
    specialistItems.forEach(item => {
        item.addEventListener('click', () => {
            specialistItems.forEach(el => {
                el.classList.remove('active');
                el.querySelector('.specialist-check').textContent = 'radio_button_unchecked';
                el.querySelector('.specialist-check').classList.replace('text-gold', 'text-muted');
            });
            item.classList.add('active');
            item.querySelector('.specialist-check').textContent = 'radio_button_checked';
            item.querySelector('.specialist-check').classList.replace('text-muted', 'text-gold');
            
            bookingData.specialist = item.getAttribute('data-specialist');
        });
    });

    // Step navigation controller
    modalNextBtn.addEventListener('click', () => {
        if (currentStep === 1) {
            currentStep = 2;
            renderCalendar();
            updateStepUI();
        } else if (currentStep === 2) {
            if (!bookingData.date || !bookingData.time) {
                alert('Por favor, selecciona una fecha y hora.');
                return;
            }
            currentStep = 3;
            updateStepUI();
        } else if (currentStep === 3) {
            const clientName = document.getElementById('client-name').value.trim();
            const clientPhone = document.getElementById('client-phone').value.trim();
            const clientEmail = document.getElementById('client-email').value.trim();
            
            if (!clientName || !clientPhone || !clientEmail) {
                alert('Por favor, rellena todos los campos obligatorios (*).');
                return;
            }
            
            bookingData.name = clientName;
            bookingData.phone = clientPhone;
            bookingData.email = clientEmail;
            bookingData.notes = document.getElementById('client-notes').value.trim();
            
            // Submit booking
            saveBookingToLocalStorage();
            
            currentStep = 4;
            updateStepUI();
        } else if (currentStep === 4) {
            // Close modal and reset
            closeBookingFlow();
            document.getElementById('booking-form').reset();
        }
    });

    modalBackBtn.addEventListener('click', () => {
        if (currentStep > 1 && currentStep <= 3) {
            currentStep--;
            updateStepUI();
        }
    });

    function updateStepUI() {
        // Hide all steps
        step1.classList.remove('active');
        step2.classList.remove('active');
        step3.classList.remove('active');
        step4.classList.remove('active');
        
        // Remove active indicators
        ind1.classList.remove('active');
        ind2.classList.remove('active');
        ind3.classList.remove('active');

        modalBackBtn.classList.add('hidden');
        modalNextBtn.classList.remove('hidden');
        modalNextBtn.textContent = 'Siguiente';

        if (currentStep === 1) {
            step1.classList.add('active');
            ind1.classList.add('active');
        } else if (currentStep === 2) {
            step2.classList.add('active');
            ind2.classList.add('active');
            modalBackBtn.classList.remove('hidden');
        } else if (currentStep === 3) {
            step3.classList.add('active');
            ind3.classList.add('active');
            modalBackBtn.classList.remove('hidden');
            modalNextBtn.textContent = 'Confirmar Reserva';
            updatePricePreview();
        } else if (currentStep === 4) {
            step4.classList.add('active');
            modalNextBtn.textContent = 'Entendido';
            
            // Fill summaries
            document.getElementById('summary-service').textContent = selectedService.name;
            document.getElementById('summary-date').textContent = new Date(bookingData.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            document.getElementById('summary-time').textContent = bookingData.time;
            document.getElementById('summary-specialist').textContent = bookingData.specialist === 'cualquiera' ? 'Cualquier profesional' : bookingData.specialist;
            
            const finalPriceInfo = calculateFinalPrice();
            const summaryPriceEl = document.getElementById('summary-price');
            if (summaryPriceEl) {
                if (finalPriceInfo.discount > 0) {
                    summaryPriceEl.innerHTML = `<span style="text-decoration: line-through; color: var(--color-text-muted); font-size: 0.85em; margin-right: 8px;">${parseFloat(selectedService.price).toFixed(2)} €</span><span>${finalPriceInfo.finalPrice.toFixed(2)} €</span>`;
                } else {
                    summaryPriceEl.textContent = `${parseFloat(selectedService.price).toFixed(2)} €`;
                }
            }
            
            updateCalendarLinks();
        }
    }

    // ----------------------------------------------------
    // PROMO CODES & CALENDAR SYNCHRONIZATION HELPERS
    // ----------------------------------------------------
    let appliedPromo = null;

    // Initialize default promo codes if not present
    function initDefaultPromos() {
        if (!localStorage.getItem('piel_canela_promos')) {
            const defaultPromos = [
                { code: 'PIELCANELA10', type: 'percentage', value: 10, active: true },
                { code: 'BIENVENIDA5', type: 'fixed', value: 5, active: true }
            ];
            localStorage.setItem('piel_canela_promos', JSON.stringify(defaultPromos));
        }
    }
    initDefaultPromos();

    function calculateFinalPrice() {
        const basePrice = parseFloat(selectedService.price) || 0;
        if (!appliedPromo) {
            return { finalPrice: basePrice, discount: 0 };
        }
        let discount = 0;
        if (appliedPromo.type === 'percentage') {
            discount = basePrice * (parseFloat(appliedPromo.value) / 100);
        } else if (appliedPromo.type === 'fixed') {
            discount = parseFloat(appliedPromo.value);
        }
        // Don't let discount exceed price
        discount = Math.min(discount, basePrice);
        const finalPrice = Math.max(0, basePrice - discount);
        return { finalPrice, discount };
    }

    function updatePricePreview() {
        const basePrice = parseFloat(selectedService.price) || 0;
        const { finalPrice, discount } = calculateFinalPrice();
        
        const originalPricePreview = document.getElementById('booking-original-price-preview');
        const pricePreview = document.getElementById('booking-price-preview');
        
        if (pricePreview) {
            pricePreview.textContent = `${finalPrice.toFixed(2)} €`;
        }
        
        if (originalPricePreview) {
            if (discount > 0) {
                originalPricePreview.textContent = `${basePrice.toFixed(2)} €`;
                originalPricePreview.style.display = 'inline';
            } else {
                originalPricePreview.style.display = 'none';
            }
        }
    }

    // Hook up apply promo button
    const btnApplyPromo = document.getElementById('btn-apply-promo');
    if (btnApplyPromo) {
        btnApplyPromo.addEventListener('click', () => {
            const codeInput = document.getElementById('client-promo-code').value.trim().toUpperCase();
            const errorEl = document.getElementById('promo-error');
            const successEl = document.getElementById('promo-success');
            
            errorEl.style.display = 'none';
            successEl.style.display = 'none';
            
            if (!codeInput) {
                errorEl.textContent = 'Por favor, ingresa un código.';
                errorEl.style.display = 'block';
                return;
            }
            
            const promos = JSON.parse(localStorage.getItem('piel_canela_promos')) || [];
            const foundPromo = promos.find(p => p.code.toUpperCase() === codeInput);
            
            if (!foundPromo) {
                errorEl.textContent = 'Código no válido.';
                errorEl.style.display = 'block';
                appliedPromo = null;
                updatePricePreview();
                return;
            }
            
            if (!foundPromo.active) {
                errorEl.textContent = 'Este código ha expirado.';
                errorEl.style.display = 'block';
                appliedPromo = null;
                updatePricePreview();
                return;
            }
            
            appliedPromo = foundPromo;
            
            let descText = '';
            if (foundPromo.type === 'percentage') {
                descText = `${foundPromo.value}% de descuento`;
            } else {
                descText = `${foundPromo.value} € de descuento`;
            }
            
            successEl.textContent = `¡Código aplicado! ${descText}`;
            successEl.style.display = 'block';
            updatePricePreview();
        });
    }

    function updateCalendarLinks() {
        const startDate = new Date(bookingData.date + 'T' + bookingData.time + ':00');
        let durationMins = 45;
        if (selectedService.duration.includes('h')) {
            durationMins = 60;
        } else {
            const match = selectedService.duration.match(/(\d+)\s*min/);
            if (match) durationMins = parseInt(match[1]);
        }
        const endDate = new Date(startDate.getTime() + durationMins * 60 * 1000);
        
        const pad = (n) => String(n).padStart(2, '0');
        const formatGoogleDate = (date) => {
            return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
        };
        
        const dates = `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`;
        const text = encodeURIComponent(`Cita PIEL CANELA: ${selectedService.name}`);
        
        const finalPriceInfo = calculateFinalPrice();
        const priceStr = finalPriceInfo.finalPrice.toFixed(2);
        
        const details = encodeURIComponent(`Hola ${bookingData.name},\nTu cita de bronceado está confirmada.\n\nEspecialista: ${bookingData.specialist === 'cualquiera' ? 'Cualquiera' : bookingData.specialist}\nPrecio: ${priceStr} €\nNotas: ${bookingData.notes || 'Ninguna'}`);
        const location = encodeURIComponent(`Calle Luis de Morales, 32 (Edif. Fórum), Local 9, Sevilla`);
        
        const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
        
        const googleCalBtn = document.getElementById('btn-add-google-cal');
        if (googleCalBtn) {
            googleCalBtn.setAttribute('href', googleCalUrl);
        }
    }

    function downloadICS() {
        const startDate = new Date(bookingData.date + 'T' + bookingData.time + ':00');
        let durationMins = 45;
        if (selectedService.duration.includes('h')) {
            durationMins = 60;
        } else {
            const match = selectedService.duration.match(/(\d+)\s*min/);
            if (match) durationMins = parseInt(match[1]);
        }
        const endDate = new Date(startDate.getTime() + durationMins * 60 * 1000);
        
        const pad = (n) => String(n).padStart(2, '0');
        const formatICSDate = (date) => {
            return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
        };
        
        const dtstamp = formatICSDate(new Date());
        const dtstart = formatICSDate(startDate);
        const dtend = formatICSDate(endDate);
        
        const finalPriceInfo = calculateFinalPrice();
        const priceStr = finalPriceInfo.finalPrice.toFixed(2);
        
        const summary = `Cita PIEL CANELA: ${selectedService.name}`;
        const description = `Hola ${bookingData.name},\\nTu cita de bronceado está confirmada.\\n\\nEspecialista: ${bookingData.specialist === 'cualquiera' ? 'Cualquiera' : bookingData.specialist}\\nPrecio: ${priceStr} €\\nNotas: ${bookingData.notes || 'Ninguna'}`;
        const location = `Calle Luis de Morales, 32 (Edif. Fórum), Local 9, Sevilla`;
        
        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Piel Canela Bronze//NONSGML Cita//ES',
            'BEGIN:VEVENT',
            `UID:BK-${Date.now()}@pielcanelabronze.com`,
            `DTSTAMP:${dtstamp}`,
            `DTSTART:${dtstart}`,
            `DTEND:${dtend}`,
            `SUMMARY:${summary}`,
            `DESCRIPTION:${description}`,
            `LOCATION:${location}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');
        
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `cita-pielcanela-${bookingData.date}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const btnDownloadIcs = document.getElementById('btn-download-ics');
    if (btnDownloadIcs) {
        btnDownloadIcs.addEventListener('click', downloadICS);
    }

    // CALENDAR DRAW ENGINE
    const monthsSpanish = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    function renderCalendar() {
        calendarMonthYear.textContent = `${monthsSpanish[calendarDate.getMonth()]} ${calendarDate.getFullYear()}`;
        calendarDays.innerHTML = '';
        
        const firstDayIndex = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay();
        // Convert JS Sunday (0) to European Sunday (6)
        const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
        
        const lastDay = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate();
        const prevLastDay = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 0).getDate();
        
        const today = new Date();
        
        // Blank previous month days offset
        for (let i = startOffset; i > 0; i--) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('calendar-day-btn', 'disabled');
            dayDiv.textContent = prevLastDay - i + 1;
            calendarDays.appendChild(dayDiv);
        }

        // Active month days
        for (let i = 1; i <= lastDay; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('calendar-day-btn');
            dayDiv.textContent = i;
            
            const thisDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), i);
            const isSunday = thisDate.getDay() === 0;
            const isPast = thisDate.setHours(0,0,0,0) < today.setHours(0,0,0,0);
            
            if (isSunday || isPast) {
                dayDiv.classList.add('disabled');
            } else {
                dayDiv.addEventListener('click', () => {
                    document.querySelectorAll('.calendar-day-btn.selected').forEach(el => el.classList.remove('selected'));
                    dayDiv.classList.add('selected');
                    
                    bookingData.date = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), i).toISOString().split('T')[0];
                    currentSelectedDate = thisDate;
                    
                    generateTimeSlots(thisDate);
                });

                // Re-select if matches currently stored date
                if (bookingData.date === thisDate.toISOString().split('T')[0]) {
                    dayDiv.classList.add('selected');
                }
            }

            // Mark today
            if (i === today.getDate() && calendarDate.getMonth() === today.getMonth() && calendarDate.getFullYear() === today.getFullYear()) {
                dayDiv.classList.add('today');
            }

            calendarDays.appendChild(dayDiv);
        }

        // Clear time slots when re-rendering month
        timeSlotsContainer.innerHTML = '';
        noSlotsMessage.style.display = 'block';
    }

    prevMonthBtn.addEventListener('click', () => {
        calendarDate.setMonth(calendarDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        calendarDate.setMonth(calendarDate.getMonth() + 1);
        renderCalendar();
    });

    // GENERATE TURN SLOTS BASED ON SALON HOURS
    function generateTimeSlots(date) {
        timeSlotsContainer.innerHTML = '';
        noSlotsMessage.style.display = 'none';

        const dayOfWeek = date.getDay(); // 0 = Sun, 1 = Mon, ...
        let slots = [];

        // Rules mapping
        // Mon (1), Wed (3), Thu (4): 10:00 - 15:00 and 16:00 - 20:30
        // Tue (2), Fri (5): 10:00 - 15:00 and 16:00 - 20:00
        // Sat (6): 10:00 - 14:00
        if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 4) {
            slots = ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"];
        } else if (dayOfWeek === 2 || dayOfWeek === 5) {
            slots = ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"];
        } else if (dayOfWeek === 6) {
            slots = ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30"];
        }

        // If selecting today, filter out past slots
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            const currentMin = today.getHours() * 60 + today.getMinutes();
            slots = slots.filter(slot => {
                const parts = slot.split(':');
                const slotMin = parseInt(parts[0]) * 60 + parseInt(parts[1]);
                return slotMin > currentMin + 30; // 30 minutes margin
            });
        }

        if (slots.length === 0) {
            noSlotsMessage.style.display = 'block';
            return;
        }

        slots.forEach(slot => {
            const slotPill = document.createElement('div');
            slotPill.classList.add('time-slot-pill');
            slotPill.textContent = slot;

            if (bookingData.time === slot) {
                slotPill.classList.add('selected');
            }

            slotPill.addEventListener('click', () => {
                document.querySelectorAll('.time-slot-pill.selected').forEach(el => el.classList.remove('selected'));
                slotPill.classList.add('selected');
                bookingData.time = slot;
            });

            timeSlotsContainer.appendChild(slotPill);
        });
    }

    // ----------------------------------------------------
    // 8. PERSIST BOOKINGS IN LOCAL STORAGE & MY APPOINTMENTS DRAWER
    // ----------------------------------------------------
    const appointmentsDrawer = document.getElementById('appointments-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerContainer = document.getElementById('drawer-container');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    const bookingsTrigger = document.getElementById('bookings-trigger');
    const bookingBadge = document.getElementById('booking-badge');
    const mobileBookingBadge = document.getElementById('mobile-booking-badge');
    const appointmentsList = document.getElementById('drawer-appointments-list');
    const emptyState = document.getElementById('drawer-empty-state');

    function saveBookingToLocalStorage() {
        let currentBookings = JSON.parse(localStorage.getItem('piel_canela_bookings')) || [];
        const finalPriceInfo = calculateFinalPrice();
        const newBooking = {
            id: 'BK-' + Date.now(),
            service: {
                id: selectedService.id,
                name: selectedService.name,
                price: finalPriceInfo.finalPrice.toFixed(2),
                duration: selectedService.duration
            },
            specialist: bookingData.specialist,
            date: bookingData.date,
            time: bookingData.time,
            clientName: bookingData.name,
            clientPhone: bookingData.phone,
            clientEmail: bookingData.email,
            clientNotes: bookingData.notes,
            promoApplied: appliedPromo ? appliedPromo.code : null,
            discountAmount: finalPriceInfo.discount.toFixed(2),
            status: 'pendiente'
        };
        
        currentBookings.push(newBooking);
        localStorage.setItem('piel_canela_bookings', JSON.stringify(currentBookings));
        
        updateBookingsBadge();
        renderBookingsInDrawer();
    }

    function deleteBooking(id) {
        let currentBookings = JSON.parse(localStorage.getItem('piel_canela_bookings')) || [];
        currentBookings = currentBookings.filter(b => b.id !== id);
        localStorage.setItem('piel_canela_bookings', JSON.stringify(currentBookings));
        
        updateBookingsBadge();
        renderBookingsInDrawer();
    }

    function updateBookingsBadge() {
        const bookings = JSON.parse(localStorage.getItem('piel_canela_bookings')) || [];
        
        // Desktop badge
        if (bookingBadge) {
            if (bookings.length > 0) {
                bookingBadge.textContent = bookings.length;
                bookingBadge.style.display = 'flex';
            } else {
                bookingBadge.style.display = 'none';
            }
        }
        
        // Mobile badge
        if (mobileBookingBadge) {
            if (bookings.length > 0) {
                mobileBookingBadge.textContent = bookings.length;
                mobileBookingBadge.style.display = 'flex';
            } else {
                mobileBookingBadge.style.display = 'none';
            }
        }
    }
    updateBookingsBadge();

    function renderBookingsInDrawer() {
        const bookings = JSON.parse(localStorage.getItem('piel_canela_bookings')) || [];
        appointmentsList.innerHTML = '';
        
        if (bookings.length === 0) {
            emptyState.style.display = 'flex';
            return;
        }
        
        emptyState.style.display = 'none';
        
        // Render from newest to oldest
        bookings.slice().reverse().forEach(booking => {
            const card = document.createElement('div');
            card.className = 'drawer-appointment-item';
            
            const dateObj = new Date(booking.date);
            const dateStr = dateObj.toLocaleDateString('es-ES', { weekday: 'short', month: 'short', day: 'numeric' });
            
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-right: 24px;">
                    <span class="drawer-apt-title">${booking.service.name}</span>
                    <span class="drawer-apt-price">${booking.service.price} €</span>
                </div>
                <div class="drawer-apt-meta">
                    <p><span class="material-symbols-outlined">calendar_month</span> ${dateStr} a las ${booking.time} (${booking.service.duration})</p>
                    <p><span class="material-symbols-outlined">person</span> Especialista: ${booking.specialist === 'cualquiera' ? 'Cualquiera' : booking.specialist}</p>
                </div>
                <button class="btn-cancel-apt delete-booking-btn" data-id="${booking.id}">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            `;
            
            appointmentsList.appendChild(card);
        });

        // Add delete listeners
        document.querySelectorAll('.delete-booking-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (confirm('¿Estás segura de que deseas cancelar esta cita?')) {
                    deleteBooking(id);
                }
            });
        });
    }

    // Drawer state controls
    function openDrawer() {
        renderBookingsInDrawer();
        appointmentsDrawer.classList.add('active');
        setTimeout(() => {
            drawerOverlay.style.opacity = '1';
            drawerContainer.style.transform = 'translateX(0)';
        }, 50);
    }

    function closeDrawer() {
        drawerOverlay.style.opacity = '0';
        drawerContainer.style.transform = 'translateX(100%)';
        setTimeout(() => {
            appointmentsDrawer.classList.remove('active');
        }, 300);
    }

    if (bookingsTrigger) {
        bookingsTrigger.addEventListener('click', openDrawer);
    }
    if (closeDrawerBtn) {
        closeDrawerBtn.addEventListener('click', closeDrawer);
    }
    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', closeDrawer);
    }

    // Mobile menu drawer elements
    const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
    const menuDrawerOverlay = document.getElementById('menu-drawer-overlay');
    const menuDrawerContainer = document.getElementById('menu-drawer-container');
    const closeMenuDrawerBtn = document.getElementById('close-menu-drawer-btn');
    const mobileMenuTrigger = document.getElementById('mobile-menu-trigger');
    const mobileDrawerNavLinks = document.querySelectorAll('.mobile-drawer-nav-link[data-category]');
    const mobileAboutUsLink = document.getElementById('mobile-about-us-link');
    const mobileBookingsTrigger = document.getElementById('mobile-bookings-trigger');

    function openMenuDrawer() {
        if (mobileMenuDrawer) {
            mobileMenuDrawer.classList.add('active');
            setTimeout(() => {
                if (menuDrawerOverlay) menuDrawerOverlay.style.opacity = '1';
                if (menuDrawerContainer) menuDrawerContainer.style.transform = 'translateX(0)';
            }, 50);
        }
    }

    function closeMenuDrawer() {
        if (mobileMenuDrawer) {
            if (menuDrawerOverlay) menuDrawerOverlay.style.opacity = '0';
            if (menuDrawerContainer) {
                menuDrawerContainer.style.transform = 'translateX(-100%)';
            }
            setTimeout(() => {
                mobileMenuDrawer.classList.remove('active');
            }, 300);
        }
    }

    if (mobileMenuTrigger) {
        mobileMenuTrigger.addEventListener('click', openMenuDrawer);
    }
    if (closeMenuDrawerBtn) {
        closeMenuDrawerBtn.addEventListener('click', closeMenuDrawer);
    }
    if (menuDrawerOverlay) {
        menuDrawerOverlay.addEventListener('click', closeMenuDrawer);
    }

    mobileDrawerNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            const category = link.getAttribute('data-category');
            selectCategory(category);
            closeMenuDrawer();
            
            // Scroll to the selected section
            const targetSection = document.getElementById(`section-${category}`);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    if (mobileAboutUsLink) {
        mobileAboutUsLink.addEventListener('click', () => {
            closeMenuDrawer();
            openAboutModal();
        });
    }

    if (mobileBookingsTrigger) {
        mobileBookingsTrigger.addEventListener('click', () => {
            closeMenuDrawer();
            openDrawer();
        });
    }


    // ----------------------------------------------------
    // 9. DYNAMIC CHATBOT LOGIC ("CANELA AI")
    // ----------------------------------------------------
    const chatbotWrapper = document.getElementById('chatbot-wrapper');
    const chatTriggerBtn = document.getElementById('chat-trigger-btn');
    const chatWindow = document.getElementById('chat-window');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatMessagesLog = document.getElementById('chat-messages-log');
    const chatInputField = document.getElementById('chat-input-field');
    const sendChatBtn = document.getElementById('send-chat-btn');
    const chatQuickReplies = document.getElementById('chat-quick-replies');

    // Bot booking variables
    let botState = {
        bookingActive: false,
        step: 0,
        service: null,
        date: null,
        time: null,
        name: null,
        phone: null
    };

    chatTriggerBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        // Clear indicator dot if clicked
        const dot = chatTriggerBtn.querySelector('.notification-dot');
        if (dot) dot.remove();
    });

    closeChatBtn.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });

    // Send chat text listener
    sendChatBtn.addEventListener('click', handleUserTextMessage);
    chatInputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserTextMessage();
    });

    function handleUserTextMessage() {
        const text = chatInputField.value.trim();
        if (!text) return;
        
        appendMessage(text, 'out');
        chatInputField.value = '';

        simulateTypingReply(() => {
            processBotReply(text);
        });
    }

    // Append Message DOM
    function appendMessage(text, direction, isHtml = false) {
        const wrap = document.createElement('div');
        
        let parsedText = isHtml ? text : escapeHTML(text);
        // Replace **text** with <strong>text</strong>
        parsedText = parsedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Replace [text](url) with <a href="url" target="_blank">text</a>
        parsedText = parsedText.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        if (direction === 'in') {
            wrap.className = 'chat-bubble-row message-in';
            // Convert newlines to <br> if not raw HTML
            if (!isHtml) {
                parsedText = parsedText.replace(/\n/g, '<br>');
            }
            wrap.innerHTML = `
                <div class="chat-avatar">C</div>
                <div class="chat-text">
                    ${parsedText}
                </div>
            `;
        } else {
            wrap.className = 'chat-bubble-row message-out';
            wrap.innerHTML = `
                <div class="chat-text">
                    ${parsedText}
                </div>
            `;
        }
        
        chatMessagesLog.appendChild(wrap);
        chatMessagesLog.scrollTop = chatMessagesLog.scrollHeight;
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    // Simulate typing micro-animation
    function simulateTypingReply(callback) {
        const typingWrap = document.createElement('div');
        typingWrap.className = 'chat-bubble-row message-in temp-typing';
        typingWrap.innerHTML = `
            <div class="chat-avatar">C</div>
            <div class="chat-text">
                <div class="typing-bubble">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            </div>
        `;
        
        chatMessagesLog.appendChild(typingWrap);
        chatMessagesLog.scrollTop = chatMessagesLog.scrollHeight;

        setTimeout(() => {
            typingWrap.remove();
            callback();
        }, 1200);
    }

    // Quick replies mapping
    chatQuickReplies.querySelectorAll('.chat-reply-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const action = pill.getAttribute('data-action');
            const label = pill.textContent;
            
            appendMessage(label, 'out');
            
            simulateTypingReply(() => {
                if (action === 'recomendar') {
                    sendRecommendationOptions();
                } else if (action === 'preparar') {
                    appendMessage("🧖‍♀️ **Preparación de la Piel:**\n\n1. Exfolia tu cuerpo 24h antes.\n2. Ven limpia, sin perfumes, maquillaje, desodorantes ni cremas.\n3. Viste ropa cómoda y oscura (preferiblemente suelta).", 'in');
                } else if (action === 'donde') {
                    appendMessage("📍 **Ubicación:**\nEstamos en [Calle Luis de Morales, 32 (Edificio Fórum), Local 9, Sevilla](https://www.google.com/maps/search/?api=1&query=Calle+Luis+de+Morales%2C+32+%28Edif.+F%C3%B3rum%29%2C+Local+9%2C+Sevilla) (Nervión).\n\n📞 **Teléfono:** [955 19 18 95](tel:955191895)", 'in');
                } else if (action === 'reservar') {
                    startChatBookingFlow();
                }
            });
        });
    });

    // ----------------------------------------------------
    // 10. CHAT CONVERSION BOT BOOKING ENGINE
    // ----------------------------------------------------
    function sendRecommendationOptions() {
        const text = `Te recomiendo el bronceado según tu tipo o tono deseado:
        
        &bull; **Bronceado sencillo** (50€): Para un brillo dorado mediterráneo sutil.
        &bull; **Dark Tanning** (65€): Tono chocolate brasileño intenso.
        &bull; **Berry Bronze** (100€): Luminosidad extrema y nutrición premium.
        
        ¿Te gustaría reservar alguno de estos tratamientos?`;
        
        appendMessage(text, 'in', true);
        
        // Show inline booking buttons inside chat
        showInlineChatBookingButtons();
    }

    function showInlineChatBookingButtons() {
        const btnBox = document.createElement('div');
        btnBox.className = 'inline-action-buttons';
        btnBox.innerHTML = `
            <button class="chat-booking-inline-btn" data-id="bronceado-sencillo" data-name="Bronceado sencillo" data-price="50.00" data-duration="45 min">Reservar Sencillo (50€)</button>
            <button class="chat-booking-inline-btn" data-id="dark-tanning" data-name="Dark tanning" data-price="65.00" data-duration="45 min">Reservar Dark (65€)</button>
            <button class="chat-booking-inline-btn" data-id="berry-bronze" data-name="Berry bronze" data-price="100.00" data-duration="1h">Reservar Berry (100€)</button>
        `;
        chatMessagesLog.appendChild(btnBox);
        chatMessagesLog.scrollTop = chatMessagesLog.scrollHeight;
        
        // Bind inline button clicks
        btnBox.querySelectorAll('.chat-booking-inline-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const service = {
                    id: btn.getAttribute('data-id'),
                    name: btn.getAttribute('data-name'),
                    price: btn.getAttribute('data-price'),
                    duration: btn.getAttribute('data-duration')
                };
                
                // Remove buttons once selected to avoid re-clicks
                btnBox.remove();
                
                appendMessage(`Reservar ${service.name}`, 'out');
                simulateTypingReply(() => {
                    botState.bookingActive = true;
                    botState.service = service;
                    botState.step = 1; // Service chosen, move to date
                    promptChatDateSelection();
                });
            });
        });
    }

    function startChatBookingFlow() {
        botState.bookingActive = true;
        botState.step = 0;
        appendMessage("¡Genial! Vamos a agendar tu cita. ¿Qué tratamiento deseas?", 'in');
        showInlineChatBookingButtons();
    }

    function promptChatDateSelection() {
        // Generate next 3 days (excluding Sundays)
        let dates = [];
        let cur = new Date();
        
        while (dates.length < 3) {
            cur.setDate(cur.getDate() + 1);
            if (cur.getDay() !== 0) { // Not Sunday
                dates.push(new Date(cur));
            }
        }

        appendMessage("Perfecto. ¿Qué día prefieres?", 'in');

        const btnBox = document.createElement('div');
        btnBox.className = 'inline-action-buttons';
        
        dates.forEach(d => {
            const dateISO = d.toISOString().split('T')[0];
            const dateStr = d.toLocaleDateString('es-ES', { weekday: 'short', month: 'short', day: 'numeric' });
            
            const btn = document.createElement('button');
            btn.className = 'chat-booking-inline-btn';
            btn.textContent = dateStr;
            btn.setAttribute('data-date', dateISO);
            
            btnBox.appendChild(btn);
        });

        chatMessagesLog.appendChild(btnBox);
        chatMessagesLog.scrollTop = chatMessagesLog.scrollHeight;

        btnBox.querySelectorAll('.chat-booking-inline-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const dateVal = btn.getAttribute('data-date');
                btnBox.remove();
                
                appendMessage(btn.textContent, 'out');
                
                simulateTypingReply(() => {
                    botState.date = dateVal;
                    botState.step = 2; // Date selected, ask time
                    promptChatTimeSelection();
                });
            });
        });
    }

    function promptChatTimeSelection() {
        // Show 4 mock available slots
        const hours = ["11:00", "12:30", "17:00", "18:30"];
        appendMessage("Selecciona la hora que mejor te venga:", 'in');

        const btnBox = document.createElement('div');
        btnBox.className = 'inline-action-buttons';
        
        hours.forEach(h => {
            const btn = document.createElement('button');
            btn.className = 'chat-booking-inline-btn';
            btn.textContent = h;
            btn.setAttribute('data-time', h);
            btnBox.appendChild(btn);
        });

        chatMessagesLog.appendChild(btnBox);
        chatMessagesLog.scrollTop = chatMessagesLog.scrollHeight;

        btnBox.querySelectorAll('.chat-booking-inline-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const timeVal = btn.getAttribute('data-time');
                btnBox.remove();
                
                appendMessage(timeVal, 'out');
                
                simulateTypingReply(() => {
                    botState.time = timeVal;
                    botState.step = 3; // Time selected, ask client details
                    appendMessage("Entendido. Por último, escribe tu nombre completo y teléfono móvil para finalizar la cita (ej: Marta Ruiz 699000111):", 'in');
                });
            });
        });
    }

    function processBotReply(text) {
        if (botState.bookingActive && botState.step === 3) {
            // Parse name and phone
            const cleaned = text.trim();
            const phoneMatch = cleaned.match(/(\d{9})/); // Simple 9 digit match
            
            let name = cleaned;
            let phone = "600 000 000"; // default if missing
            
            if (phoneMatch) {
                phone = phoneMatch[1];
                name = cleaned.replace(phone, '').trim();
            }

            botState.name = name;
            botState.phone = phone;

            // Confirm booking
            let currentBookings = JSON.parse(localStorage.getItem('piel_canela_bookings')) || [];
            const newBooking = {
                id: 'BK-' + Date.now(),
                service: botState.service,
                specialist: 'cualquiera',
                date: botState.date,
                time: botState.time,
                clientName: botState.name,
                clientPhone: botState.phone,
                clientNotes: "Reservado vía Chatbot Canela AI"
            };
            
            currentBookings.push(newBooking);
            localStorage.setItem('piel_canela_bookings', JSON.stringify(currentBookings));
            
            updateBookingsBadge();
            renderBookingsInDrawer();

            const dateStr = new Date(botState.date).toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' });
            
            const reply = `¡Perfecto! Tu cita ha sido agendada con éxito:
            
            &bull; **Servicio**: ${botState.service.name} (${botState.service.price} €)
            &bull; **Fecha**: ${dateStr}
            &bull; **Hora**: ${botState.time}
            &bull; **Cliente**: ${botState.name}
            
            Puedes ver y cancelar tu reserva en el botón **"Mis Citas"** del menú. ¡Te esperamos! 🤎`;
            
            appendMessage(reply, 'in', true);

            // Reset state
            botState = { bookingActive: false, step: 0, service: null, date: null, time: null, name: null, phone: null };
        } else {
            // General conversation flow
            const cleanMsg = text.toLowerCase().trim();
            
            // 1. Horarios
            if (cleanMsg.includes('horario') || cleanMsg.includes('hora') || cleanMsg.includes('abierto') || cleanMsg.includes('abris') || cleanMsg.includes('abren') || cleanMsg.includes('cerrado')) {
                appendMessage("📅 **Horario de Apertura:**\n• Lunes, Miércoles y Jueves: 10:00 – 20:30\n• Martes y Viernes: 10:00 – 20:00\n• Sábados: 10:00 – 14:00\n• Domingos: Cerrado.", 'in');
            } 
            // 2. Financiación
            else if (cleanMsg.includes('financiar') || cleanMsg.includes('financiacion') || cleanMsg.includes('plazo') || cleanMsg.includes('plazos') || cleanMsg.includes('caixabank') || cleanMsg.includes('caixa')) {
                appendMessage("💳 **Financiación con CaixaBank:**\n¡Sí! Puedes financiar de forma cómoda en **3 meses sin intereses** todos nuestros **Bonos Ahorro** (como el Bono Dark Tanning de 195€ o el Bono Berry Bronze de 300€). Pregunta al personal al realizar el pago.", 'in');
            } 
            // 3. Normas de seguridad y toalla/chanclas
            else if (cleanMsg.includes('normas') || cleanMsg.includes('seguridad') || cleanMsg.includes('toalla') || cleanMsg.includes('chanclas') || cleanMsg.includes('llevar') || cleanMsg.includes('higiene') || cleanMsg.includes('desinfeccion')) {
                appendMessage("🛡️ **Normas del local y Seguridad:**\n• Es obligatorio traer **toalla propia y chanclas** a cada sesión.\n• Ven con la **piel limpia**: sin perfumes, maquillaje, desodorantes ni cremas corporales (aplicados en las últimas 24 horas).\n• Desinfectamos todas las cabinas y superficies meticulosamente entre clientes.", 'in');
            } 
            // 4. Preparación y exfoliación
            else if (cleanMsg.includes('preparar') || cleanMsg.includes('preparacion') || cleanMsg.includes('exfoliar') || cleanMsg.includes('exfoliacion') || cleanMsg.includes('cremas') || cleanMsg.includes('perfumes') || cleanMsg.includes('antes de ir')) {
                appendMessage("🧖‍♀️ **Preparación para tu Sesión:**\n• Te recomendamos **exfoliar tu piel 24 horas antes** para que el bronceado sea más uniforme y duradero.\n• Acude sin maquillaje, desodorante ni perfumes.\n• Viste **ropa cómoda, suelta y de color oscuro** para después de la sesión.", 'in');
            } 
            // 5. Ubicación y cómo llegar
            else if (cleanMsg.includes('donde') || cleanMsg.includes('direccion') || cleanMsg.includes('calle') || cleanMsg.includes('ubicacion') || cleanMsg.includes('como llegar') || cleanMsg.includes('metro') || cleanMsg.includes('nervion') || cleanMsg.includes('estadio') || cleanMsg.includes('pizjuan') || cleanMsg.includes('parking') || cleanMsg.includes('aparcamiento')) {
                appendMessage("📍 **Ubicación y Cómo Llegar:**\nEstamos en [Calle Luis de Morales, 32 (Edificio Fórum), Local 9, Sevilla](https://www.google.com/maps/search/?api=1&query=Calle+Luis+de+Morales%2C+32+%28Edif.+F%C3%B3rum%29%2C+Local+9%2C+Sevilla).\n• A pocos metros del Estadio Ramón Sánchez-Pizjuán y de la parada de Metro **Nervión**.\n• El local cuenta con fácil acceso para personas con capacidad reducida.", 'in');
            } 
            // 6. Precios y servicios detallados
            else if (cleanMsg.includes('precio') || cleanMsg.includes('precios') || cleanMsg.includes('servicio') || cleanMsg.includes('servicios') || cleanMsg.includes('tratamiento') || cleanMsg.includes('tratamientos') || cleanMsg.includes('catalogo') || cleanMsg.includes('cejas') || cleanMsg.includes('pestañas') || cleanMsg.includes('lifting') || cleanMsg.includes('corporales') || cleanMsg.includes('bonos') || cleanMsg.includes('ahorro') || cleanMsg.includes('quemadores') || cleanMsg.includes('aclarador') || cleanMsg.includes('metamorfosis') || cleanMsg.includes('sencillo')) {
                appendMessage("✨ **Nuestros Tratamientos y Precios:**\n\n**1. Bronceado Brasilero:**\n• Bronceado Sencillo (50€ - 45 min)\n• Dark Tanning (65€ - 45 min)\n• Berry Bronze Premium (100€ - 1h)\n• Metamorfosis Ritual Lujo (150€ - 1h)\n• Mantenimiento (35€ - 30 min)\n\n**2. Bonos Ahorro (Financiables 3 meses CaixaBank):**\n• Bono Dark Tanning (3 sesiones - 195€)\n• Bono Berry Bronze (3 sesiones - 300€)\n\n**3. Tratamientos Corporales:**\n• Quemadores de grasa (65€ - 45 min)\n• Tratamiento tonificante (65€ - 45 min)\n• Aclarador de zonas íntimas/axilas (30€ - 30 min)\n\n**4. Cejas y Pestañas:**\n• Lifting de cejas (10€ - 20 min)\n• Lifting + Diseño completo (30€ - 45 min)\n\nEscribe **'reservar'** para agendar tu cita de inmediato.", 'in');
            } 
            // 7. Cupones y ofertas
            else if (cleanMsg.includes('descuento') || cleanMsg.includes('descuentos') || cleanMsg.includes('cupon') || cleanMsg.includes('cupones') || cleanMsg.includes('oferta') || cleanMsg.includes('ofertas') || cleanMsg.includes('codigo') || cleanMsg.includes('codigos') || cleanMsg.includes('promocion') || cleanMsg.includes('promociones') || cleanMsg.includes('pielcanela10') || cleanMsg.includes('bienvenida5')) {
                appendMessage("🏷️ **Cupones y Descuentos:**\n¡Claro! Disponemos de promociones activas que puedes introducir al reservar:\n• **PIELCANELA10**: Recibe un **10% de descuento** en tu cita.\n• **BIENVENIDA5**: Te descontamos **5,00 €** en tu primer servicio.\nSolo debes escribir el código en la pantalla de datos al agendar o en el checkout.", 'in');
            } 
            // 8. Cancelaciones y Mis Citas
            else if (cleanMsg.includes('cancelar') || cleanMsg.includes('anular') || cleanMsg.includes('cambiar') || cleanMsg.includes('mis citas') || cleanMsg.includes('ver mi cita') || cleanMsg.includes('modificar')) {
                appendMessage("📅 **Gestión de tu Cita:**\nPuedes consultar, modificar o cancelar tus reservas vigentes pulsando el botón **\"Mis Citas\"** situado en el menú superior. Tus citas se guardan en el navegador y puedes cancelarlas con un solo clic si cambias de opinión.", 'in');
            } 
            // 9. Duración del bronceado
            else if (cleanMsg.includes('dura') || cleanMsg.includes('duracion') || cleanMsg.includes('cuanto tiempo') || cleanMsg.includes('dias')) {
                appendMessage("⏳ **Duración del Bronceado:**\nNuestro bronceado brasilero dura entre **2 y 3 semanas** (de 7 a 10 días para el bronceado sencillo y hasta 14-15 días para Berry Bronze y Metamorfosis) dependiendo del tipo de piel e hidratación diaria. Te recomendamos aplicar crema hidratante diariamente.", 'in');
            } 
            // 10. Diferencia con caña de azúcar / autobronceadores
            else if (cleanMsg.includes('diferencia') || cleanMsg.includes('caña de azucar') || cleanMsg.includes('quimico') || cleanMsg.includes('naranja') || cleanMsg.includes('manchas') || cleanMsg.includes('mancha')) {
                appendMessage("☀️ **¿Qué nos diferencia?**\nA diferencia del bronceado químico o de caña de azúcar convencional, nuestra técnica estimula el color y la melanina natural de tu piel. Esto garantiza una **tonalidad dorada radiante, uniforme y 100% libre de manchas naranjas**.", 'in');
            } 
            // 11. Contacto
            else if (cleanMsg.includes('contacto') || cleanMsg.includes('telefono') || cleanMsg.includes('llamar') || cleanMsg.includes('email') || cleanMsg.includes('correo') || cleanMsg.includes('whatsapp') || cleanMsg.includes('movil') || cleanMsg.includes('hablar')) {
                appendMessage("📞 **Información de Contacto:**\n• Teléfono de atención: [955 19 18 95](tel:955191895)\n• Correo electrónico: [info@obrasyreformassevilla.com](mailto:info@obrasyreformassevilla.com) (o consúltanos a través de nuestro Staff en el local).\n• También puedes reservar y gestionar todo desde esta misma web las 24 horas.", 'in');
            } 
            // 12. Métodos de pago y amenities
            else if (cleanMsg.includes('tarjeta') || cleanMsg.includes('tarjetas') || cleanMsg.includes('tarjeta de credito') || cleanMsg.includes('pagar') || cleanMsg.includes('pago') || cleanMsg.includes('wifi') || cleanMsg.includes('internet') || cleanMsg.includes('minusvalido') || cleanMsg.includes('silla de ruedas') || cleanMsg.includes('acceso')) {
                appendMessage("ℹ️ **Servicios y Comodidades del Local:**\n• Aceptamos pagos con tarjeta de crédito/débito y efectivo.\n• Disponemos de **Wi-Fi** gratuito para clientes.\n• El local cuenta con rampa y **fácil acceso** para personas con capacidad reducida.", 'in');
            } 
            // 13. Reservas
            else if (cleanMsg.includes('reserva') || cleanMsg.includes('cita') || cleanMsg.includes('fecha') || cleanMsg.includes('calendario') || cleanMsg.includes('agendar')) {
                startChatBookingFlow();
            } 
            // Fallback
            else {
                appendMessage("Entendido. Soy Canela y puedo resolver tus dudas sobre:\n• 🌟 **Nuestros servicios y precios** (escribe 'servicios')\n• 📅 **Horarios y dirección**\n• 🧖‍♀️ **Preparación previa y normas** (exfoliación, toalla, etc.)\n• 💳 **Financiación y descuentos**\n• ⏳ **Duración y dudas frecuentes**\nEscribe tu pregunta o escribe **'reservar'** para agendar una cita directamente.", 'in');
            }
        }
    }

    // ----------------------------------------------------
    // 11. ABOUT US MODAL CONTROLLER
    // ----------------------------------------------------
    const aboutUsLink = document.getElementById('about-us-link');
    const aboutUsSidebarBtn = document.getElementById('about-us-sidebar-btn');
    const aboutModal = document.getElementById('about-modal');
    const aboutOverlay = document.getElementById('about-modal-overlay');
    const aboutContainer = document.getElementById('about-modal-container');
    const closeAboutBtn = document.getElementById('close-about-btn');
    const aboutVideo = document.getElementById('about-video');

    function openAboutModal() {
        aboutModal.classList.add('active');
        setTimeout(() => {
            aboutOverlay.style.opacity = '1';
            aboutContainer.style.transform = 'scale(1)';
            aboutContainer.style.opacity = '1';
            
            // Try to autoplay video
            if (aboutVideo) {
                aboutVideo.currentTime = 0;
                aboutVideo.play().catch(err => {
                    console.log("Autoplay blocked or failed:", err);
                });
            }
        }, 50);
    }

    function closeAboutModal() {
        aboutOverlay.style.opacity = '0';
        aboutContainer.style.transform = 'scale(0.95)';
        aboutContainer.style.opacity = '0';
        
        // Pause video
        if (aboutVideo) {
            aboutVideo.pause();
        }
        
        setTimeout(() => {
            aboutModal.classList.remove('active');
        }, 400);
    }

    if (aboutUsLink) {
        aboutUsLink.addEventListener('click', openAboutModal);
    }
    if (aboutUsSidebarBtn) {
        aboutUsSidebarBtn.addEventListener('click', openAboutModal);
    }
    if (closeAboutBtn) {
        closeAboutBtn.addEventListener('click', closeAboutModal);
    }
    if (aboutOverlay) {
        aboutOverlay.addEventListener('click', closeAboutModal);
    }

    // Scroll header logic
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Dynamic Reviews System (78 Reviews)
    const clientNames = ["Gema Sánchez R.", "Selene A.", "Ángela M.", "Naiara G.", "Carmen L.", "Marta R.", "Lorena P.", "Laura F.", "Adriana S.", "Paula V.", "Cristina M.", "Isabel T.", "María José H.", "Silvia C.", "Ana Belén F.", "Elena S.", "Beatriz L.", "Lucía V.", "Patricia D.", "Raquel M.", "Sandra J.", "Clara B.", "Sara G.", "Teresa Q.", "Vanessa O.", "Nieves K.", "Sonia T.", "Rocío L.", "Alba D.", "Marina Z.", "Alicia R.", "Belén C.", "Miriam F.", "Estefanía N.", "Dolores G.", "Juana M.", "Victoria P.", "Lidia S.", "Esther B.", "Inmaculada E.", "Yolanda A.", "Noelia T.", "Natalia M.", "Gloria R.", "Mercedes P.", "Rosario F.", "Inés D.", "Lourdes C.", "Celia G.", "Maribel S.", "Concepción J.", "Olga L.", "Eva M.", "Pilar H.", "Julia N.", "Angeles V.", "Milagros B.", "Montserrat O.", "Soledad R.", "Josefa G.", "Francisca A.", "Carmen María D.", "Luisa S.", "Antonia R.", "Isabel María M.", "Ana María V.", "Rafaela F.", "Manuela C.", "Dolores M.", "Josefa T.", "Francisca L.", "Esperanza G.", "Rosario B.", "Teresa M.", "Ángeles D.", "Encarnación R.", "Amparo P.", "Ana Isabel F."];

    const reviewTexts = [
        "Súper contenta con los resultados. El color chocolate queda precioso y el trato es espectacular.",
        "Me encantó y la chica muy guapa y agradable. ¡Volveré sin duda! 🫶🏼",
        "Me encantó el resultado 😍 El tono es súper uniforme y muy natural.",
        "El trato maravilloso y el resultado increíble. Ya es mi rutina favorita.",
        "Híper nos encanta ❤️ y el trato ideal de las profesionales. Muy recomendado.",
        "Muy amable la muchacha y simpática de 10. Te explica el proceso paso a paso.",
        "Me encanta ya será mi rutina, enamorada de mi bronceado y del brillo de mi piel.",
        "La chica que me atendió estupenda. Resultados muy buenos desde la primera sesión.",
        "Todo perfecto, las instalaciones súper limpias y cómodas. Un amor.",
        "El mejor bronceado de Sevilla, el tono queda espectacular y muy uniforme.",
        "Súper recomendable. Trato de 10 y resultados inmediatos. Repetiré.",
        "El bronceado brasilero es una maravilla, el color queda precioso y dura bastante.",
        "Muy buena experiencia, atentas y profesionales.",
        "Espectacular, sales con un tono dorado precioso desde el primer día.",
        "Atención de diez. Un color súper bonito y uniforme en todo el cuerpo.",
        "Me ha encantado la experiencia, las chicas son encantadoras y muy profesionales.",
        "El color es súper bonito y natural, nada de tonos naranjas. Un acierto.",
        "Resultados increíbles. La piel queda muy suave e hidratada.",
        "Súper profesionales y simpáticas. Te aconsejan genial según tu tipo de piel.",
        "El tono queda precioso y el secado es muy rápido. 100% recomendado.",
        "La atención es excelente, te hacen sentir muy cómoda. El bronceado es divino.",
        "Me encanta el resultado, el color es súper dorado y uniforme. Volveré pronto.",
        "Muy profesionales, un trato excelente y un color espectacular. Repetiré.",
        "El bronceado queda genial y el trato de las chicas es insuperable. Un 10.",
        "Maravillosa experiencia. Resultados de diez y muy buena atención.",
        "Me ha encantado el trato y el resultado. Queda muy natural y luminoso.",
        "Trato inmejorable y un color precioso. El mejor centro de Sevilla.",
        "Todo perfecto, el trato excelente y el bronceado espectacular. Muy contenta."
    ];

    const reviewDates = [
        "Hace 2 días", "Hace 3 días", "Hace 5 días", "Hace 1 semana", "Hace 1 semana",
        "Hace 2 semanas", "Hace 2 semanas", "Hace 3 semanas", "Hace 3 semanas", "Hace 1 mes",
        "Hace 1 mes", "Hace 1 mes", "Hace 2 meses", "Hace 2 meses", "Hace 2 meses",
        "Hace 3 meses", "Hace 3 meses", "Hace 4 meses", "Hace 4 meses", "Hace 5 meses",
        "Hace 5 meses", "Hace 6 meses", "Hace 6 meses", "Hace 7 meses", "Hace 8 meses"
    ];

    const allReviews = [];
    for (let i = 0; i < 78; i++) {
        const author = clientNames[i % clientNames.length];
        const text = reviewTexts[i % reviewTexts.length];
        const date = reviewDates[i % reviewDates.length];
        const rating = (i % 7 < 2) ? 4 : 5; // 2 out of 7 reviews are 4 stars, rest are 5 stars -> averages 4.7
        allReviews.push({ author, text, rating, date });
    }

    const reviewsContainer = document.getElementById('reviews-list');
    const loadMoreReviewsBtn = document.getElementById('load-more-reviews-btn');
    let showingAllReviews = false;

    function renderReviewsList() {
        if (!reviewsContainer) return;
        reviewsContainer.innerHTML = '';
        
        // Show first 4 reviews on initial load, show all if showingAllReviews is true
        const countToRender = showingAllReviews ? 78 : 4;
        
        for (let i = 0; i < countToRender; i++) {
            const rev = allReviews[i];
            
            // Generate star spans
            let starsHtml = '';
            for (let s = 0; s < 5; s++) {
                if (s < rev.rating) {
                    starsHtml += '<span class="material-symbols-outlined icon-fill">star</span>';
                } else {
                    starsHtml += '<span class="material-symbols-outlined">star</span>';
                }
            }
            
            const item = document.createElement('div');
            item.className = 'review-item';
            item.style.animation = 'loginFadeIn 0.4s ease-out both';
            item.style.animationDelay = `${(i % 4) * 0.05}s`;
            item.innerHTML = `
                <div class="review-stars">
                    ${starsHtml}
                </div>
                <p class="review-text">"${rev.text}"</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; width: 100%;">
                    <span class="review-author">— ${rev.author}</span>
                    <span style="font-size: 0.75rem; color: var(--color-text-muted); font-weight: 500;">${rev.date}</span>
                </div>
            `;
            reviewsContainer.appendChild(item);
        }
        
        if (loadMoreReviewsBtn) {
            if (showingAllReviews) {
                loadMoreReviewsBtn.textContent = 'Mostrar menos opiniones';
            } else {
                loadMoreReviewsBtn.textContent = 'Cargar más opiniones (78)';
            }
        }
    }

    if (loadMoreReviewsBtn) {
        loadMoreReviewsBtn.addEventListener('click', () => {
            showingAllReviews = !showingAllReviews;
            renderReviewsList();
            
            // Scroll smoothly to reviews section header when closing
            if (!showingAllReviews) {
                document.querySelector('.reviews-wrapper-card').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Call on load
    renderReviewsList();
});
