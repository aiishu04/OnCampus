/* =========================================================
   ONCAMPUS — DISCOVER ACTIVITIES
   ========================================================= */

.activities-page {
    background: #f4f7fb;
    color: #071522;
}


/* =========================================================
   DISCOVER HERO
   ========================================================= */

.discover-hero {
    position: relative;
    min-height: 440px;
    overflow: hidden;
    background:
        radial-gradient(
            circle at 82% 20%,
            rgba(35, 124, 255, 0.18),
            transparent 30%
        ),
        radial-gradient(
            circle at 15% 80%,
            rgba(255, 123, 45, 0.10),
            transparent 28%
        ),
        #071522;
    color: #ffffff;
}

.discover-grid {
    position: absolute;
    inset: 0;
    opacity: 0.18;
    background-image:
        linear-gradient(
            rgba(255, 255, 255, 0.08) 1px,
            transparent 1px
        ),
        linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.08) 1px,
            transparent 1px
        );
    background-size: 70px 70px;
    mask-image: linear-gradient(
        to bottom,
        black,
        transparent
    );
    animation: discoverGridMove 18s linear infinite;
}

@keyframes discoverGridMove {
    from {
        transform: translate3d(0, 0, 0);
    }

    to {
        transform: translate3d(70px, 70px, 0);
    }
}


.discover-orb {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(2px);
}

.discover-orb-one {
    width: 280px;
    height: 280px;
    top: 40px;
    right: 12%;
    background: rgba(36, 133, 255, 0.11);
    box-shadow:
        0 0 100px rgba(36, 133, 255, 0.20);
    animation: discoverFloatOne 8s ease-in-out infinite;
}

.discover-orb-two {
    width: 190px;
    height: 190px;
    bottom: -70px;
    left: 12%;
    background: rgba(255, 116, 40, 0.08);
    box-shadow:
        0 0 90px rgba(255, 116, 40, 0.16);
    animation: discoverFloatTwo 10s ease-in-out infinite;
}

@keyframes discoverFloatOne {
    0%,
    100% {
        transform: translate3d(0, 0, 0) scale(1);
    }

    50% {
        transform: translate3d(-25px, 22px, 0) scale(1.08);
    }
}

@keyframes discoverFloatTwo {
    0%,
    100% {
        transform: translate3d(0, 0, 0);
    }

    50% {
        transform: translate3d(35px, -20px, 0);
    }
}


.discover-hero-inner {
    position: relative;
    z-index: 2;

    width: min(
        calc(100% - 48px),
        1240px
    );

    min-height: 390px;
    margin: 0 auto;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 60px;

    padding: 72px 0 55px;
}


.discover-hero-copy {
    max-width: 720px;
}

.discover-kicker {
    display: flex;
    align-items: center;
    gap: 12px;

    margin-bottom: 24px;

    color: #a9c6e6;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.18em;
}

.discover-kicker span {
    width: 30px;
    height: 2px;
    background: #ff7a2f;
}

.discover-kicker i {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #ff7a2f;
}


.discover-hero h1 {
    margin: 0;

    max-width: 760px;

    font-size: clamp(
        48px,
        7vw,
        88px
    );

    line-height: 0.96;
    letter-spacing: -0.055em;
    font-weight: 800;
}

.discover-hero h1 em {
    display: block;

    color: #ff7a2f;
    font-style: normal;

    text-shadow:
        0 0 30px rgba(255, 122, 47, 0.16);
}


.discover-hero-copy p {
    max-width: 570px;

    margin: 28px 0 0;

    color: #b8c9da;
    font-size: 16px;
    line-height: 1.75;
}


.discover-hero-stat {
    position: relative;
    z-index: 3;

    min-width: 190px;

    padding: 26px 28px;

    border: 1px solid rgba(
        255,
        255,
        255,
        0.13
    );

    background: rgba(
        255,
        255,
        255,
        0.045
    );

    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);

    box-shadow:
        0 25px 70px rgba(
            0,
            0,
            0,
            0.22
        );

    animation: statFloat 5s ease-in-out infinite;
}

@keyframes statFloat {
    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-8px);
    }
}

.discover-hero-stat strong {
    display: block;

    font-size: 58px;
    line-height: 1;
    letter-spacing: -0.05em;
}

.discover-hero-stat span {
    display: block;

    margin-top: 10px;

    color: #8fa8bf;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.18em;
}


.discover-hero-bottom {
    position: absolute;
    z-index: 3;
    bottom: 0;
    left: 50%;

    width: min(
        calc(100% - 48px),
        1240px
    );

    transform: translateX(-50%);

    display: flex;
    justify-content: space-between;

    padding: 18px 0;

    border-top: 1px solid rgba(
        255,
        255,
        255,
        0.10
    );

    color: #71879c;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.16em;
}


