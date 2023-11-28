const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  mainAudio = wrapper.querySelector("#main-audio"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  progressArea = wrapper.querySelector(".progress-area"),
  progressBar = wrapper.querySelector(".progress-bar"),
  musicList = wrapper.querySelector(".music-list"),
  showMoreBtn = wrapper.querySelector("#more-music"),
  hideMusicBtn = musicList.querySelector("#close");

let musicIndex = 1;

window.addEventListener("load", () => {
  loadMusic(musicIndex);
  playMusicNow();
});

function loadMusic(indexNumber) {
  musicName.innerText = allMusic[indexNumber - 1].name;
  musicArtist.innerText = allMusic[indexNumber - 1].artist;
  musicImg.src = `img/${allMusic[indexNumber - 1].img}.jpg`;
  mainAudio.src = `songs/${allMusic[indexNumber - 1].src}.mp3`;
}

function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

//Next music function
function nextMusic() {
  musicIndex++;
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playMusicNow();
}

//Previous music function
function prevMusic() {
  musicIndex--;
  //If music index is lesser than 1 length then musicIndex will be array length.
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playMusicNow();
}

//Play or Pause music button event
playPauseBtn.addEventListener("click", () => {
  const isMusicPaused = wrapper.classList.contains("paused");
  isMusicPaused ? pauseMusic() : playMusic();
  playMusicNow();
});

//Next music btn event
nextBtn.addEventListener("click", () => {
  //calling next music function
  nextMusic();
});

//Previous music btn event
prevBtn.addEventListener("click", () => {
  //calling previous music function
  prevMusic();
});

mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;

  const duration = e.target.duration;
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

  mainAudio.addEventListener("loadeddata", () => {
    //Update song total duration
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      //Adding 0 if secound is less than 10
      totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });

  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    //Adding 0 if secound is less than 10
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

progressArea.addEventListener("click", (e) => {
  let progressWithValue = progressArea.clientWidth; //getting the width of progress bar
  let checkedOffSetX = e.offsetX; //gettinf offset X value
  let songDuration = mainAudio.duration; //getting song total duration

  mainAudio.currentTime = (checkedOffSetX / progressWithValue) * songDuration;
  playMusic();
});

const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerText; //getting inner text of icon
  switch (getText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song Looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback Shuffle");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist Looped");
      break;
  }
});

mainAudio.addEventListener("ended", () => {
  let getText = repeatBtn.innerText; //getting inner text of icon
  switch (getText) {
    case "repeat": //if this icon is repeat then we call the nextMusic() function
      nextMusic();
      break;
    case "repeat_one": //Changing currentTime of current song which is playing to play it again
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic(); //Calling playMusic function
      break;
    case "shuffle":
      //Generating random index between max range of array length
      let randomIndex = Math.floor(Math.random() * allMusic.length + 1);
      do {
        randomIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicIndex == randomIndex);
      musicIndex = randomIndex;
      loadMusic(musicIndex); //Calling loadMisic function
      playMusic(); //Calling playMusic function
      playMusicNow();
      break;
  }
});

showMoreBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", () => {
  showMoreBtn.click();
});

const ulTags = wrapper.querySelector("ul");

for (let i = 0; i < allMusic.length; i++) {
  let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="songs/${
    allMusic[i].src
  }.mp3"></audio>
                    <span id="${
                      allMusic[i].src
                    }" class="audio-duration">3:40</span>
                </li>`;

  ulTags.insertAdjacentHTML("beforeend", liTag);

  let liAudioDuration = ulTags.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTags.querySelector(`.${allMusic[i].src}`);

  liAudioTag.addEventListener("loadeddata", () => {
    let audioDuration = liAudioTag.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    liAudioDuration.innerText = `${totalMin}:${totalSec}`;
    liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
  });
}

const allLiTags = ulTags.querySelectorAll("li");
function playMusicNow() {
  for (let j = 0; j < allLiTags.length; j++) {
    let audioTag = allLiTags[j].querySelector(".audio-duration");
    if (allLiTags[j].classList.contains("playing")) {
      allLiTags[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }
    if (allLiTags[j].getAttribute("li-index") == musicIndex) {
      allLiTags[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    allLiTags[j].setAttribute("onclick", "clicked(this)");
  }
}

function clicked(element) {
  let getIndex = element.getAttribute("li-index");
  musicIndex = getIndex;
  loadMusic(musicIndex);
  playMusic();
  playMusicNow();
}
