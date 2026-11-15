import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Kost Shukoh - Link & Asset Path Integrity Audit', () => {
  const rootDir = process.cwd();
  const htmlFiles = [
    'index.html',
    'public/booking.html',
    'public/booking-status.html',
    'public/login.html',
    'admin/index.html',
    'tenant/index.html'
  ];

  test('All primary HTML files exist on disk', () => {
    for (const file of htmlFiles) {
      const fullPath = path.join(rootDir, file);
      assert.ok(fs.existsSync(fullPath), `File ${file} does not exist!`);
    }
  });

  test('All script and stylesheet links in HTML files resolve to existing files', () => {
    for (const file of htmlFiles) {
      const fullPath = path.join(rootDir, file);
      const content = fs.readFileSync(fullPath, 'utf8');
      const dir = path.dirname(fullPath);

      // Check stylesheets
      const cssMatches = [...content.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/g)];
      for (const match of cssMatches) {
        let href = match[1].split('?')[0]; // remove query params
        if (!href.startsWith('http')) {
          const resolved = path.resolve(dir, href);
          assert.ok(fs.existsSync(resolved), `In ${file}: CSS path ${href} resolved to non-existent file ${resolved}`);
        }
      }

      // Check JS module imports in <script type="module">
      const importMatches = [...content.matchAll(/import\s+[^;]+from\s+['"]([^'"]+)['"]/g)];
      for (const match of importMatches) {
        const importPath = match[1];
        if (importPath.startsWith('.')) {
          const resolved = path.resolve(dir, importPath);
          assert.ok(fs.existsSync(resolved), `In ${file}: JS import ${importPath} resolved to non-existent file ${resolved}`);
        }
      }
    }
  });

  test('All internal navigation links point to valid targets', () => {
    for (const file of htmlFiles) {
      const fullPath = path.join(rootDir, file);
      const content = fs.readFileSync(fullPath, 'utf8');
      const dir = path.dirname(fullPath);

      const hrefMatches = [...content.matchAll(/<a[^>]+href=["']([^"']+)["']/g)];
      for (const match of hrefMatches) {
        const href = match[1];
        if (href.startsWith('#') || href.startsWith('http') || href.startsWith('https') || href.startsWith('data:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
          continue;
        }
        const cleanHref = href.split('?')[0].split('#')[0];
        if (!cleanHref) continue;

        const resolved = path.resolve(dir, cleanHref);
        assert.ok(fs.existsSync(resolved), `In ${file}: Broken link <a href="${href}"> pointing to non-existent ${resolved}`);
      }
    }
  });
});
