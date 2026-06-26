import { useState, useEffect, useMemo } from 'react';
import { sendConfirmationEmail, sendDeclineEmail } from './emailService';
import './App.css';

function App() {
  // ─── State ───
  const [dateValue, setDateValue] = useState('');
  const [timeValue, setTimeValue] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' | 'error' | ''
  const [showTickmark, setShowTickmark] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null); // { type: 'sending'|'success'|'error', text: string }

  // ─── Set default date to next Sunday ───
  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + daysUntilSunday);

    const year = nextSunday.getFullYear();
    const month = String(nextSunday.getMonth() + 1).padStart(2, '0');
    const day = String(nextSunday.getDate()).padStart(2, '0');

    setDateValue(`${year}-${month}-${day}`);
  }, []);

  // ─── Floating Elements (Hearts, Bats, Stars, Moon) ───
  const floaters = useMemo(() => {
    const symbols = [
      { char: '♥', type: 'heart' },
      { char: '🧡', type: 'heart' },
      { char: '🔸', type: 'star' },
      { char: '🦇', type: 'bat' },
      { char: '✦', type: 'star' },
      { char: '✧', type: 'star' },
      { char: '🌙', type: 'moon' }
    ];
    return Array.from({ length: 22 }, (_, i) => {
      const sym = symbols[Math.floor(Math.random() * symbols.length)];
      return {
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 10}s`,
        duration: `${10 + Math.random() * 15}s`,
        symbol: sym.char,
        type: sym.type,
        size: sym.type === 'moon' ? '1.4em' : `${0.7 + Math.random() * 0.9}em`,
      };
    });
  }, []);

  // ─── Handlers ───
  const handleConfirm = async () => {
    if (isDeclined) {
      setResponseMessage('ERROR: Cannot confirm rendezvous if decline option is selected. Please uncheck to proceed.');
      setMessageType('error');
      setShowTickmark(false);
      return;
    }

    if (dateValue && timeValue) {
      setIsConfirmed(true);
      setResponseMessage('PROTOCOL ACCEPTED! Oh my gosh, I can\'t wait to see you! ♥');
      setMessageType('success');
      setShowTickmark(true);

      // Automatically send the email
      setEmailStatus({ type: 'sending', text: 'TRANSMITTING DATA...' });
      try {
        await sendConfirmationEmail(dateValue, timeValue);
        setEmailStatus({ type: 'success', text: 'DATA TRANSMITTED SUCCESSFULLY ✔' });
      } catch (err) {
        console.error('Email send error:', err);
        setEmailStatus({ type: 'error', text: 'TRANSMISSION FAILED. Retry or check console.' });
      }
    } else {
      setResponseMessage('ERROR: Missing temporal or spatial coordinates. Please input all parameters.');
      setMessageType('error');
      setShowTickmark(false);
      setIsConfirmed(false);
    }
  };

  const handleDecline = async (e) => {
    const checked = e.target.checked;
    setIsDeclined(checked);

    if (checked) {
      setIsConfirmed(true); // disable confirm button
      setShowTickmark(false);
      setResponseMessage('DECLINE PROTOCOL INITIATED. Your response has been recorded.');
      setMessageType('error');

      // Automatically send decline email
      setEmailStatus({ type: 'sending', text: 'TRANSMITTING DECLINE DATA...' });
      try {
        await sendDeclineEmail();
        setEmailStatus({ type: 'success', text: 'DECLINE TRANSMITTED ✔' });
      } catch (err) {
        console.error('Decline email error:', err);
        setEmailStatus({ type: 'error', text: 'DECLINE TRANSMISSION FAILED.' });
      }
    } else {
      setIsConfirmed(false);
      setResponseMessage('');
      setMessageType('');
      setEmailStatus(null);
    }
  };

  return (
    <>
      {/* Darkened Watermark Background */}
      <div className="watermark-bg">
        <img
          src="/Screenshot_20260625_141312_Instagram.jpg"
          alt=""
          aria-hidden="true"
        />
      </div>

      {/* Floating Pixel Elements */}
      <div className="floating-hearts">
        {floaters.map((f) => (
          <span
            className={`floater floater-${f.type}`}
            key={f.id}
            style={{
              left: f.left,
              animationDelay: f.delay,
              animationDuration: f.duration,
              fontSize: f.size,
            }}
          >
            {f.symbol}
          </span>
        ))}
      </div>

      {/* Main Content */}
      <div className="app-wrapper">
        <div className="container">
          {/* Retro Window Header */}
          <div className="window-header">
            <span className="window-title">🦇 BAT-OS v1.2 [MANYAJI.EXE] 🦇</span>
            <div className="window-controls">
              <span className="ctrl-btn min">_</span>
              <span className="ctrl-btn max">□</span>
              <span className="ctrl-btn close">×</span>
            </div>
          </div>

          {/* Pixel Corner Decorations */}
          <div className="corner-deco top-left"></div>
          <div className="corner-deco top-right"></div>
          <div className="corner-deco bottom-left"></div>
          <div className="corner-deco bottom-right"></div>

          {/* 8-bit Love Meter / Health Bar */}
          <div className="affinity-meter">
            <span className="meter-label">AFFINITY LEVEL:</span>
            <div className="heart-containers">
              <span className="pixel-heart pulse-1">♥</span>
              <span className="pixel-heart pulse-2">♥</span>
              <span className="pixel-heart pulse-3">♥</span>
              <span className="pixel-heart pulse-4">♥</span>
              <span className="pixel-heart pulse-5">♥</span>
            </div>
          </div>

          <h1>Social Protocol Initiation</h1>

          {/* Characters */}
          <div className="character-display">
            <div className="character">
              <div className="character-image">
                <img src="/pngegg.png" alt="Batman" />
              </div>
              <p>🦇 Me</p>
            </div>

            <div className="rose-display">
              <img src="/rose.png" alt="Rose" />
            </div>

            <div className="character">
              <div className="character-image">
                <img src="/Untitled.png" alt="Catwoman" />
              </div>
              <p>🐱 You</p>
            </div>
          </div>

          {/* Cute Pixel Divider */}
          <div className="pixel-divider">
            ✦ 🦇 ✦ ♥ ✦ 🐱 ✦ ♥ ✦ 🦇 ✦
          </div>

          {/* Dialogue */}
          <div className="dialogue-box">
            <p>
              <strong>BATMAN: </strong>
              Initiating social engagement protocol, <em>mon amour</em>. My algorithms have processed
              data indicating a high affinity for sonic frequencies associated with
              nerdy interests, alongside a notable dedication to caffeine 
              <br />
              <br />
              (Fallen in Love Status: Confirmed).
            </p>
            <p style={{ marginTop: '10px' }}>
              <strong>BATMAN: </strong>
              This analysis suggests a high probability of mutual enjoyment for a
              non-mission-critical activity next Sunday (11th July 2026) or whenever you can, <em>mon cher</em>. 
              <br />
              The creator does really enjoy talking to you and would love to go on a lunch date (following a surprise event) with you. Requesting temporal coordinates for optimal
              rendezvous. I hope you&apos;re taking care of yourself today. Drink
              water and have a good rest of the day (●&apos;◡&apos;●)
            </p>
          </div>

          {/* Cute Pixel Divider */}
          <div className="pixel-divider">
            ♦ ♥ ♦ 🦇 ♦ ♥ ♦
          </div>

          {/* Inputs */}
          <div className="input-group">
            <div className="input-item">
              <label htmlFor="date-input">DESIGNATED DATE:</label>
              <input
                type="date"
                id="date-input"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                disabled={isConfirmed}
              />
            </div>
            <div className="input-item">
              <label htmlFor="time-input">DESIGNATED TIME:</label>
              <input
                type="time"
                id="time-input"
                value={timeValue}
                onChange={(e) => setTimeValue(e.target.value)}
                disabled={isConfirmed}
              />
            </div>
          </div>

          {/* Confirm Button */}
          <button
            className="action-button"
            id="confirmButton"
            onClick={handleConfirm}
            disabled={isConfirmed}
          >
            CONFIRM RENDEZVOUS
          </button>

          {/* Decline Option */}
          <div className="decline-option">
            <input
              type="checkbox"
              id="declineCheckbox"
              checked={isDeclined}
              onChange={handleDecline}
              disabled={isConfirmed && !isDeclined}
            />
            <label htmlFor="declineCheckbox">I don&apos;t want to 😢</label>
          </div>

          {/* Sticker Display */}
          {responseMessage && (
            <div className="sticker-display">
              {messageType === 'success' && (
                <img src="/Yes.png" alt="Yes Sticker" className="response-sticker" />
              )}
              {messageType === 'error' && isDeclined && (
                <img src="/No.png" alt="No Sticker" className="response-sticker" />
              )}
            </div>
          )}

          {/* Response */}
          {responseMessage && (
            <div className={`response-message ${messageType}`}>
              {responseMessage}
            </div>
          )}

          {/* Tickmark */}
          {showTickmark && <div className="tickmark">✔</div>}

          {/* Email Status */}
          {emailStatus && (
            <div className={`email-status ${emailStatus.type}`}>
              {emailStatus.text}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
