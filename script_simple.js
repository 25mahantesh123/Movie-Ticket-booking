// Movie data
const movies = [
    {
        id: 1,
        title: "The Dark Knight Returns",
        genre: "Action, Drama",
        duration: "2h 32m",
        rating: 4.8,
        poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice."
    },
    {
        id: 2,
        title: "Inception",
        genre: "Sci-Fi, Thriller",
        duration: "2h 28m",
        rating: 4.7,
        poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O."
    },
    {
        id: 3,
        title: "The Shawshank Redemption",
        genre: "Drama",
        duration: "2h 22m",
        rating: 4.9,
        poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
        description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency."
    },
    {
        id: 4,
        title: "Pulp Fiction",
        genre: "Crime, Drama",
        duration: "2h 34m",
        rating: 4.6,
        poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
        description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption."
    },
    {
        id: 5,
        title: "The Matrix",
        genre: "Sci-Fi, Action",
        duration: "2h 16m",
        rating: 4.5,
        poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
        description: "A computer programmer discovers that reality as he knows it is a simulation created by machines, and joins a rebellion to break free."
    },
    {
        id: 6,
        title: "Forrest Gump",
        genre: "Drama, Romance",
        duration: "2h 22m",
        rating: 4.4,
        poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
        description: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75."
    }
];

// Global variables
let selectedSeats = [];
let selectedMovie = null;
const seatPrice = 12.99;

// AI Assistant variables
let isChatOpen = false;
let conversationHistory = [];

// Voice recognition
let recognition;
let isRecording = false;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayMovies();
    setupNavigation();
    setupModal();
    setMinDate();
    initializeFeaturedMovie();
    addAnimations();
    
    // Initialize voice assistant
    if (chatGptApiKey) {
        const apiConfig = document.getElementById('apiConfig');
        if (apiConfig) {
            apiConfig.style.display = 'none';
        }
    }
    
    // Load voices for speech synthesis
    if (speechSynthesis) {
        speechSynthesis.onvoiceschanged = function() {
            console.log('Voices loaded:', speechSynthesis.getVoices().length);
        };
    }
    
    // Initialize voice recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('userInput').value = transcript;
            sendMessage();
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            stopVoiceInput();
        };
        
        recognition.onend = function() {
            stopVoiceInput();
        };
    }
});

