// URL DE LA API
const URLAPI =
  "https://newsapi.org/v2/everything?q=bitcoin&language=es&apiKey=7141b98a956546f084a51645b09156c5";

let news = [];
// Endpoints que me sirven para hacer filtros a la api
const filtros = {
  relevancia: `${URLAPI}&sortBy=relevancy`,
  popularidad: `${URLAPI}&sortBy=popularity`,
  publishedAt: `${URLAPI}&sortBy=publishedAt`,
};
// Funcion asincrona para consumir todas las noticias
const getNews = async () => {
  const { data } = await axios.get(URLAPI);
  news = data;
};

//Acciones para el icono del menu
const iconMenu = document.getElementById("iconMenu");
const navList = document.getElementById("navList");
iconMenu.style.color = "#0c2461";
// Funcion para ocultar o mostrar el menu en mobile
const showCloseMenuMobile = () => {
  if (navList.classList.contains("hidden")) {
    navList.classList.remove("slide-out-left");
    navList.classList.add("slide-in-left");
    navList.classList.remove("hidden");
    iconMenu.classList.add("fa-times");
    iconMenu.classList.remove("fa-bars");
    iconMenu.style.color = "#ffffff";
  } else {
    if (window.innerWidth < 768) {
      navList.classList.remove("slide-in-left");
      navList.classList.add("slide-out-left");
      iconMenu.classList.remove("fa-times");
      iconMenu.classList.add("fa-bars");
      iconMenu.style.color = "#0c2461";

      setTimeout(() => {
        navList.classList.add("hidden");
      }, 500);
    }
  }
};

iconMenu.addEventListener("click", showCloseMenuMobile);

// Funcion que me ayuda a detectar el cambio de reosolucion en la pantalla para realizar breakpoints desde js

window.addEventListener("resize", () => {
  console.log(window.innerWidth);
  if (window.innerWidth < 768) {
    navList.classList.add("hidden");
    navList.classList.remove("slide-in-left");
    navList.classList.add("slide-out-left");
    iconMenu.classList.remove("fa-times");
    iconMenu.classList.add("fa-bars");
    navList.classList.add("hidden");
  } else {
    if (navList.classList.contains("hidden")) {
      navList.classList.remove("hidden");
      navList.classList.remove("slide-out-left");
      navList.classList.remove("slide-in-left");
    } else if (navList.classList.contains("slide-out-left")) {
      navList.classList.remove("slide-out-left");
      navList.classList.remove("slide-in-left");
    }
  }
});

// capturo seccion del loader
const secLoad = document.getElementById("secLoad");

// funcion que me sirve para el filtrado desde la navbar
const filterButtons = Array.from(navList.getElementsByTagName("a"));

const filterNews = () => {
  filterButtons.forEach((filtro) => {
    const dataType = filtro.getAttribute("data-type");
    filtro.addEventListener("click", async () => {
      switch (dataType) {
        case "relevancy":
          if (window.innerWidth < 768) {
            showCloseMenuMobile();
          }
          const { data } = await axios.get(filtros.relevancia);
          showloader(data.articles, "más importantes");
          break;
        case "popularity":
          const { data: data2 } = await axios.get(filtros.popularidad);
          if (window.innerWidth < 768) {
            showCloseMenuMobile();
          }
          showloader(data2.articles, "populares");

          break;
        case "publishedAt":
          const { data: data3 } = await axios.get(filtros.publishedAt);
          if (window.innerWidth < 768) {
            showCloseMenuMobile();
          }
          showloader(data3.articles, "por autor");
          break;
        case "favorites":
          showloader(fav, "Favoritos");
          break;
      }
    });
  });
};

navList.addEventListener("click", filterNews);

// funcion para filtrar desde el campo de tipo texto
const inputFilter = document.getElementById("inputFilter");
inputFilter.addEventListener("keyup", (e) => {
  console.log(e.target.value);
  if (e.target.value.length > 0) {
    let filteredNews = news.articles.filter(
      (noticia) =>
        noticia.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
        noticia.author.toLowerCase().includes(e.target.value.toLowerCase())
    );
    let filterNews = [];
    for (const key of filteredNews) {
      filterNews.push(key);
    }
    if (filterNews.length > 0) {
      paintNews(filterNews);
      secNews.classList.remove("hidden");
      secLoad.classList.add("hidden");
      secLoad.classList.remove("slide-in-fwd-center");
      textNew.innerHTML = "Noticias con el filtro aplicado";
    } else {
      textNew.innerHTML =
        "Sin resultados , intenta buscar nuevamente por favor";
      secLoad.classList.remove("hidden");
      secLoad.classList.add("slide-in-fwd-center");
      secNews.classList.add("hidden");
    }
  } else {
    showloader(news.articles, "más importantes");
  }
});

// Funcion que  me sirve para pintar el carrusel
const paintCarrusel = () => {
  const carrusel = document.getElementById("carrusel");
  carrusel.innerHTML = "";

  news.articles.forEach((item) => {
    carrusel.innerHTML += `
    <figure>
      <img src="${item.urlToImage}"/>
    </figure>`;
  });
  // Funcion necesaria para que arranque el carrusel
  $(".owl-carousel").owlCarousel({
    autoplay: true,
    autoplayTimeout: 5000,
    loop: true,
    margin: 10,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      1024: {
        items: 3,
      },
      1800: {
        items: 4,
      },
    },
  });
};

