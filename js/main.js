/* ============================================
   お結び集会 - メインスクリプト
   ============================================ */

// --- スタガーフェード設定 ---
// グリッド内の子要素にfadeクラスと段差ディレイを付与
const staggerGroups = [
    { parent: '.welcome-grid', child: '.welcome-item' },
    { parent: '.rule-grid',    child: '.rule-card'    },
    { parent: '.steps',        child: '.step'         },
];

staggerGroups.forEach(({ parent: parentSel, child: childSel }) => {
    const parentEl = document.querySelector(parentSel);
    if (!parentEl) return;
    parentEl.classList.remove('fade'); // ラッパーからfadeを除去
    parentEl.querySelectorAll(childSel).forEach((el, idx) => {
        el.classList.add('fade');
        el.style.transitionDelay = `${idx * 0.08}s`;
    });
});

// --- スクロールフェードイン ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('on');
            // アニメーション完了後にディレイをリセット（ホバーに影響しないよう）
            setTimeout(() => { e.target.style.transitionDelay = ''; }, 900);
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.08 });

document.querySelectorAll('.fade, .fade-left, .fade-right').forEach(el => observer.observe(el));

// --- ナビ スクロール影 ---
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// --- アクティブ セクション ハイライト ---
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav ul a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const id = e.target.id;
            navLinks.forEach(a => {
                a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
            });
        }
    });
}, { rootMargin: '-25% 0px -65% 0px' });

sections.forEach(s => sectionObserver.observe(s));
