// ! screen.orintation не работает в safari

// * Функции общего назначения

// js functions
const getValueWithoutMeasurers = (value, measurerLength) => value.split("").slice(0, - measurerLength).join("");

// DOM functions
const setWrapperScrollContainerOverflow = overflow => {
   // В safari нельзя задавать для body overflow:hidden. Поэтому создаётся дополнительная
   // обёртка над wrapper (wrapperContainer).
   // debugger
   // console.log(document.documentElement.scrollTop);

   const wrapper = document.querySelector(".wrapper");
   const wrapperContainer = document.querySelector(".wrapper-scroll-container");
   const wrapperContainerTop = `-${document.documentElement.scrollTop}px`;
   wrapperContainer.style.overflow = overflow === "scroll" ? "unset" : overflow;

   if (overflow == "scroll") {
      document.documentElement.scrollTop = - getValueWithoutMeasurers(wrapperContainerTop, 2);
      wrapper.style.top = "0px";
      return;
   }

   if (overflow === "unset") {
      document.documentElement.scrollTop = - getValueWithoutMeasurers(getComputedStyle(wrapper).top, 2);
   }

   wrapper.style.top = wrapperContainerTop;
   // На момент скрытия элемента и возврата прокрутки, scrollTop у wrapperContainer равен нулю
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
      // !                                               
      setWrapperScrollContainerOverflow("hidden");
      let widthWithoutScroll = wrapper.clientWidth;
      let scrollbarWidth = widthWithoutScroll - widthWithScroll;
      pageParts.style.paddingRight = `${scrollbarWidth}px`;
   }
}

// you-tube API functions
const returnToStartingVideo = () => {
   player.stopVideo();
}

const pauseVideo = () => {
   player.pauseVideo();
}

const getVideoStatus = () => player.getPlayerState();
// -1 – воспроизведение видео не началось
// 0 – воспроизведение видео завершено
// 1 – воспроизведение
// 2 – пауза
// 3 – буферизация
// 5 – видео находится в очереди


// ? Burger menu click ----------------------------------------------------------------

const menu = document.querySelector(".menu");
const header = document.querySelector(".header");
const burgerButton = document.querySelector(".header__burger");
const menuHideButton = document.querySelector(".menu__hide");
const reasons = document.querySelector(".reasons");

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
      // !                                                           
      setWrapperScrollContainerOverflow("unset");
   });
   setPagePartsPaddingRight(true);
}

// events--------------------------------------------------------------
burgerButton.addEventListener("click", () => {
   showMenu();
});
menuHideButton.addEventListener("click", () => hideMenu("0.5s"));
menu.addEventListener("transitionend", () => setMenuTransitionDuration("0s"));
window.addEventListener("resize", () => {
   if (getComputedStyle(menu).left === "0px") hideMenu("0")
});


// ? Video play button click --------------------------------------------------------

const playButton = document.querySelector(".watch-preview__play-video");
const watchPreviewVideo = document.querySelector(".watch-preview__video");
const youtubeVideo = document.querySelector(".watch-preview__youtube-video");
const videoBackground = document.querySelector(".watch-preview__youtube-background");

const setHeaderZIndex = index => header.style.zIndex = index;

const setReasonsZIndex = index => reasons.style.zIndex = index;

const videoJustifiedAlignment = () => {
   youtubeVideo.style.padding = "0 0 calc(56.25% * 0.8) 0";
   youtubeVideo.style.width = "80%";
   youtubeVideo.style.height = "0";
}

const videoHeightAlignment = () => {
   youtubeVideo.style.padding = "0 0 60vh 0";
   youtubeVideo.style.width = "calc(60vh * (16 / 9))";
   youtubeVideo.style.height = "0";
}

const videoContainerAlingment = () => {
   youtubeVideo.style.width = "100%";
   youtubeVideo.style.height = "100%";
   youtubeVideo.style.padding = "0";
}

const videoBighWidthAlingment = () => {
   youtubeVideo.style.width = "800px";
   youtubeVideo.style.padding = "0 0 450px 0";
   youtubeVideo.style.height = "0";
}

