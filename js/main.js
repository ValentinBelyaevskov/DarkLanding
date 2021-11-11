const getValueWithoutMeasurers = value => value.split("").slice(0, -2).join("");

const setBodyOverflow = overflow => document.body.style.overflow = overflow;

const paddingForTheScrollHIde = () => {
   let widthWithScroll = document.body.clientWidth;
   setBodyOverflow("hidden");
   let widthWithoutScroll = document.body.clientWidth;
   let scrollbarWidth = widthWithoutScroll - widthWithScroll;
   document.body.style.paddingRight = `${scrollbarWidth}px`;
}

const paddingForTheScrollShow = () => {
   document.body.style.paddingRight = 0;
}

const setHeaderZIndex = index => header.style.zIndex = index;

const returnToStartingVideo = () => {
   player.stopVideo();
}

const pauseVideo = () => {
   player.pauseVideo();
}

const getVideoStatus = () => player.getPlayerState();
// console.log(player.getPlayerState())

// ? burger click ----------------------------------------------------------------

const menu = document.querySelector(".menu");
const header = document.querySelector(".header");
const headerBurger = document.querySelector(".header__burger");
const menuHide = document.querySelector(".menu__hide");
const clientsElem = document.querySelector(".clients");

const setBurgerStyle = (element, transitionDuration, left, callback) => {
   element.style.transitionDuration = transitionDuration;
   element.style.left = left;
   if (callback) callback();
}

const showBurgerMenu = () => {
   setBurgerStyle(menu, "0.5s", 0, () => {
      paddingForTheScrollHIde();
      pauseVideo();
   });
}

const hideBurgerMenu = () => {
   setBurgerStyle(menu, "0.5s", "-100vw", () => {
      setBodyOverflow("auto");
   });
   paddingForTheScrollShow();
}

// * header events--------------------------------------------------------------
headerBurger.addEventListener("click", () => {
   showBurgerMenu();
});
menuHide.addEventListener("click", hideBurgerMenu);
menu.addEventListener("transitionend", () => menu.style.transitionDuration = "0s");


// ? watch-preview click --------------------------------------------------------

const playButton = document.querySelector(".watch-preview__play-video");
const watchPreviewVideo = document.querySelector(".watch-preview__video");
const youtubeVideo = document.querySelector(".watch-preview__youtube-video");
const videoBackground = document.querySelector(".watch-preview__youtube-background");

const showElement = (element, showClass, animate, callback) => {
   element.style.display = "unset";
   if (animate) {
      setTimeout(() => {
         element.classList.add(showClass);
      }, 0);
   } else {
      element.classList.add(showClass);
   }
   if (callback) callback();
}

const hideElement = (element, showClass, animate, callback) => {
   element.classList.remove(showClass);
   if (animate) {
      element.addEventListener("transitionend", () => {
         element.style.display = "none";
         if (callback) callback();
      }, { once: true });
   } else {
      element.style.display = "none";
      if (callback) callback();
   }
}

const hideLandscapeVideo = (video, videoBackground) => {
   hideElement(video, "show-video", true);
   hideElement(videoBackground, "show-video-background", true, () => {
      paddingForTheScrollShow();
      setBodyOverflow("auto");
      setHeaderZIndex(3);
      screen.orientation.unlock();
      returnToStartingVideo();
      clientsElem.style.zIndex = 2;
   });
   pauseVideo();
}

const showLandscapeVideo = (video, videoBackground) => {
   showElement(video, "show-video", true);
   showElement(videoBackground, "show-video-background", true, () => {
      setHeaderZIndex(2);
      paddingForTheScrollHIde();
      clientsElem.style.zIndex = 1;
   });
}

const watchPreviewVideoHandler = e => {
   if (document.documentElement.clientWidth <= 414) return;

   if (e.target.closest(".watch-preview__hide")) {
      hideLandscapeVideo(youtubeVideo, videoBackground);
      return;
   }

   if (e.target.className !== "watch-preview__play-video") return;

   showLandscapeVideo(youtubeVideo, videoBackground);
}

const windowResizeHandler = () => {
   if (screen.orientation.type === "portrait-primary" && document.documentElement.clientWidth <= 414) {
      hideElement(videoBackground, "show-video-background", false, () => {
         paddingForTheScrollShow();
         setBodyOverflow("auto");
         setHeaderZIndex(3);
      });

      showElement(youtubeVideo, "show-video", false);

   } else if (screen.orientation.type === "portrait-primary" && document.documentElement.clientWidth > 414) {
      if (getVideoStatus() === 5) {
         hideElement(youtubeVideo, "show-video", false);
         hideElement(videoBackground, "show-video-background", false);
      }

      if (getVideoStatus() === 1 || getVideoStatus() === 2) {
         showElement(videoBackground, "show-video-background", false);
         setHeaderZIndex(2);
      }
   }
}

const orientationChangeHandler = () => {
   if (screen.orientation.type === "landscape-primary") {
      if (getVideoStatus() === 1 || getVideoStatus() === 2) {
         screen.orientation.unlock();
         showElement(youtubeVideo, "show-video", false);
         showElement(videoBackground, "show-video-background", false, () => {
            setHeaderZIndex(2);
            paddingForTheScrollHIde();

         });
      }

      if (getVideoStatus() === 5) {
         hideElement(youtubeVideo, "show-video", false);
         hideElement(videoBackground, "show-video-background", false);

      }
   }

   if (screen.orientation.type === "portrait-primary" && document.documentElement.clientWidth <= 414) {
      hideElement(videoBackground, "show-video-background", false, () => {
         paddingForTheScrollShow();
         setBodyOverflow("auto");
         setHeaderZIndex(3);
      });

      if (getVideoStatus() === 5) {
         showElement(youtubeVideo, "show-video", false);
      }
   }
}

// * burger events------------------------------------------------------------
watchPreviewVideo.addEventListener("click", watchPreviewVideoHandler);
watchPreviewVideo.addEventListener("touchstart", e => {
   e.preventDefault();
   watchPreviewVideoHandler(e);
});
window.addEventListener("resize", windowResizeHandler);
screen.orientation.addEventListener('change', orientationChangeHandler);

// ? include clients elements ----------------------------------------------

const clients = [
   {name: "profitWell", logo: "image/clients/profit_well.svg"},
   {name: "appcues", logo: "image/clients/appcues.svg"},
   {name: "snipBob", logo: "image/clients/snip_bob.svg"},
   {name: "bench", logo: "image/clients/bench.svg"},
   {name: "subbly", logo: "image/clients/subbly.svg"},
   {name: "demio", logo: "image/clients/demio.svg"},
]

const createClientsItem = (parentElement, client) => {
   const clientItem = document.createElement("div");
   const clientLogo = document.createElement("img");

   clientItem.classList.add("clients__item");
   clientLogo.alt = client.name;
   clientLogo.src = client.logo;
   clientItem.append(clientLogo)
   parentElement.append(clientItem)
}

clients.forEach(item => {
   createClientsItem(document.querySelector(".clients__block"), item)
})