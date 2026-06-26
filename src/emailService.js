/**
 * Email Service using EmailJS
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://www.emailjs.com/ and create a free account
 * 2. Add a Gmail service (connect your Gmail account)
 * 3. Create two email templates:
 *
 *    Template 1 - "confirmation":
 *      Subject: Rendezvous Confirmed! (from BATMAN.EXE)
 *      Body: Use variables {{date}} and {{time}}
 *
 *    Template 2 - "decline":
 *      Subject: Rendezvous Declined (from BATMAN.EXE)
 *      Body: A decline notification message
 *
 * 4. Replace the placeholder IDs below with your actual IDs
 */

// ============================================
// REPLACE THESE WITH YOUR EMAILJS CREDENTIALS
// ============================================
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';      // e.g., 'service_abc123'
const EMAILJS_CONFIRMATION_TEMPLATE_ID = 'YOUR_CONFIRMATION_TEMPLATE_ID'; // e.g., 'template_xyz456'
const EMAILJS_DECLINE_TEMPLATE_ID = 'YOUR_DECLINE_TEMPLATE_ID';           // e.g., 'template_def789'
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';       // e.g., 'AbCdEfGhIjKlMn'

const RECIPIENT_EMAIL = 'nilaysrivas1006@gmail.com';

// Load EmailJS SDK dynamically
let emailjsLoaded = false;
let emailjsLoadPromise = null;

function loadEmailJS() {
  if (emailjsLoaded) return Promise.resolve();
  if (emailjsLoadPromise) return emailjsLoadPromise;

  emailjsLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = () => {
      if (window.emailjs) {
        window.emailjs.init(EMAILJS_PUBLIC_KEY);
        emailjsLoaded = true;
        resolve();
      } else {
        reject(new Error('EmailJS failed to load'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load EmailJS SDK'));
    document.head.appendChild(script);
  });

  return emailjsLoadPromise;
}

/**
 * Check if EmailJS is configured (user has replaced placeholder IDs)
 */
function isConfigured() {
  return (
    EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID' &&
    EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' &&
    EMAILJS_CONFIRMATION_TEMPLATE_ID !== 'YOUR_CONFIRMATION_TEMPLATE_ID' &&
    EMAILJS_DECLINE_TEMPLATE_ID !== 'YOUR_DECLINE_TEMPLATE_ID'
  );
}

/**
 * Send confirmation email with date and time
 */
export async function sendConfirmationEmail(date, time) {
  if (!isConfigured()) {
    // Fallback to mailto: if EmailJS is not configured
    console.warn('EmailJS not configured — falling back to mailto:');
    return fallbackMailto('confirmation', date, time);
  }

  await loadEmailJS();

  const templateParams = {
    to_email: RECIPIENT_EMAIL,
    date: date,
    time: time,
    message: `This is an automated confirmation from BATMAN.EXE regarding our upcoming social engagement.\n\nDesignated Date: ${date}\nDesignated Time: ${time}\n\nMy systems are now updated, and I am eagerly anticipating our interaction.\n\nSee you soon!\nBATMAN.EXE`,
  };

  const response = await window.emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_CONFIRMATION_TEMPLATE_ID,
    templateParams
  );

  return response;
}

/**
 * Send decline email
 */
export async function sendDeclineEmail() {
  if (!isConfigured()) {
    console.warn('EmailJS not configured — falling back to mailto:');
    return fallbackMailto('decline');
  }

  await loadEmailJS();

  const templateParams = {
    to_email: RECIPIENT_EMAIL,
    message: `Hello Batman,\n\nThis is an automated response via BATMAN.EXE.\n\nRegrettably, I must decline the proposed social engagement at this time. 😢\n\nCatwoman`,
  };

  const response = await window.emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_DECLINE_TEMPLATE_ID,
    templateParams
  );

  return response;
}

/**
 * Fallback to mailto: links when EmailJS is not configured
 */
function fallbackMailto(type, date, time) {
  if (type === 'confirmation') {
    const subject = encodeURIComponent('Rendezvous Confirmed! (from BATMAN.EXE)');
    const body = encodeURIComponent(
      `Hello Batman,\n\n` +
      `This is an automated confirmation from BATMAN.EXE regarding our upcoming social engagement.\n\n` +
      `Designated Date: ${date}\n` +
      `Designated Time: ${time}\n\n` +
      `My systems are now updated, and I am eagerly anticipating our interaction.\n\n` +
      `See you soon!\n` +
      `BATMAN.EXE`
    );
    window.open(`mailto:${RECIPIENT_EMAIL}?subject=${subject}&body=${body}`, '_blank');
  } else {
    const subject = encodeURIComponent('Rendezvous Declined (from BATMAN.EXE)');
    const body = encodeURIComponent(
      `Hello Batman,\n\n` +
      `This is an automated response from me via BATMAN.EXE.\n\n` +
      `Regrettably, I must decline the proposed social engagement at this time. 😢\n\n` +
      `Catwoman`
    );
    window.open(`mailto:${RECIPIENT_EMAIL}?subject=${subject}&body=${body}`, '_blank');
  }

  return Promise.resolve({ status: 200, text: 'mailto' });
}