/* =========================================================
   MAIN
   ========================================================= */

.discover-main {
    padding: 82px 0 110px;
}

.discover-main-inner {
    width: min(
        calc(100% - 48px),
        1240px
    );

    margin: 0 auto;
}


/* =========================================================
   HEADING
   ========================================================= */

.discover-heading {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 30px;

    margin-bottom: 35px;
}

.section-label {
    display: inline-block;

    margin-bottom: 10px;

    color: #2879d8;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.18em;
}

.discover-heading h2 {
    margin: 0;

    font-size: clamp(
        32px,
        4vw,
        48px
    );

    line-height: 1;
    letter-spacing: -0.04em;
}

.discover-heading p {
    margin: 14px 0 0;

    color: #6c7c8c;
    font-size: 14px;
}


.discover-count {
    display: flex;
    align-items: baseline;
    gap: 9px;

    padding-bottom: 4px;
}

.discover-count strong {
    font-size: 44px;
    line-height: 1;
    letter-spacing: -0.05em;
}

.discover-count span {
    color: #8492a0;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.12em;
}


/* =========================================================
   FILTER BAR
   ========================================================= */

.discover-filter-card {
    display: grid;
    grid-template-columns:
        minmax(0, 1fr)
        210px
        auto;

    gap: 12px;

    padding: 12px;

    margin-bottom: 35px;

    border: 1px solid #e1e8ef;
    border-radius: 18px;

    background: #ffffff;

    box-shadow:
        0 15px 45px rgba(
            7,
            21,
            34,
            0.06
        );
}


.discover-search {
    position: relative;

    display: flex;
    align-items: center;

    min-height: 52px;

    border: 1px solid #e2e8ee;
    border-radius: 12px;

    background: #f8fafc;

    transition:
        border-color 0.25s ease,
        box-shadow 0.25s ease,
        background 0.25s ease;
}

.discover-search:focus-within {
    border-color: #2879d8;

    background: #ffffff;

    box-shadow:
        0 0 0 4px rgba(
            40,
            121,
            216,
            0.08
        );
}

.discover-search > span {
    width: 46px;

    color: #718194;

    font-size: 23px;
    text-align: center;
}

.discover-search input {
    width: 100%;

    padding: 0 42px 0 0;

    border: 0;
    outline: 0;

    background: transparent;

    color: #071522;
    font: inherit;
    font-size: 14px;
}

.discover-search input::placeholder {
    color: #9aa8b5;
}


.discover-search button {
    position: absolute;
    right: 12px;

    width: 28px;
    height: 28px;

    border: 0;
    border-radius: 50%;

    background: transparent;

    color: #8b99a7;

    font-size: 21px;
    line-height: 1;

    cursor: pointer;

    opacity: 0;
    pointer-events: none;

    transition:
        opacity 0.2s ease,
        background 0.2s ease;
}

.discover-search.has-value button {
    opacity: 1;
    pointer-events: auto;
}

.discover-search button:hover {
    background: #e9eef4;
}


.discover-filter-card select {
    min-height: 52px;

    padding: 0 42px 0 16px;

    border: 1px solid #e2e8ee;
    border-radius: 12px;

    outline: none;

    background-color: #f8fafc;
    color: #26394b;

    font: inherit;
    font-size: 13px;
    font-weight: 600;

    cursor: pointer;

    transition:
        border-color 0.25s ease,
        box-shadow 0.25s ease;
}

.discover-filter-card select:focus {
    border-color: #2879d8;

    box-shadow:
        0 0 0 4px rgba(
            40,
            121,
            216,
            0.08
        );
}


.discover-clear,
.discover-empty button {
    min-height: 52px;

    padding: 0 20px;

    border: 1px solid #dbe3eb;
    border-radius: 12px;

    background: #071522;
    color: #ffffff;

    font: inherit;
    font-size: 12px;
    font-weight: 800;

    cursor: pointer;

    transition:
        transform 0.2s ease,
        background 0.2s ease,
        box-shadow 0.2s ease;
}

.discover-clear:hover,
.discover-empty button:hover {
    transform: translateY(-2px);

    background: #0e2639;

    box-shadow:
        0 10px 24px rgba(
            7,
            21,
            34,
            0.15
        );
}


/* =========================================================
   ACTIVITY GRID
   ========================================================= */

.discover-grid-list {
    display: grid;

    grid-template-columns:
        repeat(2, minmax(0, 1fr));

    gap: 20px;
}


.discover-activity-card {
    position: relative;

    display: flex;
    flex-direction: column;

    min-height: 350px;

    padding: 25px;

    overflow: hidden;

    border: 1px solid #e1e8ef;
    border-radius: 20px;

    background: #ffffff;

    cursor: pointer;

    box-shadow:
        0 12px 35px rgba(
            7,
            21,
            34,
            0.055
        );

    transition:
        transform 0.3s cubic-bezier(
            0.2,
            0.8,
            0.2,
            1
        ),
        box-shadow 0.3s ease,
        border-color 0.3s ease;
}

