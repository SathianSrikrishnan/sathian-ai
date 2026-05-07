'use client';

import { useEffect, useState } from 'react';

const c = {
  cream:      'oklch(97.5% 0.01 80)',
  brown:      'oklch(30% 0.035 65)',
  brownSoft:  'oklch(42% 0.03 65)',
  brownMuted: 'oklch(58% 0.025 65)',
  gold:       'oklch(72% 0.145 75)',
  goldHover:  'oklch(62% 0.13 72)',
  goldSoft:   'oklch(72% 0.145 75 / 0.1)',
  goldTint:   'oklch(72% 0.145 75 / 0.3)',
  border:     'oklch(88% 0.015 75)',
};

export interface ShareButtonsProps {
  keepsakeUrl: string;
  childName: string;
}

// Simple inline SVGs so this share surface stays dependency-light.
function CopyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.52 3.48A11.77 11.77 0 0 0 12.04 0C5.46 0 .1 5.36.1 11.94c0 2.1.55 4.14 1.6 5.95L0 24l6.25-1.64a11.94 11.94 0 0 0 5.79 1.47h.01c6.58 0 11.94-5.36 11.94-11.94 0-3.19-1.24-6.18-3.47-8.41ZM12.05 21.8a9.85 9.85 0 0 1-5.02-1.37l-.36-.21-3.71.97.99-3.61-.24-.37a9.86 9.86 0 1 1 8.34 4.59Zm5.4-7.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.5.07-.77.37s-1.02 1-1.02 2.44 1.04 2.83 1.19 3.03c.15.2 2.05 3.13 4.97 4.39.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.11.56-.08 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35Z"/>
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

type ShareKey = 'copy' | 'whatsapp' | 'sms' | 'email' | 'x' | 'facebook';

