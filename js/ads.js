// [Funlet 광고 & 이미지 통합 관리 시스템 V4]
// 히어로 배경 이미지까지 관리자가 제어합니다.

const version = new Date().getTime(); // 캐시 방지용

const AD_SETTINGS = {
    // 0. 메인 타이틀 배경 (Hero Section)
    hero: {
        image: `https://fun-let.github.io/funlet/images/bg_hero.png?v=${version}`
    },

    // 1. 메인 상단 가로 배너 (PC)
    mainTop: {
        image: `https://fun-let.github.io/funlet/images/banner_main_pc.png?v=${version}`,
        link: "https://www.google.com"
    },

    // 2. 게임 공통 하단 배너 (모바일)
    gameBottom: {
        image: `https://fun-let.github.io/funlet/images/banner_game_bottom.png?v=${version}`,
        link: "https://www.youtube.com"
    },

    // 3. 사이드바 세로 배너
    sidebar: {
        image: `https://fun-let.github.io/funlet/images/banner_sidebar.png?v=${version}`,
        link: "#"
    }
};

function loadAds() {
    const placeholderHTML = `
        <div style="width:100%; height:100%; background: linear-gradient(45deg, #1a1a2e, #16213e); display:flex; flex-direction:column; align-items:center; justify-content:center; color:#666; font-family:'Noto Sans KR'; text-align:center; border: 1px dashed #333;">
            <i class="fa-solid fa-bullhorn" style="font-size:1.5rem; color:#00ff9d; margin-bottom:10px;"></i>
            <div style="font-weight:bold; color:#ddd;">광고주님을 모십니다</div>
            <div style="font-size:0.8rem;">YOUR AD HERE</div>
        </div>
    `;

    // [추가됨] 히어로 배경 이미지 적용 로직
    const heroSection = document.getElementById('hero-section');
    if (heroSection) {
        // 이미지가 실제로 존재하는지 확인 후 적용 (없으면 CSS 기본값 유지)
        const img = new Image();
        img.src = AD_SETTINGS.hero.image;
        img.onload = function() {
            heroSection.style.backgroundImage = `url('${AD_SETTINGS.hero.image}')`;
        };
    }

    // 광고 배너 적용 로직
    function injectAd(elementId, adData, fitStyle) {
        const container = document.getElementById(elementId);
        if (!container) return;

        const img = new Image();
        img.src = adData.image;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = fitStyle;
        img.style.borderRadius = 'inherit';

        img.onload = function() {
            container.innerHTML = `<a href="${adData.link}" target="_blank" style="display:block; width:100%; height:100%;">${img.outerHTML}</a>`;
        };

        img.onerror = function() {
            container.innerHTML = placeholderHTML;
        };
    }

    injectAd('ad-main-top', AD_SETTINGS.mainTop, 'cover');
    injectAd('ad-game-bottom', AD_SETTINGS.gameBottom, 'contain');
    injectAd('ad-sidebar', AD_SETTINGS.sidebar, 'cover');
}

window.addEventListener('DOMContentLoaded', loadAds);
