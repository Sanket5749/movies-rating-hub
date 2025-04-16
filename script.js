const input = document.querySelector("input");
const form = document.querySelector("#search-form");
const movieName = document.querySelector(".movie-name");
const rating = document.querySelector(".rating");
const description = document.querySelector(".description");
const movieImage = document.querySelector(".movie-image");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let inputValue = input.value;

  const url1 = `https://imdb236.p.rapidapi.com/imdb/search?originalTitle=${inputValue}`;
  const options1 = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "1b74c03323msh1437909faf596dap16438cjsneffb90717533",
      "x-rapidapi-host": "imdb236.p.rapidapi.com",
    },
  };

  async function getData() {
    try {
      const response = await fetch(url1, options1);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      displayData(data);
    } catch (error) {
      console.error("Error fetching movie data:", error);
      movieName.textContent = "Error fetching movie data";
      rating.textContent = "N/A";
      description.textContent = "Please try again later";
      movieImage.style.display = "none";
    }
  }

  getData();
});

function displayData(data) {
  console.log(data);

  if (data.results && data.results.length > 0) {
    movieName.textContent =
      "Movie : " +
      data.results[0].originalTitle +
      " (" +
      data.results[0].releaseDate +
      ")";
    rating.textContent = "Rating : " + data.results[0].averageRating + "⭐";
    description.textContent = "Description : " + data.results[0].description;
    if (data.results[0].primaryImage) {
      movieImage.src = data.results[0].primaryImage;
      movieImage.style.display = "block";
    } else {
      movieImage.style.display = "none";
    }
    input.value = "";
  } else {
    movieName.textContent = "Movie not found";
    rating.textContent = "N/A";
    description.textContent = "No description available";
    movieImage.style.display = "none";
  }
}

const url2 = "https://imdb236.p.rapidapi.com/imdb/top250-movies";
const options2 = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "1b74c03323msh1437909faf596dap16438cjsneffb90717533",
    "x-rapidapi-host": "imdb236.p.rapidapi.com",
  },
};

