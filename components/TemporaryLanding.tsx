import Image from "next/image";

export function TemporaryLanding() {
  return (
    <main className="temporary-landing" aria-label="KAUNBATAYEGA coming soon">
      <div className="tl-sunburst" aria-hidden="true" />
      <div className="tl-glow" aria-hidden="true" />
      <div className="tl-accent-left" aria-hidden="true" />
      <div className="tl-accent-right" aria-hidden="true" />

      <section className="tl-content" aria-label="KAUNBATAYEGA coming soon">
        <Image
          className="tl-logo"
          src="/campaign/kaunbatayega-logo.png"
          alt="KAUNBATAYEGA"
          width={735}
          height={385}
          priority
        />

        <hr className="tl-divider" />

        <p className="tl-wait">The Wait Begins...</p>
        <p className="tl-soon">Bahut jald aapke shahar mein...</p>
        <p className="tl-city">Mathura&nbsp; • &nbsp;Vrindavan</p>
        <div className="tl-socials" aria-label="KaunBatayega social links">
          <a href="https://www.instagram.com/kaunbatayega.india?igsh=MThuNnRrend6eTNlMw==" target="_blank" rel="noreferrer" className="tl-social-link">
            <InstagramIcon />
            <span>@kaunbatayega.india</span>
          </a>
          <a href="https://www.facebook.com/share/1FBmLdJ44S/" target="_blank" rel="noreferrer" className="tl-social-link">
            <FacebookIcon />
            <span>KaunBatayega</span>
          </a>
        </div>
      </section>

      <svg className="tl-scene" viewBox="0 0 1440 430" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="temporary-landing-temple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e0a330" stopOpacity=".18" />
            <stop offset="1" stopColor="#b56f20" stopOpacity=".84" />
          </linearGradient>
          <linearGradient id="temporary-landing-river" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#073f9e" stopOpacity=".09" />
            <stop offset=".5" stopColor="#11aaa8" stopOpacity=".16" />
            <stop offset="1" stopColor="#073f9e" stopOpacity=".09" />
          </linearGradient>
        </defs>
        <path
          fill="url(#temporary-landing-temple)"
          d="M0,350 L0,285 L60,285 L60,245 L95,245 L95,278 L145,278 L145,205 L173,205 L184,155 L195,205 L220,205 L220,285 L305,285 L305,250 L345,250 L345,196 L360,196 L370,145 L380,196 L407,196 L407,287 L490,287 L490,255 L530,255 L530,220 L545,220 L555,175 L565,220 L592,220 L592,292 L680,292 L680,235 L710,235 L720,186 L730,235 L760,235 L760,290 L850,290 L850,250 L890,250 L890,202 L907,202 L917,152 L927,202 L955,202 L955,285 L1045,285 L1045,245 L1088,245 L1088,188 L1102,188 L1112,125 L1122,188 L1152,188 L1152,284 L1235,284 L1235,242 L1277,242 L1277,202 L1294,202 L1304,150 L1314,202 L1342,202 L1342,286 L1440,286 L1440,430 L0,430Z"
        />
        <path
          fill="url(#temporary-landing-river)"
          d="M0 325 C250 292 425 348 705 320 C975 294 1180 344 1440 312 L1440 430 L0 430Z"
        />
        <path
          d="M0 343 C290 314 420 361 705 334 C985 307 1200 354 1440 327"
          fill="none"
          stroke="#fff"
          strokeOpacity=".68"
          strokeWidth="9"
        />
      </svg>

      <div className="tl-mist" aria-hidden="true" />
     

      <style>{`
        .temporary-landing {
          --blue: #073f9e;
          --deep-blue: #062f78;
          --teal: #11aaa8;
          --gold: #e2a51e;
          --cream: #fff8eb;
          --white: #ffffff;
          min-height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 34px 20px 100px;
          color: var(--deep-blue);
          background:
            radial-gradient(circle at 50% 15%, rgba(255, 255, 255, .98), rgba(255, 255, 255, .82) 31%, transparent 54%),
            linear-gradient(180deg, #ffffff 0%, #fffaf0 58%, #f7e3bd 100%);
          overflow-x: hidden;
          isolation: isolate;
          font-family: Arial, "Noto Sans Devanagari", sans-serif;
        }

        .temporary-landing *,
        .temporary-landing *::before,
        .temporary-landing *::after {
          box-sizing: border-box;
        }

        .tl-sunburst {
          position: absolute;
          top: -7vh;
          left: 50%;
          width: min(950px, 110vw);
          aspect-ratio: 1;
          transform: translateX(-50%);
          border-radius: 50%;
          background: repeating-conic-gradient(
            from -12deg,
            rgba(17, 170, 168, .08) 0deg 3deg,
            rgba(255, 255, 255, 0) 3deg 11deg,
            rgba(7, 63, 158, .055) 11deg 14deg,
            rgba(255, 255, 255, 0) 14deg 23deg
          );
          mask-image: radial-gradient(circle, black 0 30%, rgba(0, 0, 0, .55) 48%, transparent 71%);
          -webkit-mask-image: radial-gradient(circle, black 0 30%, rgba(0, 0, 0, .55) 48%, transparent 71%);
          z-index: -3;
          animation: tlSlowSpin 46s linear infinite;
        }

        .tl-glow {
          position: absolute;
          top: 4%;
          left: 50%;
          width: 560px;
          height: 560px;
          transform: translateX(-50%);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 211, 107, .38), rgba(255, 211, 107, 0) 70%);
          filter: blur(2px);
          z-index: -2;
        }

        .tl-content {
          width: min(980px, 100%);
          position: relative;
          z-index: 3;
          animation: tlFadeUp 1s ease both;
        }

        .tl-logo {
          width: min(760px, 92vw);
          max-height: 330px;
          object-fit: contain;
          display: block;
          margin: 0 auto;
          filter: drop-shadow(0 15px 24px rgba(6, 47, 120, .10));
        }

        .tl-divider {
          width: min(460px, 70vw);
          border: 0;
          height: 2px;
          margin: 22px auto 20px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
        }

        .tl-wait {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(34px, 5vw, 64px);
          line-height: 1;
          letter-spacing: .02em;
          color: #252525;
          font-weight: 700;
        }

        .tl-soon {
          margin: 17px 0 0;
          font-size: clamp(28px, 4.4vw, 55px);
          line-height: 1.15;
          color: var(--gold);
          font-weight: 900;
        }

        .tl-city {
          margin: 16px 0 0;
          font-size: clamp(19px, 2.6vw, 30px);
          line-height: 1.2;
          color: var(--deep-blue);
          font-weight: 800;
          letter-spacing: .12em;
        }

        .tl-city::before {
          content: "";
          display: inline-block;
          width: 16px;
          height: 21px;
          margin-right: 11px;
          vertical-align: -3px;
          background: var(--gold);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
        }

        .tl-socials {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin: 24px auto 0;
          position: relative;
          z-index: 4;
        }

        .tl-social-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 44px;
          padding: 10px 16px;
          border-radius: 999px;
          border: 1px solid rgba(7, 63, 158, .16);
          background: rgba(255, 255, 255, .74);
          color: var(--deep-blue);
          text-decoration: none;
          font-size: 14px;
          font-weight: 800;
          box-shadow: 0 10px 26px rgba(6, 47, 120, .08);
          backdrop-filter: blur(10px);
          transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
        }

        .tl-social-link:hover {
          transform: translateY(-2px);
          border-color: rgba(17, 170, 168, .36);
          box-shadow: 0 16px 32px rgba(6, 47, 120, .12);
        }

        .tl-social-link svg {
          width: 18px;
          height: 18px;
          flex: 0 0 auto;
        }

        .tl-scene {
          position: absolute;
          inset: auto 0 0;
          height: 34vh;
          min-height: 230px;
          max-height: 390px;
          z-index: 0;
          opacity: .52;
        }

        .tl-mist {
          position: absolute;
          inset: auto 0 0;
          height: 27%;
          background: linear-gradient(180deg, transparent, rgba(255, 250, 240, .92));
          z-index: 1;
          pointer-events: none;
        }

        .tl-accent-left,
        .tl-accent-right {
          position: absolute;
          top: 13%;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          border: 2px solid rgba(7, 63, 158, .10);
          z-index: -1;
        }

        .tl-accent-left {
          left: -85px;
        }

        .tl-accent-right {
          right: -85px;
          border-color: rgba(17, 170, 168, .12);
        }

        @keyframes tlFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes tlSlowSpin {
          to { transform: translateX(-50%) rotate(360deg); }
        }

        @media (max-width: 640px) {
          .temporary-landing {
            padding: 22px 14px 115px;
          }

          .tl-logo {
            width: 96vw;
            max-height: 255px;
          }

          .tl-divider {
            margin: 14px auto 17px;
          }

          .tl-scene {
            height: 30vh;
            min-height: 205px;
          }

          .tl-wait {
            font-size: clamp(31px, 9vw, 48px);
          }

          .tl-soon {
            margin-top: 14px;
          }

          .tl-city {
            letter-spacing: .06em;
          }

          .tl-socials {
            gap: 8px;
            margin-top: 18px;
          }

          .tl-social-link {
            min-height: 40px;
            padding: 9px 12px;
            font-size: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .temporary-landing *,
          .temporary-landing *::before,
          .temporary-landing *::after {
            animation: none !important;
          }
        }

      `}</style>
    </main>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="18" height="18" rx="5.2" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M14.2 8.3V6.9c0-.7.4-1.1 1.2-1.1h1.4V3.3c-.7-.1-1.4-.2-2.2-.2-2.3 0-3.9 1.4-3.9 3.9v1.3H8.3v2.8h2.4v9.8h3.1v-9.8h2.4l.5-2.8h-2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
