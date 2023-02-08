const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
let playList = $(".playlist");
let heading = $("header h2");
let cdThumb = $(".cd .cd-thumb");
let audio = $("#audio");
const cd = $(".cd");
let playBtn = $(".btn-toggle-play");
let player = $(".player");
let progress = $("#progress");
let nextBtn = $(".btn-next");
let prevBtn = $(".btn-prev");

const app = {
  currentIndex: 0,
  timeLine : 60000,
  song: [
    {
      name: "Biết Ông Thương Không",
      singer: "Thủy Nguyễn",
      path: "./assets/music/BIẾT ÔNG THƯƠNG KHÔNG.mp3",
      img: "./assets/img/nn.jpg",
    },
    {
      name: "Đường tôi chở em về",
      singer: "Singer 2",
      path: "./assets/music/Đường Tôi Chở Em Về.mp3",
      img: "./assets/img/a15f06f41d79337c6ebde50c20969fee.png",
    },
    {
      name: "Lửng và Ler.mp3",
      singer: "Singer 3",
      path: "./assets/music/Lửng và Ler.mp3",
      img: "./assets/img/lofi-girl-making-beat.jpg",
    },
    {
      name: "Sang Xin Mịn.mp3",
      singer: "Singer 4",
      path: "./assets/music/Sang Xịn Mịn.mp3",
      img: "./assets/img/anh-nhac.jpg",
    },
    {
      name: "Thu Cuối.mp3",
      singer: "Singer 5",
      path: "./assets/music/Thu Cuối.mp3",
      img: "./assets/img/lofi-girl-making-beat.jpg",
    },
    {
      name: "Người Em Cố Đô.mp3",
      singer: "Singer 5",
      path: "./assets/music/Người Em Cố Đô.mp3",
      img: "./assets/img/lofi-girl-making-beat.jpg",
    },
    {
      name: "Thuyền Quyên.mp3",
      singer: "Singer 5",
      path: "./assets/music/Thuyền Quyên.mp3",
      img: "./assets/img/anh-nhac.jpg",
    },
  ],
  isPlaying: false,
  render: function () {
    const html = this.song.map((sing) => {
      return `
            <div class="song">
            <div
              class="thumb"
              style="
                background-image: url('${sing.img}');
              "
            ></div>
            <div class="body">
              <h3 class="title">${sing.name}</h3>
              <p class="author">${sing.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`;
    });
    playList.innerHTML = html.join("");
  },
  //Lấy ra bài hát đầu tiên
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.song[this.currentIndex];
      },
    });
  },
  handeEvent: function () {
    //Xử lý phóng to, thu nhỏ CD
    const cdWidth = cd.offsetWidth;
    document.onscroll = () => {
      const newWidth = cdWidth - scrollY;
      cd.style.width = newWidth > 0 ? `${newWidth}px` : 0;
      cd.style.opacity = newWidth / cdWidth;
    };

    //Xử lý CD quay khi chạy song
    let cdAnimate = cdThumb.animate([
      { transform: "rotate(360deg)" }
    ], {
      duration : this.timeLine,
      interations: Infinity,
    });
    cdAnimate.pause();
    //Playlist khi click
    playBtn.onclick = () => {
      if (app.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    //Khi song đưuọc play
    audio.onplay = () => {
      this.isPlaying = true;
      player.classList.add("playing");
      cdAnimate.play();
    };
    //Khi song pause
    audio.onpause = () => {
      this.isPlaying = false;
      player.classList.remove("playing");
      cdAnimate.pause();
    };
    //Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = () => {
      //currentTime trả về thời gian hiện tại khi song được play
      //duration trả về độ dài của song (seconds)
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    //Xử lý khi tua song
    progress.oninput = () => {
      const seekTime = (audio.duration / 100) * progress.value;
      //Lấy tổng tg / 100 , * giá trị khi tua => gán lại cho currentTime để audio update
      audio.currentTime = seekTime;
    };
    // Khi next bài hát
    nextBtn.onclick = ()=>{
      this.nextSong();
      audio.play();
    },
    prevBtn.onclick = ()=>{
      this.prevSong();
      audio.play();
    }
  },
  loadCurrentSong: function () {
    heading.innerText = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
    audio.src = this.currentSong.path;
  },
  nextSong : function(){
    this.currentIndex++;
    if(this.currentIndex >= this.song.length){
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong : function(){
    this.currentIndex--;
    if(this.currentIndex < 0){
      this.currentIndex = this.song.length -1;
    }
    this.loadCurrentSong();
  },
  start: function () {
    //Định nghĩa thuộc tính cho object
    this.defineProperties();
    //Lắng nghe sự kiện
    this.handeEvent();
    //Tải thông tin ra UI
    this.loadCurrentSong();
    //render ra màn hình
    this.render();
  },
};
app.start();
