/* ============================================
   お結び集会 - メインスクリプト
   ============================================ */

// スクロールアニメーション（.fade クラスの要素が画面に入ったらフェードイン）
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('on');
    });
}, { threshold: 0.08 });

document.querySelectorAll('.fade').forEach(el => observer.observe(el));
