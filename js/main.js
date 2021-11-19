// ! screen.orintation не работает в safari

// * Функции общего назначения

// js functions
const getValueWithoutMeasurers = value => value.split("").slice(0, -2).join("");

// DOM functions
const setWrapperOverflow = overflow => {
   // В safari нельзя задавать для body overflow:hidden. Поэтому создаётся дополнительная
   // обёртка над wrapper (wrapperContainer). Задать wrapper высоту в 100vh тоже нельзя, т.к. при
   // клике по видео со скроллом, оно сделает перемотку наверх
   const wrapperContainer = document.querySelector(".wrapper-scroll-container");
   wrapperContainer.style.overflow = overflow;
}

const setPagePartsPaddingRight = (haveAScrollbar) => {
   // Элемент sections находится на одном уровне с общим фоном страницы, и padding задётся ему,
   // что бы фон не сдвигался
   const pageParts = document.querySelector(".page-parts");
   const wrapperContainer = document.querySelector(".wrapper-scroll-container");
   const wrapper = document.querySelector(".wrapper");

   if (haveAScrollbar) {
      pageParts.style.paddingRight = 0;
   } else {
      let widthWithScroll = wrapperContainer.clientWidth;
      setWrapperOverflow("hidden");
      let widthWithoutScroll = wrapper.clientWidth;
      let scrollbarWidth = widthWithoutScroll - widthWithScroll;
      pageParts.style.paddingRight = `${scrollbarWidth}px`;
   }
}

const setHeaderZIndex = index => header.style.zIndex = index;

const setClientsZIndex = index => {
   clients.style.zIndex = index
};

// you-tube API functions
const returnToStartingVideo = () => {
   player.stopVideo();
}

const pauseVideo = () => {
   player.pauseVideo();
}

const getVideoStatus = () => player.getPlayerState();


// ? Burger menu click ----------------------------------------------------------------

const menu = document.querySelector(".menu");
const header = document.querySelector(".header");
const burgerButton = document.querySelector(".header__burger");
const menuHideButton = document.querySelector(".menu__hide");
const clients = document.querySelector(".clients");

const setMenuTransitionDuration = transitionDuration => menu.style.transitionDuration = transitionDuration;

const setMenuStyle = (transitionDuration, left, callback) => {
   setMenuTransitionDuration(transitionDuration);
   menu.style.left = left;
   if (callback) callback();
}

const showMenu = () => {
   // Свойство transition задаётся динамически, что бы при resize
   // (увеличение размера) в отладчике меню слева на "отставало"
   setMenuStyle("0.5s", 0, () => {
      setPagePartsPaddingRight(false);
      pauseVideo();
   });
}

const hideMenu = (time) => {
   setMenuStyle(time, "-100vw", () => {
      setWrapperOverflow("visible");
   });
   setPagePartsPaddingRight(true);
}

// events--------------------------------------------------------------
burgerButton.addEventListener("click", () => {
   showMenu();
   console.log("clickBurger")
});
menuHideButton.addEventListener("click", () => hideMenu("0.5s"));
menu.addEventListener("transitionend", () => setMenuTransitionDuration("0s"));
window.addEventListener("resize", () => {
   if ( getComputedStyle(menu).left === "0px" ) hideMenu("0")
});


// ? Video play button click --------------------------------------------------------

const playButton = document.querySelector(".watch-preview__play-video");
const watchPreviewVideo = document.querySelector(".watch-preview__video");
const youtubeVideo = document.querySelector(".watch-preview__youtube-video");
const videoBackground = document.querySelector(".watch-preview__youtube-background");

const videoJustifiedAlignment = () => {
   youtubeVideo.style.padding = "0 0 calc(56.25% * 0.8) 0";
   youtubeVideo.style.width = "80%";
}

const videoHeightAlignment = () => {
   youtubeVideo.style.padding = "0 0 60vh 0";
   youtubeVideo.style.width = "calc(60vh * (16 / 9))";
}

const videoContainerAlingment = () => {
   youtubeVideo.style.width = "100%";
   youtubeVideo.style.padding = "0 0 56.25% 0";
}

const videoBighWidthAlingment = () => {
   youtubeVideo.style.width = "800px";
   youtubeVideo.style.padding = "0 0 450px 0";
}

