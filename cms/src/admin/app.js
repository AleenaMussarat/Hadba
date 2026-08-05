import logoOrange from './assets/logo-orange.png';
import logoRed from './assets/logo-red.png';
// Same icon used as the live website's favicon (index.html), so both match.
import favicon from './assets/icon-knife-fork.png';

const brandPrimary = {
  // Red drives everything by default (forms, focus rings, sidebar nav
  // active state, buttons, login) — this is the single global token Strapi
  // uses across nearly the whole admin, so red here is what makes forms/nav
  // actually read as red without needing extra per-page hacks.
  // Darker than a typical "pale tint" primary100/200 on purpose — paired
  // with the light neutral900 text color, selected/checked chips need to
  // stay dark for readable contrast in this dark theme.
  primary100: '#3D211F',
  primary200: '#522A27',
  primary500: '#D9534F',
  primary600: '#BC3433',
  primary700: '#8F2726',
  buttonPrimary500: '#BC3433',
  buttonPrimary600: '#8F2726',

  danger100: '#3D211F',
  danger200: '#522A27',
  danger500: '#D9534F',
  danger600: '#BC3433',
  danger700: '#8F2726',
  alternative100: '#3D211F',
  alternative200: '#522A27',
  alternative500: '#D9534F',
  alternative600: '#BC3433',
  alternative700: '#8F2726',

  // Neutral scale — true black background, red/orange stay distinct accents
  // rather than blended into the background itself.
  neutral0: '#0B0908',
  neutral100: '#151110',
  neutral150: '#1D1613',
  neutral200: '#332419',
  neutral300: '#4A3628',
  neutral400: '#6B5340',
  neutral500: '#8C7C6A',
  neutral600: '#A6875F',
  neutral700: '#C7B9A8',
  neutral800: '#D9B88A',
  neutral900: '#F5ECE1',
};

const config = {
  theme: {
    light: {
      colors: brandPrimary,
    },
    dark: {
      colors: brandPrimary,
    },
  },
  // Enables Strapi's own admin interface (menus, buttons, labels) in Arabic —
  // separate from content i18n. Admins can switch it from their profile menu.
  locales: ['ar'],

  // Branding — SAMDAN logo on the login screen and the main nav, and the
  // restaurant's icon as the browser tab favicon for the admin panel.
  auth: {
    logo: logoRed,
  },
  menu: {
    logo: logoOrange,
  },
  head: {
    favicon,
  },
  translations: {
    en: {
      'Auth.form.welcome.title': 'Welcome to SAMDAN',
      'app.components.LeftMenu.navbrand.title': 'SAMDAN',
      'app.components.LeftMenu.navbrand.workplace': 'Restaurant CMS',
    },
    ar: {
      'Auth.form.welcome.title': 'مرحباً بكم في سمدان',
      'app.components.LeftMenu.navbrand.title': 'سمدان',
      'app.components.LeftMenu.navbrand.workplace': 'لوحة تحكم المطعم',
    },
  },
  tutorials: false,
  notifications: {
    releases: false,
  },
};

// A single shared fetch patch backs two things: (1) capturing whatever
// Authorization header the admin app itself successfully sends on any
// request — reused by the CSV export below instead of us guessing at
// Strapi's localStorage token format/key, which turned out to be unreliable
// — and (2) the create-and-return-to-list behavior.
const TRACKED_UIDS = ['api::menu-item.menu-item', 'api::carousel-slide.carousel-slide'];

const getRequestAuthHeader = (input, init) => {
  try {
    const headers = init?.headers ?? (input instanceof Request ? input.headers : null);
    if (!headers) return null;
    if (typeof headers.get === 'function') {
      return headers.get('Authorization') || headers.get('authorization') || null;
    }
    return headers.Authorization || headers.authorization || null;
  } catch (e) {
    return null;
  }
};

