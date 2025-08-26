// Movie data
const movies = [
    {
        id: 1,
        title: "The Dark Knight Returns",
        genre: "Action, Drama",
        duration: "2h 32m",
        rating: 4.8,
        poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop",
        description: "A thrilling superhero action film with intense drama and stunning visuals."
    },
    {
        id: 2,
        title: "Inception",
        genre: "Sci-Fi, Thriller",
        duration: "2h 28m",
        rating: 4.7,
        poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=450&fit=crop",
        description: "A mind-bending science fiction thriller about dreams within dreams."
    },
    {
        id: 3,
        title: "The Shawshank Redemption",
        genre: "Drama",
        duration: "2h 22m",
        rating: 4.9,
        poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop",
        description: "A powerful story of hope and friendship in the face of adversity."
    },
    {
        id: 4,
        title: "Pulp Fiction",
        genre: "Crime, Drama",
        duration: "2h 34m",
        rating: 4.6,
        poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=300&h=450&fit=crop",
        description: "A groundbreaking crime drama with interconnected stories."
    },
    {
        id: 5,
        title: "The Matrix",
        genre: "Sci-Fi, Action",
        duration: "2h 16m",
        rating: 4.5,
        poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop",
        description: "A revolutionary science fiction film about reality and illusion."
    },
    {
        id: 6,
        title: "Forrest Gump",
        genre: "Drama, Romance",
        duration: "2h 22m",
        rating: 4.8,
        poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=450&fit=crop",
        description: "A heartwarming story of an extraordinary man's journey through life."
    }
];

// Global variables
let selectedMovie = null;
let selectedSeats = [];
let seatPrice = 12.99;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    displayMovies();
    setupNavigation();
    setupModal();
    setMinDate();
    generateSeats();
});

// Display movies in the grid
function displayMovies() {
    const moviesGrid = document.getElementById('moviesGrid');
    
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
                <div class="movie-meta">
                    <span>${movie.genre}</span>
                    <div class="movie-rating">
                        <i class="fas fa-star"></i>
                        <span>${movie.rating}</span>
                    </div>
                </div>
                <div class="movie-meta">
                    <span>${movie.duration}</span>
                    <span>$${seatPrice}</span>
                </div>
                <button class="book-button" onclick="openBookingModal(${movie.id})">Book Now</button>
            </div>
        `;
        moviesGrid.appendChild(movieCard);
    });
}

// Setup navigation
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Setup modal
function setupModal() {
    const modal = document.getElementById('bookingModal');
    const closeBtn = document.querySelector('.close');

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        resetBooking();
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            resetBooking();
        }
    });
}

// Set minimum date for booking
function setMinDate() {
    const dateInput = document.getElementById('dateSelect');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    dateInput.value = today;
}

// Generate seats
function generateSeats() {
    const seatsContainer = document.getElementById('seatsContainer');
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    
    rows.forEach(row => {
        for (let col = 1; col <= 10; col++) {
            const seat = document.createElement('div');
            const seatId = `${row}${col}`;
            seat.className = 'seat available';
            seat.textContent = seatId;
            seat.setAttribute('data-seat', seatId);
            
            // Randomly occupy some seats
            if (Math.random() < 0.3) {
                seat.className = 'seat occupied';
            }
            
            // Add click event for seat selection (both single and multi)
            seat.addEventListener('click', (e) => {
                e.preventDefault();
                if (seat.classList.contains('occupied')) {
                    showNotification('This seat is already occupied!', 'error');
                    return;
                }
                
                const seatId = seat.getAttribute('data-seat');
                const seatCount = parseInt(document.getElementById('seatCount').value);
                
                if (seat.classList.contains('selected')) {
                    // Deselect seat
                    seat.classList.remove('selected');
                    selectedSeats = selectedSeats.filter(s => s !== seatId);
                    showNotification(`Seat ${seatId} deselected`);
                } else {
                    // Select seat if within limit
                    if (selectedSeats.length < seatCount) {
                        seat.classList.add('selected');
                        selectedSeats.push(seatId);
                        showNotification(`Seat ${seatId} selected`);
                        
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
            
            seatsContainer.appendChild(seat);
        }
    });
}

// Simple seat selection function
function selectSeat(seatElement) {
    if (seatElement.classList.contains('occupied')) {
        return;
    }
    
    const seatId = seatElement.getAttribute('data-seat');
    const seatCount = parseInt(document.getElementById('seatCount').value);
    
    if (seatElement.classList.contains('selected')) {
        // Deselect seat
        seatElement.classList.remove('selected');
        selectedSeats = selectedSeats.filter(seat => seat !== seatId);
    } else {
        // Select seat if within limit
        if (selectedSeats.length < seatCount) {
            seatElement.classList.add('selected');
            selectedSeats.push(seatId);
        } else {
            alert(`You can only select ${seatCount} seats.`);
        }
    }
    
    updateBookingSummary();
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
    }
}

// Reset booking
function resetBooking() {
    selectedSeats = [];
    document.querySelectorAll('.seat.selected').forEach(seat => {
        seat.classList.remove('selected');
        seat.classList.add('available');
    });
    updateBookingSummary();
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
        totalPrice: (selectedSeats.length * seatPrice).toFixed(2)
    };
    
    // Show loading notification
    showNotification('Processing your booking...', 'success');
    
    // Simulate booking confirmation with delay
    setTimeout(() => {
        showBookingConfirmation(bookingDetails);
        showNotification('Booking confirmed successfully!', 'success');
    }, 1500);
}

// Show booking confirmation
function showBookingConfirmation(booking) {
    const modal = document.getElementById('bookingModal');
    const modalContent = document.querySelector('.modal-content');
    
    modalContent.innerHTML = `
        <div style="padding: 3rem; text-align: center;">
            <div style="font-size: 4rem; color: #27ae60; margin-bottom: 1rem;">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2 style="color: #2c3e50; margin-bottom: 1rem;">Booking Confirmed!</h2>
            <div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; margin: 2rem 0;">
                <h3 style="color: #2c3e50; margin-bottom: 1rem;">${booking.movie}</h3>
                <p><strong>Theater:</strong> ${booking.theater}</p>
                <p><strong>Date:</strong> ${booking.date}</p>
                <p><strong>Time:</strong> ${booking.time}</p>
                <p><strong>Seats:</strong> ${booking.seats.join(', ')}</p>
                <p><strong>Total:</strong> $${booking.totalPrice}</p>
            </div>
            <p style="color: #7f8c8d; margin-bottom: 2rem;">
                A confirmation email has been sent to your registered email address.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <button onclick="downloadTicket(${JSON.stringify(booking).replace(/"/g, '&quot;')})" style="background: linear-gradient(45deg, #3498db, #2980b9); color: white; border: none; padding: 15px 30px; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-download"></i> Download Ticket
                </button>
                <button onclick="closeModal()" style="background: linear-gradient(45deg, #27ae60, #2ecc71); color: white; border: none; padding: 15px 30px; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer;">
                    Close
                </button>
            </div>
        </div>
    `;
}

// Download ticket function
function downloadTicket(booking) {
    // Generate a unique booking ID
    const bookingId = 'CM' + Date.now().toString().slice(-8);
    
    // Create ticket HTML content
    const ticketHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Movie Ticket - ${booking.movie}</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: 'Poppins', sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }
                .ticket {
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    overflow: hidden;
                    max-width: 400px;
                    width: 100%;
                    position: relative;
                }
                .ticket-header {
                    background: linear-gradient(45deg, #e74c3c, #c0392b);
                    color: white;
                    padding: 2rem;
                    text-align: center;
                    position: relative;
                }
                .ticket-header::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: repeating-linear-gradient(
                        to right,
                        transparent,
                        transparent 10px,
                        rgba(255, 255, 255, 0.3) 10px,
                        rgba(255, 255, 255, 0.3) 20px
                    );
                }
                .ticket-header h1 {
                    font-size: 1.5rem;
                    margin-bottom: 0.5rem;
                    font-weight: 700;
                }
                .ticket-header p {
                    opacity: 0.9;
                    font-size: 0.9rem;
                }
                .ticket-body {
                    padding: 2rem;
                }
                .ticket-info {
                    margin-bottom: 1.5rem;
                }
                .ticket-info h3 {
                    color: #2c3e50;
                    margin-bottom: 1rem;
                    font-size: 1.2rem;
                    border-bottom: 2px solid #ecf0f1;
                    padding-bottom: 0.5rem;
                }
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.8rem;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid #f8f9fa;
                }
                .info-label {
                    font-weight: 600;
                    color: #7f8c8d;
                }
                .info-value {
                    font-weight: 500;
                    color: #2c3e50;
                }
                .qr-section {
                    text-align: center;
                    margin-top: 2rem;
                    padding-top: 1.5rem;
                    border-top: 2px solid #ecf0f1;
                }
                .qr-code {
                    width: 100px;
                    height: 100px;
                    background: #f8f9fa;
                    border: 2px solid #e1e8ed;
                    border-radius: 10px;
                    margin: 0 auto 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.7rem;
                    color: #7f8c8d;
                    font-family: monospace;
                }
                .booking-id {
                    font-size: 0.9rem;
                    color: #7f8c8d;
                    font-weight: 500;
                }
                .ticket-footer {
                    background: #f8f9fa;
                    padding: 1rem 2rem;
                    text-align: center;
                    color: #7f8c8d;
                    font-size: 0.8rem;
                }
                .seat-badge {
                    background: #e74c3c;
                    color: white;
                    padding: 0.3rem 0.8rem;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    margin: 0.2rem;
                    display: inline-block;
                }
                @media print {
                    body {
                        background: white;
                    }
                    .ticket {
                        box-shadow: none;
                        border: 2px solid #ddd;
                    }
                }
            </style>
        </head>
        <body>
            <div class="ticket">
                <div class="ticket-header">
                    <h1><i class="fas fa-film"></i> CineMax</h1>
                    <p>Premium Movie Experience</p>
                </div>
                <div class="ticket-body">
                    <div class="ticket-info">
                        <h3>${booking.movie}</h3>
                        <div class="info-row">
                            <span class="info-label">Theater:</span>
                            <span class="info-value">${booking.theater}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Date:</span>
                            <span class="info-value">${booking.date}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Time:</span>
                            <span class="info-value">${booking.time}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Seats:</span>
                            <span class="info-value">
                                ${booking.seats.map(seat => `<span class="seat-badge">${seat}</span>`).join('')}
                            </span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Total:</span>
                            <span class="info-value">$${booking.totalPrice}</span>
                        </div>
                    </div>
                    <div class="qr-section">
                        <div class="qr-code">
                            ${bookingId}
                        </div>
                        <div class="booking-id">Booking ID: ${bookingId}</div>
                    </div>
                </div>
                <div class="ticket-footer">
                    <p>Please arrive 15 minutes before the show time</p>
                    <p>Present this ticket at the entrance</p>
                </div>
            </div>
        </body>
        </html>
    `;
    
    // Create a blob and download the ticket
    const blob = new Blob([ticketHTML], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket_${bookingId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    // Show success message
    showNotification('Ticket downloaded successfully!', 'success');
}

// Close modal
function closeModal() {
    document.getElementById('bookingModal').style.display = 'none';
    setupModal(); // Re-setup modal for future use
}

// Scroll to movies section
function scrollToMovies() {
    document.getElementById('movies').scrollIntoView({ behavior: 'smooth' });
}

// Smooth scrolling for navigation
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

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Contact form submission
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simulate form submission
    const formData = new FormData(this);
    const submitButton = this.querySelector('button');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
});

