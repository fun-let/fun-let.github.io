// [Funlet 광고 통합 관리 시스템 V2]
// 이미지가 없을 때 대체 문구를 보여주는 기능이 추가되었습니다.

const AD_SETTINGS = {
    // 1. 메인 상단 가로 배너 (728x90)
    mainTop: {
        // 여기에 실제 광고 이미지 주소를 넣으세요. 없으면 비워두거나 깨진 주소를 넣어도 대체 문구가 뜹니다.
        image: "", // 예: "https://fun-let.github.io/funlet/images/main_banner.png"
        link: "#"
    },

    // 2. 게임 내부 하단 배너 (320x100)
    gameBottom: {
        image: "https://fun-let.github.io/funlet/images/mangsudda.PNG", // 실제 이미지가 있으면 이게 뜹니다.
        link: "#"
    },

    // 3. 사이드바 세로 배너 (160x600)
    sidebar: {
        image: "", // 이미지가 없으면 대체 문구가 뜹니다.
        link: "#"
    }
};

// --- 광고 로더 (이미지 에러 처리 기능 추가) ---
function loadAds() {
    // 대체 문구 (Placeholder) 템플릿
    const placeholderHTML = `
        <div style="width:100%; height:100%; background: linear-gradient(45deg, #1a1a2e, #16213e); display:flex; flex-direction:column; align-items:center; justify-content:center; color:#666; font-family:'Noto Sans KR'; text-align:center; border: 1px dashed #333;">
            <i class="fa-solid fa-bullhorn" style="font-size:1.5rem; color:#00ff9d; margin-bottom:10px;"></i>
            <div style="font-weight:bold; color:#ddd;">광고주님을 모십니다</div>
            <div style="font-size:0.8rem;">YOUR AD HERE</div>
        </div>
    `;

    function injectAd(elementId, adData, fitStyle) {
        const container = document.getElementById(elementId);
        if (!container) return;

        // 이미지가 없거나 주소가 비어있으면 바로 대체 문구 표시
        if (!adData.image) {
            container.innerHTML = placeholderHTML;
            return;
        }

        // 이미지 로드 시도
        const img = new Image();
        img.src = adData.image;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = fitStyle;
        img.style.borderRadius = 'inherit';

        // 이미지 로드 성공 시
        img.onload = function() {
            container.innerHTML = `<a href="${adData.link}" target="_blank" style="display:block; width:100%; height:100%;">${img.outerHTML}</a>`;
        };

        // 이미지 로드 실패 시 (깨진 이미지) -> 대체 문구 표시
        img.onerror = function() {
            container.innerHTML = placeholderHTML;
        };
    }

    injectAd('ad-main-top', AD_SETTINGS.mainTop, 'cover');
    injectAd('ad-game-bottom', AD_SETTINGS.gameBottom, 'contain');
    injectAd('ad-sidebar', AD_SETTINGS.sidebar, 'cover');
}

window.addEventListener('DOMContentLoaded', loadAds);