// ! VIDEO SIZE                                                      
const setVideoSize = (orientationChange) => {
   const width = orientationChange ? document.documentElement.clientHeight : document.documentElement.clientWidth;
   const height = orientationChange ? document.documentElement.clientWidth : document.documentElement.clientHeight;
   const ratio =  width / height;

   // console.log(orientationChange, width, height);

   if (width > 1024) {
      videoBighWidthAlingment();
   } else if (width <= 414) {
      videoContainerAlingment();
   } else if (ratio < (1024 / 768)) {
      videoJustifiedAlignment();
   } else if (ratio > (1024 / 768)) {
      videoHeightAlignment();
   }
}

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
      setPagePartsPaddingRight(true);
      setWrapperOverflow("visible");
      setHeaderZIndex(3);
      // для android.
      screen.orientation.unlock();
      returnToStartingVideo();
      setClientsZIndex(2);
   });
   pauseVideo();
}

const showLandscapeVideo = (video, videoBackground) => {
   showElement(video, "show-video", true, () => {
      // ! VIDEO SIZE                                                      
      setVideoSize();
   });
   showElement(videoBackground, "show-video-background", true, () => {
      setHeaderZIndex(2);
      setPagePartsPaddingRight(false);
      setClientsZIndex(1);
   });
}

// event listeners
const watchPreviewVideoClickHandler = e => {
   if (document.documentElement.clientWidth <= 414) return;

   if (e.target.closest(".watch-preview__hide")) {
      hideLandscapeVideo(youtubeVideo, videoBackground);
      return;
   }

   if (e.target.className !== "watch-preview__play-video") return;

   showLandscapeVideo(youtubeVideo, videoBackground);
}

const windowResizeHandler = () => {
   if (getComputedStyle(youtubeVideo).display == "none" && document.documentElement.clientWidth > 414) return
   // ! VIDEO SIZE                                                   
   setVideoSize();

   // if (screen.orientation.type === "portrait-primary" && document.documentElement.clientWidth <= 414) {
   //    hideElement(videoBackground, "show-video-background", false, () => {
   //       setPagePartsPaddingRight(true);
   //       setWrapperOverflow("visible");
   //       setHeaderZIndex(3);

   //    });

   //    showElement(youtubeVideo, "show-video", false);

   // } else if (screen.orientation.type === "portrait-primary" && document.documentElement.clientWidth > 414) {
   //    if (getVideoStatus() === 5) {
   //       hideElement(youtubeVideo, "show-video", false);
   //       hideElement(videoBackground, "show-video-background", false);
   //    }

   //    if (getVideoStatus() === 1 || getVideoStatus() === 2) {
   //       showElement(videoBackground, "show-video-background", false);
   //       setHeaderZIndex(2);
   //    }
   // }
}

// const orientationChangeHandler = () => {

//    // ! VIDEO SIZE                                                         
//    // setVideoSize(true);

//    // ! window.matchMedia("(orientation: portrait)");
//    if (screen.orientation.type === "landscape-primary") {
//       if (getVideoStatus() === 1 || getVideoStatus() === 2) {

//          // !
//          screen.orientation.unlock();

//          showElement(youtubeVideo, "show-video", false);
//          showElement(videoBackground, "show-video-background", false, () => {
//             setHeaderZIndex(2);
//             setPagePartsPaddingRight(false);

//          });
//       }

//       if (getVideoStatus() === 5) {
//          hideElement(youtubeVideo, "show-video", false);
//          hideElement(videoBackground, "show-video-background", false);

//       }
//    }

//    // ! window.matchMedia("(orientation: portrait)");
//    if (screen.orientation.type === "portrait-primary" && document.documentElement.clientWidth <= 414) {
//       hideElement(videoBackground, "show-video-background", false, () => {
//          setPagePartsPaddingRight(true);
//          setWrapperOverflow("visible");
//          setHeaderZIndex(3);
//       });

//       if (getVideoStatus() === 5) {
//          showElement(youtubeVideo, "show-video", false);
//       }
//    }
// }

// events------------------------------------------------------------
watchPreviewVideo.addEventListener("click", watchPreviewVideoClickHandler);
watchPreviewVideo.addEventListener("touchstart", e => {
   // отмена блокировки смены ориентации на android
   e.preventDefault();
   watchPreviewVideoClickHandler(e);
});
window.addEventListener("resize", windowResizeHandler);

// ! document.addEventListener("orientationchange", updateOrientation);
// screen.orientation.addEventListener('change', orientationChangeHandler);



// ? include clients elements ----------------------------------------------

const clientsArr = [
   { name: "profitWell", logo: "image/clients/profit_well.svg" },
   { name: "appcues", logo: "image/clients/appcues_.svg" },
   { name: "snipBob", logo: "image/clients/snip_bob.svg" },
   { name: "bench", logo: "image/clients/bench.svg" },
   { name: "subbly", logo: "image/clients/subbly.svg" },
   { name: "demio", logo: "image/clients/demio.svg" },
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

clientsArr.forEach(item => {
   createClientsItem(document.querySelector(".clients__block"), item)
})