// Seat count change handler
document.getElementById('seatCount').addEventListener('change', function() {
    const seatCount = parseInt(this.value);
    if (selectedSeats.length > seatCount) {
        // Remove excess selected seats
        const seatsToRemove = selectedSeats.slice(seatCount);
        seatsToRemove.forEach(seatId => {
            const seatElement = document.querySelector(`[data-seat="${seatId}"]`);
            if (seatElement) {
                seatElement.classList.remove('selected');
            }
        });
        selectedSeats = selectedSeats.slice(0, seatCount);
        updateBookingSummary();
    }
});

// Update booking progress
function updateBookingProgress(step) {
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((stepElement, index) => {
        stepElement.classList.remove('active', 'completed');
        if (index + 1 < step) {
            stepElement.classList.add('completed');
        } else if (index + 1 === step) {
            stepElement.classList.add('active');
        }
    });
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add some interactive animations
function addAnimations() {
    // Animate movie cards on scroll
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
    
    document.querySelectorAll('.movie-card, .theater-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Initialize animations
document.addEventListener('DOMContentLoaded', addAnimations);

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// AI Assistant Variables
let isChatOpen = false;
let conversationHistory = [];

// AI Assistant Functions
function toggleChat() {
    const aiAssistant = document.getElementById('aiAssistant');
    const aiToggle = document.getElementById('aiToggle');
    const aiNotification = document.getElementById('aiNotification');
    
    isChatOpen = !isChatOpen;
    
    if (isChatOpen) {
        aiAssistant.classList.add('active');
        aiToggle.classList.add('hidden');
        aiNotification.style.display = 'none';
    } else {
        aiAssistant.classList.remove('active');
        aiToggle.classList.remove('hidden');
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
    
    if (message === '') return;
    
    // Add user message to chat
    addMessage(message, 'user');
    userInput.value = '';
    
    // Process message with AI
    processAIResponse(message);
}

function addMessage(content, sender) {
    const chatBody = document.getElementById('chatBody');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div class="message-content">
                <i class="fas fa-user"></i>
                <div class="message-text">
                    <p>${content}</p>
                </div>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                <i class="fas fa-robot"></i>
                <div class="message-text">
                    ${content}
                </div>
            </div>
        `;
    }
    
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Add to conversation history
    conversationHistory.push({ sender, content, timestamp: new Date() });
}

async function processAIResponse(userMessage) {
    // Show loading message
    addMessage('<span style="opacity:0.7"><i class="fas fa-spinner fa-spin"></i> AI is thinking...</span>', 'ai');
    const chatBody = document.getElementById('chatBody');
    chatBody.scrollTop = chatBody.scrollHeight;

    // Simulate AI thinking time
    setTimeout(() => {
        // Remove loading message
        const loadingMsg = chatBody.querySelector('.ai-message:last-child');
        if (loadingMsg) chatBody.removeChild(loadingMsg);
        
        // Generate smart response based on user input
        const response = generateAIResponse(userMessage);
        addMessage(response, 'ai');
        
        // Update conversation history
        conversationHistory.push(
            { role: 'user', content: userMessage },
            { role: 'assistant', content: response }
        );
        
        // Keep conversation history manageable
        if (conversationHistory.length > 20) {
            conversationHistory = conversationHistory.slice(-20);
        }
    }, 1000);
    
    return '';
}

function generateAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('book') || lowerMessage.includes('ticket') || lowerMessage.includes('reserve')) {
        return `
            <p><strong>I can help you book tickets! 🎫</strong></p>
            <p>Here's how to book your movie:</p>
            <ol>
                <li>Browse our movies below</li>
                <li>Click "Book Now" on your chosen movie</li>
                <li>Select theater, date, time, and seats</li>
                <li>Confirm your booking</li>
                <li>Download your ticket</li>
            </ol>
            <p><strong>Ready to start?</strong></p>
            <div class="quick-actions">
                <button class="quick-action-btn" onclick="scrollToMovies()">Browse Movies</button>
                <button class="quick-action-btn" onclick="openBookingModal(1)">Book Dark Knight</button>
                <button class="quick-action-btn" onclick="openBookingModal(2)">Book Inception</button>
            </div>
        `;
    } else if (lowerMessage.includes('movie') || lowerMessage.includes('recommend') || lowerMessage.includes('suggestion')) {
        const topMovies = movies.sort((a, b) => b.rating - a.rating).slice(0, 3);
        return `
            <p><strong>🎬 Top Movie Recommendations:</strong></p>
            <ul>
                ${topMovies.map(movie => `
                    <li><strong>${movie.title}</strong> ⭐ ${movie.rating}/5 - ${movie.genre}</li>
                `).join('')}
            </ul>
            <p>These are our highest-rated movies right now!</p>
            <div class="quick-actions">
                <button class="quick-action-btn" onclick="openBookingModal(${topMovies[0].id})">Book ${topMovies[0].title}</button>
                <button class="quick-action-btn" onclick="scrollToMovies()">View All Movies</button>
            </div>
        `;
    } else if (lowerMessage.includes('theater') || lowerMessage.includes('location') || lowerMessage.includes('cinema')) {
        return `
            <p><strong>🏢 Our Premium Theaters:</strong></p>
            <ul>
                <li><strong>CineMax Downtown:</strong> 8 screens, Dolby Atmos Sound, Recliner Seats, 4K Projection</li>
                <li><strong>CineMax Mall:</strong> 12 screens, IMAX Experience, Premium Food Service, VIP Lounges</li>
                <li><strong>CineMax Premium:</strong> Luxury cinema experience, Butler Service, Gourmet Menu, Private Screening</li>
            </ul>
            <p>All theaters offer premium experiences with the latest technology!</p>
            <div class="quick-actions">
                <button class="quick-action-btn" onclick="document.getElementById('theaters').scrollIntoView({behavior: 'smooth'})">View Theaters</button>
            </div>
        `;
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
        return `
            <p><strong>💰 Ticket Pricing:</strong></p>
            <ul>
                <li>Standard Ticket: <strong>$12.99</strong> per seat</li>
                <li>Total price depends on number of seats selected</li>
                <li>All theaters have the same pricing</li>
                <li>No additional fees or charges</li>
            </ul>
            <p>Ready to book? Choose a movie and I'll help you through the process!</p>
            <div class="quick-actions">
                <button class="quick-action-btn" onclick="scrollToMovies()">Browse Movies</button>
            </div>
        `;
    } else if (lowerMessage.includes('seat') || lowerMessage.includes('sitting')) {
        return `
            <p><strong>🎭 Seat Selection Guide:</strong></p>
            <ul>
                <li>Click on any available seat to select it</li>
                <li>You can select multiple seats (up to your chosen limit)</li>
                <li>Selected seats are highlighted in red</li>
                <li>Click again to deselect a seat</li>
                <li>Occupied seats are grayed out</li>
            </ul>
            <p><strong>Pro tip:</strong> Middle seats (rows D-F) offer the best viewing experience!</p>
        `;
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return `
            <p>Hello! 👋 I'm your movie booking assistant.</p>
            <p>I can help you with:</p>
            <ul>
                <li>🎬 Finding movies and recommendations</li>
                <li>🎫 Booking tickets step by step</li>
                <li>🏢 Theater information and locations</li>
                <li>💰 Pricing details</li>
                <li>🎭 Seat selection tips</li>
            </ul>
            <p>What would you like to know?</p>
            <div class="quick-actions">
                <button class="quick-action-btn" onclick="scrollToMovies()">Browse Movies</button>
                <button class="quick-action-btn" onclick="openBookingModal(1)">Book Now</button>
            </div>
        `;
    } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
        return `
            <p><strong>🆘 How can I help you?</strong></p>
            <p>I'm here to assist with:</p>
            <ul>
                <li>Movie recommendations and reviews</li>
                <li>Step-by-step booking guidance</li>
                <li>Theater locations and amenities</li>
                <li>Pricing information</li>
                <li>Seat selection tips</li>
                <li>General movie booking questions</li>
            </ul>
            <p>Just ask me anything about movies or booking!</p>
        `;
    } else {
        return `
            <p>I'm here to help with your movie booking needs! 🎬</p>
            <p>You can ask me about:</p>
            <ul>
                <li>🎬 Movie recommendations and reviews</li>
                <li>🎫 Booking tickets step by step</li>
                <li>🏢 Theater locations and amenities</li>
                <li>💰 Pricing information</li>
                <li>🎭 Seat selection tips</li>
            </ul>
            <p>Try asking: "Help me book tickets" or "Recommend movies"</p>
            <div class="quick-actions">
                <button class="quick-action-btn" onclick="scrollToMovies()">Browse Movies</button>
                <button class="quick-action-btn" onclick="openBookingModal(1)">Book Now</button>
            </div>
        `;
    }
}

// Helper functions for AI assistant
function showBookingHelp() {
    addMessage(`
        <p><strong>Complete Booking Guide:</strong></p>
        <ol>
            <li><strong>Choose a Movie:</strong> Browse our selection and click "Book Now"</li>
            <li><strong>Select Theater:</strong> Choose from our 3 premium locations</li>
            <li><strong>Pick Date & Time:</strong> Select your preferred showtime</li>
            <li><strong>Choose Seats:</strong> Click on seats in the interactive map</li>
            <li><strong>Confirm Booking:</strong> Review and confirm your selection</li>
            <li><strong>Download Ticket:</strong> Get your printable ticket</li>
        </ol>
        <p>Ready to start? Let me know if you need help with any step!</p>
    `, 'ai');
}

// Smart AI Recommendations
function getMovieRecommendations() {
    const recommendations = movies
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
    
    return `
        <p><strong>Top Movie Recommendations:</strong></p>
        <ul>
            ${recommendations.map(movie => `
                <li><strong>${movie.title}</strong> ⭐ ${movie.rating}/5 - ${movie.genre}</li>
            `).join('')}
        </ul>
        <p>These are our highest-rated movies right now!</p>
        <div class="quick-actions">
            <button class="quick-action-btn" onclick="openBookingModal(${recommendations[0].id})">Book ${recommendations[0].title}</button>
            <button class="quick-action-btn" onclick="scrollToMovies()">View All Movies</button>
        </div>
    `;
}

// AI Booking Assistant
function assistWithBooking() {
    addMessage(`
        <p><strong>Let me help you book your tickets!</strong></p>
        <p>I'll guide you through each step:</p>
        <ol>
            <li>First, let's find a movie you like</li>
            <li>Then choose your preferred theater</li>
            <li>Pick a convenient date and time</li>
            <li>Select your perfect seats</li>
            <li>Confirm and download your ticket</li>
        </ol>
        <p>What type of movie are you in the mood for?</p>
        <div class="quick-actions">
            <button class="quick-action-btn" onclick="showActionMovies()">Action</button>
            <button class="quick-action-btn" onclick="showDramaMovies()">Drama</button>
            <button class="quick-action-btn" onclick="showScifiMovies()">Sci-Fi</button>
            <button class="quick-action-btn" onclick="scrollToMovies()">Browse All</button>
        </div>
    `, 'ai');
}

function showActionMovies() {
    const actionMovies = movies.filter(movie => 
        movie.genre.toLowerCase().includes('action')
    );
    
    addMessage(`
        <p><strong>Action Movies Available:</strong></p>
        <ul>
            ${actionMovies.map(movie => `
                <li><strong>${movie.title}</strong> ⭐ ${movie.rating}/5 - ${movie.duration}</li>
            `).join('')}
        </ul>
        <p>Great choices for an exciting night out!</p>
        <div class="quick-actions">
            <button class="quick-action-btn" onclick="openBookingModal(${actionMovies[0].id})">Book ${actionMovies[0].title}</button>
        </div>
    `, 'ai');
}

function showDramaMovies() {
    const dramaMovies = movies.filter(movie => 
        movie.genre.toLowerCase().includes('drama')
    );
    
    addMessage(`
        <p><strong>Drama Movies Available:</strong></p>
        <ul>
            ${dramaMovies.map(movie => `
                <li><strong>${movie.title}</strong> ⭐ ${movie.rating}/5 - ${movie.duration}</li>
            `).join('')}
        </ul>
        <p>Perfect for a thoughtful movie experience!</p>
        <div class="quick-actions">
            <button class="quick-action-btn" onclick="openBookingModal(${dramaMovies[0].id})">Book ${dramaMovies[0].title}</button>
        </div>
    `, 'ai');
}

function showScifiMovies() {
    const scifiMovies = movies.filter(movie => 
        movie.genre.toLowerCase().includes('sci-fi')
    );
    
    addMessage(`
        <p><strong>Sci-Fi Movies Available:</strong></p>
        <ul>
            ${scifiMovies.map(movie => `
                <li><strong>${movie.title}</strong> ⭐ ${movie.rating}/5 - ${movie.duration}</li>
            `).join('')}
        </ul>
        <p>Mind-bending adventures await!</p>
        <div class="quick-actions">
            <button class="quick-action-btn" onclick="openBookingModal(${scifiMovies[0].id})">Book ${scifiMovies[0].title}</button>
        </div>
    `, 'ai');
}

function scrollToTheaters() {
    document.getElementById('theaters').scrollIntoView({ behavior: 'smooth' });
}

function scrollToContact() {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}

// Initialize featured movie
function initializeFeaturedMovie() {
    const featuredMovie = movies[0]; // Use the first movie as featured
    const featuredTitle = document.querySelector('.featured-info h2');
    const featuredGenre = document.querySelector('.featured-info h3');
    const featuredDescription = document.querySelector('.movie-description');
    const featuredRating = document.querySelector('.rating-value');
    const featuredDuration = document.querySelector('.duration-value');
    const featuredYear = document.querySelector('.year-value');
    const featuredPoster = document.querySelector('.poster-container');
    
    if (featuredTitle) featuredTitle.textContent = featuredMovie.title;
    if (featuredGenre) featuredGenre.textContent = featuredMovie.genre;
    if (featuredDescription) featuredDescription.textContent = featuredMovie.description;
    if (featuredRating) featuredRating.textContent = featuredMovie.rating;
    if (featuredDuration) featuredDuration.textContent = featuredMovie.duration;
    if (featuredYear) featuredYear.textContent = '2024';
    if (featuredPoster) {
        featuredPoster.style.backgroundImage = `url('${featuredMovie.poster}')`;
    }
}

// Call featured movie initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeFeaturedMovie();
}); 

// Voice Assistant Variables
let recognition;
let isRecording = false;
let isVoiceAssistantOpen = false;
let voiceConversationHistory = [];
let speechSynthesis = window.speechSynthesis;
let speaking = false;

// Voice Assistant Functions
function toggleVoiceAssistant() {
    const voiceAssistant = document.getElementById('voiceAssistant');
    const voiceToggle = document.querySelector('.voice-toggle');
    
    isVoiceAssistantOpen = !isVoiceAssistantOpen;
    
    if (isVoiceAssistantOpen) {
        voiceAssistant.classList.add('open');
        voiceToggle.classList.add('active');
        startVoiceListening();
    } else {
        voiceAssistant.classList.remove('open');
        voiceToggle.classList.remove('active');
        stopVoiceListening();
    }
}

function startVoiceListening() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showNotification('Voice recognition not supported in this browser.', 'error');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 3; // Get multiple alternatives for better accuracy
    recognition.continuous = false;

    const voiceMicButton = document.getElementById('voiceMicBtn');
    if (voiceMicButton) {
        voiceMicButton.classList.add('recording');
        voiceMicButton.innerHTML = '<i class="fas fa-stop"></i><span>Stop Listening</span>';
    }
    isRecording = true;
    
    // Show listening indicator
    showListeningIndicator(true);

    recognition.onresult = function(event) {
        let transcript = event.results[0][0].transcript;
        console.log('Voice input:', transcript); // Debug log
        
        // Try to get better alternatives if available
        if (event.results[0].length > 1) {
            const alternatives = event.results[0];
            console.log('Alternatives:', alternatives.map(alt => alt.transcript));
            
            // Use the most confident result or the first one
            transcript = alternatives[0].transcript;
        }
        
        // Hide listening indicator
        showListeningIndicator(false);
        
        // Show what was heard
        addVoiceMessage(`🎤 Heard: "${transcript}"`, 'user');
        
        // Process the command
        processVoiceAIResponse(transcript);
    };
    
    recognition.onerror = function(event) {
        console.error('Voice recognition error:', event.error);
        showNotification('Voice recognition error: ' + event.error, 'error');
        stopVoiceListening();
    };
    
    recognition.onend = function() {
        stopVoiceListening();
    };
    
    recognition.start();
}

function showListeningIndicator(isListening) {
    let indicator = document.getElementById('listeningIndicator');
    if (!indicator) return;
    
    if (isListening) {
        indicator.innerHTML = `
            <div class=\"listening-content\">
                <div class=\"listening-icon\"><i class=\"fas fa-microphone\"></i></div>
                <div class=\"listening-text\">Listening...</div>
                <div class=\"listening-waves\">
                    <div class=\"wave\"></div>
                    <div class=\"wave\"></div>
                    <div class=\"wave\"></div>
                </div>
            </div>
        `;
        indicator.classList.add('active');
    } else {
        indicator.innerHTML = '';
        indicator.classList.remove('active');
    }
}

function stopVoiceListening() {
    if (recognition && isRecording) {
        recognition.stop();
    }
    
    const voiceMicButton = document.getElementById('voiceMicBtn');
    if (voiceMicButton) {
        voiceMicButton.classList.remove('recording');
        voiceMicButton.innerHTML = '<i class="fas fa-microphone"></i><span>Hold to Speak</span>';
    }
    isRecording = false;
    
    // Hide listening indicator
    showListeningIndicator(false);
}

function addVoiceMessage(content, sender) {
    const voiceBody = document.getElementById('voiceBody');
    const messageDiv = document.createElement('div');
    messageDiv.className = `voice-message ${sender}-message`;
    
    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div class="voice-message-content">
                <div>
                    <p>${content}</p>
                </div>
                <i class="fas fa-user"></i>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="voice-message-content">
                <i class="fas fa-robot"></i>
                <div>${content}</div>
            </div>
        `;
    }
    
    voiceBody.appendChild(messageDiv);
    voiceBody.scrollTop = voiceBody.scrollHeight;
}

async function processVoiceAIResponse(userMessage) {
    // Show loading message
    addVoiceMessage('<span style="opacity:0.7"><i class="fas fa-spinner fa-spin"></i> AI is thinking...</span>', 'ai');
    
    // Simulate AI thinking time
    setTimeout(() => {
        // Remove loading message
        const loadingMsg = document.querySelector('.voice-message.ai-message:last-child');
        if (loadingMsg) loadingMsg.remove();
        
        // Generate smart response based on user input
        const response = generateVoiceAIResponse(userMessage);
        addVoiceMessage(response, 'ai');
        
        // Speak the response
        speakResponse(response);
        
        // Update conversation history
        voiceConversationHistory.push(
            { role: 'user', content: userMessage },
            { role: 'assistant', content: response }
        );
        
        // Keep conversation history manageable
        if (voiceConversationHistory.length > 10) {
            voiceConversationHistory = voiceConversationHistory.slice(-10);
        }
    }, 1000);
}

function generateVoiceAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Auto-booking commands - More flexible recognition with variations
    if (lowerMessage.includes('book dark knight') || lowerMessage.includes('book the dark knight') || lowerMessage.includes('dark knight') || lowerMessage.includes('the dark knight') || lowerMessage.includes('dark night') || lowerMessage.includes('knight')) {
        openBookingModal(1);
        return `Opening booking for The Dark Knight Returns. Please select your preferences in the booking window.`;
    } else if (lowerMessage.includes('book inception') || lowerMessage.includes('inception') || lowerMessage.includes('book movie ticket for inception') || lowerMessage.includes('book ticket for inception') || lowerMessage.includes('inception movie') || lowerMessage.includes('book inception movie')) {
        openBookingModal(2);
        return `Opening booking for Inception. Please select your preferences in the booking window.`;
    } else if (lowerMessage.includes('book shawshank') || lowerMessage.includes('book the shawshank') || lowerMessage.includes('shawshank') || lowerMessage.includes('the shawshank') || lowerMessage.includes('shawshank redemption') || lowerMessage.includes('redemption')) {
        openBookingModal(3);
        return `Opening booking for The Shawshank Redemption. Please select your preferences in the booking window.`;
    } else if (lowerMessage.includes('book pulp fiction') || lowerMessage.includes('pulp fiction') || lowerMessage.includes('pulp') || lowerMessage.includes('fiction')) {
        openBookingModal(4);
        return `Opening booking for Pulp Fiction. Please select your preferences in the booking window.`;
    } else if (lowerMessage.includes('book matrix') || lowerMessage.includes('book the matrix') || lowerMessage.includes('matrix') || lowerMessage.includes('the matrix') || lowerMessage.includes('matrix movie')) {
        openBookingModal(5);
        return `Opening booking for The Matrix. Please select your preferences in the booking window.`;
    } else if (lowerMessage.includes('book forrest gump') || lowerMessage.includes('forrest gump') || lowerMessage.includes('forrest') || lowerMessage.includes('gump')) {
        openBookingModal(6);
        return `Opening booking for Forrest Gump. Please select your preferences in the booking window.`;
    } else if (lowerMessage.includes('book tickets') || lowerMessage.includes('book movie') || lowerMessage.includes('reserve tickets') || lowerMessage.includes('book movie ticket') || lowerMessage.includes('book ticket') || lowerMessage.includes('book a movie') || lowerMessage.includes('book a ticket') || lowerMessage.includes('reserve a ticket') || lowerMessage.includes('buy tickets') || lowerMessage.includes('buy ticket')) {
        // Auto-select best movie and open booking
        const bestMovie = movies.sort((a, b) => b.rating - a.rating)[0];
        openBookingModal(bestMovie.id);
        return `Opening booking for ${bestMovie.title} (our highest rated movie). Please select your preferences in the booking window.`;
    }
    
    // Theater selection commands - More flexible
    else if (lowerMessage.includes('select downtown') || lowerMessage.includes('choose downtown') || lowerMessage.includes('downtown') || lowerMessage.includes('downtown theater') || lowerMessage.includes('downtown cinema')) {
        if (document.getElementById('theaterSelect')) {
            document.getElementById('theaterSelect').value = 'CineMax Downtown';
            return `Selected CineMax Downtown theater.`;
        }
        return `Please open a booking first by saying "book tickets" or "book [movie name]".`;
    } else if (lowerMessage.includes('select mall') || lowerMessage.includes('choose mall') || lowerMessage.includes('mall') || lowerMessage.includes('mall theater') || lowerMessage.includes('mall cinema')) {
        if (document.getElementById('theaterSelect')) {
            document.getElementById('theaterSelect').value = 'CineMax Mall';
            return `Selected CineMax Mall theater.`;
        }
        return `Please open a booking first by saying "book tickets" or "book [movie name]".`;
    } else if (lowerMessage.includes('select premium') || lowerMessage.includes('choose premium') || lowerMessage.includes('premium') || lowerMessage.includes('premium theater') || lowerMessage.includes('premium cinema')) {
        if (document.getElementById('theaterSelect')) {
            document.getElementById('theaterSelect').value = 'CineMax Premium';
            return `Selected CineMax Premium theater.`;
        }
        return `Please open a booking first by saying "book tickets" or "book [movie name]".`;
    }
    
    // Seat count commands - More flexible
    else if (lowerMessage.includes('one seat') || lowerMessage.includes('1 seat') || lowerMessage.includes('single seat') || lowerMessage.includes('one') || lowerMessage.includes('1') || lowerMessage.includes('single')) {
        if (document.getElementById('seatCount')) {
            document.getElementById('seatCount').value = '1';
            return `Selected 1 seat.`;
        }
        return `Please open a booking first by saying "book tickets" or "book [movie name]".`;
    } else if (lowerMessage.includes('two seats') || lowerMessage.includes('2 seats') || lowerMessage.includes('double seats') || lowerMessage.includes('two') || lowerMessage.includes('2') || lowerMessage.includes('double')) {
        if (document.getElementById('seatCount')) {
            document.getElementById('seatCount').value = '2';
            return `Selected 2 seats.`;
        }
        return `Please open a booking first by saying "book tickets" or "book [movie name]".`;
    } else if (lowerMessage.includes('three seats') || lowerMessage.includes('3 seats') || lowerMessage.includes('three') || lowerMessage.includes('3') || lowerMessage.includes('triple')) {
        if (document.getElementById('seatCount')) {
            document.getElementById('seatCount').value = '3';
            return `Selected 3 seats.`;
        }
        return `Please open a booking first by saying "book tickets" or "book [movie name]".`;
    } else if (lowerMessage.includes('four seats') || lowerMessage.includes('4 seats') || lowerMessage.includes('four') || lowerMessage.includes('4')) {
        if (document.getElementById('seatCount')) {
            document.getElementById('seatCount').value = '4';
            return `Selected 4 seats.`;
        }
        return `Please open a booking first by saying "book tickets" or "book [movie name]".`;
    } else if (lowerMessage.includes('five seats') || lowerMessage.includes('5 seats') || lowerMessage.includes('five') || lowerMessage.includes('5')) {
        if (document.getElementById('seatCount')) {
            document.getElementById('seatCount').value = '5';
            return `Selected 5 seats.`;
        }
        return `Please open a booking first by saying "book tickets" or "book [movie name]".`;
    }
    
    // Time selection commands
    else if (lowerMessage.includes('morning') || lowerMessage.includes('10 am') || lowerMessage.includes('10:00')) {
        if (document.getElementById('timeSelect')) {
            document.getElementById('timeSelect').value = '10:00 AM';
            return `Selected 10:00 AM showtime.`;
        }
        return `Please open a booking first by saying "book tickets" or "book [movie name]".`;
    } else if (lowerMessage.includes('afternoon') || lowerMessage.includes('1 pm') || lowerMessage.includes('1:00')) {
        if (document.getElementById('timeSelect')) {
            document.getElementById('timeSelect').value = '1:00 PM';
            return `Selected 1:00 PM showtime.`;
        }
        return `Please open a booking first by saying "book tickets" or "book [movie name]".`;
    } else if (lowerMessage.includes('evening') || lowerMessage.includes('7 pm') || lowerMessage.includes('7:00')) {
        if (document.getElementById('timeSelect')) {
            document.getElementById('timeSelect').value = '7:00 PM';
            return `Selected 7:00 PM showtime.`;
        }
        return `Please open a booking first by saying "book tickets" or "book [movie name]".`;
    } else if (lowerMessage.includes('night') || lowerMessage.includes('10 pm') || lowerMessage.includes('10:00 pm')) {
        if (document.getElementById('timeSelect')) {
            document.getElementById('timeSelect').value = '10:00 PM';
            return `Selected 10:00 PM showtime.`;
        }
        return `Please open a booking first by saying "book tickets" or "book [movie name]".`;
    }
    
    // Auto seat selection commands
    else if (lowerMessage.includes('select seats') || lowerMessage.includes('choose seats') || lowerMessage.includes('pick seats')) {
        if (document.getElementById('bookingModal').style.display === 'block') {
            // Auto-select best available seats
            const seatCount = parseInt(document.getElementById('seatCount').value);
            const availableSeats = document.querySelectorAll('.seat.available');
            
            if (availableSeats.length >= seatCount) {
                // Select middle seats if available
                const middleSeats = Array.from(availableSeats).filter(seat => {
                    const seatId = seat.getAttribute('data-seat');
                    return seatId && (seatId.includes('D') || seatId.includes('E') || seatId.includes('F'));
                });
                
                const seatsToSelect = middleSeats.length >= seatCount ? middleSeats.slice(0, seatCount) : availableSeats.slice(0, seatCount);
                
                seatsToSelect.forEach(seat => {
                    seat.click();
                });
                
                const selectedSeatIds = seatsToSelect.map(seat => seat.getAttribute('data-seat')).join(', ');
                return `Auto-selected seats: ${selectedSeatIds}. Say "confirm booking" to complete your booking!`;
            } else {
                return `Sorry, only ${availableSeats.length} seats are available. Please select fewer seats.`;
            }
        }
        return `Please open a booking first by saying "book tickets" or "book [movie name]".`;
    }
    
    // Confirmation commands
    else if (lowerMessage.includes('confirm booking') || lowerMessage.includes('confirm tickets') || lowerMessage.includes('book now')) {
        if (document.getElementById('bookingModal').style.display === 'block') {
            confirmBooking();
            return `Booking confirmed! Your ticket has been generated and downloaded.`;
        }
        return `Please open a booking first by saying "book tickets" or "book [movie name]".`;
    }
    
    // Information commands
    else if (lowerMessage.includes('movie') || lowerMessage.includes('recommend') || lowerMessage.includes('suggestion')) {
        const topMovies = movies.sort((a, b) => b.rating - a.rating).slice(0, 2);
        return `Top recommendations: ${topMovies[0].title} (${topMovies[0].rating}/5) and ${topMovies[1].title} (${topMovies[1].rating}/5). Say "book [movie name]" to book!`;
    } else if (lowerMessage.includes('theater') || lowerMessage.includes('location') || lowerMessage.includes('cinema')) {
        return `We have 3 theaters: CineMax Downtown, CineMax Mall, and CineMax Premium. Say "select [theater name]" to choose!`;
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
        return `Tickets are $12.99 per seat. Say "book tickets" to start booking!`;
    } else if (lowerMessage.includes('seat') || lowerMessage.includes('sitting')) {
        return `You can select 1-5 seats. Say "one seat", "two seats", etc. to choose!`;
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return `Hello! I'm your voice booking assistant. Say "book tickets" to start booking, or ask me about movies, theaters, or pricing!`;
    } else if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('commands')) {
        return `🎤 Voice Commands Available:

📽️ BOOKING: "book tickets", "book inception", "book dark knight", "book matrix"
🏢 THEATER: "select downtown", "select mall", "select premium"  
💺 SEATS: "one seat", "two seats", "three seats", "four seats"
⏰ TIME: "morning", "afternoon", "evening", "night"
🎯 AUTO: "select seats" (auto-picks best seats)
✅ CONFIRM: "confirm booking"
🧭 NAVIGATION: "go home", "go to movies", "go to theaters", "go to about", "go to contact"
🔊 VOICE: "speak louder", "speak slower", "stop speaking"

Try: "book inception" then "select downtown" then "two seats" then "evening" then "select seats" then "confirm booking"`;
    }
    // Navigation commands
    else if (lowerMessage.includes('go home') || lowerMessage.includes('home page') || lowerMessage.includes('main page')) {
        document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
        return `Navigating to home page.`;
    } else if (lowerMessage.includes('go to movies') || lowerMessage.includes('show movies') || lowerMessage.includes('movies section')) {
        document.getElementById('movies').scrollIntoView({ behavior: 'smooth' });
        return `Navigating to movies section.`;
    } else if (lowerMessage.includes('go to theaters') || lowerMessage.includes('show theaters') || lowerMessage.includes('theaters section')) {
        document.getElementById('theaters').scrollIntoView({ behavior: 'smooth' });
        return `Navigating to theaters section.`;
    } else if (lowerMessage.includes('go to about') || lowerMessage.includes('about section')) {
        document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
        return `Navigating to about section.`;
    } else if (lowerMessage.includes('go to contact') || lowerMessage.includes('contact section')) {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        return `Navigating to contact section.`;
    }
    // Voice control commands
    else if (lowerMessage.includes('speak louder') || lowerMessage.includes('volume up') || lowerMessage.includes('louder')) {
        return `I'll speak louder for you.`;
    } else if (lowerMessage.includes('speak slower') || lowerMessage.includes('slower') || lowerMessage.includes('slow down')) {
        return `I'll speak slower for you.`;
    } else if (lowerMessage.includes('stop speaking') || lowerMessage.includes('stop talking') || lowerMessage.includes('quiet')) {
        if (speechSynthesis && speaking) {
            speechSynthesis.cancel();
            speaking = false;
            updateVoiceStatus('Ready to listen', 'ready');
        }
        return `Stopped speaking. How else can I help you?`;
    } else {
        return `I'm your voice booking assistant! Say "help" to see all commands, or try "book inception" to start booking!`;
    }
}

// Text-to-Speech Function
function speakResponse(text) {
    if (speechSynthesis && !speaking) {
        // Check if auto-speak is enabled
        const autoSpeak = localStorage.getItem('autoSpeak') !== 'false';
        if (!autoSpeak) return;
        
        // Stop any current speech
        speechSynthesis.cancel();
        
        // Create speech utterance
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Configure speech settings from user preferences
        utterance.rate = parseFloat(localStorage.getItem('voiceSpeed')) || 0.9;
        utterance.pitch = parseFloat(localStorage.getItem('voicePitch')) || 1.0;
        utterance.volume = parseFloat(localStorage.getItem('voiceVolume')) || 0.8;
        
        // Get available voices and set a good one
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
            voice.lang === 'en-US' && 
            (voice.name.includes('Google') || voice.name.includes('Natural') || voice.name.includes('Premium'))
        ) || voices.find(voice => voice.lang === 'en-US') || voices[0];
        
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        
        // Event handlers
        utterance.onstart = () => {
            speaking = true;
            updateVoiceStatus('Speaking...', 'speaking');
        };
        
        utterance.onend = () => {
            speaking = false;
            updateVoiceStatus('Ready to listen', 'ready');
        };
        
        utterance.onerror = () => {
            speaking = false;
            updateVoiceStatus('Speech error', 'error');
        };
        
        // Speak the text
        speechSynthesis.speak(utterance);
    }
}

