// === 作品数据 ===
const works = [
    // 运营 (3-14)
    ...Array.from({length: 12}, (_, i) => ({
        tag: 'ops',
        title: `运营设计`,
        page: i + 3,
        img: `images/works/page_${String(i + 3).padStart(2, '0')}.png`
    })),
    // 品牌 (15-25)
    ...Array.from({length: 11}, (_, i) => ({
        tag: 'brand',
        title: `品牌设计`,
        page: i + 15,
        img: `images/works/page_${String(i + 15).padStart(2, '0')}.png`
    })),
    // UI (26-29)
    ...Array.from({length: 4}, (_, i) => ({
        tag: 'ui',
        title: `UI 设计`,
        page: i + 26,
        img: `images/works/page_${String(i + 26).padStart(2, '0')}.png`
    })),
    // 其他 (30-31)
    ...Array.from({length: 2}, (_, i) => ({
        tag: 'other',
        title: `其他作品`,
        page: i + 30,
        img: `images/works/page_${String(i + 30).padStart(2, '0')}.png`
    })),
];

// === 渲染 ===
const grid = document.getElementById('worksGrid');
let currentFilter = 'all';

function renderWorks(filter = 'all') {
    currentFilter = filter;
    grid.innerHTML = '';
    const filtered = filter === 'all' ? works : works.filter(w => w.tag === filter);

    filtered.forEach((w, i) => {
        const card = document.createElement('div');
        card.className = 'work-card';
        card.setAttribute('data-tag', w.tag);
        card.style.animationDelay = `${i * 0.05}s`;
        card.innerHTML = `
            <div class="work-card-img">
                <img src="${w.img}" alt="${w.title}" loading="lazy">
            </div>
            <div class="work-card-info">
                <span class="work-card-tag">${getTagName(w.tag)}</span>
                <span class="work-card-page">第${w.page}页</span>
            </div>
        `;
        card.addEventListener('click', () => openLightbox(w));
        grid.appendChild(card);
    });

    // Update count
    document.getElementById('workCount').textContent = `${filtered.length} 件作品`;
}

function getTagName(tag) {
    const map = { ops: '运营设计', brand: '品牌设计', ui: 'UI 设计', other: '其他' };
    return map[tag] || tag;
}

// === 筛选 ===
document.getElementById('worksFilter').addEventListener('click', e => {
    if (e.target.classList.contains('filter-btn')) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderWorks(e.target.dataset.cat);
    }
});

// === Lightbox ===
function openLightbox(work) {
    let lb = document.getElementById('lightbox');
    if (!lb) {
        lb = document.createElement('div');
        lb.id = 'lightbox';
        lb.className = 'lightbox';
        lb.innerHTML = `
            <button class="lightbox-close">&times;</button>
            <button class="lightbox-prev">‹</button>
            <button class="lightbox-next">›</button>
            <div class="lightbox-content"></div>
            <div class="lightbox-counter"></div>
        `;
        document.body.appendChild(lb);
        lb.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
        lb.querySelector('.lightbox-prev').addEventListener('click', prevWork);
        lb.querySelector('.lightbox-next').addEventListener('click', nextWork);
        document.addEventListener('keydown', lightboxKeys);
    }

    const filtered = currentFilter === 'all' ? works : works.filter(w => w.tag === currentFilter);
    window._lbWorks = filtered;
    window._lbIndex = filtered.findIndex(w => w.page === work.page);
    showLightboxWork();
    lb.classList.add('active');
}

function showLightboxWork() {
    const w = window._lbWorks[window._lbIndex];
    const content = document.querySelector('.lightbox-content');
    const counter = document.querySelector('.lightbox-counter');
    content.innerHTML = `<img src="${w.img}" alt="${w.title}">`;
    counter.textContent = `${window._lbIndex + 1} / ${window._lbWorks.length}`;
    document.querySelector('.lightbox-prev').style.visibility = window._lbIndex > 0 ? 'visible' : 'hidden';
    document.querySelector('.lightbox-next').style.visibility = window._lbIndex < window._lbWorks.length - 1 ? 'visible' : 'hidden';
}

function prevWork() { if (window._lbIndex > 0) { window._lbIndex--; showLightboxWork(); } }
function nextWork() { if (window._lbIndex < window._lbWorks.length - 1) { window._lbIndex++; showLightboxWork(); } }
function closeLightbox() { document.getElementById('lightbox').classList.remove('active'); document.removeEventListener('keydown', lightboxKeys); }
function lightboxKeys(e) { if (e.key === 'Escape') closeLightbox(); if (e.key === 'ArrowLeft') prevWork(); if (e.key === 'ArrowRight') nextWork(); }

// === 移动端导航 ===
document.getElementById('navToggle').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => document.querySelector('.nav-links').classList.remove('open'));
});

// === 导航阴影 ===
window.addEventListener('scroll', () => {
    document.getElementById('nav').style.background = window.scrollY > 50
        ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.85)';
});

// === 启动 ===
renderWorks();
