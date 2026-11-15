import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { getTheme, setTheme, toggleTheme, THEME_STORAGE_KEY } from '../src/js/theme.js';

describe('Kost Shukoh - Theme Manager (Dark & Light Mode)', () => {
  // Mock mockStorage
  let storageMap = {};

  beforeEach(() => {
    storageMap = {};
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
      querySelectorAll: () => []
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
});
