document.addEventListener('DOMContentLoaded', function() {
    const bookElement = document.getElementById('book');
    const flipSound = document.getElementById('flipSound');
    const pageIdxDisplay = document.getElementById('pageIdx');
    const totalPages = 67;

    // 1. 페이지 생성
    for (let i = 1; i <= totalPages; i++) {
        const page = document.createElement('div');
        page.className = 'page';
        
        let content = `
            <div class="page-content">
                <img src="images/${i}.jpg" alt="페이지 ${i}">
                <div class="page-num">${i}</div>
        `;

        if (i === totalPages) {
            content += `
                <div class="last-page-overlay">
                    <button onclick="goToFirstPage()" class="retry-btn">처음부터 다시보기</button>
                </div>
            `;
        }

        content += `</div>`;
        page.innerHTML = content;
        bookElement.appendChild(page);
    }

    // 2. PageFlip 초기화
    const pageFlip = new St.PageFlip(bookElement, {
        width: 400,
        height: 600,
        size: "stretch",
        minWidth: 310,
        maxWidth: 1000,
        minHeight: 420,
        maxHeight: 1350,
        showCover: true,
        mobileScrollSupport: true,
        usePortrait: true, 
        flippingTime: 800
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));

    window.goToFirstPage = function() {
        pageFlip.flip(0);
    };

    // 3. 페이지 전환 시 소리 및 인덱스 업데이트
    pageFlip.on('flip', (e) => {
        if (flipSound) {
            flipSound.currentTime = 0;
            flipSound.play().catch(() => {});
        }
        pageIdxDisplay.innerText = `${e.data + 1} / ${totalPages}`;
    });

    // 4. 마우스 휠로 페이지 넘기기
    bookElement.addEventListener('wheel', function(e) {
        e.preventDefault();
        if (e.deltaY > 0) {
            pageFlip.flipNext();
        } else {
            pageFlip.flipPrev();
        }
    }, { passive: false });

    // 5. 반응형 (모바일 1페이지 / PC 2페이지)
    function updateOrientation() {
        const width = window.innerWidth;
        if (width <= 768) {
            pageFlip.update({mode: 'portrait'});
        } else {
            pageFlip.update({mode: 'landscape'});
        }
    }

    window.addEventListener('resize', updateOrientation);
    updateOrientation();
});