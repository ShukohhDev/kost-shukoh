/**
 * Kost Shukoh Management System (KMS)
 * Theme Manager (Dark & Light Mode)
 */

export const THEME_STORAGE_KEY = 'kms_theme';

/**
 * Get current active theme ('dark' | 'light')
 */
export function getTheme() {
  if (typeof window === 'undefined') return 'light';
  
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
  } catch (e) {
    // LocalStorage might be disabled or unavailable in test env
  }

  // Fallback to OS preference
  if (typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

/**
 * Apply theme to document and persist preference
 * @param {'dark' | 'light'} theme 
 */
export function setTheme(theme) {
  const selected = theme === 'dark' ? 'dark' : 'light';
  
  if (typeof document !== 'undefined') {
    if (selected === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, selected);
    }
  } catch (e) {
    // Ignore storage errors
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('kms-theme-changed', { detail: { theme: selected } }));
    updateAllThemeToggles(selected);
  }

  return selected;
}

/**
 * Toggle between 'dark' and 'light'
 */
export function toggleTheme() {
  const current = getTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  return setTheme(next);
}

/**
 * SVG Icons for Sun and Moon
 */
export const ICONS = {
  sun: `<svg class="w-5 h-5 text-amber-400 transition-transform duration-300 rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`,
  moon: `<svg class="w-5 h-5 text-slate-600 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>`
};

/**
 * Update visual icon and title of all theme toggle buttons
 */
export function updateAllThemeToggles(theme) {
  if (typeof document === 'undefined') return;
  const toggles = document.querySelectorAll('[data-theme-toggle]');
  toggles.forEach(btn => {
    btn.innerHTML = theme === 'dark' ? ICONS.sun : ICONS.moon;
    btn.setAttribute('title', theme === 'dark' ? 'Beralih ke Tema Terang' : 'Beralih ke Tema Gelap');
    btn.setAttribute('aria-label', theme === 'dark' ? 'Beralih ke Tema Terang' : 'Beralih ke Tema Gelap');
  });
}

/**
 * Bind click listener to a toggle element
 */
export function bindThemeToggle(element) {
  if (!element) return;
  element.setAttribute('data-theme-toggle', 'true');
  const current = getTheme();
  element.innerHTML = current === 'dark' ? ICONS.sun : ICONS.moon;
  element.setAttribute('title', current === 'dark' ? 'Beralih ke Tema Terang' : 'Beralih ke Tema Gelap');
  element.setAttribute('aria-label', current === 'dark' ? 'Beralih ke Tema Terang' : 'Beralih ke Tema Gelap');

  element.addEventListener('click', (e) => {
    e.preventDefault();
    toggleTheme();
  });
}

/**
 * Initialize theme and auto-bind all [data-theme-toggle] buttons on page
 */
export function initTheme() {
  const current = getTheme();
  setTheme(current);

  if (typeof document !== 'undefined') {
    const buttons = document.querySelectorAll('[data-theme-toggle]');
    buttons.forEach(btn => bindThemeToggle(btn));
  }

  // Listen to OS theme changes if user hasn't explicitly set preference
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        const saved = localStorage.getItem(THEME_STORAGE_KEY);
        if (!saved) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      });
    } catch (e) {
      // matchMedia listener fallback
    }
  }

  return current;
}
