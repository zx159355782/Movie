const baseURL = "https://api.themoviedb.org/3/";
function FetchList(listID, URL) {
  fetch(`${baseURL}${URL}`, { method: "GET" })
    .then((res) => {
      return res.json();
    })
    .then((result) => {
      const data = result.results;
      Print(data, listID);
      Overview(listID, data);
    });
}
function Overview(listID, data) {
  const modal = document.querySelector(".modal");
  const btn = document.getElementsByClassName(`btn-${listID}`);
  const modalbg = document.querySelector(".modal-bg");
  for (let i = 0; i < data.length; i++) {
    btn[i].addEventListener("click", () => {
      modal.innerHTML = `
      <div class="modal-block"><img class="modal-img" src="${
        data[i].poster_path
          ? "https://www.themoviedb.org/t/p/w220_and_h330_face" +
            data[i].poster_path
          : "picture/error.png"
      }" alt="${data[i].title}"></div>
      <div class="modal-block modal-right">
        <div class="btn-close"><i class="fas fa-times"></i></div>
        <h1>${data[i].title}</h1>
        <h2>概要</h2>
        <p>${data[i].overview}</p>
      </div>`;
      modalbg.style.display = "block";
      let opacity = 0;
      let op = setInterval(() => {
        if (opacity >= 1) {
          clearInterval(op);
        }
        opacity += 0.01;
        modalbg.style.opacity = opacity;
      }, 2);
      CloseModal();
    });
  }
}

function CloseModal() {
  const modal = document.querySelector(".modal");
  const close = document.querySelector(".btn-close");
  const modalbg = document.querySelector(".modal-bg");
  close.addEventListener("click", () => {
    modalbg.style.display = "none";
    modalbg.style.opacity = 0;
  });
  modalbg.addEventListener("click", () => {
    modalbg.style.display = "none";
  });
  modal.addEventListener("click", (e) => {
    e.stopPropagation();
  });
}

function Print(data, listID) {
  const id = document.getElementById(listID);
  let list = ``;
  if (data.length === 0) {
    list = `查無資料`;
  } else {
    for (let i = 0; i < data.length; i++) {
      list += `<div class="item">

        <div class="front"><img src="${
          data[i].poster_path
            ? "https://www.themoviedb.org/t/p/w220_and_h330_face" +
              data[i].poster_path
            : "picture/error.png"
        }" alt="${data[i].title}"/><p>${data[i].title}</p></div>

        <div class="back">
        <div class="back-bg" style="background-image:url(https://www.themoviedb.org/t/p/w220_and_h330_face${
          data[i].backdrop_path
        });"></div>
        <div class="content">
        <h2 class="name">${data[i].title}</h2>
        <p class="rate">${data[i].vote_average / 2}</p>
        <div class="star-rating">
          <div class="star-back">
            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
            <div class="star-front" style="width:${
              data[i].vote_average * 10
            }%"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div></div>
        </div>
        <div class="rate-count"><i class="fas fa-user-alt"></i> ${
          data[i].vote_count
        }</div>
        <button class="btn-detail btn-${listID}">查看概要</button>
        </div>
      </div>
    </div>`;
    }
  }
  id.innerHTML = list;
}

const search = document.querySelector(".search-button");
search.addEventListener("click", (e) => {
  const searchValue = document.querySelector(".search-bar").value;
  e.preventDefault();
  window.location.href = `search.html?q=${searchValue}`;
});

function SearchMovie() {
  const searchValue = window.location.search.slice(3);
  fetch(
    `${baseURL}search/movie?api_key=9c52db004e23905278d4913727394bcf&language=zh-TW&page=1&query=${searchValue}`
  )
    .then((res) => {
      return res.json();
    })
    .then((result) => {
      document.querySelector(
        "#main"
      ).innerHTML = `<div class="type"><p class="type-title search-type-title">搜尋結果: ${decodeURI(
        searchValue
      )}</p><div class="list" id="search"></div></div>`;
      const data = result.results;
      Print(data, "search");
      Overview("search", data);
    });
}

if (window.location.pathname.indexOf("search") === -1) {
  FetchList(
    "popular",
    "movie/popular?api_key=9c52db004e23905278d4913727394bcf&language=zh-TW&page=1&region=TW"
  );
  FetchList(
    "commingSoon",
    "movie/upcoming?api_key=9c52db004e23905278d4913727394bcf&language=zh-TW&page=1&region=TW"
  );
  FetchList(
    "top",
    "movie/top_rated?api_key=9c52db004e23905278d4913727394bcf&language=zh-TW&page=1&region=TW"
  );
  FetchList(
    "playing",
    "movie/now_playing?api_key=9c52db004e23905278d4913727394bcf&language=zh-TW&page=1&region=TW"
  );
} else {
  SearchMovie();
}