async function getTopData() {
  const container = document.getElementById("top-movies-container");
  if (!container) {
    console.error("Container element not found!");
    return;
  }

  try {
    const response = await fetch(url2, options2);
    console.log("Response status:", response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Raw API Response:", JSON.stringify(data, null, 2));

    if (!data) {
      throw new Error("No data received from API");
    }

    if (data.error) {
      throw new Error(`API Error: ${data.error}`);
    }

    const results = data.results || data;
    if (!Array.isArray(results)) {
      throw new Error("Invalid data format - expected an array of movies");
    }

    displayTopData({ results });
  } catch (error) {
    console.error("Error fetching top movies:", error);
    container.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-danger">
                    Error: ${error.message}<br>
                    Please check your API key and try again.
                </div>
            </div>`;
  }
}

function displayTopData(data) {
  const container = document.getElementById("top-movies-container");
  if (!container) {
    console.error("Container element not found in displayTopData");
    return;
  }

  console.log("Processing movies data:", data);
  container.innerHTML = "";

  const movies = data.results;
  if (!Array.isArray(movies) || movies.length === 0) {
    console.error("No movies data available");
    container.innerHTML =
      '<div class="col-12 text-center"><div class="alert alert-warning">No movies data available</div></div>';
    return;
  }

  movies.forEach((movie, index) => {
    if (!movie) return;

    const movieCard = document.createElement("div");
    movieCard.className = "col mb-4";

    const imageUrl =
      movie.primaryImage ||
      movie.image?.url ||
      "https://via.placeholder.com/300x450?text=No+Image";
    const title = movie.originalTitle || movie.title || "Untitled";
    const rating = movie.averageRating || movie.rating || "N/A";

    const card = document.createElement("div");
    card.className = "card h-100 shadow";

    card.innerHTML = `
            <img src="${imageUrl}" class="card-img-top movie-image" alt="${title}" onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'">
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p class="card-text"><strong>Rating:</strong> ${rating}${
      rating !== "N/A" ? "⭐" : ""
    }</p>
                <p class="card-text">${
                  movie.description || movie.plot || "No description available"
                }</p>
            </div>
        `;

    movieCard.appendChild(card);
    container.appendChild(movieCard);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, fetching movies...");
  getTopData();
});

var c = document.getElementById("c");
var ctx = c.getContext("2d");
var cH;
var cW;
var bgColor = "#FF6138";
var animations = [];
var circles = [];

var colorPicker = (function () {
  var colors = ["#FF6138", "#FFBE53", "#2980B9", "#282741"];
  var index = 0;
  function next() {
    index = index++ < colors.length - 1 ? index : 0;
    return colors[index];
  }
  function current() {
    return colors[index];
  }
  return {
    next: next,
    current: current,
  };
})();

function removeAnimation(animation) {
  var index = animations.indexOf(animation);
  if (index > -1) animations.splice(index, 1);
}

function calcPageFillRadius(x, y) {
  var l = Math.max(x - 0, cW - x);
  var h = Math.max(y - 0, cH - y);
  return Math.sqrt(Math.pow(l, 2) + Math.pow(h, 2));
}

function addClickListeners() {
  document.addEventListener("touchstart", handleEvent);
  document.addEventListener("mousedown", handleEvent);
}

function handleEvent(e) {
  if (e.touches) {
    e.preventDefault();
    e = e.touches[0];
  }
  var currentColor = colorPicker.current();
  var nextColor = colorPicker.next();
  var targetR = calcPageFillRadius(e.pageX, e.pageY);
  var rippleSize = Math.min(200, cW * 0.4);
  var minCoverDuration = 750;

  var pageFill = new Circle({
    x: e.pageX,
    y: e.pageY,
    r: 0,
    fill: nextColor,
  });
  var fillAnimation = anime({
    targets: pageFill,
    r: targetR,
    duration: Math.max(targetR / 2, minCoverDuration),
    easing: "easeOutQuart",
    complete: function () {
      bgColor = pageFill.fill;
      removeAnimation(fillAnimation);
    },
  });

  var ripple = new Circle({
    x: e.pageX,
    y: e.pageY,
    r: 0,
    fill: currentColor,
    stroke: {
      width: 3,
      color: currentColor,
    },
    opacity: 1,
  });
  var rippleAnimation = anime({
    targets: ripple,
    r: rippleSize,
    opacity: 0,
    easing: "easeOutExpo",
    duration: 900,
    complete: removeAnimation,
  });

  var particles = [];
  for (var i = 0; i < 32; i++) {
    var particle = new Circle({
      x: e.pageX,
      y: e.pageY,
      fill: currentColor,
      r: anime.random(24, 48),
    });
    particles.push(particle);
  }
  var particlesAnimation = anime({
    targets: particles,
    x: function (particle) {
      return particle.x + anime.random(rippleSize, -rippleSize);
    },
    y: function (particle) {
      return particle.y + anime.random(rippleSize * 1.15, -rippleSize * 1.15);
    },
    r: 0,
    easing: "easeOutExpo",
    duration: anime.random(1000, 1300),
    complete: removeAnimation,
  });
  animations.push(fillAnimation, rippleAnimation, particlesAnimation);
}

function extend(a, b) {
  for (var key in b) {
    if (b.hasOwnProperty(key)) {
      a[key] = b[key];
    }
  }
  return a;
}

var Circle = function (opts) {
  extend(this, opts);
};

Circle.prototype.draw = function () {
  ctx.globalAlpha = this.opacity || 1;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
  if (this.stroke) {
    ctx.strokeStyle = this.stroke.color;
    ctx.lineWidth = this.stroke.width;
    ctx.stroke();
  }
  if (this.fill) {
    ctx.fillStyle = this.fill;
    ctx.fill();
  }
  ctx.closePath();
  ctx.globalAlpha = 1;
};

var animate = anime({
  duration: Infinity,
  update: function () {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, cW, cH);
    animations.forEach(function (anim) {
      anim.animatables.forEach(function (animatable) {
        animatable.target.draw();
      });
    });
  },
});

var resizeCanvas = function () {
  cW = window.innerWidth;
  cH = window.innerHeight;
  c.width = cW * devicePixelRatio;
  c.height = cH * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
};

(function init() {
  resizeCanvas();
  if (window.CP) {
    window.CP.PenTimer.MAX_TIME_IN_LOOP_WO_EXIT = 6000;
  }
  window.addEventListener("resize", resizeCanvas);
  addClickListeners();
  if (!!window.location.pathname.match(/fullcpgrid/)) {
    startFauxClicking();
  }
  handleInactiveUser();
})();

function handleInactiveUser() {
  var inactive = setTimeout(function () {
    fauxClick(cW / 2, cH / 2);
  }, 2000);

  function clearInactiveTimeout() {
    clearTimeout(inactive);
    document.removeEventListener("mousedown", clearInactiveTimeout);
    document.removeEventListener("touchstart", clearInactiveTimeout);
  }

  document.addEventListener("mousedown", clearInactiveTimeout);
  document.addEventListener("touchstart", clearInactiveTimeout);
}

function startFauxClicking() {
  setTimeout(function () {
    fauxClick(
      anime.random(cW * 0.2, cW * 0.8),
      anime.random(cH * 0.2, cH * 0.8)
    );
    startFauxClicking();
  }, anime.random(200, 900));
}

function fauxClick(x, y) {
  var fauxClick = new Event("mousedown");
  fauxClick.pageX = x;
  fauxClick.pageY = y;
  document.dispatchEvent(fauxClick);
}
