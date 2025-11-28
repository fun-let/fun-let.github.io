// [Funlet 광고 통합 관리 시스템]
// 이 파일의 내용만 바꾸면 모든 게임의 배너가 한 번에 바뀝니다.

// 1. 이미지 주소 설정 (나중에 여기만 수정하면 됩니다)
const AD_SETTINGS = {
    // 메인 상단 가로 배너 (PC용)
    mainTop: {
        image: "https://via.placeholder.com/728x90/00ff9d/000000?text=Grand+Open+Event",
        link: "https://www.google.com" // 클릭 시 이동할 주소
    },
    // 게임 내부 하단 배너
    gameBottom: {
        image: "https://github.com/fun-let/funlet/blob/main/images/%ED%94%BC%EB%A7%9D%EC%84%AF%EB%8B%A4.PNG",
        link: "https://www.youtube.com"
    },
    // 사이드바 세로 배너
    sidebar: {
        image: "https://via.placeholder.com/160x600/333333/ffffff?text=Ad+Area",
        link: "#"
    }
};

// 2. 광고를 화면에 뿌려주는 기능 (건드리지 마세요)
function loadAds() {
    // 메인 배너 찾기
    const mainBanner = document.getElementById('ad-main-top');
    if(mainBanner) {
        mainBanner.innerHTML = `<a href="${AD_SETTINGS.mainTop.link}" target="_blank">
            <img src="${AD_SETTINGS.mainTop.image}" style="width:100%; height:100%; object-fit:cover; border-radius:10px;">
        </a>`;
    }

    // 게임 하단 배너 찾기
    const gameBanner = document.getElementById('ad-game-bottom');
    if(gameBanner) {
        gameBanner.innerHTML = `<a href="${AD_SETTINGS.gameBottom.link}" target="_blank">
            <img src="${AD_SETTINGS.gameBottom.image}" style="width:100%; height:100%; object-fit:contain;">
        </a>`;
    }

    // 사이드바 배너 찾기
    const sideBanner = document.getElementById('ad-sidebar');
    if(sideBanner) {
        sideBanner.innerHTML = `<a href="${AD_SETTINGS.sidebar.link}" target="_blank">
            <img src="${AD_SETTINGS.sidebar.image}" style="width:100%; height:100%; object-fit:cover;">
        </a>`;
    }
}

// 페이지 로딩 완료 시 광고 실행
window.addEventListener('DOMContentLoaded', loadAds);