// Update voice status display
function updateVoiceStatus(message, status) {
    const statusElement = document.querySelector('.voice-status span');
    const statusDot = document.querySelector('.voice-status-dot');
    
    if (statusElement) {
        statusElement.textContent = message;
    }
    
    if (statusDot) {
        statusDot.className = `voice-status-dot ${status}`;
    }
}



// Voice Settings Functions
function toggleVoiceSettings() {
    const settingsPanel = document.getElementById('voiceSettingsPanel');
    settingsPanel.classList.toggle('show');
}

function updateVoiceSettings() {
    const speed = document.getElementById('voiceSpeed').value;
    const pitch = document.getElementById('voicePitch').value;
    const volume = document.getElementById('voiceVolume').value;
    const autoSpeak = document.getElementById('autoSpeak').checked;
    
    // Update display values
    document.getElementById('speedValue').textContent = speed;
    document.getElementById('pitchValue').textContent = pitch;
    document.getElementById('volumeValue').textContent = volume;
    
    // Store settings in localStorage
    localStorage.setItem('voiceSpeed', speed);
    localStorage.setItem('voicePitch', pitch);
    localStorage.setItem('voiceVolume', volume);
    localStorage.setItem('autoSpeak', autoSpeak);
    
    // Show confirmation
    showNotification('Voice settings updated!', 'success');
}