const installSharedFetchPatch = () => {
  if (typeof window === 'undefined' || window.__samdanFetchPatched) return;
  window.__samdanFetchPatched = true;

  const originalFetch = window.fetch.bind(window);
  window.fetch = async (...args) => {
    const [input, init] = args;

    const authHeader = getRequestAuthHeader(input, init);
    if (authHeader) window.__samdanLastAuthHeader = authHeader;

    const response = await originalFetch(...args);
    try {
      const url = typeof input === 'string' ? input : input?.url || '';
      const method = (init?.method || input?.method || 'GET').toUpperCase();

      if (method === 'POST' && response.ok) {
        const match = url.match(/\/content-manager\/collection-types\/([^/?]+)(?:\?.*)?$/);
        const uid = match && decodeURIComponent(match[1]);
        if (uid && TRACKED_UIDS.includes(uid)) {
          window.setTimeout(() => {
            window.location.href = `/admin/content-manager/collection-types/${uid}`;
          }, 500);
        }
      }
    } catch (e) {
      // Never let this optional UX tweak break the actual save request.
    }
    return response;
  };
};

// When the media picker dialog opens, skip straight to the "Add new assets"
// (upload from your computer) step instead of landing on the library browse
// grid. Best-effort only: it looks for the exact button Strapi renders for
// this action, and does nothing if it can't find it (falls back to the
// normal picker, never blocks or breaks the field).
const ADD_ASSET_BUTTON_TEXT = 'Add new assets';

