const movieData = {
    interstellar: {
        title: "Interstellar",
        tagline: "Любовь — это единственное, что способно противостоять времени и пространству.",
        director: "Кристофер Нолан",
        year: 2014,
        team: ["Муниса", "Музаяна"],
        description: "Фильм о путешествии группы исследователей через кротовую нору, чтобы спасти человечество от гибели. Шедевр, объединяющий науку и эмоции.",
        merits: [
            "Визуализация черной дыры (Гаргантюа)",
            "Великолепный саундтрек Ханса Циммера",
            "Глубокий философский смысл"
        ],
        bg: "bg-interstellar",
        vidId: "vid-interstellar",
        poster: "assets/interstellar.png",
        votes: 0
    },
    oppenheimer: {
        title: "Oppenheimer",
        tagline: "Теперь я стал Смертью, разрушителем миров.",
        director: "Кристофер Нолан",
        year: 2023,
        team: ["Сардор", "Азимхон", "Мухаммадзиё"],
        description: "Эпическая история о создании атомной бомбы и моральной дилемме Роберта Оппенгеймера. Фильм, изменивший взгляд на историю.",
        merits: [
            "Практические эффекты взрывов",
            "Блестящая игра Киллиана Мерфи",
            "Напряженная атмосфера 'тикающих часов'"
        ],
        bg: "bg-oppenheimer",
        vidId: "vid-oppenheimer",
        poster: "assets/oppenheimer.png",
        votes: 0
    },
    lucy: {
        title: "Lucy",
        tagline: "Она — ключ к бесконечной силе разума.",
        director: "Люк Бессон",
        year: 2014,
        team: ["Рухшона", "Мухаррамхон"],
        description: "История о женщине, чей мозг начал работать на 100%, превращая её в сверхчеловека. Динамичный экшен с глубокими вопросами бытия.",
        merits: [
            "Уникальный визуальный стиль",
            "Концепция эволюции сознания",
            "Динамичный темп повествования"
        ],
        bg: "bg-lucy",
        vidId: "vid-lucy",
        poster: "assets/lucy.png",
        votes: 0
    }
};

