// const buttons = document.querySelectorAll(".secList button");
// buttons.forEach((btn) => {
//   btn.addEventListener("click", () => {
//     btn.classList.toggle("active");
//     const content = btn.parentElement.nextElementSibling;
//     content.style.display = content.style.display === "block" ? "none" : "block";
//   });
// });


  const buttons = document.querySelectorAll(".secList button");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Close all other contents
      buttons.forEach((otherBtn) => {
        const otherContent = otherBtn.parentElement.nextElementSibling;
        if (otherBtn !== btn) {
          otherBtn.classList.remove("active");
          otherContent.style.maxHeight = null;
        }
      });

      // Toggle current one
      btn.classList.toggle("active");
      const content = btn.parentElement.nextElementSibling;

      if (btn.classList.contains("active")) {
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        content.style.maxHeight = null;
      }
    });
  });





function auth(event) {
    event.preventDefault();

    var emailaddress = document.getElementById('emailaddress').value;
    var password = document.getElementById('password').value;

    if (emailaddress === 'testuser@example.com' && password === 'Test@4321') {
        localStorage.setItem("isAuthenticated", "true");
        alert("Login successful!");
        window.location.href = 'main.html';
    } else {
        alert("Invalid Information");
    }
}


// Header background color change on scroll
const header = document.querySelector('header');
window.addEventListener("scroll", function () {
    header.style.backgroundColor = window.scrollY > 50 ? "rgb(0, 0, 0)" : "transparent";
});

// TMDB API setup
const API_KEY = 'd92a8cd2fc953e1b600568b97180bdf9';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';
const TRENDING_MOVIES_URL = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`;

// Carousel elements
const carousel = document.querySelector('.carousel');
const carouselImages = document.querySelector('.carousel_images');
const carouselTitle = document.querySelector('.carousel_title');
const carouselDetails = document.querySelector('.carousel_details');
const carouselDescription = document.querySelector('.carousel_description');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let movies = [];
let currentIndex = 0;

// Fetch trending movies and initialize the carousel
async function fetchTrendingMovies() {
    try {
        const response = await fetch(TRENDING_MOVIES_URL);
        const data = await response.json();
        movies = data.results || [];
        if (movies.length > 0) {
            createCarouselImages();
            displayMovie(0);
        }
    } catch (error) {
        console.error('Error fetching trending movies:', error);
    }
}

// Create carousel images
function createCarouselImages() {
    carouselImages.innerHTML = "";
    movies.forEach((movie, index) => {
        const img = document.createElement('img');
        img.src = `${IMAGE_BASE_URL}${movie.backdrop_path || movie.poster_path || 'assets/images/fallback.jpg'}`;
        img.alt = movie.title;
        img.classList.add('carousel-img');
        img.addEventListener('click', () => navigateToMovieDetails(movie.id));
        carouselImages.appendChild(img);
    });
}

// Display movie details in the carousel
function displayMovie(index) {
    if (movies.length === 0) return;
    const movie = movies[index];
    carouselTitle.textContent = movie.title;
    carouselDetails.textContent = `Release Date: ${movie.release_date} | Rating: ${movie.vote_average}`;
    carouselDescription.textContent = movie.overview;
    carouselImages.style.transform = `translateX(-${index * 100}%)`;
}

// Move to next and previous movie
function moveToNextSlide() {
    currentIndex = (currentIndex + 1) % movies.length;
    displayMovie(currentIndex);
}
function moveToPreviousSlide() {
    currentIndex = (currentIndex - 1 + movies.length) % movies.length;
    displayMovie(currentIndex);
}

// Event listeners for buttons
nextBtn.addEventListener('click', moveToNextSlide);
prevBtn.addEventListener('click', moveToPreviousSlide);

// Auto-scroll every 3 seconds
let autoScroll = setInterval(moveToNextSlide, 3000);
carousel.addEventListener('mouseenter', () => {
  clearInterval(autoScroll);
});

carousel.addEventListener('mouseleave', () => {
  autoScroll = setInterval(moveToNextSlide, 3000);
});


// Navigate to movie details page
function navigateToMovieDetails(movieId) {
    window.location.href = `moviedetails.html?id=${movieId}`;
}

// Fetch and display movies by category
const categories = {
    "Indian Movies": `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_origin_country=IN`,
    "Popular": `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`,
    "Comedy": `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=35`,
    "Action": `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=28`,
};

async function fetchMovies() {
    const container = document.querySelector('.movies-container');
    container.innerHTML = '';
    for (let category in categories) {
        try {
            const response = await fetch(categories[category]);
            const data = await response.json();
            if (data.results.length > 0) {
                displayMovies(category, data.results, container);
            }
        } catch (error) {
            console.error(`Error fetching ${category}:`, error);
        }
    }
}

function displayMovies(category, movies, container) {
    const row = document.createElement('div');
    row.classList.add('row');
    row.innerHTML = `<h2>${category}</h2><div class="rowposter"></div>`;
    container.appendChild(row);
    const rowPoster = row.querySelector('.rowposter');
    movies.forEach(movie => {
        const backdropPath = movie.backdrop_path 
            ? `${IMAGE_BASE_URL}${movie.backdrop_path}` 
            : movie.poster_path 
                ? `${IMAGE_BASE_URL}${movie.poster_path}` 
                : 'assets/images/fallback.jpg';
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie-item');
        movieDiv.innerHTML = `<img src="${backdropPath}" alt="${movie.title}" class="poster">
        <p class="movie-title">${movie.title}</p> `;
        movieDiv.addEventListener('click', () => navigateToMovieDetails(movie.id));
        rowPoster.appendChild(movieDiv);
    });
}

// Search functionality
const searchInput = document.querySelector('.search_container input');

searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchMovies(searchInput.value);
    }
});

async function searchMovies(query) {
    query = query.trim();
    if (!query) return alert("Please enter a movie name!");

    const searchURL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`;
    try {
        const response = await fetch(searchURL);
        const data = await response.json();
        displaySearchResults(data.results || []);
    } catch (error) {
        console.error('Error searching movies:', error);
    }
}

function displaySearchResults(movies) {
    const container = document.querySelector('.movies-container');
    container.innerHTML = '<h2>Search Results</h2>';
    const row = document.createElement('div');
    row.classList.add('rowposter');
    container.appendChild(row);
    movies.forEach(movie => {
        const backdropPath = movie.backdrop_path 
            ? `${IMAGE_BASE_URL}${movie.backdrop_path}` 
            : movie.poster_path 
                ? `${IMAGE_BASE_URL}${movie.poster_path}` 
                : 'assets/images/fallback.jpg';
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie-item');
        movieDiv.innerHTML = `<img src="${backdropPath}" alt="${movie.title}" class="poster">
        <p class="movie-title">${movie.title}</p> `;
        movieDiv.addEventListener('click', () => navigateToMovieDetails(movie.id));
        row.appendChild(movieDiv);
    });
}

// Load movies
fetchTrendingMovies();
fetchMovies();
