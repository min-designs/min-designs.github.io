// === 作品数据（替换为你的真实作品） ===
const works = [];
for (let i = 1; i <= 32; i++) {
    const page = String(i).padStart(2, '0');
    works.push({
        tag: 'all',
        title: `作品集 第${i}页`,
        img: `images/works/page_${page}.png`
    });
}

// === 渲染作品 ===
const grid = document.getElementById('worksGrid');
function renderWorks(filter = 'all') {
    grid.innerHTML = '';
    const filtered = filter === 'all' ? works : works.filter(w => w.tag === filter);
    filtered.forEach((w, i) => {
        const card = document.createElement('div');
        card.className = 'work-card';
        card.setAttribute('data-index', i);
        card.innerHTML = `
            <div class="work-card-img">
                ${w.img ? `<img src="${w.img}" alt="${w.title}" style="width:100%;height:100%;object-fit:cover;">` : '📁 作品图片'}
            </div>
            <div class="work-card-info">
                <p class="work-card-tag">${getTagName(w.tag)}</p>
                <h3 class="work-card-title">${w.title}</h3>
            </div>
        `;
        card.addEventListener('click', () => openLightbox(w));
        grid.appendChild(card);
    });
}

function getTagName(tag) {
    const map = { esports: '电竞海报', brand: '品牌视觉', illustration: '插画', other: '其他' };
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
        lb.innerHTML = '<button class="lightbox-close">&times;</button><div class="lightbox-content"></div>';
        document.body.appendChild(lb);
        lb.querySelector('.lightbox-close').addEventListener('click', () => lb.classList.remove('active'));
        lb.addEventListener('click', e => { if (e.target === lb) lb.classList.remove('active'); });
    }
    const content = lb.querySelector('.lightbox-content');
    if (work.img) {
        content.innerHTML = `<img src="${work.img}" alt="${work.title}"><p style="color:#ccc;text-align:center;margin-top:1rem;">${work.title} — ${work.desc}</p>`;
    } else {
        content.innerHTML = `
            <div style="text-align:center;color:#333;">
                <div style="font-size:4rem;margin-bottom:1rem;">📁</div>
                <h2 style="font-size:1.5rem;margin-bottom:0.5rem;">${work.title}</h2>
                <p style="color:#888;">${work.desc}</p>
                <p style="color:#555;margin-top:1rem;">📷 此处替换为你的作品图片</p>
            </div>
        `;
    }
    lb.classList.add('active');
}

// === 移动端导航 ===
document.getElementById('navToggle').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('open');
    });
});

// === 导航滚动阴影 ===
window.addEventListener('scroll', () => {
    const nav = document.getElementById('nav');
    nav.style.background = window.scrollY > 50
        ? 'rgba(255,255,255,0.95)'
        : 'rgba(255,255,255,0.85)';
});

// === 启动 ===
renderWorks();