const jumpMediaPickerToUpload = () => {
  if (typeof window === 'undefined' || window.__samdanUploadJumpInstalled) return;
  window.__samdanUploadJumpInstalled = true;

  // Cooldown instead of a one-time flag: Strapi re-shows a button with this
  // exact text again after a successful upload (e.g. prompting to add more),
  // which previously caused an infinite auto-click loop that trapped the
  // user on the "add assets" step forever. A short cooldown lets the initial
  // jump-past-the-browse-grid convenience still work, without re-triggering
  // on every later re-render of the same button text.
  let lastClickTime = 0;
  const COOLDOWN_MS = 4000;

  const clickAddAssetButton = () => {
    if (Date.now() - lastClickTime < COOLDOWN_MS) return false;
    const buttons = document.querySelectorAll('button');
    for (const btn of buttons) {
      if (btn.textContent && btn.textContent.trim() === ADD_ASSET_BUTTON_TEXT) {
        btn.click();
        lastClickTime = Date.now();
        return true;
      }
    }
    return false;
  };

  const observer = new MutationObserver(() => {
    clickAddAssetButton();
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

// Adds a floating "Export CSV" button on the Inquiry table only. Reuses the
// exact same authenticated content-manager endpoint the table itself calls,
// with the Authorization header captured off a real request by the shared
// fetch patch above, rather than standing up a new backend route — so
// there's no separate auth surface to keep in sync.
const INQUIRY_EXPORT_BUTTON_ID = 'samdan-inquiry-export-btn';
const INQUIRY_LIST_PATH_SUFFIX = '/content-manager/collection-types/api::inquiry.inquiry';
const INQUIRY_EXPORT_COLUMNS = ['id', 'name', 'phone', 'guests', 'date', 'time', 'stage', 'notes', 'createdAt'];

const csvEscape = (value) => {
  const str = value === null || value === undefined ? '' : String(value);
  return /["\n,]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

const downloadInquiriesCsv = async () => {
  const btn = document.getElementById(INQUIRY_EXPORT_BUTTON_ID);
  const originalLabel = btn ? btn.textContent : '';
  if (btn) {
    btn.textContent = 'Exporting…';
    btn.disabled = true;
  }

  try {
    // Prefer the Authorization header actually captured off a real request
    // this same admin session already made successfully — reconstructing it
    // from localStorage's raw token turned out to 401, so don't rely on
    // guessing the exact format Strapi expects.
    let authHeader = window.__samdanLastAuthHeader || null;
    if (!authHeader) {
      try {
        const tokenRaw = window.localStorage.getItem('jwtToken');
        const token = tokenRaw ? JSON.parse(tokenRaw) : null;
        if (token) authHeader = `Bearer ${token}`;
      } catch (e) {
        authHeader = null;
      }
    }

    if (!authHeader) {
      throw new Error("Couldn't find your login session yet — click into any dish or slide first (so a request fires), then try Export again.");
    }

    const res = await fetch('/content-manager/collection-types/api::inquiry.inquiry?pageSize=1000&sort=createdAt:desc', {
      credentials: 'include',
      headers: { Authorization: authHeader }
    });

    if (!res.ok) {
      throw new Error(`Server responded ${res.status}. Make sure you're logged in and on the Inquiry page.`);
    }

    const json = await res.json();
    const rows = json.results || [];

    if (rows.length === 0) {
      window.alert('No inquiries to export yet.');
      return;
    }

    const lines = [
      INQUIRY_EXPORT_COLUMNS.join(','),
      ...rows.map((row) => INQUIRY_EXPORT_COLUMNS.map((col) => csvEscape(row[col])).join(','))
    ];
    // Leading BOM so Excel opens the UTF-8 file correctly (needed for Arabic names/notes).
    const blob = new Blob([`﻿${lines.join('\r\n')}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `samdan-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    window.alert(`Export failed: ${e && e.message ? e.message : 'unknown error'}`);
  } finally {
    if (btn) {
      btn.textContent = originalLabel || 'Export CSV (Excel)';
      btn.disabled = false;
    }
  }
};

const installInquiryExportButton = () => {
  if (typeof window === 'undefined' || window.__samdanExportButtonInstalled) return;
  window.__samdanExportButtonInstalled = true;

  const ensureButton = () => {
    const existing = document.getElementById(INQUIRY_EXPORT_BUTTON_ID);
    const path = window.location.pathname;
    const idx = path.indexOf(INQUIRY_LIST_PATH_SUFFIX);
    // On the list page the suffix is either the whole rest of the path, or
    // followed only by a trailing slash — not by a document id (edit view).
    const remainder = idx === -1 ? null : path.slice(idx + INQUIRY_LIST_PATH_SUFFIX.length);
    const onListPage = idx !== -1 && (remainder === '' || remainder === '/');

    if (!onListPage) {
      if (existing) existing.remove();
      return;
    }
    if (existing) return;

    const btn = document.createElement('button');
    btn.id = INQUIRY_EXPORT_BUTTON_ID;
    btn.type = 'button';
    btn.textContent = 'Export CSV (Excel)';
    btn.style.cssText = [
      'position:fixed', 'bottom:24px', 'right:24px', 'z-index:9999',
      'background:#BC3433', 'color:#fff', 'border:none', 'border-radius:8px',
      'padding:12px 22px', 'font-weight:600', 'font-family:inherit', 'font-size:14px',
      'cursor:pointer', 'box-shadow:0 8px 24px rgba(0,0,0,0.4)'
    ].join(';');
    btn.addEventListener('click', downloadInquiriesCsv);
    document.body.appendChild(btn);
  };

  new MutationObserver(ensureButton).observe(document.body, { childList: true, subtree: true });
  window.addEventListener('popstate', ensureButton);
  ensureButton();
};

// Red is the global default everywhere (forms, nav, buttons, login, "Create
// new entry" — all driven by the primary/buttonPrimary tokens above). No
// per-page color overrides needed.

// Strapi hardcodes the browser tab title as "Strapi Admin" (and "<Page> |
// Strapi" on every other page) inside its own compiled package — there's no
// config option for it. This rewrites any "Strapi" occurrence in the tab
// title to "Samdan" whenever it changes, covering both the initial title and
// every subsequent page navigation.
const rewriteTitle = () => {
  if (document.title.includes('Strapi')) {
    document.title = document.title.replace(/Strapi/g, 'Samdan');
  }
};

const installTitleRewrite = () => {
  if (typeof document === 'undefined' || window.__samdanTitleRewriteInstalled) return;
  window.__samdanTitleRewriteInstalled = true;
  rewriteTitle();
  const titleEl = document.querySelector('title');
  if (titleEl) {
    new MutationObserver(rewriteTitle).observe(titleEl, { childList: true, characterData: true, subtree: true });
  }
};

const bootstrap = () => {
  installSharedFetchPatch();
  installTitleRewrite();
  // Both disabled — wasn't working reliably (the media-picker jump kept
  // re-triggering and discarding real file selections; the CSV export had
  // auth issues). Code left in place in case it's worth revisiting later.
  // jumpMediaPickerToUpload();
  // installInquiryExportButton();
};

export default {
  config,
  bootstrap,
};
