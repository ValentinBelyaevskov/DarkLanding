// burger click listener
const menu = document.querySelector(".menu");
const header = document.querySelector(".header")
const headerBurger = document.querySelector(".header__burger");
const menuHide = document.querySelector(".menu__hide");

headerBurger.addEventListener("click", () => {
   menu.style.transitionDuration = "0.5s"
   menu.style.left = 0;

   let widthWithScroll = document.body.clientWidth;
   document.body.style.overflow = "hidden";

   let widthWithoutScroll = document.body.clientWidth;
   let scrollbarWidth = widthWithoutScroll - widthWithScroll

   document.body.style.paddingRight = `${scrollbarWidth}px`

})

menuHide.addEventListener("click", () => {
   menu.style.transitionDuration = "0.5s"
   menu.style.left = "-100vw"
   document.body.style.overflow = "auto";
   document.body.style.paddingRight = 0;
})

menu.addEventListener("transitionend", () => menu.style.transitionDuration = "0s");

const getValueWithoutMeasurers = value => value.split("").slice(0, -2).join("");

// watch-preview click listener
const playButton = document.querySelector(".watch-preview__play-video");
const watchPreviewVideo = document.querySelector(".watch-preview__video");

watchPreviewVideo.addEventListener("click", (e) => {

   let videoContainer = e.currentTarget.querySelector(".watch-preview__youtube-video");
   let videoBackground = e.currentTarget.querySelector(".watch-preview__youtube-background");

   if (e.target.closest(".watch-preview__hide")) {
      videoContainer.style.opacity = 0;
      videoBackground.style.opacity = 0;
      header.style.zIndex = 3;
      
      videoContainer.addEventListener("transitionend", () => {
         videoContainer.style.display = "none"
      }, {once: true});
      videoBackground.addEventListener("transitionend", () => {
         videoBackground.style.display = "none"
         document.body.style.paddingRight = 0;
         document.body.style.overflow = "auto";
      }, {once: true});
      console.log("hide");
      // player.playVideo()
      player.pauseVideo()
      player.seekTo(0, false)
      return;
   }

   if (e.target.className !== "watch-preview__play-video") return;

   console.log("show")

   header.style.zIndex = 2;

   setTimeout(() => {
      videoContainer.style.opacity = 1;
      videoBackground.style.opacity = 0.97;
   }, 0);

   videoContainer.style.display = "unset";
   videoBackground.style.display = "unset";

   let widthWithScroll = document.body.clientWidth;
   document.body.style.overflow = "hidden";
   let widthWithoutScroll = document.body.clientWidth;
   let scrollbarWidth = widthWithoutScroll - widthWithScroll

   document.body.style.paddingRight = `${scrollbarWidth}px`

})

