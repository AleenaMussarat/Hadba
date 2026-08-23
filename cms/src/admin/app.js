import logoOrange from './assets/logo-orange.png';
import logoRed from './assets/logo-red.png';
// Same icon used as the live website's favicon (index.html), so both match.
import favicon from './assets/favicon.png';

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
  locales: ['en', 'ar'],

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

// Strapi's table date cells (Created At, Updated At) are hardcoded to render
// with Intl's "full" date style (e.g. "Wednesday, August 5, 2026") — there's
// no config to change the format per-field. Date-only fields (like the
// Inquiry "date" field) render the same way but without the weekday prefix
// (e.g. "August 5, 2026"). Both outputs are distinctive enough to safely
// pattern-match and rewrite to DD/MM/YYYY wherever they show up in the admin.
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DATE_CORE_SRC = '(January|February|March|April|May|June|July|August|September|October|November|December) (\\d{1,2}), (\\d{4})';
const FULL_DATE_RE = new RegExp(`(?:Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday), ${DATE_CORE_SRC}`, 'g');
const SHORT_DATE_RE = new RegExp(DATE_CORE_SRC, 'g');

const toDdmmyyyy = (_match, month, day, year) => {
  const mm = String(MONTHS.indexOf(month) + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${dd}/${mm}/${year}`;
};

const rewriteDateText = (text) => text.replace(FULL_DATE_RE, toDdmmyyyy).replace(SHORT_DATE_RE, toDdmmyyyy);

const hasDateMatch = (text) => {
  const full = FULL_DATE_RE.test(text);
  FULL_DATE_RE.lastIndex = 0;
  const short = SHORT_DATE_RE.test(text);
  SHORT_DATE_RE.lastIndex = 0;
  return full || short;
};

const rewriteDateNodesIn = (root) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let node = walker.nextNode();
  while (node) {
    if (node.nodeValue && hasDateMatch(node.nodeValue)) nodes.push(node);
    node = walker.nextNode();
  }
  nodes.forEach((n) => {
    n.nodeValue = rewriteDateText(n.nodeValue);
  });
};

const installDateFormatRewrite = () => {
  if (typeof document === 'undefined' || window.__samdanDateRewriteInstalled) return;
  window.__samdanDateRewriteInstalled = true;
  rewriteDateNodesIn(document.body);
  new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      m.addedNodes.forEach((n) => {
        if (n.nodeType === Node.TEXT_NODE) {
          if (hasDateMatch(n.nodeValue || '')) n.nodeValue = rewriteDateText(n.nodeValue);
        } else if (n.nodeType === Node.ELEMENT_NODE) {
          rewriteDateNodesIn(n);
        }
      });
    });
  }).observe(document.body, { childList: true, subtree: true });
};

// Every bilingual string we author in our schemas (content-type display
// names, field labels, descriptions) follows the same "<non-Arabic side> /
// <Arabic side>" convention — e.g. "Name (EN) / الاسم (EN)" or
// "Branch / الفرع". Strapi's own core UI switches language automatically
// with the admin's chosen interface language, but has no equivalent for
// labels that live in *our* schemas — those are always plain static text.
// This fills that gap by rewriting any such text node down to just the
// currently active side, keyed off the <html lang>/dir Strapi itself sets
// when an admin changes their interface language (no page reload needed).
// Only text where exactly one side actually contains Arabic characters is
// touched, so incidental "/" text elsewhere (URLs, "and/or", etc.) is left
// alone.
const ARABIC_CHAR_RE = /[؀-ۿ]/;
const BILINGUAL_TEXT_RE = /^\s*(.+?)\s*\/\s*(.+?)\s*$/;

const isArabicInterfaceActive = () => {
  const lang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
  const dir = (
    document.documentElement.getAttribute('dir') ||
    document.body.getAttribute('dir') ||
    ''
  ).toLowerCase();
  return lang.startsWith('ar') || dir === 'rtl';
};

// Strapi is supposed to flip the whole admin (including the pre-login screen
// and every page after it — sidebar on the right, content on the left) to
// RTL the moment Arabic is selected, by setting <html lang>/dir together.
// In practice it doesn't always keep both attributes in sync — lang updates
// but dir is left stale on some screens (notably the login page). This
// forces dir to always match whatever lang is currently set, closing that
// gap everywhere at once instead of chasing it page by page.
const enforceDirectionFromLang = () => {
  const lang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
  if (!lang) return;
  const expectedDir = lang.startsWith('ar') ? 'rtl' : 'ltr';
  if (document.documentElement.getAttribute('dir') !== expectedDir) {
    document.documentElement.setAttribute('dir', expectedDir);
  }
  if (document.body && document.body.getAttribute('dir') !== expectedDir) {
    document.body.setAttribute('dir', expectedDir);
  }
};

// The pre-login screen's own language switcher only affects that one page
// — it's discarded the moment you authenticate, when Strapi loads the
// account's saved "Interface language" from its Profile settings instead.
// That mismatch is confusing (pick English at login, land on an Arabic
// dashboard), so this hides the pre-login switcher entirely, leaving the
// Profile setting as the one and only place language is chosen. Best-effort
// text match since there's no stable class name to target from outside the
// live app — safe either way: if the text doesn't match, nothing happens.
const LOGIN_LANGUAGE_PICKER_HINTS = ['not the right language', 'ليست اللغة الصحيحة'];

const isOnLoginRoute = () => /\/admin\/auth\/(login|register)/.test(window.location.pathname);

const hideLoginLanguagePicker = () => {
  if (!isOnLoginRoute()) return;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const text = (node.nodeValue || '').trim().toLowerCase();
    if (text && LOGIN_LANGUAGE_PICKER_HINTS.some((hint) => text.includes(hint))) {
      let el = node.parentElement;
      for (let i = 0; i < 5 && el; i++) {
        if (el.tagName === 'BUTTON' || el.tagName === 'A' || el.getAttribute('role') === 'button') {
          el.style.display = 'none';
          break;
        }
        el = el.parentElement;
      }
    }
    node = walker.nextNode();
  }
};

const installLoginLanguagePickerHide = () => {
  if (typeof document === 'undefined' || window.__samdanLoginPickerHideInstalled) return;
  window.__samdanLoginPickerHideInstalled = true;
  hideLoginLanguagePicker();
  new MutationObserver(hideLoginLanguagePicker).observe(document.body, { childList: true, subtree: true });
};

const installDirectionEnforcement = () => {
  if (typeof document === 'undefined' || window.__samdanDirectionEnforceInstalled) return;
  window.__samdanDirectionEnforceInstalled = true;
  enforceDirectionFromLang();
  new MutationObserver(enforceDirectionFromLang).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang']
  });
};

// Strapi (via react-intl's Intl.NumberFormat/DateTimeFormat) renders digits
// as Eastern Arabic-Indic numerals (٠١٢٣...) in some widgets once the
// interface locale is Arabic — the dashboard's "Project statistics" counts
// are the clearest example. Numbers should always stay in plain Latin
// digits regardless of interface language, so this normalizes any Eastern
// Arabic-Indic digit found anywhere in the admin back to its Latin
// equivalent — unconditionally, not just while Arabic is active, since
// Latin digits are always correct.
const EASTERN_ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const EASTERN_DIGIT_RE = /[٠-٩]/g;

const normalizeDigitsIn = (root) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let node = walker.nextNode();
  while (node) {
    if (node.nodeValue && EASTERN_DIGIT_RE.test(node.nodeValue)) nodes.push(node);
    EASTERN_DIGIT_RE.lastIndex = 0;
    node = walker.nextNode();
  }
  nodes.forEach((n) => {
    n.nodeValue = n.nodeValue.replace(EASTERN_DIGIT_RE, (d) => String(EASTERN_ARABIC_DIGITS.indexOf(d)));
  });
};

const installDigitNormalizer = () => {
  if (typeof document === 'undefined' || window.__samdanDigitNormalizerInstalled) return;
  window.__samdanDigitNormalizerInstalled = true;
  normalizeDigitsIn(document.body);
  new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      m.addedNodes.forEach((n) => {
        if (n.nodeType === Node.TEXT_NODE) {
          if (EASTERN_DIGIT_RE.test(n.nodeValue || '')) {
            n.nodeValue = n.nodeValue.replace(EASTERN_DIGIT_RE, (d) => String(EASTERN_ARABIC_DIGITS.indexOf(d)));
          }
          EASTERN_DIGIT_RE.lastIndex = 0;
        } else if (n.nodeType === Node.ELEMENT_NODE) {
          normalizeDigitsIn(n);
        }
      });
    });
  }).observe(document.body, { childList: true, subtree: true });
};

const pickActiveBilingualText = (text) => {
  const match = text.match(BILINGUAL_TEXT_RE);
  if (!match) return null;
  const [, first, second] = match;
  const firstIsArabic = ARABIC_CHAR_RE.test(first);
  const secondIsArabic = ARABIC_CHAR_RE.test(second);
  if (firstIsArabic === secondIsArabic) return null;

  const arabicSide = firstIsArabic ? first : second;
  const nonArabicSide = firstIsArabic ? second : first;
  return isArabicInterfaceActive() ? arabicSide : nonArabicSide;
};

const rewriteBilingualNodesIn = (root) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let node = walker.nextNode();
  while (node) {
    if (node.nodeValue && node.nodeValue.includes('/')) nodes.push(node);
    node = walker.nextNode();
  }
  nodes.forEach((n) => {
    const picked = pickActiveBilingualText(n.nodeValue);
    if (picked && picked !== n.nodeValue) n.nodeValue = picked;
  });
};

const installBilingualLabelRewrite = () => {
  if (typeof document === 'undefined' || window.__samdanBilingualRewriteInstalled) return;
  window.__samdanBilingualRewriteInstalled = true;

  const rerun = () => rewriteBilingualNodesIn(document.body);
  rerun();

  // Re-scan on every DOM change (Strapi is a SPA — content re-renders
  // without a full reload as you navigate) and whenever the interface
  // language itself flips (Strapi swaps <html lang>/dir in place).
  new MutationObserver(rerun).observe(document.body, { childList: true, subtree: true, characterData: true });
  new MutationObserver(rerun).observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] });
};

// Strapi's own bundled Arabic translations don't cover every core string —
// notably the left-nav plugin names (Home, Content Manager, Media Library,
// Content-Type Builder) and the dashboard homepage widgets are missing from
// the shipped ar.json even though Settings/Marketplace are covered. Strapi
// gives no way to patch individual gaps in its own translation pack, so this
// does the same job as the bilingual rewriter above but with a maintained
// dictionary of exact English phrases → Arabic, only ever applied while the
// interface is set to Arabic (English stays untouched either way). If more
// untranslated strings turn up, add them here — same pattern, one more entry.
const FIXED_PHRASE_TRANSLATIONS_AR = {
  'Home': 'الرئيسية',
  'Content Manager': 'إدارة المحتوى',
  'Media Library': 'مكتبة الوسائط',
  'Content-Type Builder': 'منشئ أنواع المحتوى',
  'Add Widget': 'إضافة عنصر',
  'Welcome to your administration panel': 'مرحباً بك في لوحة التحكم الخاصة بك',
  'Last edited entries': 'آخر العناصر التي تم تعديلها',
  'Last published entries': 'آخر العناصر التي تم نشرها',
  'Quick Actions': 'إجراءات سريعة',
  'No content found': 'لا يوجد محتوى',
  "You don't have any content yet": 'لا يوجد محتوى بعد',
  'Create new entry': 'إنشاء عنصر جديد',
  'See more': 'عرض المزيد',

  // Dashboard "Project statistics" widget.
  'Project statistics': 'إحصائيات المشروع',
  'Delete': 'حذف',
  'Entries': 'الإدخالات',
  'Assets': 'الأصول',
  'Content-Types': 'أنواع المحتوى',
  'Components': 'المكونات',
  'Locales': 'اللغات',
  'Admins': 'المسؤولون',
  'Webhooks': 'الويب هوك',
  'API Tokens': 'رموز API',

  // Generic single-language field/column labels — content types with only
  // one language per field (like Inquiry) show these as-is rather than the
  // "English (EN) / Arabic (EN)" pattern the bilingual rewriter handles.
  'Name': 'الاسم',
  'Phone': 'الهاتف',
  'Guests': 'الضيوف',
  'Date': 'التاريخ',
  'Time': 'الوقت',
  'Notes': 'الملاحظات',
  'Stage': 'الحالة',
  'Price': 'السعر',
  'Calories': 'السعرات الحرارية',
  'Featured': 'مميز',
  'Order': 'الترتيب',
  'Image': 'الصورة',
  'Created At': 'تاريخ الإنشاء',
  'Updated At': 'تاريخ التحديث',
  'Published At': 'تاريخ النشر',

  // Entry edit-view header (preview link, status labels, document id panel).
  'Set up preview': 'إعداد المعاينة',
  'Set up the preview': 'إعداد المعاينة',
  'Delete entry': 'حذف العنصر',
  'Updated': 'تم التحديث',
  'Created': 'تم الإنشاء',
  'Document ID': 'معرف المستند',
  'Copy Document ID': 'نسخ معرف المستند',

  // Avatar dropdown menu + profile page.
  'Profile': 'الملف الشخصي',
  'Profile settings': 'إعدادات الملف الشخصي',
  'Active devices': 'الأجهزة النشطة',

  // "Displayed fields" column picker — labels here come from Strapi's own
  // auto-generated field names, not our schema's displayName, so they use a
  // different casing ("Hours (Ar)") than the bilingual rewriter's pattern
  // ("Hours (AR) / الساعات (AR)") and need their own exact-match entries.
  'Displayed fields': 'الحقول المعروضة',
  'Created By': 'أنشأ بواسطة',
  'Updated By': 'تم التحديث بواسطة',
  'documentId': 'معرف المستند',
  'ID': 'المعرف',
  'Maps Link': 'رابط الخرائط',
  'Hours (Ar)': 'الساعات (AR)',
  'Hours (En)': 'الساعات (EN)',
  'Location (Ar)': 'الموقع (AR)',
  'Location (En)': 'الموقع (EN)',
  'Name (Ar)': 'الاسم (AR)',
  'Name (En)': 'الاسم (EN)',

  // Carousel slide fields.
  'Badge (Ar)': 'الشارة (AR)',
  'Badge (En)': 'الشارة (EN)',
  'isActive': 'نشط',
  'Subtitle (Ar)': 'العنوان الفرعي (AR)',
  'Subtitle (En)': 'العنوان الفرعي (EN)',
  'Title (Ar)': 'العنوان (AR)',
  'Title (En)': 'العنوان (EN)',

  // Gallery image fields.
  'Caption (Ar)': 'التعليق (AR)',
  'Caption (En)': 'التعليق (EN)',

  // Menu Category's "Displayed fields" picker renders raw camelCase field
  // keys instead of formatted labels (unlike other content types), so these
  // need exact lowercase/no-space matches distinct from the Title Case ones
  // above (e.g. "name(Ar)" here vs "Name (Ar)" elsewhere).
  'createdAt': 'تاريخ الإنشاء',
  'createdBy': 'أنشأ بواسطة',
  'displayLabel': 'التسمية المعروضة',
  'id': 'المعرف',
  'menuItems': 'عناصر القائمة',
  'name(Ar)': 'الاسم (AR)',
  'name(En)': 'الاسم (EN)',
  'order': 'الترتيب',
  'updatedAt': 'تاريخ التحديث',
  'updatedBy': 'تم التحديث بواسطة',

  // Menu Item fields (legacy category enum + relation + description).
  'categoryAr': 'الفئة (AR)',
  'categoryEn': 'الفئة (EN)',
  'Description (Ar)': 'الوصف (AR)',
  'Description (En)': 'الوصف (EN)',
  'menuCategory': 'فئة القائمة',

  'Accepting Reservations': 'قبول الحجوزات',
  'Accepting Reservations*': 'قبول الحجوزات *',

  // Page Hero fields.
  'backgroundImage': 'صورة الخلفية',
  'Page Name': 'اسم الصفحة',
  'subtitleAr': 'العنوان الفرعي (AR)',
  'subtitleEn': 'العنوان الفرعي (EN)',

  // Admin Users list.
  'Email': 'البريد الإلكتروني',
  'First Name': 'الاسم الأول',
  'Last Name': 'اسم العائلة',
  'Role': 'الدور',
  'Temporary Password': 'كلمة مرور مؤقتة',

  // Reservation Settings singleType.

  // Site Settings singleType (Contact information group).

  'Tagline (En)': 'الشعار (EN)',
  'Tagline (Ar)': 'الشعار (AR)',

  'Address (En)': 'العنوان (EN)',
  'Address (Ar)': 'العنوان (AR)',
  'Instagram URL': 'رابط إنستغرام',
  'X URL': 'رابط X',
  'Snapchat URL': 'رابط سناب شات',
  'Tiktok URL': 'رابط تيك توك',
  'Facebook URL': 'رابط فيسبوك',
  'Whatsapp URL': 'رابط واتساب',

  // Entry edit-view side panel headings.
  'Entry': 'الإدخال',
  'Preview': 'المعاينة',

  // Settings sidebar — entries Strapi's own bundle leaves in English.
  'Content History': 'سجل المحتوى',
  'Releases': 'الإصدارات',
  'Internationalization': 'التدويل',
  'Review Workflows': 'سير العمل للمراجعة',
  'Admin Tokens': 'رموز المسؤول',
  'Email plugin': 'إضافة البريد الإلكتروني',
  'Configuration': 'الإعدادات',
  'Users & Permissions plugin': 'إضافة المستخدمين والصلاحيات',

  // List row "..." context menu.
  'Edit': 'تعديل',
  'Open in new tab': 'فتح في علامة تبويب جديدة',
  'Duplicate': 'تكرار',

  // Search input placeholder (handled separately below since placeholder
  // text lives in an attribute, not a text node the rewriter can walk).
  'Search': 'بحث',

  // Relation/media field headers on individual record edit forms — Strapi
  // auto-generates these from the field name in Title Case, a different
  // string than the lowercase "menuCategory"/"backgroundImage" keys used
  // for the "Displayed fields" picker above.
  'Background Image': 'صورة الخلفية',

  // Site Settings singleType — new social platforms. Strapi auto-titlecases
  // the field key ("youtubeUrl") by just capitalizing the first letter of
  // each word — it doesn't know "YouTube" has an internal capital, so the
  // rendered label is actually "Youtube URL", not "YouTube URL".
  'Telegram URL': 'رابط تيليجرام',
  'YouTube URL': 'رابط يوتيوب',
  'Youtube URL': 'رابط يوتيوب',
};

// "Hello Admin" / "Hello Jane" etc. — the greeting is a fixed template with
// the logged-in admin's own name spliced in, so it can't be matched as one
// exact phrase the way the dictionary above works.
const HELLO_GREETING_RE = /^Hello\s+(.+)$/;

// "1 entry found" / "5 entries found" — same idea, a template with the
// live count spliced in. Arabic count agreement is simplified here (2 gets
// its own dual form, everything else just uses the plural noun) rather than
// full classical grammar, which is the normal, accepted approach for UI
// strings — the number itself is left untouched, per "numbers stay English".
const ENTRIES_FOUND_RE = /^(\d+)\s+entr(?:y|ies)\s+found$/i;

// "Menu Category (1)" — the relation field's card header on the Menu Item
// edit form, with the live selected-count spliced in the same way.
const MENU_CATEGORY_HEADER_RE = /^Menu Category(?:\s+\((\d+)\))?$/;

const arabicEntriesFound = (count) => {
  const n = Number(count);
  if (n === 0) return 'لم يتم العثور على أي إدخالات';
  if (n === 1) return `تم العثور على ${count} إدخال`;
  if (n === 2) return `تم العثور على ${count} إدخالين`;
  return `تم العثور على ${count} إدخالات`;
};

const pickFixedPhraseTranslation = (text) => {
  if (!isArabicInterfaceActive()) return null;

  const trimmed = text.trim();
  if (FIXED_PHRASE_TRANSLATIONS_AR[trimmed]) return FIXED_PHRASE_TRANSLATIONS_AR[trimmed];

  const helloMatch = trimmed.match(HELLO_GREETING_RE);
  if (helloMatch) return `مرحباً ${helloMatch[1]}`;

  const entriesMatch = trimmed.match(ENTRIES_FOUND_RE);
  if (entriesMatch) return arabicEntriesFound(entriesMatch[1]);

  const menuCategoryMatch = trimmed.match(MENU_CATEGORY_HEADER_RE);
  if (menuCategoryMatch) return menuCategoryMatch[1] ? `فئة القائمة (${menuCategoryMatch[1]})` : 'فئة القائمة';

  return null;
};

const rewriteFixedPhraseNodesIn = (root) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let node = walker.nextNode();
  while (node) {
    if (node.nodeValue && node.nodeValue.trim()) nodes.push(node);
    node = walker.nextNode();
  }
  nodes.forEach((n) => {
    const picked = pickFixedPhraseTranslation(n.nodeValue);
    if (picked && picked !== n.nodeValue) n.nodeValue = picked;
  });
};

// Placeholder text (e.g. the sidebar Search box) lives in an attribute, not
// a text node, so the dictionary rewriter above can't reach it — this walks
// every input/textarea separately and translates its placeholder the same
// way, reusing the same dictionary.
const rewritePlaceholdersIn = (root) => {
  const fields = root.querySelectorAll ? root.querySelectorAll('input[placeholder], textarea[placeholder]') : [];
  fields.forEach((field) => {
    const picked = pickFixedPhraseTranslation(field.placeholder);
    if (picked && picked !== field.placeholder) field.placeholder = picked;
  });
};

const installFixedPhraseRewrite = () => {
  if (typeof document === 'undefined' || window.__samdanFixedPhraseRewriteInstalled) return;
  window.__samdanFixedPhraseRewriteInstalled = true;

  const rerun = () => {
    rewriteFixedPhraseNodesIn(document.body);
    rewritePlaceholdersIn(document.body);
  };
  rerun();

  new MutationObserver(rerun).observe(document.body, { childList: true, subtree: true, characterData: true });
  new MutationObserver(rerun).observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] });
};

// The overall page layout flips correctly for RTL (sidebar to the right,
// table column order mirrors — both come from the browser's native bidi
// handling of <html dir="rtl">), but Strapi's own Table component doesn't
// adapt text-align inside header/data cells to match — they stay left-
// aligned, so header and body text end up visually offset from each other
// within the same column once Arabic is active (see the Branch list view).
// This injects one small stylesheet forcing right-alignment for every table
// cell while RTL is active. Plain tag selectors (table/th/td), not Strapi's
// internal hashed class names, so it isn't tied to a specific Strapi build
// and covers every list view at once.
const installRtlTableAlignmentFix = () => {
  if (typeof document === 'undefined' || window.__samdanRtlTableFixInstalled) return;
  window.__samdanRtlTableFixInstalled = true;

  const style = document.createElement('style');
  style.textContent = `
    html[dir="rtl"] table th,
    html[dir="rtl"] table td {
      text-align: right;
    }
    html[dir="rtl"] label {
      display: block;
      width: 100%;
      text-align: right;
    }
    html[dir="rtl"] nav a,
    html[dir="rtl"] aside a {
      display: block;
      width: 100%;
      text-align: right;
    }
  `;
  document.head.appendChild(style);
};

// Strapi's Date/Time picker inputs show their digits inside the page's RTL
// context, which lets the browser's bidi algorithm insert invisible RTL
// marks around the "/" separators and reorder the whole value — turning
// "22/08/2026" into "22‏/08‏/2026" (with a right-to-left mark before each
// slash). dir="ltr" fixes the internal digit order; text-align is set to
// right (not left) so the field still sits flush with the right edge of
// its row, matching the rest of the RTL form — dir and text-align are
// independent, so an LTR-ordered value can still be right-aligned overall.
const DATE_VALUE_RE = /^\d{1,4}[/-]\d{1,2}[/-]\d{1,4}$/;
const TIME_VALUE_RE = /^\d{1,2}:\d{2}(\s?[AP]M)?$/i;

const fixDateTimeInputDirection = (root) => {
  const inputs = root.querySelectorAll ? root.querySelectorAll('input') : [];
  inputs.forEach((input) => {
    const value = (input.value || '').trim();
    if (DATE_VALUE_RE.test(value) || TIME_VALUE_RE.test(value)) {
      if (input.dir !== 'ltr') input.dir = 'ltr';
      if (input.style.textAlign !== 'right') input.style.textAlign = 'right';
    }
  });
};

const installLtrDateTimeFix = () => {
  if (typeof document === 'undefined' || window.__samdanLtrDateTimeFixInstalled) return;
  window.__samdanLtrDateTimeFixInstalled = true;
  fixDateTimeInputDirection(document.body);
  new MutationObserver(() => fixDateTimeInputDirection(document.body)).observe(document.body, {
    childList: true,
    subtree: true
  });
};

// The sidebar's "Collection Types" / "Single Types" section headers show
// their entry-count badge (8, 2) as a sibling of the heading text inside a
// shared row wrapper. The first attempt at this walked up to the nearest
// ancestor with display:flex and reversed ITS flex-direction — too broad a
// target: on this page that ancestor turned out to be a much larger layout
// container (not the small heading+badge row), so reversing it scrambled
// that container's own children instead (the heading and count stacking
// instead of sitting side by side). This version only ever touches the
// heading's own direct parent-of-parent — the tight row that actually
// holds just the heading and the badge — and drives left/right purely via
// that row's `direction` (rtl puts the DOM-first child, the heading, on
// the right and the DOM-second child, the badge, on the left; ltr does the
// reverse), never by reordering children.
const SECTION_HEADINGS_AR = ['أنواع المجموعات', 'أنواع مفردة'];
const SECTION_HEADINGS_EN = ['Collection Types', 'Single Types'];

const findFlexAncestor = (el) => {
  let node = el;
  while (node && node !== document.body) {
    const display = window.getComputedStyle(node).display;
    if (display === 'flex' || display === 'inline-flex') return node;
    node = node.parentElement;
  }
  return null;
};

const fixSidebarSectionHeaderLayout = (root) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const text = (node.nodeValue || '').trim();
    const isArabicHeading = SECTION_HEADINGS_AR.includes(text);
    const isEnglishHeading = SECTION_HEADINGS_EN.includes(text);
    if (isArabicHeading || isEnglishHeading) {
      const headingEl = node.parentElement;
      const row = headingEl && headingEl.parentElement;
      if (row) {
        row.style.display = 'flex';
        row.style.flexDirection = 'row';
        row.style.justifyContent = 'space-between';
        row.style.alignItems = 'center';
        row.style.width = '100%';
        row.style.direction = isArabicHeading ? 'rtl' : 'ltr';
      }
    }
    node = walker.nextNode();
  }
};

const installSidebarSectionHeaderFix = () => {
  if (typeof document === 'undefined' || window.__samdanSidebarHeaderFixInstalled) return;
  window.__samdanSidebarHeaderFixInstalled = true;
  fixSidebarSectionHeaderLayout(document.body);
  new MutationObserver(() => fixSidebarSectionHeaderLayout(document.body)).observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
};

// The "← Back" link's arrow icon (an SVG, not a font glyph) doesn't flip
// direction on its own under RTL — in Arabic it should point right instead
// of left, matching the flipped reading direction. This finds the "Back"
// text node (Strapi's own bundle already translates it to "الى الوراء"),
// walks up to the nearest wrapper that actually contains an <svg>, and
// mirrors that icon horizontally.
const BACK_LINK_TEXT_AR = ['الى الوراء', 'إلى الوراء'];

const flipBackArrowIcon = (root) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const text = (node.nodeValue || '').trim();
    if (BACK_LINK_TEXT_AR.includes(text)) {
      let container = node.parentElement;
      for (let i = 0; i < 4 && container; i++) {
        const svg = container.querySelector ? container.querySelector('svg') : null;
        if (svg) {
          svg.style.transform = 'scaleX(-1)';
          break;
        }
        container = container.parentElement;
      }
    }
    node = walker.nextNode();
  }
};

const installBackArrowFlip = () => {
  if (typeof document === 'undefined' || window.__samdanBackArrowFlipInstalled) return;
  window.__samdanBackArrowFlipInstalled = true;
  flipBackArrowIcon(document.body);
  new MutationObserver(() => flipBackArrowIcon(document.body)).observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
};

// A handful of specific Arabic labels/headings don't get properly right-
// aligned by the generic `label` CSS rule above — either because Strapi
// renders them through a non-<label> element for this particular field
// type (the Accepting Reservations toggle), or because they're simple
// headings rather than form field labels (the "Entry"/"Preview" panel
// titles on every edit view). This matches them directly by their known
// Arabic text and right-aligns whichever element actually wraps them.
const RIGHT_ALIGN_TEXT_AR = ['قبول الحجوزات', 'الإدخال', 'المعاينة'];

const fixKnownLabelAlignment = (root) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const text = (node.nodeValue || '').trim();
    if (RIGHT_ALIGN_TEXT_AR.includes(text)) {
      const el = node.parentElement;
      if (el) {
        // display:block alone isn't enough — a block element still shrinks
        // to fit its own text unless it's also given width:100%, so
        // text-align has nothing to align within otherwise (this was the
        // bug: the element became block but stayed content-width).
        el.style.display = 'block';
        el.style.width = '100%';
        el.style.textAlign = 'right';
      }
    }
    node = walker.nextNode();
  }
};

// Strapi's boolean fields that render as two separate "False"/"True"
// buttons (rather than a switch) — like Accepting Reservations — keep that
// pair left-aligned as a group under RTL. This finds the pair by their
// (already Arabic-translated) text and pushes the whole group to the right
// edge of its row instead, re-evaluated each pass so switching back to
// English restores the normal left alignment.
const BOOLEAN_TOGGLE_TEXT_AR = ['خطأ', 'حقيقي'];
const BOOLEAN_TOGGLE_TEXT_EN = ['False', 'True'];

const fixBooleanToggleAlignment = (root) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const text = (node.nodeValue || '').trim();
    const isArabicToggle = BOOLEAN_TOGGLE_TEXT_AR.includes(text);
    const isEnglishToggle = BOOLEAN_TOGGLE_TEXT_EN.includes(text);
    if (isArabicToggle || isEnglishToggle) {
      const flexAncestor = findFlexAncestor(node.parentElement);
      if (flexAncestor) flexAncestor.style.justifyContent = isArabicToggle ? 'flex-end' : '';
    }
    node = walker.nextNode();
  }
};

// Text/textarea fields that already hold Arabic content should read right-
// to-left within their own box, matching the language actually typed in —
// independent of whether a given field is "meant" to be Arabic (nameAr vs
// nameEn, etc.), since that isn't reliably detectable from the DOM alone.
// Fields with Latin/English content (or still empty) are left untouched.
const fixArabicContentInputDirection = (root) => {
  const fields = root.querySelectorAll ? root.querySelectorAll('input[type="text"], textarea') : [];
  fields.forEach((field) => {
    const value = field.value || '';
    if (ARABIC_CHAR_RE.test(value)) {
      if (field.dir !== 'rtl') field.dir = 'rtl';
      if (field.style.textAlign !== 'right') field.style.textAlign = 'right';
    }
  });
};

// The "Set up preview" button in the edit view's side panel is likely an
// <a> styled as a button sitting inside an <aside>-tagged panel, so the
// broad `aside a { text-align: right }` rule above (meant for real sidebar
// nav links) caught it too — a button's own label should stay centered,
// not pushed to one edge. This forces it back to center regardless of what
// caught it, taking priority since inline styles beat the stylesheet rule.
const CENTER_ALIGN_TEXT = ['إعداد المعاينة', 'Set up preview', 'Set up the preview'];

const fixPreviewButtonAlignment = (root) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const text = (node.nodeValue || '').trim();
    if (CENTER_ALIGN_TEXT.includes(text)) {
      const el = node.parentElement;
      if (el) el.style.textAlign = 'center';
    }
    node = walker.nextNode();
  }
};

const installRecordFormAlignmentFixes = () => {
  if (typeof document === 'undefined' || window.__samdanRecordFormAlignFixInstalled) return;
  window.__samdanRecordFormAlignFixInstalled = true;

  const rerun = () => {
    fixKnownLabelAlignment(document.body);
    fixBooleanToggleAlignment(document.body);
    fixArabicContentInputDirection(document.body);
    fixPreviewButtonAlignment(document.body);
  };
  rerun();

  new MutationObserver(rerun).observe(document.body, { childList: true, subtree: true, characterData: true });
  new MutationObserver(rerun).observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] });
};

const bootstrap = () => {
  installSharedFetchPatch();
  installTitleRewrite();
  installDateFormatRewrite();
  installLoginLanguagePickerHide();
  installDirectionEnforcement();
  installRtlTableAlignmentFix();
  installLtrDateTimeFix();
  installDigitNormalizer();
  installBilingualLabelRewrite();
  installFixedPhraseRewrite();
  installSidebarSectionHeaderFix();
  installBackArrowFlip();
  installRecordFormAlignmentFixes();
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