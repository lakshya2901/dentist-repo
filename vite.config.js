import { defineConfig } from 'vite';

/**
 * Builds the page HTML from src/config.js + src/render.js, so the output is
 * static, crawlable HTML (good for SEO) and all text lives in config.js.
 */
function clinicHtml() {
  return {
    name: 'clinic-html',
    async transformIndexHtml(html, ctx) {
      // In dev use Vite's module loader so config edits are picked up; in build use plain import.
      const mod = ctx.server
        ? await ctx.server.ssrLoadModule('/src/render.js')
        : await import('./src/render.js');
      const { head, body, specialty } = mod.renderPage();
      return html
        .replace('<html lang="en">', `<html lang="en" data-specialty="${specialty}">`)
        .replace('<!--HEAD-->', head)
        .replace('<!--APP-->', body);
    },
    configureServer(server) {
      // Reload the browser when content/templates change.
      server.watcher.on('change', (file) => {
        if (/src[\\/](config|render)\.js$/.test(file)) {
          server.moduleGraph.invalidateAll();
          server.ws.send({ type: 'full-reload' });
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [clinicHtml()],
  build: { target: 'es2020', chunkSizeWarningLimit: 700 },
});
