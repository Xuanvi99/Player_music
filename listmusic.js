const name_music = document.querySelector('.music_title h3');
const img_music = document.querySelector('.img_radius');
const audio_music = document.querySelector('audio');
const slide = document.querySelector('input[type="range"]');
const btn_next = document.querySelector('li.btn_next');
const btn_pre = document.querySelector('li.btn_pre');
const btn_loop = document.querySelector('li.btn_loop');
const btn_random = document.querySelector('li.btn_random');
const PLAYER_MUSIC_STORAGE_KEY = 'PLAY_MUSIC';
const app = {
    isloop: true,
    israndom: true,
    indexmusic: 0,
    listmusic: [{
            name: `Rap chậm thôi`,
            singer: `RPT MCK x RPT Jinn ft. RZ Ma$`,
            path: `./music/Rap Chậm Thôi.mp3`,
            img: `./img/rpchamthoi.jpg`,
        },
        {
            name: `Alaba Trap`,
            singer: `MCK`,
            path: `./music/Alaba Trap .mp3`,
            img: `./img/alabatrap.jpg`,
        },
        {
            name: `Cafe không đường`,
            singer: `Amee`,
            path: `./music/Cafe Không Đường (Orinn Remix).mp3`,
            img: `./img/cafe.jpg`,
        },
        {
            name: `Cô ấy nói`,
            singer: `Luan Tang`,
            path: `./music/Cô Ấy Nói (Orinn Remix).mp3`,
            img: `./img/coaynoi.jpg`,
        },
        {
            name: `Cô Đơn Dành Cho Ai`,
            singer: `LEE KHAN & NAL`,
            path: `./music/Cô Đơn Dành Cho Ai (Orinn Remix).mp3`,
            img: `./img/codon.jpg`,
        },
        {
            name: `Yêu Một Người Gian Dối`,
            singer: `Như Việt / Thương Võ`,
            path: `./music/Yêu Một Người Gian Dối (ACV Remix).mp3`,
            img: `./img/giandoi.jpg`,
        },
        {
            name: `Sắp 30`,
            singer: `Trịnh Đình Quang`,
            path: `./music/Sắp 30 (Orinn Remix).mp3`,
            img: `./img/sap30.jpg`,
        },
        {
            name: `Sầu Tương Tư`,
            singer: `Nhật Phong`,
            path: `./music/Sầu Tương Tư.mp3`,
            img: `./img/sautuong tu.jpg`,
        },
        {
            name: `Xích Thêm Chút`,
            singer: `RPT Groovie ft TLinh x RPT MCK`,
            path: `./music/Xích Thêm Chút.mp3`,
            img: `./img/xichthemchut.jpg`,
        },
        {
            name: `Thích Em Hơi Nhiều`,
            singer: `WREN EVANS`,
            path: `./music/Thích Em Hơi Nhiều (Orinn Remix).mp3`,
            img: `./img/thichem.jpg`,
        },
    ],
    config: JSON.parse(localStorage.getItem(PLAYER_MUSIC_STORAGE_KEY)) || {},
    setconfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_MUSIC_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function() {
        var music_item = document.querySelector('.music_list');
        var html = '';
        this.listmusic.forEach((item, index) => {
            html += `<div data-scroll=${index} class="music_item ${
        index === app.indexmusic ? 'active_item' : ''
      }">
                    <div class="item_img ">
                        <div class="item_img-radius" style="background-image: url('${
                          item.img
                        }');background-size: cover;">
                        </div>
                    </div>
                    <div class="item_title">
                        <ul class="title">
                            <li>
                                <h2>${item.name}</h2>
                            </li>
                            <li>
                                <p>${item.singer}</p>
                            </li>
                        </ul>
                    </div>
                    <div class="item_icon">
                        <i class="fas fa-ellipsis-h fa-2x"></i>
                    </div>
                </div>`;
        });
        music_item.innerHTML = html;
        app.click_mouse();
    },
    handleEvent_music: function() {
        var cd = document.querySelector('.music_img');
        var img = document.querySelector('.img_radius');
        var cdwidth = cd.clientWidth;
        var istrue = true;
        $('.music_container').scroll(function() {
            var x = $('.music_container').scrollTop();
            var newcd = cdwidth - x;
            cd.style.width = newcd + 'px';
            img.style.height = newcd + 'px';
            cd.style.opacity = newcd / cdwidth;
        });

        var btn_play = document.querySelectorAll('.fa-4x');
        btn_play.forEach((btn, index) => {
            btn.onclick = function() {
                document.querySelector('i.fas.active').classList.remove('active');
                this.classList.add('active');
                if (istrue) {
                    audio_music.play();
                } else {
                    audio_music.pause();
                }
            };
        });

        audio_music.onplay = function() {
            istrue = false;
            img_music.style.animation = 'cd 10s linear infinite running';
        };
        audio_music.onpause = function() {
            istrue = true;
            img_music.style.animation = 'cd 10s linear infinite paused';
        };

        audio_music.ontimeupdate = function() {
            if (audio_music.duration) {
                slide.value = Math.floor(
                    (audio_music.currentTime / audio_music.duration) * 100
                );
                var x = slide.value;
                var color = `linear-gradient(90deg, rgb(249, 0, 79) ${x}%, rgb(239, 235, 235) ${x}%)`;
                slide.style.background = color;
                var time = audio_music.currentTime / audio_music.duration;

                if (time == 1) {
                    app.isloop ? btn_next.onclick() : audio_music.play();
                }
            }
        };

        slide.oninput = function() {
            var x = slide.value;
            var color = `linear-gradient(90deg, rgb(249, 0, 79) ${x}%, rgb(239, 235, 235) ${x}%)`;
            slide.style.background = color;
            audio_music.currentTime = (x / 100) * audio_music.duration;
            istrue ? audio_music.pause() : audio_music.play();
        };

        btn_next.onclick = function() {
            app.israndom ? app.nextsong() : app.playRandom();
            img_music.style.animation = '';
            audio_music.play();
            document.querySelector('i.fas.active').classList.remove('active');
            document.querySelector('i.fa-play-circle').classList.add('active');
            document
                .querySelector('.music_item.active_item')
                .classList.remove('active_item');
            const music_item = document.querySelectorAll('.music_item');
            music_item[app.indexmusic].classList.add('active_item');
        };

        btn_pre.onclick = function() {
            app.israndom ? app.presong() : app.playRandom();
            img_music.style.animation = '';
            audio_music.play();
            document.querySelector('i.fas.active').classList.remove('active');
            document.querySelector('i.fa-play-circle').classList.add('active');
            document
                .querySelector('.music_item.active_item')
                .classList.remove('active_item');
            const music_item = document.querySelectorAll('.music_item');
            music_item[app.indexmusic].classList.add('active_item');
        };

        btn_loop.onclick = function() {
            if (app.isloop) {
                btn_loop.classList.add('active_color');
                app.isloop = false;
            } else {
                btn_loop.classList.remove('active_color');
                app.isloop = true;
            }
            app.setconfig('isloop', app.isloop);
        };
        btn_random.onclick = function() {
            if (app.israndom) {
                btn_random.classList.add('active_color');
                app.israndom = false;
            } else {
                btn_random.classList.remove('active_color');
                app.israndom = true;
            }
            app.setconfig('israndom', app.israndom);
        };
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentsong', {
            get: function() {
                return this.listmusic[this.indexmusic];
            },
        });
    },

    getmusic: function() {
        name_music.innerHTML = this.currentsong.name;
        img_music.style.backgroundImage = `url("${this.currentsong.img}")`;
        audio_music.src = this.currentsong.path;
    },

    presong: function() {
        this.indexmusic -= 1;
        if (this.indexmusic < 0) {
            this.indexmusic = this.listmusic.length - 1;
        }
        this.getmusic();
    },

    nextsong: function() {
        this.indexmusic += 1;
        if (this.indexmusic >= this.listmusic.length) {
            this.indexmusic = 0;
        }
        this.getmusic();
    },
    playRandom: function() {
        let newindex;
        do {
            newindex = Math.floor(Math.random() * this.listmusic.length);
        } while (newindex === this.indexmusic);
        this.indexmusic = newindex;
        this.getmusic();
    },
    click_mouse: function() {
        const music_item = document.querySelectorAll('.music_item');
        music_item.forEach((music_choose, index) => {
            music_choose.onclick = function() {
                app.indexmusic = index;
                app.getmusic();
                audio_music.play();
                app.render();
                img_music.style.animation = '';
                document.querySelector('i.fas.active').classList.remove('active');
                document.querySelector('i.fa-play-circle').classList.add('active');
            };
        });
    },
    load_config: function() {
        this.isloop = this.config.isloop;
        this.israndom = this.config.israndom;
    },
    start: function() {
        this.load_config();

        this.defineProperties();
        // lay du liẹu
        this.getmusic();
        // tong hop envent
        this.handleEvent_music();
        // xuat du lieu
        this.render();
        if (!this.israndom) {
            btn_random.classList.add('active_color');
            this.israndom = false;
        } else {
            btn_random.classList.remove('active_color');
            this.israndom = true;
        }
        if (!this.isloop) {
            btn_loop.classList.add('active_color');
            this.isloop = false;
        } else {
            btn_loop.classList.remove('active_color');
            this.isloop = true;
        }
    },
};
app.start();