/* ============================================================
   お結び集会 — 2026 リニューアル スクリプト
   ============================================================ */

(() => {
    'use strict';

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;
    const body = document.body;

    /* ------------------------------------------------------
       1. ヒーロータイトルを一文字ずつふわっと出す
       ------------------------------------------------------ */
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && !prefersReduced) {
        let charIndex = 0;
        const splitNode = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const frag = document.createDocumentFragment();
                for (const ch of node.textContent) {
                    if (ch.trim() === '') {
                        frag.appendChild(document.createTextNode(ch));
                        continue;
                    }
                    const span = document.createElement('span');
                    span.className = 'char';
                    span.style.setProperty('--char-i', charIndex++);
                    span.textContent = ch;
                    frag.appendChild(span);
                }
                node.replaceWith(frag);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                [...node.childNodes].forEach(splitNode);
            }
        };
        [...heroTitle.childNodes].forEach(splitNode);
    }

    /* ------------------------------------------------------
       2. スクロール連動（進捗おむすび・ヘッダー影・フロートCTA）
       ------------------------------------------------------ */
    const header = document.querySelector('.site-header');

    const onScroll = () => {
        const max = Math.max(1, root.scrollHeight - window.innerHeight);
        const progress = Math.min(1, window.scrollY / max);
        root.style.setProperty('--scroll-progress', progress.toFixed(4));

        header?.classList.toggle('scrolled', window.scrollY > 30);
        body.classList.toggle('is-scrolled', window.scrollY > 80);
        body.classList.toggle('show-float', window.scrollY > 480);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    /* ------------------------------------------------------
       3. モバイルナビ（ハンバーガー）
       ------------------------------------------------------ */
    const navToggle = document.querySelector('.nav-toggle');
    const navBackdrop = document.querySelector('.nav-backdrop');
    const navLinks = document.querySelectorAll('.nav-links a');

    const setNav = (open) => {
        body.classList.toggle('nav-open', open);
        navToggle?.setAttribute('aria-expanded', String(open));
    };

    navToggle?.addEventListener('click', () => {
        setNav(!body.classList.contains('nav-open'));
    });

    navBackdrop?.addEventListener('click', () => setNav(false));
    navLinks.forEach(a => a.addEventListener('click', () => setNav(false)));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setNav(false);
    });

    /* ------------------------------------------------------
       4. スクロールリビール（時間差つき）
       ------------------------------------------------------ */
    const staggerGroups = [
        { parent: '.ease-grid',     child: '.ease-card'    },
        { parent: '.welcome-grid',  child: '.welcome-item' },
        { parent: '.rule-grid',     child: '.rule-card'    },
        { parent: '.steps',         child: '.step'         },
        { parent: '.hero-chips',    child: 'li'            },
        { parent: '.sanpo-voices',  child: '.sanpo-voice'  },
    ];

    staggerGroups.forEach(({ parent, child }) => {
        const parentEl = document.querySelector(parent);
        if (!parentEl) return;
        parentEl.classList.remove('reveal');
        parentEl.querySelectorAll(child).forEach((el, i) => {
            el.classList.add('reveal');
            el.style.setProperty('--reveal-delay', `${Math.min(i * 0.09, 0.55)}s`);
        });
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('on');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -4% 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ------------------------------------------------------
       5. ナビのアクティブセクション表示
       ------------------------------------------------------ */
    const sections = document.querySelectorAll('section[id]');
    const menuAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                menuAnchors.forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-30% 0px -60% 0px' });

    sections.forEach(s => sectionObserver.observe(s));

    /* ------------------------------------------------------
       6. 桜の花びら（ページ全体・控えめに）
       ------------------------------------------------------ */
    const petalsWrap = document.querySelector('.petals-global');
    if (petalsWrap && !prefersReduced) {
        const settings = [
            [8, 26, 0], [22, 31, 8], [38, 24, 15], [55, 29, 4],
            [70, 27, 11], [84, 33, 19], [94, 25, 6]
        ];
        settings.forEach(([left, duration, delay]) => {
            const petal = document.createElement('span');
            petal.className = 'petal';
            petal.style.left = `${left}%`;
            petal.style.animationDuration = `${duration}s`;
            petal.style.animationDelay = `${delay}s`;
            petalsWrap.appendChild(petal);
        });
    }

    /* ------------------------------------------------------
       7. CTAクリックで桜がふわっと舞う
       ------------------------------------------------------ */
    if (!prefersReduced) {
        const burstTargets = document.querySelectorAll('[data-burst]');
        burstTargets.forEach(target => {
            target.addEventListener('click', (e) => {
                const count = 10;
                for (let i = 0; i < count; i++) {
                    const p = document.createElement('span');
                    p.className = 'sakura-burst';
                    p.style.left = `${e.clientX}px`;
                    p.style.top = `${e.clientY}px`;
                    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.6;
                    const dist = 46 + Math.random() * 56;
                    p.style.setProperty('--bx', `${Math.cos(angle) * dist}px`);
                    p.style.setProperty('--by', `${Math.sin(angle) * dist - 36}px`);
                    p.style.setProperty('--br', `${180 + Math.random() * 360}deg`);
                    document.body.appendChild(p);
                    p.addEventListener('animationend', () => p.remove());
                }
            });
        });
    }
})();
