// PIEL CANELA BRONZE - CORE APPLICATION JAVASCRIPT

document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.innerWidth <= 768;
    // ----------------------------------------------------
    // 1. PRELOADER & INITIAL LOAD
    // ----------------------------------------------------
    const preloader = document.getElementById('preloader');
    
    // Hide preloader with luxury animation after assets load
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('preloader-hidden');
            document.body.classList.remove('loading-state');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 800); // Wait for transition opacity 0.8s to finish
        }, 1000); // Small delay to appreciate the entry animation
    });

    // In case load event fired before listener
    if (document.readyState === 'complete') {
        setTimeout(() => {
            preloader.classList.add('preloader-hidden');
            document.body.classList.remove('loading-state');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 800);
        }, 1000);
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
    // 5. GALLERY SLIDER CAROUSEL
    // ----------------------------------------------------
    // 5. GALLERY SLIDER CAROUSEL (NATIVE SCROLL SNAP)
    const galleryViewport = document.querySelector('.gallery-viewport');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');

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

    // FAQ Accordion click handler (Global window binding for immediate tap response)
    window.toggleFaq = (button) => {
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
    };

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
        step1.classList.add('hidden');
        step2.classList.add('hidden');
        step3.classList.add('hidden');
        step4.classList.add('hidden');
        
        // Remove active indicators
        ind1.classList.remove('active');
        ind2.classList.remove('active');
        ind3.classList.remove('active');

        modalBackBtn.classList.add('hidden');
        modalNextBtn.classList.remove('hidden');
        modalNextBtn.textContent = 'Siguiente';

        if (currentStep === 1) {
            step1.classList.remove('hidden');
            ind1.classList.add('active');
        } else if (currentStep === 2) {
            step2.classList.remove('hidden');
            ind2.classList.add('active');
            modalBackBtn.classList.remove('hidden');
        } else if (currentStep === 3) {
            step3.classList.remove('hidden');
            ind3.classList.add('active');
            modalBackBtn.classList.remove('hidden');
            modalNextBtn.textContent = 'Confirmar Reserva';
        } else if (currentStep === 4) {
            step4.classList.remove('hidden');
            modalNextBtn.textContent = 'Entendido';
            
            // Fill summaries
            document.getElementById('summary-service').textContent = selectedService.name;
            document.getElementById('summary-date').textContent = new Date(bookingData.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            document.getElementById('summary-time').textContent = bookingData.time;
            document.getElementById('summary-specialist').textContent = bookingData.specialist === 'cualquiera' ? 'Cualquier profesional' : bookingData.specialist;
            document.getElementById('summary-price').textContent = `${selectedService.price} €`;
        }
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
        const newBooking = {
            id: 'BK-' + Date.now(),
            service: selectedService,
            specialist: bookingData.specialist,
            date: bookingData.date,
            time: bookingData.time,
            clientName: bookingData.name,
            clientPhone: bookingData.phone,
            clientNotes: bookingData.notes
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
        
        if (direction === 'in') {
            wrap.className = 'chat-bubble-row message-in';
            wrap.innerHTML = `
                <div class="chat-avatar">C</div>
                <div class="chat-text">
                    ${isHtml ? text : escapeHTML(text).replace(/\n/g, '<br>')}
                </div>
            `;
        } else {
            wrap.className = 'chat-bubble-row message-out';
            wrap.innerHTML = `
                <div class="chat-text">
                    ${escapeHTML(text)}
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
                    appendMessage("📍 **Ubicación:**\nEstamos en Calle Luis de Morales, 32, Edificio Fórum, local 9, Sevilla (Nervión).\n\n📞 **Teléfono:** 955 19 18 95", 'in');
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
            if (cleanMsg.includes('bronceado') || cleanMsg.includes('servicio') || cleanMsg.includes('precio') || cleanMsg.includes('tratamiento')) {
                sendRecommendationOptions();
            } else if (cleanMsg.includes('preparar') || cleanMsg.includes('exfoliar') || cleanMsg.includes('como ir')) {
                appendMessage("🧖‍♀️ **Preparación:**\nExfolia tu piel 24h antes. Acude sin cremas, desodorante ni perfumes. Usa ropa cómoda y oscura.", 'in');
            } else if (cleanMsg.includes('donde') || cleanMsg.includes('direccion') || cleanMsg.includes('calle') || cleanMsg.includes('ubicacion')) {
                appendMessage("📍 Estamos en Calle Luis de Morales, 32, Edificio Fórum, local 9, Sevilla. A pocos metros del Estadio Ramón Sánchez-Pizjuán.", 'in');
            } else if (cleanMsg.includes('reserva') || cleanMsg.includes('cita') || cleanMsg.includes('fecha') || cleanMsg.includes('calendario')) {
                startChatBookingFlow();
            } else {
                appendMessage("Entendido. ¿Prefieres reservar un bronceado, saber nuestra dirección, o consultar cómo preparar tu piel? Escribe 'reservar' para agendar directamente.", 'in');
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
});
