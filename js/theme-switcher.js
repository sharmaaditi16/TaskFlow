    // Theme Switcher for TaskFlow
    class ThemeSwitcher {
        constructor() {
            this.currentTheme = this.getStoredTheme() || this.getPreferredTheme();
            this.init();
        }

        init() {
            this.setTheme(this.currentTheme);
            this.createToggleButton();
            this.listenForSystemThemeChanges();
        }

        getStoredTheme() {
            try {
                return localStorage.getItem('taskflow-theme');
            } catch (e) {
                return null;
            }
        }

        getPreferredTheme() {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        setTheme(theme) {
            this.currentTheme = theme;
            document.documentElement.setAttribute('data-theme', theme);
            try {
                localStorage.setItem('taskflow-theme', theme);
            } catch (e) {
                // Handle storage errors gracefully
            }
            this.updateToggleButton();
        }

        toggleTheme() {
            const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
            
            // Add subtle animation effect
            document.body.style.transition = 'background-color 0.3s ease';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 300);
        }

        createToggleButton() {
            if (document.querySelector('.theme-toggle')) return;

            const toggleButton = document.createElement('button');
            toggleButton.className = 'theme-toggle';
            toggleButton.setAttribute('aria-label', 'Toggle theme');
            toggleButton.setAttribute('title', 'Toggle theme');
            
            toggleButton.addEventListener('click', () => this.toggleTheme());
            document.body.appendChild(toggleButton);
            this.updateToggleButton();
        }

        updateToggleButton() {
            const toggleButton = document.querySelector('.theme-toggle');
            if (!toggleButton) return;

            const isDark = this.currentTheme === 'dark';
            toggleButton.innerHTML = isDark ? 
                '<i class="fas fa-sun"></i>' : 
                '<i class="fas fa-moon"></i>';
            
            toggleButton.setAttribute('title', 
                isDark ? 'Switch to light mode' : 'Switch to dark mode'
            );
        }

        listenForSystemThemeChanges() {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                try {
                    if (!localStorage.getItem('taskflow-theme')) {
                        this.setTheme(e.matches ? 'dark' : 'light');
                    }
                } catch (err) {
                    // Handle storage errors gracefully
                }
            });
        }
    }

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // Navbar effects
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.15)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.1)';
            navbar.style.backdropFilter = 'blur(10px)';
        }

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });

    // Parallax effect for background blobs
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const blobs = document.querySelectorAll('.bg-blob');
        
        blobs.forEach((blob, index) => {
            const speed = 0.5 + (index * 0.1);
            blob.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Button ripple effects
    document.querySelectorAll('.btn-primary-glass, .btn-secondary-glass').forEach(button => {
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
            `;
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Feature card magnetic effects
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            card.style.transform = `
                translateY(-10px) 
                rotateX(${y / 10}deg) 
                rotateY(${-x / 10}deg)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
        });
    });

    // Initialize theme switcher
    document.addEventListener('DOMContentLoaded', () => {
        new ThemeSwitcher();
        
        // Smooth page reveal
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
    });

    // Keyboard shortcut for theme toggle (Ctrl+T)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 't') {
            e.preventDefault();
            const themeSwitcher = new ThemeSwitcher();
            themeSwitcher.toggleTheme();
        }
    });