// Display movies
function displayMovies() {
    const moviesGrid = document.getElementById('moviesGrid');
    moviesGrid.innerHTML = '';

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
            <div class="movie-poster" style="background-image: url('${movie.poster}')">
                <div class="movie-poster-overlay">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <p class="movie-genre">${movie.genre}</p>
                <div class="movie-details">
                    <span class="duration"><i class="fas fa-clock"></i> ${movie.duration}</span>
                    <span class="rating"><i class="fas fa-star"></i> ${movie.rating}/5</span>
                </div>
                <p class="movie-description">${movie.description}</p>
                <button class="btn btn-primary" onclick="openBookingModal(${movie.id})">Book Now</button>
            </div>
        `;
        moviesGrid.appendChild(movieCard);
    });
}

// Setup navigation
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Setup modal
function setupModal() {
    const modal = document.getElementById('bookingModal');
    window.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    }
}

// Set minimum date
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateSelect').min = today;
}

// Generate seats
function generateSeats() {
    const seatsContainer = document.getElementById('seatsContainer');
    seatsContainer.innerHTML = '';
    
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 12;
    
    rows.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'seat-row';
        
        for (let i = 1; i <= seatsPerRow; i++) {
            const seat = document.createElement('div');
            seat.className = 'seat available';
            seat.setAttribute('data-seat', `${row}${i}`);
            seat.textContent = `${row}${i}`;
            
            // Randomly occupy some seats
            if (Math.random() < 0.3) {
                seat.classList.remove('available');
                seat.classList.add('occupied');
            }
            
            seat.addEventListener('click', function() {
                if (this.classList.contains('occupied')) {
                    return;
                }
                
                const seatId = this.getAttribute('data-seat');
                const seatCount = parseInt(document.getElementById('seatCount').value);
                
                if (this.classList.contains('selected')) {
                    // Deselect seat
                    this.classList.remove('selected');
                    selectedSeats = selectedSeats.filter(seat => seat !== seatId);
                } else {
                    // Select seat if within limit
                    if (selectedSeats.length < seatCount) {
                        this.classList.add('selected');
                        selectedSeats.push(seatId);
                        
                        // Update progress when first seat is selected
                        if (selectedSeats.length === 1) {
                            updateBookingProgress(2);
                        }
                    } else {
                        showNotification(`You can only select ${seatCount} seats.`, 'error');
                    }
                }
                
                updateBookingSummary();
            });
            
            rowDiv.appendChild(seat);
        }
        
        seatsContainer.appendChild(rowDiv);
    });
}

// Update booking summary
function updateBookingSummary() {
    const selectedSeatsElement = document.getElementById('selectedSeats');
    const totalPriceElement = document.getElementById('totalPrice');
    
    if (selectedSeats.length > 0) {
        selectedSeatsElement.textContent = selectedSeats.join(', ');
        const total = (selectedSeats.length * seatPrice).toFixed(2);
        totalPriceElement.textContent = `$${total}`;
    } else {
        selectedSeatsElement.textContent = 'None';
        totalPriceElement.textContent = '$0';
    }
}

// Open booking modal
function openBookingModal(movieId) {
    selectedMovie = movies.find(movie => movie.id === movieId);
    
    if (selectedMovie) {
        document.getElementById('modalMoviePoster').src = selectedMovie.poster;
        document.getElementById('modalMovieTitle').textContent = selectedMovie.title;
        document.getElementById('modalMovieGenre').textContent = selectedMovie.genre;
        document.getElementById('modalMovieDuration').textContent = selectedMovie.duration;
        
        document.getElementById('bookingModal').style.display = 'block';
        resetBooking();
        generateSeats();
    }
}

// Reset booking
function resetBooking() {
    selectedSeats = [];
    updateBookingSummary();
    updateBookingProgress(1);
}

// Confirm booking
function confirmBooking() {
    if (selectedSeats.length === 0) {
        showNotification('Please select at least one seat.', 'error');
        return;
    }
    
    const theater = document.getElementById('theaterSelect').value;
    const date = document.getElementById('dateSelect').value;
    const time = document.getElementById('timeSelect').value;
    
    // Update progress to step 3
    updateBookingProgress(3);
    
    const bookingDetails = {
        movie: selectedMovie.title,
        theater: theater,
        date: date,
        time: time,
        seats: selectedSeats,
        totalPrice: (selectedSeats.length * seatPrice).toFixed(2),
        bookingId: generateBookingId()
    };
    
    showBookingConfirmation(bookingDetails);
}

// Show booking confirmation
function showBookingConfirmation(booking) {
    const modalContent = document.querySelector('.modal-content');
    modalContent.innerHTML = `
        <div class="booking-confirmation">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Booking Confirmed!</h2>
            <div class="booking-details">
                <div class="detail-item">
                    <span class="label">Movie:</span>
                    <span class="value">${booking.movie}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Theater:</span>
                    <span class="value">${booking.theater}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Date:</span>
                    <span class="value">${booking.date}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Time:</span>
                    <span class="value">${booking.time}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Seats:</span>
                    <span class="value">${booking.seats.join(', ')}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Total:</span>
                    <span class="value">$${booking.totalPrice}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Booking ID:</span>
                    <span class="value">${booking.bookingId}</span>
                </div>
            </div>
            <div class="confirmation-actions">
                <button class="btn btn-primary" onclick="downloadTicket(${JSON.stringify(booking).replace(/"/g, '&quot;')})">
                    <i class="fas fa-download"></i> Download Ticket
                </button>
                <button class="btn btn-secondary" onclick="closeModal()">Close</button>
            </div>
        </div>
    `;
}

// Download ticket
function downloadTicket(booking) {
    const ticketHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Movie Ticket - ${booking.movie}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
                .ticket { background: white; border-radius: 10px; padding: 30px; max-width: 400px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { text-align: center; border-bottom: 2px solid #e74c3c; padding-bottom: 20px; margin-bottom: 20px; }
                .logo { font-size: 24px; font-weight: bold; color: #e74c3c; }
                .movie-title { font-size: 20px; font-weight: bold; margin: 10px 0; }
                .detail { display: flex; justify-content: space-between; margin: 10px 0; }
                .label { font-weight: bold; color: #666; }
                .value { color: #333; }
                .qr-code { text-align: center; margin: 20px 0; }
                .qr-code div { width: 100px; height: 100px; background: #333; margin: 0 auto; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="ticket">
                <div class="header">
                    <div class="logo">CineMax</div>
                    <div class="movie-title">${booking.movie}</div>
                </div>
                <div class="detail">
                    <span class="label">Theater:</span>
                    <span class="value">${booking.theater}</span>
                </div>
                <div class="detail">
                    <span class="label">Date:</span>
                    <span class="value">${booking.date}</span>
                </div>
                <div class="detail">
                    <span class="label">Time:</span>
                    <span class="value">${booking.time}</span>
                </div>
                <div class="detail">
                    <span class="label">Seats:</span>
                    <span class="value">${booking.seats.join(', ')}</span>
                </div>
                <div class="detail">
                    <span class="label">Total:</span>
                    <span class="value">$${booking.totalPrice}</span>
                </div>
                <div class="detail">
                    <span class="label">Booking ID:</span>
                    <span class="value">${booking.bookingId}</span>
                </div>
                <div class="qr-code">
                    <div>QR CODE<br>${booking.bookingId}</div>
                </div>
                <div class="footer">
                    Please arrive 15 minutes before showtime<br>
                    Enjoy your movie!
                </div>
            </div>
        </body>
        </html>
    `;
    
    const blob = new Blob([ticketHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${booking.bookingId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Ticket downloaded successfully!', 'success');
}

// Generate booking ID
function generateBookingId() {
    return 'BK' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
}

// Close modal
function closeModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

// Scroll to movies
function scrollToMovies() {
    document.getElementById('movies').scrollIntoView({ behavior: 'smooth' });
}

// Update booking progress
function updateBookingProgress(step) {
    document.querySelectorAll('.progress-step').forEach((stepEl, index) => {
        if (index + 1 <= step) {
            stepEl.classList.add('active');
        } else {
            stepEl.classList.remove('active');
        }
    });
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.getElementById('notificationContainer').appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animations
function addAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.movie-card, .theater-card, .feature').forEach(el => {
        observer.observe(el);
    });
}