.discover-activity-card::before {
    content: "";

    position: absolute;

    top: 0;
    left: 0;

    width: 100%;
    height: 3px;

    background:
        linear-gradient(
            90deg,
            #2879d8,
            #55a4ff,
            #ff7a2f
        );

    transform: scaleX(0);
    transform-origin: left;

    transition:
        transform 0.35s ease;
}

.discover-activity-card::after {
    content: "";

    position: absolute;

    width: 170px;
    height: 170px;

    top: -90px;
    right: -90px;

    border-radius: 50%;

    background: rgba(
        40,
        121,
        216,
        0.055
    );

    transition:
        transform 0.45s ease;
}

.discover-activity-card:hover {
    transform: translateY(-7px);

    border-color: #d1dce7;

    box-shadow:
        0 25px 55px rgba(
            7,
            21,
            34,
            0.11
        );
}

.discover-activity-card:hover::before {
    transform: scaleX(1);
}

.discover-activity-card:hover::after {
    transform: scale(1.7);
}


.discover-card-top {
    position: relative;
    z-index: 2;

    display: flex;
    justify-content: space-between;
    align-items: center;

    margin-bottom: 26px;
}

.discover-category {
    display: inline-flex;
    align-items: center;

    min-height: 27px;

    padding: 0 10px;

    border-radius: 6px;

    background: #edf5ff;
    color: #2879d8;

    font-size: 9px;
    font-weight: 900;
    letter-spacing: 0.13em;
}

.discover-card-index {
    color: #b2bdc8;

    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.12em;
}


.discover-card-title {
    position: relative;
    z-index: 2;

    margin: 0;

    max-width: 520px;

    color: #071522;

    font-size: 25px;
    line-height: 1.18;
    letter-spacing: -0.035em;
}


.discover-card-description {
    position: relative;
    z-index: 2;

    margin: 13px 0 25px;

    color: #6f7f8e;

    font-size: 13px;
    line-height: 1.7;

    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;

    overflow: hidden;
}


/* =========================================================
   ACTIVITY INFO
   ========================================================= */

.discover-card-info {
    position: relative;
    z-index: 2;

    display: grid;
    grid-template-columns:
        repeat(2, minmax(0, 1fr));

    gap: 10px;

    margin-top: auto;
}

.discover-info-item {
    min-width: 0;

    padding: 12px;

    border-radius: 10px;

    background: #f6f8fa;
}

.discover-info-item span {
    display: block;

    margin-bottom: 5px;

    color: #98a5b1;

    font-size: 8px;
    font-weight: 900;
    letter-spacing: 0.13em;
}

.discover-info-item strong {
    display: block;

    overflow: hidden;

    color: #25394a;

    font-size: 11px;
    line-height: 1.35;

    white-space: nowrap;
    text-overflow: ellipsis;
}


/* =========================================================
   CARD FOOTER
   ========================================================= */

.discover-card-footer {
    position: relative;
    z-index: 2;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;

    margin-top: 22px;
    padding-top: 18px;

    border-top: 1px solid #edf0f3;
}

.discover-organizer {
    max-width: 55%;

    overflow: hidden;

    color: #83919d;

    font-size: 10px;
    font-weight: 700;

    white-space: nowrap;
    text-overflow: ellipsis;
}

.discover-open {
    display: inline-flex;
    align-items: center;
    gap: 9px;

    color: #2879d8;

    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.09em;

    white-space: nowrap;
}

.discover-open b {
    font-size: 17px;
    font-weight: 500;

    transition:
        transform 0.2s ease;
}

.discover-activity-card:hover .discover-open b {
    transform: translateX(5px);
}


/* =========================================================
   LOADING
   ========================================================= */

.discover-loading {
    grid-column: 1 / -1;

    min-height: 260px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    gap: 18px;

    border: 1px dashed #d6e0e8;
    border-radius: 18px;

    background: #ffffff;

    color: #83909d;

    font-size: 12px;
    font-weight: 700;
}

.discover-loading-bar {
    position: relative;

    width: 130px;
    height: 3px;

    overflow: hidden;

    border-radius: 20px;

    background: #e5ebf0;
}

.discover-loading-bar::after {
    content: "";

    position: absolute;

    left: -50%;
    top: 0;

    width: 50%;
    height: 100%;

    border-radius: inherit;

    background: #2879d8;

    animation: loadingMove 1.1s ease-in-out infinite;
}

@keyframes loadingMove {
    0% {
        left: -50%;
    }

    100% {
        left: 100%;
    }
}


