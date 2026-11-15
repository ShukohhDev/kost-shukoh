import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { getTheme, setTheme, toggleTheme, THEME_STORAGE_KEY, bindThemeToggle, updateAllThemeToggles, getThemeToggleElements } from '../src/js/theme.js';

describe('Kost Shukoh - Theme Manager (Dark & Light Mode)', () => {
  // Mock mockStorage
  let storageMap = {};
  let mockElements = [];

  beforeEach(() => {
    storageMap = {};
    mockElements = [];

    globalThis.localStorage = {
      getItem: (key) => storageMap[key] || null,
      setItem: (key, val) => { storageMap[key] = String(val); },
      removeItem: (key) => { delete storageMap[key]; }
    };

    globalThis.document = {
      documentElement: {
        classList: {
          classes: new Set(),
          add(c) { this.classes.add(c); },
          remove(c) { this.classes.delete(c); },
          contains(c) { return this.classes.has(c); }
        }
      },
      querySelectorAll: (sel) => mockElements
    };

    globalThis.window = {
      dispatchEvent: () => true,
      matchMedia: () => ({ matches: false, addEventListener: () => {} })
    };
  });

  test('1. Default theme resolves to light when storage is empty', () => {
    const theme = getTheme();
    assert.equal(theme, 'light');
  });

  test('2. setTheme correctly updates classList and localStorage', () => {
    setTheme('dark');
    assert.equal(localStorage.getItem(THEME_STORAGE_KEY), 'dark');
    assert.ok(document.documentElement.classList.contains('dark'));

    setTheme('light');
    assert.equal(localStorage.getItem(THEME_STORAGE_KEY), 'light');
    assert.ok(!document.documentElement.classList.contains('dark'));
  });

  test('3. toggleTheme seamlessly flips between dark and light', () => {
    setTheme('light');
    const t1 = toggleTheme();
    assert.equal(t1, 'dark');
    assert.equal(getTheme(), 'dark');
    assert.ok(document.documentElement.classList.contains('dark'));

    const t2 = toggleTheme();
    assert.equal(t2, 'light');
    assert.equal(getTheme(), 'light');
    assert.ok(!document.documentElement.classList.contains('dark'));
  });

  test('4. bindThemeToggle and updateAllThemeToggles update innerHTML and attributes', () => {
    let clickHandler = null;
    const btn = {
      innerHTML: '',
      attributes: {},
      dataset: {},
      setAttribute(k, v) { this.attributes[k] = v; },
      getAttribute(k) { return this.attributes[k]; },
      addEventListener(evt, cb) {
        if (evt === 'click') clickHandler = cb;
      }
    };
    mockElements = [btn];

    setTheme('light');
    bindThemeToggle(btn);

    assert.equal(btn.getAttribute('data-theme-toggle'), 'true');
    assert.ok(btn.innerHTML.includes('svg'));
    assert.ok(btn.getAttribute('title').includes('Dark Mode'));

    // Toggle theme
    setTheme('dark');
    assert.ok(btn.innerHTML.includes('text-amber-500'));
    assert.ok(btn.getAttribute('title').includes('Light Mode'));

    // Trigger click
    clickHandler({ preventDefault: () => {} });
    assert.equal(getTheme(), 'light');
  });
});