// Load voice settings from localStorage
function loadVoiceSettings() {
    const speed = localStorage.getItem('voiceSpeed') || '0.9';
    const pitch = localStorage.getItem('voicePitch') || '1.0';
    const volume = localStorage.getItem('voiceVolume') || '0.8';
    const autoSpeak = localStorage.getItem('autoSpeak') !== 'false';
    
    document.getElementById('voiceSpeed').value = speed;
    document.getElementById('voicePitch').value = pitch;
    document.getElementById('voiceVolume').value = volume;
    document.getElementById('autoSpeak').checked = autoSpeak;
    
    // Update display values
    document.getElementById('speedValue').textContent = speed;
    document.getElementById('pitchValue').textContent = pitch;
    document.getElementById('volumeValue').textContent = volume;
}

// AI Voice Bot Functions
let voiceBotRecognition = null;
let voiceBotIsListening = false;

function toggleVoiceBot() {
    const voiceBot = document.getElementById('aiVoiceBot');
    voiceBot.classList.toggle('minimized');
}

function closeVoiceBot() {
    const voiceBot = document.getElementById('aiVoiceBot');
    voiceBot.style.display = 'none';
}

function startVoiceBotListening() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        addVoiceBotMessage('Voice recognition not supported in this browser.', 'ai');
        return;
    }
    
    if (voiceBotIsListening) {
        stopVoiceBotListening();
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    voiceBotRecognition = new SpeechRecognition();
    voiceBotRecognition.lang = 'en-US';
    voiceBotRecognition.interimResults = false;
    voiceBotRecognition.maxAlternatives = 3;
    voiceBotRecognition.continuous = false;
    
    // Update UI
    const micBtn = document.getElementById('voiceBotMicBtn');
    micBtn.classList.add('recording');
    micBtn.innerHTML = '<i class="fas fa-stop"></i><span>Stop Listening</span>';
    
    updateVoiceBotStatus('Listening...', 'listening');
    voiceBotIsListening = true;
    
    voiceBotRecognition.onresult = function(event) {
        let transcript = event.results[0][0].transcript;
        console.log('Voice Bot heard:', transcript);
        
        // Add user message
        addVoiceBotMessage(`🎤 "${transcript}"`, 'user');
        
        // Process command
        processVoiceBotCommand(transcript);
    };
    
    voiceBotRecognition.onerror = function(event) {
        console.error('Voice Bot recognition error:', event.error);
        addVoiceBotMessage('Voice recognition error: ' + event.error, 'ai');
        stopVoiceBotListening();
    };
    
    voiceBotRecognition.onend = function() {
        stopVoiceBotListening();
    };
    
    voiceBotRecognition.start();
}

