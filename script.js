document.addEventListener('DOMContentLoaded', () => {
    const app = {
        // Mock data for professionals
        professionals: [
            { id: 1, name: "Mario López", service: "plomeria", rating: 4.5, description: "Experto en fugas, desatascos e instalaciones de tuberías. Más de 10 años de experiencia.", hourly_rate: 25, image_url: "profile-placeholder.png" },
            { id: 2, name: "Ana García", service: "plomeria", rating: 4.2, description: "Reparaciones de grifería y sanitarios. Rápida y eficiente.", hourly_rate: 22, image_url: "profile-placeholder.png" },
            { id: 3, name: "Carlos Pérez", service: "electricidad", rating: 4.8, description: "Instalaciones eléctricas seguras, reparaciones de cortocircuitos y cuadros eléctricos.", hourly_rate: 30, image_url: "profile-placeholder.png" },
            { id: 4, name: "Lucía Fernandez", service: "electricidad", rating: 4.9, description: "Especialista en iluminación LED y ahorro energético. Certificada.", hourly_rate: 35, image_url: "profile-placeholder.png" },
            { id: 5, name: "Jorge Ramirez", service: "albanileria", rating: 4.6, description: "Reformas generales, tabiquería, alicatado y solado. Trabajos de calidad.", hourly_rate: 28, image_url: "profile-placeholder.png" },
            { id: 6, name: "Sofia Torres", service: "albanileria", rating: 4.3, description: "Pequeñas reparaciones de albañilería, enlucidos y pintura. Presupuestos ajustados.", hourly_rate: 26, image_url: "profile-placeholder.png" },
            { id: 7, name: "Ricardo Vargas", service: "plomeria", rating: 4.0, description: "Instalación y mantenimiento de calentadores de agua.", hourly_rate: 23, image_url: "profile-placeholder.png" },
            { id: 8, name: "Elena Moya", service: "electricidad", rating: 4.7, description: "Revisión y certificación de instalaciones eléctricas para hogares y negocios.", hourly_rate: 32, image_url: "profile-placeholder.png" }
        ],

        users: [], 
        currentUser: null, 
        currentProfessionalForRequest: null, 
        serviceRequests: [], 
        currentView: 'services', // 'services' or 'requests'

        currentService: null,
        activeServiceButton: null,

        // Service icons mapping
        serviceIcons: {
            plomeria: "/plumber-icon.png",
            electricidad: "/electrician-icon.png",
            albanileria: "/mason-icon.png"
        },

        // DOM elements
        elements: {
            authContainer: document.getElementById('auth-container'),
            appContainer: document.getElementById('app-container'),
            showLoginBtn: document.getElementById('show-login-btn'),
            showRegisterBtn: document.getElementById('show-register-btn'),
            loginFormContainer: document.getElementById('login-form-container'),
            registerFormContainer: document.getElementById('register-form-container'),
            loginForm: document.getElementById('login-form'),
            registerForm: document.getElementById('register-form'),
            loginEmailInput: document.getElementById('login-email'),
            loginPasswordInput: document.getElementById('login-password'),
            loginMessage: document.getElementById('login-message'),
            registerNameInput: document.getElementById('register-name'),
            registerEmailInput: document.getElementById('register-email'),
            registerPasswordInput: document.getElementById('register-password'),
            registerMessage: document.getElementById('register-message'),
            loggedInUserName: document.getElementById('logged-in-user-name'),
            logoutButton: document.getElementById('logout-button'),
            
            // App navigation
            appNavigation: document.getElementById('app-navigation'),
            navServicesBtn: document.getElementById('nav-services-btn'),
            navMyRequestsBtn: document.getElementById('nav-my-requests-btn'),

            // App content views
            appContentWrapper: document.getElementById('app-content-wrapper'),
            serviceSearchView: document.getElementById('service-search-view'),
            myRequestsView: document.getElementById('my-requests-view'),
            myRequestsList: document.getElementById('my-requests-list'),

            // Service search related
            serviceButtonsContainer: document.querySelector('.service-buttons'),
            professionalsListDiv: document.getElementById('professionals-list'),
            professionalsListTitle: document.getElementById('professionals-list-title'),
            
            // Modals
            modal: document.getElementById('professional-detail-modal'),
            modalCloseButton: document.querySelector('#professional-detail-modal .close-button'),
            modalProfImage: document.getElementById('modal-prof-image'),
            modalProfName: document.getElementById('modal-prof-name'),
            modalProfService: document.getElementById('modal-prof-service'),
            modalProfRating: document.getElementById('modal-prof-rating'),
            modalProfDescription: document.getElementById('modal-prof-description'),
            modalProfRate: document.getElementById('modal-prof-rate'),
            openServiceRequestModalButton: document.getElementById('open-service-request-modal-button'),
            profDetailCloseBtn: document.getElementById('prof-detail-close-btn'),
            serviceRequestModal: document.getElementById('service-request-modal'),
            srModalCloseBtn: document.getElementById('sr-modal-close-btn'),
            srModalTitle: document.getElementById('sr-modal-title'),
            srProfNameDisplay: document.getElementById('sr-prof-name-display'),
            serviceRequestForm: document.getElementById('service-request-form'),
            srDescriptionInput: document.getElementById('sr-description'),
            srAddressInput: document.getElementById('sr-address'),
            srDateTimeInput: document.getElementById('sr-datetime'),
            srMessage: document.getElementById('sr-message'),
            srConfirmButton: document.getElementById('sr-confirm-button'),
            srCancelButton: document.getElementById('sr-cancel-button')
        },

        // Initialize the app
        init() {
            this.loadUsers();
            this.loadServiceRequests();
            this.checkLoginStatus();
            this.bindEvents();
            if (!this.currentUser) {
                this.showAuthView();
            } else {
                this.showAppView();
            }
            this.elements.modal.style.display = 'none'; 
            this.elements.serviceRequestModal.style.display = 'none';
        },

        // Load users from localStorage
        loadUsers() {
            const storedUsers = localStorage.getItem('laborAppUsers');
            if (storedUsers) {
                this.users = JSON.parse(storedUsers);
            }
        },

        // Save users to localStorage
        saveUsers() {
            localStorage.setItem('laborAppUsers', JSON.stringify(this.users));
        },

        // Load service requests from localStorage
        loadServiceRequests() {
            const storedRequests = localStorage.getItem('laborAppServiceRequests');
            if (storedRequests) {
                this.serviceRequests = JSON.parse(storedRequests);
            }
        },

        // Save service requests to localStorage
        saveServiceRequests() {
            localStorage.setItem('laborAppServiceRequests', JSON.stringify(this.serviceRequests));
        },

        // Check if a user is logged in (from localStorage)
        checkLoginStatus() {
            const loggedInUserEmail = localStorage.getItem('laborAppCurrentUser');
            if (loggedInUserEmail) {
                this.currentUser = this.users.find(user => user.email === loggedInUserEmail);
                if (this.currentUser) {
                     this.elements.loggedInUserName.textContent = `Hola, ${this.currentUser.name.split(' ')[0]}`;
                } else {
                    // If user in localstorage not found in users array (e.g. corrupted data), clear it
                    localStorage.removeItem('laborAppCurrentUser');
                }
            }
        },
        
        showAuthView() {
            this.elements.authContainer.style.display = 'flex';
            this.elements.appContainer.style.display = 'none';
            this.showLoginFormView(); 
        },

        showAppView() {
            this.elements.authContainer.style.display = 'none';
            this.elements.appContainer.style.display = 'flex';
            if (this.currentUser) {
                 this.elements.loggedInUserName.textContent = `Hola, ${this.currentUser.name.split(' ')[0]}`;
            }
            // Reset service search view specific things
            this.elements.professionalsListDiv.innerHTML = `<p class="placeholder-text">Selecciona un servicio para ver los profesionales.</p>`;
            this.elements.professionalsListTitle.textContent = 'Profesionales Disponibles';
            if (this.activeServiceButton) {
                this.activeServiceButton.classList.remove('active');
                this.activeServiceButton = null;
            }
            this.currentService = null;

            // Default to service search view
            this.showServiceSearchView();
        },

        showServiceSearchView() {
            this.elements.serviceSearchView.style.display = 'block';
            this.elements.myRequestsView.style.display = 'none';
            this.elements.navServicesBtn.classList.add('active');
            this.elements.navMyRequestsBtn.classList.remove('active');
            this.currentView = 'services';
        },

        showMyRequestsView() {
            this.elements.serviceSearchView.style.display = 'none';
            this.elements.myRequestsView.style.display = 'block';
            this.elements.navServicesBtn.classList.remove('active');
            this.elements.navMyRequestsBtn.classList.add('active');
            this.currentView = 'requests';
            this.renderMyRequests();
        },

        showLoginFormView() {
            this.elements.loginFormContainer.style.display = 'block';
            this.elements.registerFormContainer.style.display = 'none';
            this.elements.showLoginBtn.classList.add('active');
            this.elements.showRegisterBtn.classList.remove('active');
            this.elements.loginMessage.textContent = '';
            this.elements.registerMessage.textContent = '';
        },

        showRegisterFormView() {
            this.elements.loginFormContainer.style.display = 'none';
            this.elements.registerFormContainer.style.display = 'block';
            this.elements.showLoginBtn.classList.remove('active');
            this.elements.showRegisterBtn.classList.add('active');
            this.elements.loginMessage.textContent = '';
            this.elements.registerMessage.textContent = '';
        },

        handleRegistration(event) {
            event.preventDefault();
            const name = this.elements.registerNameInput.value.trim();
            const email = this.elements.registerEmailInput.value.trim();
            const password = this.elements.registerPasswordInput.value;

            if (!name || !email || !password) {
                this.elements.registerMessage.textContent = 'Todos los campos son obligatorios.';
                this.elements.registerMessage.className = 'auth-message error';
                return;
            }
            if (this.users.find(user => user.email === email)) {
                this.elements.registerMessage.textContent = 'Este email ya está registrado.';
                this.elements.registerMessage.className = 'auth-message error';
                return;
            }

            const newUser = { name, email, password }; 
            this.users.push(newUser);
            this.saveUsers();
            this.currentUser = newUser;
            localStorage.setItem('laborAppCurrentUser', email);
            this.elements.registerMessage.textContent = '¡Registro exitoso!';
            this.elements.registerMessage.className = 'auth-message success';
            setTimeout(() => {
                this.showAppView();
                this.elements.registerForm.reset();
            }, 1000);
        },

        handleLogin(event) {
            event.preventDefault();
            const email = this.elements.loginEmailInput.value.trim();
            const password = this.elements.loginPasswordInput.value;

            if (!email || !password) {
                this.elements.loginMessage.textContent = 'Email y contraseña son obligatorios.';
                this.elements.loginMessage.className = 'auth-message error';
                return;
            }

            const user = this.users.find(u => u.email === email && u.password === password); 

            if (user) {
                this.currentUser = user;
                localStorage.setItem('laborAppCurrentUser', user.email);
                this.elements.loginMessage.textContent = '¡Inicio de sesión exitoso!';
                this.elements.loginMessage.className = 'auth-message success';
                setTimeout(() => {
                    this.showAppView();
                    this.elements.loginForm.reset();
                }, 1000);
            } else {
                this.elements.loginMessage.textContent = 'Email o contraseña incorrectos.';
                this.elements.loginMessage.className = 'auth-message error';
            }
        },

        handleLogout() {
            this.currentUser = null;
            localStorage.removeItem('laborAppCurrentUser');
            this.showAuthView();
            // Ensure when logging back in, the view resets
            this.currentView = 'services'; 
        },

        // Bind event listeners
        bindEvents() {
            this.elements.showLoginBtn.addEventListener('click', () => this.showLoginFormView());
            this.elements.showRegisterBtn.addEventListener('click', () => this.showRegisterFormView());
            this.elements.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
            this.elements.registerForm.addEventListener('submit', (e) => this.handleRegistration(e));
            this.elements.logoutButton.addEventListener('click', () => this.handleLogout());

            // App navigation
            this.elements.navServicesBtn.addEventListener('click', () => this.showServiceSearchView());
            this.elements.navMyRequestsBtn.addEventListener('click', () => this.showMyRequestsView());

            this.elements.serviceButtonsContainer.addEventListener('click', (event) => {
                const button = event.target.closest('button[data-service]');
                if (button) {
                    const service = button.dataset.service;
                    this.currentService = service;
                    
                    if (this.activeServiceButton) {
                        this.activeServiceButton.classList.remove('active');
                    }
                    button.classList.add('active');
                    this.activeServiceButton = button;

                    this.displayProfessionals(service);
                }
            });

            this.elements.modalCloseButton.addEventListener('click', () => this.hideProfessionalDetail());
            this.elements.profDetailCloseBtn.addEventListener('click', () => this.hideProfessionalDetail());

            window.addEventListener('click', (event) => {
                if (event.target === this.elements.modal) {
                    this.hideProfessionalDetail();
                }
                if (event.target === this.elements.serviceRequestModal) {
                    this.cancelServiceRequest();
                }
            });
            
            this.elements.professionalsListDiv.addEventListener('click', (event) => {
                const button = event.target.closest('.view-details-button');
                if (button) {
                    const card = button.closest('.professional-card');
                    const profId = parseInt(card.dataset.id);
                    this.showProfessionalDetail(profId);
                }
            });

            this.elements.openServiceRequestModalButton.addEventListener('click', () => {
                const profId = parseInt(this.elements.openServiceRequestModalButton.dataset.profId);
                if(profId) this.prepareAndShowServiceRequestModal(profId);
            });

            this.elements.srModalCloseBtn.addEventListener('click', () => this.cancelServiceRequest());
            this.elements.srCancelButton.addEventListener('click', () => this.cancelServiceRequest());
            this.elements.serviceRequestForm.addEventListener('submit', (e) => this.submitServiceRequest(e));
        },

        // Display professionals based on selected service
        displayProfessionals(serviceName) {
            this.elements.professionalsListDiv.innerHTML = ''; 
            const serviceDisplayNames = {
                plomeria: "Plomería",
                electricidad: "Electricidad",
                albanileria: "Albañilería"
            };
            this.elements.professionalsListTitle.textContent = `Profesionales de ${this.getServiceDisplayName(serviceName)}`;

            const filteredProfessionals = this.professionals.filter(p => p.service === serviceName);

            if (filteredProfessionals.length === 0) {
                this.elements.professionalsListDiv.innerHTML = `<p class="placeholder-text">No hay profesionales disponibles para ${this.getServiceDisplayName(serviceName)} en este momento.</p>`;
                return;
            }

            filteredProfessionals.forEach(prof => {
                const card = this.createProfessionalCard(prof);
                this.elements.professionalsListDiv.appendChild(card);
            });
        },

        // Create HTML card for a professional
        createProfessionalCard(prof) {
            const card = document.createElement('div');
            card.className = 'professional-card';
            card.dataset.id = prof.id;

            const img = document.createElement('img');
            img.src = prof.image_url || 'profile-placeholder.png';
            img.alt = prof.name;
            img.className = 'profile-avatar';

            const name = document.createElement('h4');
            name.textContent = prof.name;

            const rating = document.createElement('p');
            rating.innerHTML = `Rating: ${prof.rating} ⭐`;
            
            const shortDescription = document.createElement('p');
            const descriptionText = prof.description || "";
            shortDescription.textContent = descriptionText.substring(0, 50) + (descriptionText.length > 50 ? "..." : "");


            const detailsButton = document.createElement('button');
            detailsButton.textContent = 'Ver Detalles';
            detailsButton.className = 'view-details-button';

            card.appendChild(img);
            card.appendChild(name);
            card.appendChild(rating);
            card.appendChild(shortDescription);
            card.appendChild(detailsButton);

            return card;
        },

        // Show detailed information of a professional in a modal
        showProfessionalDetail(profId) {
            const prof = this.professionals.find(p => p.id === profId);
            if (!prof) return;

            this.elements.modalProfImage.src = prof.image_url || 'profile-placeholder.png';
            this.elements.modalProfName.textContent = prof.name;
            const serviceDisplayNames = {
                plomeria: "Plomería",
                electricidad: "Electricidad",
                albanileria: "Albañilería"
            };
            this.elements.modalProfService.textContent = serviceDisplayNames[prof.service] || prof.service;
            this.elements.modalProfRating.textContent = prof.rating;
            this.elements.modalProfDescription.textContent = prof.description;
            this.elements.modalProfRate.textContent = prof.hourly_rate;
            
            this.elements.openServiceRequestModalButton.dataset.profId = prof.id;

            this.elements.modal.style.display = 'flex'; 
        },

        // Hide the professional detail modal
        hideProfessionalDetail() {
            this.elements.modal.style.display = 'none';
        },

        // Prepare and show the Service Request Modal
        prepareAndShowServiceRequestModal(profId) {
            this.currentProfessionalForRequest = this.professionals.find(p => p.id === profId);
            if (!this.currentProfessionalForRequest) {
                console.error("Professional not found for service request.");
                return;
            }

            this.elements.srProfNameDisplay.textContent = this.currentProfessionalForRequest.name;
            this.elements.srModalTitle.textContent = `Solicitar ${this.getServiceDisplayName(this.currentProfessionalForRequest.service)}`;
            
            // Clear form and messages
            this.elements.serviceRequestForm.reset();
            this.elements.srMessage.textContent = '';
            this.elements.srMessage.className = 'auth-message';
            this.elements.srConfirmButton.disabled = false;
            this.elements.srConfirmButton.textContent = 'Confirmar Solicitud';


            this.hideProfessionalDetail(); // Hide the professional detail modal
            this.elements.serviceRequestModal.style.display = 'flex'; // Show service request modal
        },

        // Handle submission of the service request form
        submitServiceRequest(event) {
            event.preventDefault();
            if (!this.currentProfessionalForRequest || !this.currentUser) {
                this.elements.srMessage.textContent = 'Error: No se pudo identificar al profesional o usuario.';
                this.elements.srMessage.className = 'auth-message error';
                return;
            }

            const description = this.elements.srDescriptionInput.value.trim();
            const address = this.elements.srAddressInput.value.trim();
            const datetime = this.elements.srDateTimeInput.value;

            if (!description || !address || !datetime) {
                this.elements.srMessage.textContent = 'Todos los campos son obligatorios.';
                this.elements.srMessage.className = 'auth-message error';
                return;
            }
            
            // Validate datetime format (basic check if it's not empty, modern browsers handle format)
            // For a real app, more robust date validation would be needed.
            const preferredDate = new Date(datetime);
            if (isNaN(preferredDate.getTime())) {
                 this.elements.srMessage.textContent = 'Fecha y hora inválidas.';
                 this.elements.srMessage.className = 'auth-message error';
                 return;
            }
            if (preferredDate < new Date()) {
                this.elements.srMessage.textContent = 'La fecha y hora deben ser futuras.';
                this.elements.srMessage.className = 'auth-message error';
                return;
            }


            const newRequest = {
                requestId: Date.now(),
                professionalId: this.currentProfessionalForRequest.id,
                professionalName: this.currentProfessionalForRequest.name,
                serviceType: this.currentProfessionalForRequest.service,
                requestingUserId: this.currentUser.email,
                requestingUserName: this.currentUser.name,
                problemDescription: description,
                address: address,
                preferredDateTime: datetime,
                status: "pending", // Initial status
                requestedAt: new Date().toISOString()
            };

            this.serviceRequests.push(newRequest);
            this.saveServiceRequests();

            this.elements.srMessage.textContent = '¡Solicitud enviada con éxito!';
            this.elements.srMessage.className = 'auth-message success';
            this.elements.srConfirmButton.disabled = true;
            this.elements.srConfirmButton.textContent = 'Enviada';


            setTimeout(() => {
                this.closeServiceRequestModal(true); // true indicates submission was successful
            }, 2000);
        },

        // Cancel service request process or close modal
        cancelServiceRequest() {
            this.closeServiceRequestModal(false); // false indicates cancellation
        },

        // Close the Service Request Modal
        closeServiceRequestModal(isConfirmed) {
            this.elements.serviceRequestModal.style.display = 'none';
            this.elements.serviceRequestForm.reset(); // Reset form for next time
            this.elements.srMessage.textContent = '';
            this.elements.srMessage.className = 'auth-message';
            this.elements.srConfirmButton.disabled = false;
            this.elements.srConfirmButton.textContent = 'Confirmar Solicitud';


            if (!isConfirmed && this.currentProfessionalForRequest) {
                // If cancelled, and we know which professional detail modal was open, re-show it.
                // This requires currentProfessionalForRequest to be set before this modal opens.
                this.showProfessionalDetail(this.currentProfessionalForRequest.id);
            }
            // If confirmed, user returns to the main app view (professionals list)
            // as the prof detail modal was hidden and not re-shown.

            this.currentProfessionalForRequest = null; // Clear the context
        },

        getServiceDisplayName(serviceKey) {
            const serviceDisplayNames = {
                plomeria: "Plomería",
                electricidad: "Electricidad",
                albanileria: "Albañilería"
            };
            return serviceDisplayNames[serviceKey] || serviceKey;
        },

        renderMyRequests() {
            if (!this.currentUser) {
                this.elements.myRequestsList.innerHTML = `<p class="placeholder-text">Debes iniciar sesión para ver tus solicitudes.</p>`;
                return;
            }

            const userRequests = this.serviceRequests.filter(
                req => req.requestingUserId === this.currentUser.email
            );

            this.elements.myRequestsList.innerHTML = ''; // Clear previous content

            if (userRequests.length === 0) {
                this.elements.myRequestsList.innerHTML = `<p class="placeholder-text">Aún no has solicitado ningún servicio.</p>`;
                return;
            }

            userRequests.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt)); // Show newest first

            userRequests.forEach(request => {
                const card = document.createElement('div');
                card.className = 'request-card';
                card.dataset.requestId = request.requestId;

                const serviceIconImg = this.serviceIcons[request.serviceType] 
                    ? `<img src="${this.serviceIcons[request.serviceType]}" alt="${this.getServiceDisplayName(request.serviceType)}" class="service-icon">` 
                    : '';

                const title = document.createElement('h4');
                title.innerHTML = `${serviceIconImg}Solicitud de ${this.getServiceDisplayName(request.serviceType)}`;
                
                const professionalName = document.createElement('p');
                professionalName.innerHTML = `<strong>Profesional:</strong> ${request.professionalName}`;

                const dateTime = new Date(request.preferredDateTime);
                const formattedDateTime = dateTime.toLocaleString('es-ES', { 
                    year: 'numeric', month: 'long', day: 'numeric', 
                    hour: '2-digit', minute: '2-digit' 
                });
                const preferredDate = document.createElement('p');
                preferredDate.innerHTML = `<strong>Fecha y Hora:</strong> ${formattedDateTime}`;

                const address = document.createElement('p');
                address.innerHTML = `<strong>Dirección:</strong> ${request.address}`;
                
                const description = document.createElement('p');
                description.innerHTML = `<strong>Descripción:</strong> ${this.truncateText(request.problemDescription, 100)}`;


                const statusText = {
                    pending: "Pendiente",
                    confirmed: "Confirmada",
                    completed: "Completada",
                    cancelled: "Cancelada"
                };

                const statusDisplay = document.createElement('p');
                statusDisplay.innerHTML = `<strong>Estado:</strong> <span class="status ${request.status.toLowerCase()}">${statusText[request.status.toLowerCase()] || request.status}</span>`;
                
                const requestedAtDate = new Date(request.requestedAt);
                const formattedRequestedAt = requestedAtDate.toLocaleString('es-ES', {
                    day: 'numeric', month: 'short', year: 'numeric'
                });
                const requestedAtElem = document.createElement('p');
                requestedAtElem.style.fontSize = '0.8em';
                requestedAtElem.style.color = '#777';
                requestedAtElem.style.textAlign = 'right';
                requestedAtElem.innerHTML = `Solicitado el: ${formattedRequestedAt}`;


                card.appendChild(title);
                card.appendChild(professionalName);
                card.appendChild(preferredDate);
                card.appendChild(address);
                card.appendChild(description);
                card.appendChild(statusDisplay);
                card.appendChild(requestedAtElem);

                this.elements.myRequestsList.appendChild(card);
            });
        },

        truncateText(text, maxLength) {
            if (text.length <= maxLength) {
                return text;
            }
            return text.substring(0, maxLength) + "...";
        }
    };

    app.init();
});