const priceElement = document.querySelector('#price');
const moviesSelector = document.querySelector('#movies');
const selectedSeatsElement = document.querySelector('#selectedSeats');
const resetButton = document.querySelector('.reset');
const confirmButton = document.querySelector('.confirm');

const movies = {
  Joker: {
    price: 10,
    img: './img/Joker.jpg',
  },
  'Toy Story 4': {
    price: 15,
    img: './img/Toy Story 4.png',
  },
  'The Lion King': {
    price: 13,
    img: './img/The Lion King.webp',
  },
  Pocahontas: {
    price: 12,
    img: './img/Pocahontas.jpg',
  },
  Titanic: {
    price: 12,
    img: './img/Titanic.jpg',
  },
};

let priceTicket = movies[moviesSelector.value]?.price || 0;
let selectedSeatsCount =
  JSON.parse(sessionStorage.getItem('selectedSeatsCount')) || 0;
let totalPrice = selectedSeatsCount * priceTicket;

function seatClickHandler(e) {
  const seat = e.target;
  if (!seat.classList.contains('ocupped')) {
    seat.classList.toggle('reserved');

    seat.classList.contains('reserved')
      ? selectedSeatsCount++
      : selectedSeatsCount--;
    updateTicketView();
  }
  saveSessionStorage();
}

function initSeats() {
  const seatsContainerElement = document.querySelector('.seats');

  for (let i = 0; i < 5; i++) {
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');

    for (let i = 0; i < 3; i++) {
      const columnElement = document.createElement('div');
      columnElement.classList.add('column');
      const seats = i === 1 ? 4 : 2;
      for (let i = 0; i < seats; i++) {
        const seatElement = document.createElement('div');
        seatElement.classList.add('seat');
        seatElement.addEventListener('click', seatClickHandler);
        columnElement.appendChild(seatElement);
      }
      rowElement.appendChild(columnElement);
    }

    seatsContainerElement.appendChild(rowElement);
  }
  let seatStates = JSON.parse(sessionStorage.getItem('seatStates')) || [];
  seatStates.forEach((seat, i) => {
    const seats = Array.from(seatsContainerElement.querySelectorAll('.seat'));
    seats[i].classList.add(seat.state);
  });
}

function initMoviesSelector() {
  Object.keys(movies).forEach((movie) => {
    const movieOptionElement = document.createElement('option');
    movieOptionElement.value = movie;
    movieOptionElement.innerText = `${movie} $${movies[movie].price}`;
    moviesSelector.appendChild(movieOptionElement);
  });
  moviesSelector.firstElementChild.setAttribute('selected', '');
  priceTicket = movies[moviesSelector.value]?.price;
}

function saveSessionStorage() {
  const seats = Array.from(document.querySelectorAll('.seat'));
  const seatStates = seats.map((seat) => {
    const state = seat.classList.contains('reserved')
      ? 'reserved'
      : seat.classList.contains('ocupped')
      ? 'ocupped'
      : 'available';

    return {
      state,
    };
  });
  sessionStorage.setItem('seatStates', JSON.stringify(seatStates));
  sessionStorage.setItem(
    'selectedSeatsCount',
    JSON.stringify(selectedSeatsCount)
  );
}

function changeMovieImg(img) {
  const screen = document.querySelector('#screen');
  screen.querySelector('img').src = img;
}
function initHandlers() {
  const seats = Array.from(document.querySelectorAll('.seat'));
  moviesSelector.addEventListener('change', () => {
    const movie = moviesSelector.value;
    priceTicket = movies[movie].price;
    changeMovieImg(movies[movie].img);
    updateTicketView();
  });
  resetButton.addEventListener('click', () => {
    seats.forEach((seat) => {
      seat.classList.remove('reserved');
    });
    selectedSeatsCount = 0;
    updateTicketView();
    saveSessionStorage();
  });
  confirmButton.addEventListener('click', () => {
    seats.forEach((seat) => {
      seat.classList.replace('reserved', 'ocupped');
      selectedSeatsCount = 0;
    });
    updateTicketView();
    saveSessionStorage();
  });
}

function updateTicketView() {
  totalPrice = priceTicket * selectedSeatsCount;
  selectedSeatsElement.innerText = selectedSeatsCount;
  priceElement.innerText = totalPrice;
}

initSeats();
initMoviesSelector();
initHandlers();
updateTicketView();