const secNews = document.getElementById("secNews");
// Funcion que me pinta las noticias (recibe un array con la cantidad de noticias que vengan ya sean filtradas o no )
const paintNews = (array) => {
  secNews.innerHTML = "";
  if (array.length > 0) {
    array.forEach((item, index) => {
      secNews.innerHTML += `  <figure class="cardNew">
            <img src="${item.urlToImage}" alt="">
            <i class="iconFav fas fa-heart" data-id="${index}"></i>
            <figcaption>
                <article>
                    <h3>${cutText(item.title, 30)}</h3>
                    <h3>Por: <span>${
                      item.author == null ? "Sin autor" : item.author
                    }</span></h3>
                </article>
                <p>${cutText(item.description, 180)}</p>
                <button class="btnCard" data-id="${index}">Ver mas</button>
            </figcaption>
        </figure>`;
    });
    // Evento click del boton de ver más
    const btnCard = document.querySelectorAll(".btnCard");

    // Agregar un controlador de eventos clic a cada botón
    btnCard.forEach((button) => {
      button.addEventListener("click", (event) => {
        const dataId = event.target.getAttribute("data-id");
        let noticia = news.articles[Number(dataId)];

        paintNew(noticia);
      });
    });

    //Evento click del boton de favoritos
    const iconFav = document.querySelectorAll(".iconFav");
    iconFav.forEach((button) => {
      button.addEventListener("click", (event) => {
        const dataId = event.target.getAttribute("data-id");
        let noticia = news.articles[Number(dataId)];
        console.log(fav);
        let filterFav = fav.filter((noti) => noti.title == noticia.title);
        if (filterFav.length > 0) {
          let quitFav = fav.filter((noti) => noti.title != noticia.title);
          fav = quitFav;
          if (fav.length > 0) {
            goFavToLocal();
            notify("Noticia retirada de favoritos 😥");
          } else {
            fav = [];
            goFavToLocal();
            notify("Sin noticias Favoritas😥");
          }
        } else {
          fav.push(noticia);
          goFavToLocal();
          notify("Noticia agregada a favoritos 🥰", true);
        }
      });
    });
  } else {
    secNews.innerHTML += `<h3>Sin noticias en esta sección</h3>`;
  }
};

// funcion para verificar si la noticia se encontraba en favoritos

//Funcion para mostrar el detalle de la noticia
const paintNew = (noticia) => {
  // Obtener el elemento <section>
  const secDetail = document.querySelector(".secDetail");
  secNews.classList.add("hidden");
  secDetail.classList.remove("hidden");
  secDetail.classList.add("slide-in-fwd-center");

  // Accedo a los elementos secundarios dentro del primer article
  const sec1 = secDetail.querySelector(".secDetail__sec1");
  const sec2 = secDetail.querySelector(".secDetail__sec2");

  // Acceder a los elementos dentro del segundo article

  const h4 = sec1.querySelector("h4");
  const img = sec1.querySelector("img");
  const p = sec1.querySelector("p");

  // Cambio el contenido de los elementos
  textNew.innerText = noticia.title;
  h4.textContent = "Escrito por: " + noticia.author;
  img.src = noticia.urlToImage;
  p.textContent = noticia.description;

  // Accedo a los botones dentro de sec2
  const btnMain = sec2.querySelector(".btnMain");
  const btnNext = sec2.querySelector(".btnNext");

  btnMain.addEventListener("click", () => {
    secNews.classList.remove("hidden");
    secDetail.classList.add("hidden");
    secDetail.classList.remove("slide-in-fwd-center");
    showPreloader()
    showloader(news.articles, "más importantes");
  });

  btnNext.addEventListener("click", () => {
    const numero = numeroAleatorio();
    noticia = news.articles[numero];
    paintNew(noticia);
  });
};
//Funcion para generar un numero aleatorio para poder consumr la noticia
function numeroAleatorio() {
  return Math.floor(Math.random() * 100);
}

// Funcion para acrotar caracteres para que el diseño en las cards no se desborden
function cutText(text, lim) {
  if (text.length > lim) {
    return text.substring(0, lim) + "...";
  }
  return text;
}
// Funcion que me sirve para mostrar el loader
function showloader(array, tipo = "") {
  const textNew = document.getElementById("textNew");

  textNew.innerText = "Cargando";

  secNews.classList.add("hidden");
  secLoad.classList.remove("hidden");
  secLoad.classList.add("slide-in-fwd-center");
  paintNews(array);
  setTimeout(() => {
    secNews.classList.remove("hidden");
    secLoad.classList.add("hidden");
    secLoad.classList.remove("slide-in-fwd-center");
    textNew.innerText = "Noticias " + tipo;
  }, 2000);
}
if (window.innerWidth <= 768) {
  navList.classList.add("hidden");
}

let fav = [];
function setFavToLocal() {
  fav = JSON.parse(localStorage.getItem("fav")) || [];
}
function goFavToLocal(noticia) {
  localStorage.setItem("fav", JSON.stringify(fav));
}

function notify(mensaje, op = false) {
  Toastify({
    text: `${mensaje}`,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: `${
        op
          ? "linear-gradient(to right, #00b09b, #96c93d)"
          : "linear-gradient(to right, #e74c3c, #e67e22)"
      }`,
    },
    onClick: function () {}, // Callback after click
  }).showToast();
}

const secPreloader = document.getElementById("secPreloader");

function showPreloader() {
  secPreloader.classList.remove("hidden");
  setTimeout(() => {
    secPreloader.classList.add("hidden");
  }, 3000);
}

document.addEventListener("DOMContentLoaded", async () => {
  showPreloader();
  await getNews();
  console.log(news);
  paintCarrusel(news);
  showloader(news.articles, "más importantes");
  setFavToLocal();
});
