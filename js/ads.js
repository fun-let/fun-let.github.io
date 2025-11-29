// [Funlet 광고 시스템 V11 - Hybrid & Interstitial]
const USER = 'fun-let';
const REPO = 'funlet';
const DATA_URL = `https://${USER}.github.io/${REPO}/data/ads.json?v=${new Date().getTime()}`;

let adData = {};

// 초기화
window.addEventListener('DOMContentLoaded', async () => {
    await loadAdsData();
    renderBanners();
    setupInterstitial(); // 전면광고 준비
});

async function loadAdsData() {
    try {
        const response = await fetch(DATA_URL);
        adData = await response.json();
        
        // 히어로 배경 (이미지 타입일 때만)
        const heroSection = document.getElementById('hero-section');
        if (heroSection && adData.hero && adData.hero.type === 'image') {
            heroSection.style.backgroundImage = `url('${adData.hero.content}')`;
        }
    } catch (error) { console.error("광고 데이터 로드 실패", error); }
}

function renderBanners() {
    // 각 영역별 광고 주입
    injectAd('ad-main-top', adData.mainTop);
    injectAd('ad-game-bottom', adData.gameBottom);
    injectAd('ad-sidebar', adData.sidebar);
}

function injectAd(elementId, data, fitStyle = 'cover') {
    const container = document.getElementById(elementId);
    if (!container) return;

    if (!data || !data.content) {
        container.innerHTML = getPlaceholderHTML();
        return;
    }

    // [핵심] 타입에 따라 다르게 처리
    if (data.type === 'code') {
        // 1. 코드(HTML/Script) 방식
        container.innerHTML = data.content;
        // 스크립트 태그가 있으면 강제 실행 (보안상 막힌 경우를 위해)
        Array.from(container.querySelectorAll("script")).forEach(oldScript => {
            const newScript = document.createElement("script");
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });
    } else {
        // 2. 이미지 방식 (기존)
        const linkUrl = data.link || "#";
        container.innerHTML = `
            <a href="${linkUrl}" target="_blank" style="display:block; width:100%; height:100%;">
                <img src="${data.content}" style="width:100%; height:100%; object-fit:${fitStyle}; border-radius:inherit;">
            </a>`;
    }
}

// --- 전면 광고 (Interstitial) 기능 ---
function setupInterstitial() {
    // 전면 광고용 HTML을 body 끝에 추가
    if (!document.getElementById('interstitial-overlay')) {
        const div = document.createElement('div');
        div.id = 'interstitial-overlay';
        div.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.9); z-index: 9999; display: none;
            flex-direction: column; align-items: center; justify-content: center;
        `;
        div.innerHTML = `
            <div style="position:relative; width:90%; max-width:400px; background:#222; padding:20px; border-radius:15px; text-align:center;">
                <button onclick="closeInterstitial()" style="position:absolute; top:-15px; right:-15px; background:#fff; border:none; border-radius:50%; width:30px; height:30px; font-weight:bold; cursor:pointer;">X</button>
                <div id="interstitial-content" style="min-height:300px; display:flex; align-items:center; justify-content:center; color:#666;">
                    광고 로딩 중...
                </div>
            </div>
        `;
        document.body.appendChild(div);
    }
}

// 게임에서 호출하는 함수: showInterstitial()
window.showInterstitial = function() {
    const overlay = document.getElementById('interstitial-overlay');
    const content = document.getElementById('interstitial-content');
    
    if (overlay && adData.interstitial) {
        // 데이터가 있으면 광고 표시
        if (adData.interstitial.type === 'code') {
            content.innerHTML = adData.interstitial.content;
        } else {
            content.innerHTML = `
                <a href="${adData.interstitial.link || '#'}" target="_blank">
                    <img src="${adData.interstitial.content}" style="max-width:100%; max-height:400px; border-radius:10px;">
                </a>`;
        }
        overlay.style.display = 'flex';
    } else {
        console.log("전면 광고 데이터가 없습니다.");
    }
};

window.closeInterstitial = function() {
    document.getElementById('interstitial-overlay').style.display = 'none';
};

function getPlaceholderHTML() {
    return `<div style="width:100%; height:100%; background:#1a1a2e; display:flex; align-items:center; justify-content:center; color:#666; border:1px dashed #333; font-size:0.8rem;">광고 영역</div>`;
}