const setVideoSize = (orientationChange) => {
   const width = orientationChange ? document.documentElement.clientHeight : window.innerWidth;
   const height = orientationChange ? window.innerWidth : document.documentElement.clientHeight;
   const ratio = width / height;

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

const setWrapperScrollContainerHeight = height => {
   const wrapperContainer = document.querySelector(".wrapper-scroll-container");
   wrapperContainer.style.height = height;
}

const showElement = (element, showClass, animate, callback) => {
   // Если сразу задать в css display: unset; и opacity: 1, плавной анимации не будет
   // Нужно сначала задать display: unset, затем сделать opacity: 1;
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
   // Нет класса hide video. Видимость определяется наличием/отсутствием класса show-video
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

const hideLandscapeVideo = (video, videoBackground, animate, setWrapperContainerOverflow) => {
   hideElement(video, "show-video", animate);
   hideElement(videoBackground, "show-video-background", animate, () => {
      setPagePartsPaddingRight(true);
      // !                                                     
      if (setWrapperContainerOverflow) setWrapperScrollContainerOverflow("unset");
      setHeaderZIndex(3);
      setWrapperScrollContainerHeight("100%");
      returnToStartingVideo();
      setReasonsZIndex(2);
   });
   pauseVideo();
}

const showLandscapeVideo = (video, videoBackground, animate) => {
   showElement(video, "show-video", animate, () => {
      setVideoSize();
   });
   showElement(videoBackground, "show-video-background", animate, () => {
      setHeaderZIndex(2);
      setPagePartsPaddingRight(false);
      setReasonsZIndex(3);
      setWrapperScrollContainerHeight("100vh");
   });
}

// event listeners
const watchPreviewVideoClickHandler = e => {
   if (window.innerWidth <= 414) return;

   if (e.target.closest(".watch-preview__hide")) {
      hideLandscapeVideo(youtubeVideo, videoBackground, true, true);
      return;
   }

   if (e.target.className !== "watch-preview__play-video") return;

   showLandscapeVideo(youtubeVideo, videoBackground, true);
}

const windowResizeHandler = () => {
   // При ширине экрана больше 414px и если видео не проигрывается
   // скрыть видео
   if (window.innerWidth > 414
      && (getVideoStatus() === 5 || getVideoStatus() === -1)
      && youtubeVideo.classList.contains("show-video")) {
      hideLandscapeVideo(youtubeVideo, videoBackground, false, false)
      // console.log("hide pause video in large display")
   }

   // Если видео не проигрывается и ширина экрана больше
   // чем 414px, прекратить обработку
   if ((getVideoStatus() === 5)
      && window.innerWidth > 414) return
   setVideoSize();

   // Если ширина экрана меньше 414px, скрыть фон видео
   if (window.innerWidth <= 414) {
      hideElement(videoBackground, "show-video-background", false, () => {
         setPagePartsPaddingRight(true);
         //                                        !
         // Здесь не нужно изменять свойство overflow у wrapperContainer
         setWrapperScrollContainerOverflow("scroll");
         // console.log("call setWrapperScrollContainerOverflow");
         setHeaderZIndex(3);
      });
      showElement(youtubeVideo, "show-video", false);
   }

   // Если ширина экрана меньше 414px и видео проигрывается,
   // показать видео вместе с фоном
   if (window.innerWidth > 414
      && (getVideoStatus() === 1 || getVideoStatus() === 2
      || getVideoStatus() === -1 || getVideoStatus() === 0
      || getVideoStatus() == 3)) {
      showLandscapeVideo(youtubeVideo, videoBackground, false);
      // console.log("w > 414 & video play/pause")
   }
}


// events------------------------------------------------------------
watchPreviewVideo.addEventListener("click", watchPreviewVideoClickHandler);
watchPreviewVideo.addEventListener("touchstart", e => {
   // отмена блокировки смены ориентации на android
   e.preventDefault();
   watchPreviewVideoClickHandler(e);
});
window.addEventListener("resize", windowResizeHandler);


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