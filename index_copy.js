const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'

movies = []

let filteredMovies = []

let currentViewStyle = 'card'; // Default view style is 'card'

//
const dataPanel = document.querySelector('#data-panel')

const searchForm = document.querySelector('#search-form')

const paginator = document.querySelector('#paginator')

const showStyle = document.querySelector('#show-style') 

const MOVIES_PER_PAGE = 12

//監聽表單提交事件
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  console.log('click!') //測試用

  const searchInput = document.querySelector('#search-input') //新增這裡

  const keyword = searchInput.value.trim().toLowerCase();
  if (!keyword.length) {
    return alert('type correct string')
  }

  //條件篩選
  filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(keyword))

  //錯誤處理：無符合條件的結果
  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }
  //重新輸出至畫面
  renderMovieList(getMoviesByPage(1))
  renderPaginator(filteredMovies.length)
})

// filter用法
// let numbers = [1, 2, 3, 4, 5, 6]
// let newNumbers = numbers.filter(number => number < 3)
// console.log(newNumbers) // [1,2]

function renderMovieList(data) {
  if (currentViewStyle === 'card') {
    renderMovieList_Card(data);
  } else {
    renderMovieList_List(data);
  }
}


//renderMovieList_Card()
function renderMovieList_Card(data) {
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
                <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
              </div>
            </div>
          </div>
        </div> `
  })
  dataPanel.innerHTML = rawHTML
}

// renderMovieList_List()
function renderMovieList_List(data) {
  // console.log(data)
  let rawHTML = `<ul class="list-group">`
  data.forEach((item) => {
    // console.log(item) 
    rawHTML += `
        <ul class="list-group">
          <li class="list-group-item d-flex justify-content-between">
            <h5 data-id="${item.id}">"${item.title}"</h5>
            <div>
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>

              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>              
            </div>
          </li>  
        `
  })
  rawHTML += `</ul>`
  dataPanel.innerHTML = rawHTML
}

// 
showStyle.addEventListener('click', function onStyleClicked(event) {
  if (event.target.matches('#list')) {
    currentViewStyle = 'list';
  } else if (event.target.matches('#card')) {
    currentViewStyle = 'card';
  }
  renderMovieList(getMoviesByPage(1));
});

// // 自己寫的
// showStyle.addEventListener('click', function onStyleCLicked(event) {
//   if (event.target.matches('#list')) {
//     renderMovieList_List(getMoviesByPage(1))

//   } else if (event.target.matches('#card')) {
//     renderMovieList_Card(getMoviesByPage(1))
//   }
// })


function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id).then(response => {
    const data = response.data.results
    console.log(data) // specific item data

    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image
      }" alt="movie-poster" class="img-fluid">`
    
    // ?Q?
    // Bootstrap 5 Modal Trigger
    const movieModal = new bootstrap.Modal(document.getElementById('movie-modal'));
    movieModal.show();

  })

}


///
//新增函式
// 在 addToFavorite 傳入一個 id
// 請 find 去電影總表中查看，找出 id 相同的電影物件回傳，暫存在 movie
// 把 movie 推進收藏清單
// 接著呼叫 localStorage.setItem，把更新後的收藏清單同步到 local stroage
function addToFavorite(id) {
  console.log(id)
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find(movie => movie.id === id)

  if (list.some(movie => movie.id === id)) {
    return alert("This movie has already existed")
  }

  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}



//負責從總清單裡切割資料，然後回傳切割好的新陣列。
function getMoviesByPage(page) {
  // movies?
  const data = filteredMovies.length ? filteredMovies : movies


  //計算起始INDEX
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  //回傳切割後陣列
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function renderPaginator(amount) {
  const NumberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  //
  let rawHTML = ''
  for (let page = 1; page <= NumberOfPages; page++) {
    rawHTML += `
      <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
  `
  }
  // 我們在每個a 標籤中，加上 data-page 屬性來標注頁數，方便後續取用頁碼。
  paginator.innerHTML = rawHTML
}


paginator.addEventListener('click', function onPaginatorClicked(event) {
  //如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== 'A') return
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Element/tagName

  //透過dataset取得被點擊的頁數
  const page = Number(event.target.dataset.page)

  renderMovieList(getMoviesByPage(page))
})

// // renderMovieList_List()
// function renderMovieList_List() {

// }


dataPanel.addEventListener('click', function onPanelClicked(event) {
  // console.log(event.target)

  if (event.target.matches('.btn-show-movie')) {
    // console.log(event.target.dataset)
    console.log(event.target.dataset.id) // 印出id
    showMovieModal(Number(event.target.dataset.id))
    // The Number function is used to convert the value inside the parentheses to a number. This is done because the dataset values are usually stored as strings, and converting to a number might be necessary, especially if the id is expected to be a numeric value.
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

axios
  .get(INDEX_URL)
  .then((response) => {
    // console.log(response.data.results)
    // for (const movie of show_results) {
    //   movies.push(movie)
    // }

    movies.push(...response.data.results)
    // 寫完 renderMovieList 之後，別忘了要調用函式。請在 axios 程式碼中的 then() 中呼叫它，並把 movies 傳進去：
    renderPaginator(movies.length)
    // renderMovieList(getMoviesByPage(1))
    renderMovieList_List(getMoviesByPage(1))
  })
  .catch((err) => console.log(err))