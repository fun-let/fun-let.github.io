// [Funlet 광고 시스템 V12 - Reward & Banner]
const USER = 'fun-let';
const REPO = 'funlet';
const DATA_URL = `https://${USER}.github.io/${REPO}/data/ads.json?v=${new Date().getTime()}`;

let adData = {};
let rewardCallback = null; // 보상 지급을 위한 기억 장소

window.addEventListener('DOMContentLoaded', async () => {
    await loadAdsData();
    renderBanners();
    setupOverlay(); 
});

async function loadAdsData() {
    try {
        const response = await fetch(DATA_URL);
        adData = await response.json();
        
        // 히어로 배경
        const heroSection = document.getElementById('hero-section');
        if (heroSection && adData.hero && adData.hero.type === 'image') {
            heroSection.style.backgroundImage = `url('${adData.hero.content}')`;
        }
    } catch (error) { console.error("광고 로드 실패", error); }
}

function renderBanners() {
    injectAd('ad-main-top', adData.mainTop);
    injectAd('ad-game-bottom', adData.gameBottom);
    injectAd('ad-sidebar', adData.sidebar);
}

function injectAd(elementId, data) {
    const container = document.getElementById(elementId);
    if (!container) return;

    if (!data || !data.content) {
        container.innerHTML = `<div style="width:100%; height:100%; background:#111; display:flex; align-items:center; justify-content:center; color:#444; border:1px dashed #333; font-size:0.8rem;">광고 영역</div>`;
        return;
    }

    if (data.type === 'code') {
        container.innerHTML = data.content;
        // 스크립트 강제 실행
        Array.from(container.querySelectorAll("script")).forEach(oldScript => {
            const newScript = document.createElement("script");
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });
    } else {
        container.innerHTML = `<a href="${data.link||'#'}" target="_blank" style="display:block; width:100%; height:100%;"><img src="${data.content}" style="width:100%; height:100%; object-fit:cover;"></a>`;
    }
}

// --- 전면/보상형 광고 오버레이 ---
function setupOverlay() {
    if (!document.getElementById('ad-overlay')) {
        const div = document.createElement('div');
        div.id = 'ad-overlay';
        div.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 99999; display: none; flex-direction: column; align-items: center; justify-content: center;`;
        
        div.innerHTML = `
            <div style="position:relative; width:90%; max-width:400px; background:#222; padding:20px; border-radius:15px; text-align:center; border: 1px solid #444;">
                <div id="ad-content-area" style="min-height:250px; display:flex; align-items:center; justify-content:center; color:#888; margin-bottom:15px;">
                    광고 로딩 중...
                </div>
                <button onclick="closeAd()" style="padding:10px 30px; background:#00ff9d; color:black; border:none; border-radius:30px; font-weight:bold; cursor:pointer; font-size:1rem;">닫기 (Close)</button>
            </div>
        `;
        document.body.appendChild(div);
    }
}

// [핵심] 광고 호출 함수
// callback: 광고를 닫았을 때 실행할 함수 (아이템 지급 등)
window.showRewardAd = function(callback) {
    const overlay = document.getElementById('ad-overlay');
    const content = document.getElementById('ad-content-area');
    
    // 1. 어드민에 전면광고(interstitial) 설정이 있는지 확인
    if (adData.interstitial && adData.interstitial.content) {
        if (adData.interstitial.type === 'code') {
            content.innerHTML = adData.interstitial.content;
        } else {
            content.innerHTML = `<a href="${adData.interstitial.link||'#'}" target="_blank"><img src="${adData.interstitial.content}" style="max-width:100%; max-height:300px;"></a>`;
        }
    } else {
        content.innerHTML = "광고 준비 중입니다.<br>(어드민에서 전면광고를 설정해주세요)";
    }

    rewardCallback = callback; // 보상 함수 저장
    overlay.style.display = 'flex';
};

window.closeAd = function() {
    document.getElementById('ad-overlay').style.display = 'none';
    // 보상 지급
    if (rewardCallback) {
        rewardCallback();
        rewardCallback = null;
    }
};