export function ShareButtons({ keepsakeUrl, childName }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [shareStatus, setShareStatus] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const touch =
      'ontouchstart' in window ||
      (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0);
    setIsTouch(touch);
    setCanNativeShare(
      typeof navigator !== 'undefined' && typeof navigator.share === 'function'
    );
    setCurrentUrl(window.location.href);
  }, []);

  const resolvedUrl = keepsakeUrl || currentUrl;
  const shareText = `${childName}'s first forever memory`;
  const shareBody = `I wanted to share ${shareText}: ${resolvedUrl}`;
  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareBody)}`,
    sms: `sms:?body=${encodeURIComponent(shareBody)}`,
    email: `mailto:?subject=${encodeURIComponent(
      `${childName}'s first forever memory`
    )}&body=${encodeURIComponent(shareBody)}`,
    x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      resolvedUrl
    )}&text=${encodeURIComponent(shareText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      resolvedUrl
    )}`,
  };

  const handleCopy = async () => {
    if (!resolvedUrl) return;
    setShareStatus('');
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(resolvedUrl);
      } else {
        throw new Error('clipboard unavailable');
      }
      setCopied(true);
      setShareStatus('Family link copied.');
      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => setShareStatus(''), 3200);
    } catch {
      const input = document.createElement('textarea');
      input.value = resolvedUrl;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed';
      input.style.left = '-9999px';
      input.style.top = '0';
      document.body.appendChild(input);
      input.focus();
      input.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setShareStatus('Family link copied.');
        setTimeout(() => setCopied(false), 2000);
        setTimeout(() => setShareStatus(''), 3200);
      } catch {
        setShareStatus('Copy was blocked. Select the link below instead.');
      }
      document.body.removeChild(input);
    }
  };

  // On touch devices with Web Share API, prefer the native sheet for everything
  // except copy-link, which we keep explicit because it is the highest-trust path.
  const tryNativeShare = async (): Promise<boolean> => {
    if (!canNativeShare || !resolvedUrl) return false;
    try {
      await navigator.share({
        title: `${childName}'s first forever memory`,
        text: shareText,
        url: resolvedUrl,
      });
      return true;
    } catch {
      // User cancelled or share failed; fall through to per-platform URL.
      return false;
    }
  };

  const handleNativeShare = async () => {
    const ok = await tryNativeShare();
    if (!ok) setShareStatus('Share sheet closed. You can copy the family link instead.');
  };

  const handleShare = async (
    event: React.MouseEvent<HTMLAnchorElement>,
    key: Exclude<ShareKey, 'copy'>
  ) => {
    // Mobile-first: try the native share sheet if available. Users get WhatsApp,
    // iMessage, Mail, Messenger, and everything else they've installed.
    if (canNativeShare && isTouch) {
      event.preventDefault();
      const ok = await tryNativeShare();
      if (ok) return;
      window.location.href = shareLinks[key];
    }
  };

  const iconBtnStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    background: c.cream,
    color: c.brown,
    border: `1px solid ${c.border}`,
    minHeight: 52,
    minWidth: 52,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '0 14px',
    borderRadius: 26,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
  };

  return (
    <div className="w-full flex flex-col items-stretch gap-3">
      {/* Copy link: primary, always full-width on mobile */}
      <button
        type="button"
        onClick={handleCopy}
        className="w-full px-8 py-4 rounded-full active:scale-[0.98]"
        style={{
          fontFamily: 'var(--font-body)',
          background: c.gold,
          color: c.cream,
          fontSize: '1rem',
          fontWeight: 600,
          letterSpacing: '0.01em',
          boxShadow: `0 4px 24px oklch(72% 0.145 75 / 0.2)`,
          minHeight: 56,
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = c.goldHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = c.gold;
        }}
        aria-label="Copy family memory link"
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
          <CopyIcon />
          {copied ? 'Copied!' : 'Copy family link'}
        </span>
      </button>

      {canNativeShare && (
        <button
          type="button"
          onClick={handleNativeShare}
          className="w-full px-8 py-4 rounded-full active:scale-[0.98]"
          style={{
            fontFamily: 'var(--font-body)',
            background: c.cream,
            color: c.brown,
            border: `1px solid ${c.border}`,
            fontSize: '1rem',
            fontWeight: 600,
            minHeight: 56,
            cursor: 'pointer',
          }}
          aria-label="Open share options"
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
            <MessageIcon />
            Share from this device
          </span>
        </button>
      )}

      {/* Share row: 5 destinations. SMS hidden on desktop (sms: link is mobile). */}
      <div
        className="flex flex-wrap items-center justify-center gap-2"
        role="group"
        aria-label="Share keepsake"
      >
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => handleShare(event, 'whatsapp')}
          style={iconBtnStyle}
          aria-label={`Share ${childName}'s memory on WhatsApp`}
        >
          <WhatsAppIcon />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>

        {isTouch && (
          <a
            href={shareLinks.sms}
            onClick={(event) => handleShare(event, 'sms')}
            style={iconBtnStyle}
            aria-label={`Share ${childName}'s memory via Messages`}
          >
            <MessageIcon />
            <span className="hidden sm:inline">Messages</span>
          </a>
        )}

        <a
          href={shareLinks.email}
          onClick={(event) => handleShare(event, 'email')}
          style={iconBtnStyle}
          aria-label={`Email ${childName}'s memory`}
        >
          <EmailIcon />
          <span className="hidden sm:inline">Email</span>
        </a>

        <a
          href={shareLinks.x}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => handleShare(event, 'x')}
          style={iconBtnStyle}
          aria-label={`Share ${childName}'s memory on X`}
        >
          <XIcon />
          <span className="hidden sm:inline">X</span>
        </a>

        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => handleShare(event, 'facebook')}
          style={iconBtnStyle}
          aria-label={`Share ${childName}'s memory on Facebook`}
        >
          <FacebookIcon />
          <span className="hidden sm:inline">Facebook</span>
        </a>
      </div>

      <div
        aria-live="polite"
        style={{
          minHeight: 34,
          color: shareStatus ? c.brownSoft : c.brownMuted,
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          lineHeight: 1.35,
          textAlign: 'center',
        }}
      >
        {shareStatus ? (
          <span>{shareStatus}</span>
        ) : (
          <span>This link opens the memory first, then the Smile Fund gift option.</span>
        )}
      </div>

      {shareStatus.includes('blocked') && (
        <input
          readOnly
          value={resolvedUrl}
          onFocus={(event) => event.currentTarget.select()}
          style={{
            width: '100%',
            minHeight: 44,
            borderRadius: 22,
            border: `1px solid ${c.border}`,
            background: c.cream,
            color: c.brownSoft,
            padding: '0 14px',
            fontFamily: 'var(--font-body)',
            fontSize: 12,
          }}
          aria-label="Family memory link"
        />
      )}
    </div>
  );
}