/* =========================================================
   EMPTY STATE
   ========================================================= */

.discover-empty {
    padding: 70px 30px;

    border: 1px solid #e1e8ef;
    border-radius: 20px;

    background: #ffffff;

    text-align: center;

    box-shadow:
        0 12px 35px rgba(
            7,
            21,
            34,
            0.045
        );
}

.discover-empty-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 64px;
    height: 64px;

    margin: 0 auto 20px;

    border-radius: 18px;

    background: #edf5ff;
    color: #2879d8;

    font-size: 27px;
}

.discover-empty > span {
    color: #2879d8;

    font-size: 9px;
    font-weight: 900;
    letter-spacing: 0.16em;
}

.discover-empty h3 {
    margin: 10px 0 8px;

    font-size: 25px;
    letter-spacing: -0.025em;
}

.discover-empty p {
    margin: 0 auto 22px;

    max-width: 400px;

    color: #7c8a97;

    font-size: 13px;
    line-height: 1.6;
}


/* =========================================================
   TOAST
   ========================================================= */

.activities-toast {
    position: fixed;

    right: 25px;
    bottom: 25px;

    z-index: 9999;

    display: flex;
    align-items: center;
    gap: 12px;

    min-width: 245px;

    padding: 14px 17px;

    border: 1px solid rgba(
        255,
        255,
        255,
        0.08
    );

    border-radius: 13px;

    background: #071522;
    color: #ffffff;

    box-shadow:
        0 18px 50px rgba(
            0,
            0,
            0,
            0.2
        );

    opacity: 0;
    transform: translateY(20px);

    pointer-events: none;

    transition:
        opacity 0.25s ease,
        transform 0.25s ease;
}

.activities-toast.show {
    opacity: 1;
    transform: translateY(0);
}

.activities-toast-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 30px;
    height: 30px;

    border-radius: 50%;

    background: #2879d8;

    font-size: 13px;
    font-weight: 900;
}

.activities-toast strong {
    display: block;

    font-size: 12px;
}

.activities-toast span {
    display: block;

    margin-top: 2px;

    color: #9db0c2;

    font-size: 10px;
}


/* =========================================================
   RESPONSIVE — TABLET
   ========================================================= */

@media (max-width: 900px) {

    .discover-hero-inner {
        min-height: 440px;

        flex-direction: column;
        align-items: flex-start;
        justify-content: center;

        gap: 35px;
    }

    .discover-hero-stat {
        min-width: 170px;
    }

    .discover-filter-card {
        grid-template-columns:
            1fr 1fr;
    }

    .discover-search {
        grid-column: 1 / -1;
    }

    .discover-clear {
        width: 100%;
    }

    .discover-grid-list {
        grid-template-columns: 1fr;
    }

}


/* =========================================================
   RESPONSIVE — MOBILE
   ========================================================= */

@media (max-width: 650px) {

    .top-bar {
        display: none;
    }

    .discover-hero {
        min-height: 500px;
    }

    .discover-hero-inner {
        width: min(
            calc(100% - 32px),
            1240px
        );

        min-height: 450px;

        padding-top: 65px;
    }

    .discover-hero h1 {
        font-size: 48px;
    }

    .discover-hero-copy p {
        font-size: 14px;
    }

    .discover-hero-bottom {
        width: calc(100% - 32px);

        font-size: 8px;
    }

    .discover-hero-bottom span:last-child {
        display: none;
    }


    .discover-main {
        padding: 55px 0 80px;
    }

    .discover-main-inner {
        width: calc(100% - 32px);
    }


    .discover-heading {
        align-items: flex-start;
        flex-direction: column;
        gap: 20px;
    }

    .discover-count {
        padding-bottom: 0;
    }


    .discover-filter-card {
        display: flex;
        flex-direction: column;

        padding: 9px;
    }

    .discover-search {
        width: 100%;
    }


    .discover-activity-card {
        min-height: 0;

        padding: 20px;
    }

    .discover-card-title {
        font-size: 22px;
    }

    .discover-card-info {
        grid-template-columns: 1fr 1fr;
    }


    .discover-card-footer {
        align-items: flex-start;
        flex-direction: column;
    }

    .discover-organizer {
        max-width: 100%;
    }

    .discover-open {
        align-self: flex-end;
    }


    .activities-toast {
        right: 16px;
        bottom: 16px;
        left: 16px;

        min-width: 0;
    }

}


/* =========================================================
   ACCESSIBILITY
   ========================================================= */

@media (prefers-reduced-motion: reduce) {

    .discover-grid,
    .discover-orb-one,
    .discover-orb-two,
    .discover-hero-stat,
    .discover-activity-card,
    .discover-activity-card::before,
    .discover-activity-card::after,
    .discover-open b,
    .activities-toast {
        animation: none !important;
        transition: none !important;
    }

}