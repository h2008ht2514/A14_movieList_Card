const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []

let filteredMovies = []


//
const dataPanel = document.querySelector('#data-panel')

function renderMovieList(data) {
  // console.log(data)
  let rawHTML = ''
  data.forEach((item) => {
    // console.log(item) 

    //title, image
    rawHTML += `
      <div class="col-sm-3">
          <div class="mb-2">
            <div class="card">
              <img
                src="${POSTER_URL + item.image}"
                class="card-img-top" alt="Movie Poster" />
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer">
                <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
                  data-bs-target="#movie-modal" 
                  data-id= "${item.id}">More</button>
                <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">x</button>
              </div>
            </div>
          </div>
        </div> `
  })
  dataPanel.innerHTML = rawHTML
}


function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id).then(response => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image
      }" alt="movie-poster" class="img-fluid">`
  })

}

function removeFavorite(id) {
  // const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  // const movie = movies.find(movie => movie.id === id)

  // if (list.some(movie => movie.id === id)) {
  //   return alert("This movie has already existed")
  // }

  // list.push(movie)
  // localStorage.setItem('favoriteMovies', JSON.stringify(list))
  if (!movies || !movies.length) return

  const movieIndex = movies.findIndex(movie => movie.id === id)
  // 
  movies.splice(movieIndex, 1)
  //存回 local storage
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  //  
  renderMovieList(movies)
}


dataPanel.addEventListener('click', function onPanelClicked(event) {
  // console.log(event.target)

  if (event.target.matches('.btn-show-movie')) {
    // console.log(event.target.dataset)
    // console.log(event.target.dataset.id) // 印出id
    showMovieModal(Number(event.target.dataset.id))
    // The Number function is used to convert the value inside the parentheses to a number. This is done because the dataset values are usually stored as strings, and converting to a number might be necessary, especially if the id is expected to be a numeric value.
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFavorite(Number(event.target.dataset.id))
  }
})

renderMovieList(movies)