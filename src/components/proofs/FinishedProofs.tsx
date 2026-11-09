'use client';
// AGE-63 (owner, Nov 9): three ways to show the Finished Proofs. No arrows, no captions; tap or touch pauses.
//  - ProofStack: cards piled one on another; flips every 3.2 s or on tap (hero banners).
//  - ProofRow: two rows drifting in opposite directions ("Finished Proofs", top of the page).
//  - ProofRound: a slow round carousel (2.5D, renders on every phone), placed under the price.
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FINISHED_PROOFS, type FinishedProof } from '@/content/finished-proofs';
import styles from './FinishedProofs.module.css';

const still = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function ProofStack({ proofs = FINISHED_PROOFS.slice(0, 5), priority = false, size = 'md' }: { proofs?: FinishedProof[]; priority?: boolean; size?: 'sm' | 'md' }) {
  const [top, setTop] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const start = () => { if (timer.current) clearInterval(timer.current); if (!still()) timer.current = setInterval(() => setTop(t => (t + 1) % proofs.length), 3200); };
  useEffect(() => { start(); return () => { if (timer.current) clearInterval(timer.current); }; }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className={styles.stackWrap}>
      <button type="button" className={`${styles.stack} ${size === 'sm' ? styles.sm : ''}`} aria-label="Show the next Proof" onClick={() => { setTop(t => (t + 1) % proofs.length); start(); }}>
        {proofs.map((p, i) => {
          const pos = (i - top + proofs.length) % proofs.length;
          return <Image key={p.src} src={p.src} alt={pos === 0 ? p.alt : ''} width={p.width} height={p.height} sizes={size === 'sm' ? '170px' : '(min-width: 700px) 280px, 62vw'}
            priority={priority && i === 0} loading={priority && i === 0 ? undefined : 'lazy'} className={styles.card} data-pos={Math.min(pos, 4)} />;
        })}
      </button>
      <div className={styles.dots} aria-hidden="true">{proofs.map((p, i) => <i key={p.src} className={i === top ? styles.on : undefined} />)}</div>
    </div>
  );
}

export function ProofRow({ proofs = FINISHED_PROOFS, title = 'Finished Proofs', label }: { proofs?: FinishedProof[]; title?: string | null; label?: string }) {
  const a = proofs.filter((_, i) => i % 2 === 0), b = proofs.filter((_, i) => i % 2 === 1);
  const track = (list: FinishedProof[], rev: boolean) => (
    <div className={`${styles.track} ${rev ? styles.rev : ''}`}>
      {[...list, ...list].map((p, i) => <Image key={p.src + i} src={p.src} alt={i < list.length ? p.alt : ''} aria-hidden={i >= list.length || undefined} width={p.width} height={p.height} sizes="150px" loading="lazy" />)}
    </div>
  );
  return (
    <section className={styles.rowWrap} aria-label={title ?? label}>
      {title ? <h2 className={styles.rowTitle}>{title}</h2> : null}
      <div className={styles.marquee}>{track(a, false)}{track(b, true)}</div>
    </section>
  );
}

export function ProofRound({ proofs = FINISHED_PROOFS.slice(5, 15) }: { proofs?: FinishedProof[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLImageElement | null)[]>([]);
  useEffect(() => {
    let ang = 0, hold = false, lastX: number | null = null, raf = 0;
    const n = proofs.length, w = wrap.current;
    if (!w) return;
    const place = () => {
      const R = Math.min(w.clientWidth * 0.42, 330);
      cards.current.forEach((c, i) => {
        if (!c) return;
        const a = ang + (i * 2 * Math.PI) / n, d = (Math.cos(a) + 1) / 2;
        c.style.transform = `translate(calc(-50% + ${Math.sin(a) * R}px), -50%) scale(${0.55 + 0.45 * d})`;
        c.style.zIndex = String(Math.round(d * 100));
        c.style.opacity = String(0.35 + 0.65 * d);
      });
    };
    const tick = () => { if (!hold && !still()) ang -= 0.0035; place(); raf = requestAnimationFrame(tick); };
    const down = (e: PointerEvent) => { hold = true; lastX = e.clientX; };
    const move = (e: PointerEvent) => { if (hold && lastX !== null) { ang += (e.clientX - lastX) / 180; lastX = e.clientX; } };
    const up = () => { hold = false; lastX = null; };
    w.addEventListener('pointerdown', down); window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
    // Spin only while on screen.
    const io = new IntersectionObserver(([e]) => { cancelAnimationFrame(raf); if (e.isIntersecting) tick(); else place(); });
    io.observe(w);
    return () => { cancelAnimationFrame(raf); io.disconnect(); w.removeEventListener('pointerdown', down); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  }, [proofs.length]);
  return (
    <div ref={wrap} className={styles.round} aria-label="Finished Proofs, turning">
      {proofs.map((p, i) => <Image key={p.src} ref={el => { cards.current[i] = el; }} src={p.src} alt={p.alt} width={p.width} height={p.height} sizes="170px" loading="lazy" className={styles.roundCard} />)}
    </div>
  );
}