// AI Assistant Functions
function toggleChat() {
    const aiAssistant = document.getElementById('aiAssistant');
    const aiToggle = document.querySelector('.ai-toggle');
    
    isChatOpen = !isChatOpen;
    
    if (isChatOpen) {
        aiAssistant.classList.add('open');
        aiToggle.classList.add('active');
        document.getElementById('userInput').focus();
    } else {
        aiAssistant.classList.remove('open');
        aiToggle.classList.remove('active');
    }
}

function handleUserInput(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    
    if (message) {
        addMessage(message, 'user');
        userInput.value = '';
        
        // Process AI response
        processAIResponse(message);
    }
}

function addMessage(content, sender) {
    const chatBody = document.getElementById('chatBody');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div class="message-content">
                <div>
                    <p>${content}</p>
                </div>
                <i class="fas fa-user"></i>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                <i class="fas fa-robot"></i>
                <div>${content}</div>
            </div>
        `;
    }
    
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Mock AI Response (since we don't have ChatGPT backend)
function processAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Show loading message
    addMessage('<span style="opacity:0.7"><i class="fas fa-spinner fa-spin"></i> Thinking...</span>', 'ai');
    
    setTimeout(() => {
        // Remove loading message
        const loadingMsg = document.querySelector('.ai-message:last-child');
        if (loadingMsg) loadingMsg.remove();
        
        let response = '';
        
        if (lowerMessage.includes('book') || lowerMessage.includes('ticket')) {
            response = `
                <p><strong>I can help you book tickets!</strong></p>
                <p>Here's how to book:</p>
                <ol>
                    <li>Browse our movies below</li>
                    <li>Click "Book Now" on your chosen movie</li>
                    <li>Select theater, date, time, and seats</li>
                    <li>Confirm your booking</li>
                    <li>Download your ticket</li>
                </ol>
                <div class="quick-actions">
                    <button class="quick-action-btn" onclick="scrollToMovies()">Browse Movies</button>
                    <button class="quick-action-btn" onclick="openBookingModal(1)">Book Dark Knight</button>
                </div>
            `;
        } else if (lowerMessage.includes('movie') || lowerMessage.includes('recommend')) {
            const topMovies = movies.sort((a, b) => b.rating - a.rating).slice(0, 3);
            response = `
                <p><strong>Top Movie Recommendations:</strong></p>
                <ul>
                    ${topMovies.map(movie => `
                        <li><strong>${movie.title}</strong> ⭐ ${movie.rating}/5 - ${movie.genre}</li>
                    `).join('')}
                </ul>
                <p>These are our highest-rated movies!</p>
                <div class="quick-actions">
                    <button class="quick-action-btn" onclick="openBookingModal(${topMovies[0].id})">Book ${topMovies[0].title}</button>
                    <button class="quick-action-btn" onclick="scrollToMovies()">View All Movies</button>
                </div>
            `;
        } else if (lowerMessage.includes('theater') || lowerMessage.includes('location')) {
            response = `
                <p><strong>Our Premium Theaters:</strong></p>
                <ul>
                    <li><strong>CineMax Downtown:</strong> 8 screens, Dolby Atmos, Recliner Seats</li>
                    <li><strong>CineMax Mall:</strong> 12 screens, IMAX Experience, VIP Lounges</li>
                    <li><strong>CineMax Premium:</strong> Luxury experience, Butler Service</li>
                </ul>
                <div class="quick-actions">
                    <button class="quick-action-btn" onclick="document.getElementById('theaters').scrollIntoView({behavior: 'smooth'})">View Theaters</button>
                </div>
            `;
        } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
            response = `
                <p><strong>Ticket Pricing:</strong></p>
                <ul>
                    <li>Standard Ticket: $12.99 per seat</li>
                    <li>Total price depends on number of seats selected</li>
                    <li>All theaters have the same pricing</li>
                </ul>
                <p>Ready to book? Choose a movie and I'll help you through the process!</p>
            `;
        } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            response = `
                <p>Hello! 👋 I'm your movie booking assistant.</p>
                <p>I can help you with:</p>
                <ul>
                    <li>🎬 Finding movies and recommendations</li>
                    <li>🎫 Booking tickets</li>
                    <li>🏢 Theater information</li>
                    <li>💰 Pricing details</li>
                </ul>
                <p>What would you like to know?</p>
            `;
        } else {
            response = `
                <p>I'm here to help with your movie booking needs!</p>
                <p>You can ask me about:</p>
                <ul>
                    <li>Movie recommendations</li>
                    <li>Booking tickets</li>
                    <li>Theater locations</li>
                    <li>Pricing information</li>
                </ul>
                <div class="quick-actions">
                    <button class="quick-action-btn" onclick="scrollToMovies()">Browse Movies</button>
                    <button class="quick-action-btn" onclick="openBookingModal(1)">Book Now</button>
                </div>
            `;
        }
        
        addMessage(response, 'ai');
    }, 1000);
}

// Voice input functions
function startVoiceInput() {
    if (!recognition) {
        showNotification('Voice recognition not supported in this browser.', 'error');
        return;
    }
    
    const micButton = document.getElementById('micButton');
    micButton.classList.add('recording');
    micButton.innerHTML = '<i class="fas fa-stop"></i>';
    
    recognition.start();
    isRecording = true;
}

function stopVoiceInput() {
    if (recognition) {
        recognition.stop();
    }
    
    const micButton = document.getElementById('micButton');
    micButton.classList.remove('recording');
    micButton.innerHTML = '<i class="fas fa-microphone"></i>';
    
    isRecording = false;
}

// Initialize featured movie
function initializeFeaturedMovie() {
    const featuredMovie = movies[0]; // Show first movie as featured
    document.getElementById('featuredPoster').style.backgroundImage = `url('${featuredMovie.poster}')`;
    document.getElementById('featuredTitle').textContent = featuredMovie.title;
    document.getElementById('featuredGenre').textContent = featuredMovie.genre;
    document.getElementById('featuredRating').textContent = `⭐ ${featuredMovie.rating}`;
}

// Left Side Voice Assistant Functionality
let voiceAssistantActive = false;
let isVoiceRecording = false;
let voiceRecognition = null;
let speechSynthesis = window.speechSynthesis;
let chatGptApiKey = localStorage.getItem('chatgpt_api_key') || '';

// Initialize Web Speech API
function initializeVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        voiceRecognition = new SpeechRecognition();
        
        voiceRecognition.continuous = false;
        voiceRecognition.interimResults = false;
        voiceRecognition.lang = 'en-US';
        
        voiceRecognition.onstart = function() {
            console.log('Voice recognition started');
            updateVoiceStatus('Listening...');
            showListeningIndicator(true);
            updateVoiceIndicator(true);
        };
        
        voiceRecognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            console.log('Voice input received:', transcript);
            addVoiceMessage(transcript, 'user');
            processVoiceInput(transcript);
        };
        
        voiceRecognition.onerror = function(event) {
            console.error('Voice recognition error:', event.error);
            updateVoiceStatus('Error: ' + event.error);
            stopVoiceRecording();
        };
        
        voiceRecognition.onend = function() {
            console.log('Voice recognition ended');
            stopVoiceRecording();
        };
    } else {
        console.error('Speech recognition not supported');
        updateVoiceStatus('Speech recognition not supported in this browser');
    }
}

// Toggle voice assistant left panel
function toggleVoiceAssistantLeft() {
    const assistant = document.getElementById('voiceAssistantLeft');
    voiceAssistantActive = !voiceAssistantActive;
    
    if (voiceAssistantActive) {
        assistant.classList.add('active');
        if (!voiceRecognition) {
            initializeVoiceRecognition();
        }
    } else {
        assistant.classList.remove('active');
        if (isVoiceRecording) {
            stopVoiceRecording();
        }
    }
}

// Minimize voice assistant
function minimizeVoiceAssistant() {
    const assistant = document.getElementById('voiceAssistantLeft');
    assistant.classList.remove('active');
    voiceAssistantActive = false;
    if (isVoiceRecording) {
        stopVoiceRecording();
    }
}

// Toggle voice recording
function toggleVoiceRecording() {
    if (!voiceRecognition) {
        initializeVoiceRecognition();
        return;
    }
    
    if (!chatGptApiKey) {
        showNotification('Please configure your ChatGPT API key first', 'error');
        return;
    }
    
    if (isVoiceRecording) {
        stopVoiceRecording();
    } else {
        startVoiceRecording();
    }
}

// Start voice recording
function startVoiceRecording() {
    if (!voiceRecognition) return;
    
    try {
        voiceRecognition.start();
        isVoiceRecording = true;
        updateVoiceButtons(true);
        updateVoiceStatus('Listening... Speak now!');
        showListeningIndicator(true);
        updateVoiceIndicator(true);
    } catch (error) {
        console.error('Error starting voice recognition:', error);
        updateVoiceStatus('Error starting voice recognition');
    }
}

// Stop voice recording
function stopVoiceRecording() {
    if (voiceRecognition && isVoiceRecording) {
        voiceRecognition.stop();
    }
    
    isVoiceRecording = false;
    updateVoiceButtons(false);
    updateVoiceStatus('Ready to listen');
    showListeningIndicator(false);
    updateVoiceIndicator(false);
}

// Update voice buttons state
function updateVoiceButtons(recording) {
    const micBtn = document.getElementById('voiceMicBtn');
    const stopBtn = document.getElementById('stopBtn');
    
    if (recording) {
        micBtn.classList.add('recording');
        micBtn.innerHTML = '<i class="fas fa-microphone"></i><span>Recording...</span>';
        micBtn.style.display = 'none';
        stopBtn.style.display = 'flex';
    } else {
        micBtn.classList.remove('recording');
        micBtn.innerHTML = '<i class="fas fa-microphone"></i><span>Start Listening</span>';
        micBtn.style.display = 'flex';
        stopBtn.style.display = 'none';
    }
}

// Update voice status
function updateVoiceStatus(status) {
    const statusElement = document.getElementById('voiceStatus');
    if (statusElement) {
        statusElement.innerHTML = `<span>${status}</span>`;
    }
}

// Show/hide listening indicator
function showListeningIndicator(show) {
    const indicator = document.getElementById('listeningIndicator');
    if (show) {
        indicator.classList.add('active');
    } else {
        indicator.classList.remove('active');
    }
}

// Update voice indicator
function updateVoiceIndicator(listening) {
    const indicator = document.getElementById('voiceIndicator');
    if (listening) {
        indicator.classList.add('listening');
    } else {
        indicator.classList.remove('listening');
    }
}

// Add voice message to chat
function addVoiceMessage(message, sender) {
    const messagesContainer = document.getElementById('voiceMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `voice-message ${sender === 'user' ? 'user-voice-message' : 'ai-voice-message'}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'voice-avatar';
    avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    const textDiv = document.createElement('div');
    textDiv.className = 'voice-text';
    textDiv.innerHTML = `<p>${message}</p>`;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(textDiv);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Save API key
function saveApiKey() {
    const apiKeyInput = document.getElementById('apiKeyInput');
    const apiKey = apiKeyInput.value.trim();
    
    if (apiKey) {
        chatGptApiKey = apiKey;
        localStorage.setItem('chatgpt_api_key', apiKey);
        showNotification('API key saved successfully!', 'success');
        apiKeyInput.value = '';
        
        // Hide API config section after saving
        document.getElementById('apiConfig').style.display = 'none';
    } else {
        showNotification('Please enter a valid API key', 'error');
    }
}

// Process voice input with ChatGPT
async function processVoiceInput(transcript) {
    if (!chatGptApiKey) {
        addVoiceMessage('Please configure your ChatGPT API key first.', 'ai');
        return;
    }
    
    updateVoiceStatus('Processing...');
    
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${chatGptApiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful movie booking assistant for CineMax cinema. Help users with movie information, booking tickets, theater details, and movie recommendations. Keep responses concise and friendly.'
                    },
                    {
                        role: 'user',
                        content: transcript
                    }
                ],
                max_tokens: 200,
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        
        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        
        addVoiceMessage(aiResponse, 'ai');
        speakResponse(aiResponse);
        updateVoiceStatus('Ready to listen');
        
    } catch (error) {
        console.error('Error processing voice input:', error);
        const errorMessage = 'Sorry, I encountered an error processing your request. Please check your API key and try again.';
        addVoiceMessage(errorMessage, 'ai');
        updateVoiceStatus('Error occurred');
    }
}

// Text to speech
function speakResponse(text) {
    if (speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        // Try to use a more natural voice
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => 
            voice.name.includes('Female') || 
            voice.name.includes('Samantha') || 
            voice.name.includes('Karen') ||
            voice.name.includes('Google US English Female')
        );
        
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }
        
        speechSynthesis.speak(utterance);
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            container.removeChild(notification);
        }, 300);
    }, 3000);
}

// Voice assistant initialization will be added to the existing DOMContentLoaded event 