function stopVoiceBotListening() {
    if (voiceBotRecognition && voiceBotIsListening) {
        voiceBotRecognition.stop();
    }
    
    const micBtn = document.getElementById('voiceBotMicBtn');
    micBtn.classList.remove('recording');
    micBtn.innerHTML = '<i class="fas fa-microphone"></i><span>Click to Speak</span>';
    
    updateVoiceBotStatus('Ready to help!', 'ready');
    voiceBotIsListening = false;
}

function addVoiceBotMessage(content, sender) {
    const messagesContainer = document.getElementById('voiceBotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `voice-bot-message ${sender}-message`;
    
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
                <div>
                    <p>${content}</p>
                </div>
            </div>
        `;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function updateVoiceBotStatus(message, status) {
    const statusElement = document.querySelector('#voiceBotStatus .status-indicator span');
    const statusDot = document.querySelector('#voiceBotStatus .status-dot');
    
    if (statusElement) {
        statusElement.textContent = message;
    }
    
    if (statusDot) {
        statusDot.className = `status-dot ${status}`;
    }
}

function processVoiceBotCommand(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Show thinking indicator
    addVoiceBotMessage('<i class="fas fa-spinner fa-spin"></i> Processing...', 'ai');
    
    setTimeout(() => {
        // Remove thinking message
        const thinkingMsg = document.querySelector('#voiceBotMessages .voice-bot-message:last-child');
        if (thinkingMsg) thinkingMsg.remove();
        
        let response = '';
        
        // Process commands
        if (lowerMessage.includes('book') || lowerMessage.includes('ticket')) {
            if (lowerMessage.includes('inception')) {
                openBookingModal(2);
                response = 'Opening booking for Inception! Please select your preferences.';
            } else if (lowerMessage.includes('dark knight') || lowerMessage.includes('knight')) {
                openBookingModal(1);
                response = 'Opening booking for The Dark Knight Returns! Please select your preferences.';
            } else if (lowerMessage.includes('matrix')) {
                openBookingModal(5);
                response = 'Opening booking for The Matrix! Please select your preferences.';
            } else {
                const bestMovie = movies.sort((a, b) => b.rating - a.rating)[0];
                openBookingModal(bestMovie.id);
                response = `Opening booking for ${bestMovie.title} (our highest rated movie)!`;
            }
        } else if (lowerMessage.includes('movie') || lowerMessage.includes('show')) {
            document.getElementById('movies').scrollIntoView({ behavior: 'smooth' });
            response = 'Taking you to the movies section!';
        } else if (lowerMessage.includes('theater') || lowerMessage.includes('cinema')) {
            document.getElementById('theaters').scrollIntoView({ behavior: 'smooth' });
            response = 'Taking you to the theaters section!';
        } else if (lowerMessage.includes('home') || lowerMessage.includes('main')) {
            document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
            response = 'Taking you to the home page!';
        } else if (lowerMessage.includes('help') || lowerMessage.includes('command')) {
            response = `🎤 Available Voice Commands:
• "Book tickets" - Open booking
• "Book [movie name]" - Book specific movie
• "Show movies" - Go to movies section
• "Go to theaters" - Go to theaters section
• "Go home" - Return to home page
• "Help" - Show this help message`;
        } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            response = 'Hello! How can I help you today? You can book tickets, navigate the site, or ask for help!';
        } else {
            response = 'I heard you say: "' + userMessage + '". Try saying "help" to see all available commands, or "book tickets" to start booking!';
        }
        
        addVoiceBotMessage(response, 'ai');
        
        // Speak the response
        speakResponse(response);
    }, 1000);
}

function quickAction(action) {
    switch(action) {
        case 'book':
            const bestMovie = movies.sort((a, b) => b.rating - a.rating)[0];
            openBookingModal(bestMovie.id);
            addVoiceBotMessage(`Opening booking for ${bestMovie.title}!`, 'ai');
            break;
        case 'movies':
            document.getElementById('movies').scrollIntoView({ behavior: 'smooth' });
            addVoiceBotMessage('Taking you to the movies section!', 'ai');
            break;
        case 'help':
            addVoiceBotMessage(`🎤 Quick Actions Available:
• Book - Start booking tickets
• Movies - Go to movies section
• Help - Show this help message

Voice Commands:
• "Book tickets for [movie name]"
• "Go to [section name]"
• "Help" for all commands`, 'ai');
            break;
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Initialize voice synthesis when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (speechSynthesis) {
        speechSynthesis.onvoiceschanged = function() {
            console.log('Voice synthesis voices loaded:', speechSynthesis.getVoices().length);
        };
    }
    
    // Load voice settings
    loadVoiceSettings();
    
    // Initialize voice bot
    console.log('AI Voice Bot initialized!');
    
    // Show welcome message
    setTimeout(() => {
        showNotification('🎤 AI Voice Bot is ready! Click the microphone to start speaking.', 'success');
    }, 2000);
}); 