window.app = {
    init() {
        document.getElementById('btn-back').addEventListener('click', () => {
            this.navigate('section-selection');
            this.stopAllVideos();
        });

        // Spotlight movement
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            document.querySelectorAll('.overlay').forEach(overlay => {
                overlay.style.setProperty('--x', `${x}%`);
                overlay.style.setProperty('--y', `${y}%`);
            });
        });

        // Initial ambient dust
        setInterval(() => {
            if (Math.random() > 0.7) this.createSingleParticle();
        }, 500);
    },

    createSingleParticle() {
        const container = document.querySelector('.dust-particles') || document.body;
        const p = document.createElement('div');
        p.style.position = 'absolute';
        p.style.width = (1 + Math.random() * 3) + 'px';
        p.style.height = p.style.width;
        p.style.background = 'rgba(201, 168, 76, 0.4)';
        p.style.borderRadius = '50%';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = '110%';
        p.style.boxShadow = '0 0 10px rgba(201, 168, 76, 0.5)';
        p.style.pointerEvents = 'none';
        p.style.transition = `all ${5 + Math.random() * 5}s linear`;
        container.appendChild(p);

        requestAnimationFrame(() => {
            p.style.top = '-10%';
            p.style.left = (parseFloat(p.style.left) + (Math.random() * 10 - 5)) + '%';
        });
        setTimeout(() => p.remove(), 10000);
    },

    // ── Voting ──
    vote(movieId) {
        movieData[movieId].votes++;
        const el = document.getElementById(`count-${movieId}`);
        el.textContent = movieData[movieId].votes;
        
        // Add epic bump animation
        el.classList.remove('bump');
        void el.offsetWidth; // Trigger reflow
        el.classList.add('bump');
        setTimeout(() => el.classList.remove('bump'), 400);

        // Create floating +1
        const counterContainer = el.parentElement;
        const plusOne = document.createElement('div');
        plusOne.className = 'plus-one';
        plusOne.textContent = '+1';
        counterContainer.appendChild(plusOne);
        setTimeout(() => plusOne.remove(), 800);
    },

    // ── Winner ──
    revealWinner() {
        const sorted = Object.entries(movieData)
            .map(([id, d]) => ({ id, ...d }))
            .sort((a, b) => b.votes - a.votes);

        const winner = sorted[0];
        const totalVotes = sorted.reduce((s, m) => s + m.votes, 0) || 1;

        const stage = document.getElementById('winner-stage');
        stage.innerHTML = `
            <div class="winner-poster">
                <img src="${winner.poster}" alt="${winner.title}">
            </div>
            <div class="winner-info">
                <p class="award-label">🏆 Победитель Народного Оскара 2026</p>
                <h1>${winner.title}</h1>
                <p class="win-tagline">"${winner.tagline}"</p>

                <div class="win-detail">
                    <div class="win-detail-item">
                        <h4>Режиссер</h4>
                        <p>${winner.director}</p>
                    </div>
                    <div class="win-detail-item">
                        <h4>Команда</h4>
                        <p>${winner.team.join(', ')}</p>
                    </div>
                    <div class="win-detail-item">
                        <h4>Голосов</h4>
                        <p>${winner.votes}</p>
                    </div>
                </div>

                <div class="vote-results">
                    <h4>Результаты голосования</h4>
                    ${sorted.map(m => `
                        <div class="result-row ${m.id === winner.id ? 'winner-row' : ''}">
                            <span class="movie-label">${m.title}</span>
                            <div class="bar-track">
                                <div class="bar-fill" data-width="${Math.round((m.votes / totalVotes) * 100)}"></div>
                            </div>
                            <span class="vote-num">${m.votes}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        const overlay = document.getElementById('winner-overlay');
        overlay.classList.add('active');
        this.launchConfetti();

        // Animate bars after a short delay
        setTimeout(() => {
            stage.querySelectorAll('.bar-fill').forEach(bar => {
                bar.style.width = bar.dataset.width + '%';
            });
        }, 300);
    },

    closeWinner() {
        document.getElementById('winner-overlay').classList.remove('active');
        document.querySelectorAll('.confetti-piece').forEach(c => c.remove());
    },

    launchConfetti() {
        const colors = ['#c9a84c', '#f1dca0', '#8a6d2b', '#ffffff', '#ffd700'];
        const container = document.body;
        
        for (let i = 0; i < 120; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + 'vw';
            piece.style.top = '-20px';
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.width = (6 + Math.random() * 10) + 'px';
            piece.style.height = (6 + Math.random() * 10) + 'px';
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            piece.style.zIndex = '4000';
            
            const duration = 3 + Math.random() * 3;
            piece.style.transition = `top ${duration}s cubic-bezier(0.1, 0.4, 0.45, 1), 
                                      left ${duration}s ease-out, 
                                      transform ${duration}s ease-out, 
                                      opacity 1s ease-out ${duration - 1}s`;
            
            container.appendChild(piece);

            setTimeout(() => {
                piece.style.top = '110vh';
                piece.style.left = (parseFloat(piece.style.left) + (Math.random() * 20 - 10)) + 'vw';
                piece.style.transform = `rotate(${Math.random() * 1500}deg)`;
                piece.style.opacity = '0';
            }, 10);
            
            setTimeout(() => piece.remove(), (duration + 1) * 1000);
        }
    },

    // ── Videos ──
    stopAllVideos() {
        document.querySelectorAll('video').forEach(v => { v.pause(); v.currentTime = 0; });
    },
    playVideo(vidId) {
        this.stopAllVideos();
        const v = document.getElementById(vidId);
        if (v) v.play().catch(() => {});
    },

    // ── Navigation ──
    navigate(sectionId, callback) {
        const overlay = document.getElementById('transition-overlay');
        overlay.classList.add('flare');
        setTimeout(() => {
            this.showSection(sectionId);
            if (callback) callback();
        }, 400);
        setTimeout(() => overlay.classList.remove('flare'), 800);
    },

    showSection(id) {
        document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');

        if (id === 'section-intro' || id === 'section-selection') {
            this.switchBg('bg-main');
            document.getElementById('btn-back').classList.remove('show');
            this.stopAllVideos();
        } else {
            document.getElementById('btn-back').classList.add('show');
        }
    },

    switchBg(bgId) {
        document.querySelectorAll('.bg-layer').forEach(bg => bg.classList.remove('active'));
        document.getElementById(bgId).classList.add('active');
    },

    // ── Presentation ──
    showPresentation(movieId) {
        this.navigate('section-presentation', () => {
            const d = movieData[movieId];
            this.switchBg(d.bg);
            this.playVideo(d.vidId);

            document.getElementById('presentation-content').innerHTML = `
                <div class="presentation-slide">
                    <div class="pres-header">
                        <h1>${d.title}</h1>
                        <p class="tagline">"${d.tagline}"</p>
                    </div>
                    <div class="pres-grid">
                        <div class="info-box">
                            <h3>О фильме</h3>
                            <p>${d.description}</p>
                        </div>
                        <div class="info-box">
                            <h3>Режиссер</h3>
                            <p class="director-name">${d.director}</p>
                        </div>
                        <div class="info-box">
                            <h3>Достоинства</h3>
                            <ul>${d.merits.map(m => `<li>${m}</li>`).join('')}</ul>
                        </div>
                        <div class="info-box">
                            <h3>Команда номинантов</h3>
                            <div class="team-chips">
                                ${d.team.map(n => `<span class="team-chip">${n}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    }
};

window.app.init();
