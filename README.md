# Mother's Day E-Card

A tappable 3D gift-box e-card. The recipient taps the gift three times — it shakes, the lid pops off with confetti, the sides fall open, and a personal letter and photos are revealed.

Pure HTML / CSS / JS. No build step, no dependencies. Drop it on any static host (Netlify, Vercel, GitHub Pages, S3) or open `index.html` directly in a browser.

## Quick start

1. Copy `content.example.js` to `content.js`.
2. Edit `content.js` — heading, letter, signature, photo paths.
3. Drop your photos into the `photos/` folder. The example expects `photo1.jpg` through `photo4.jpg`, but any path works.
4. Open `index.html` in a browser.

## Privacy

`content.js` and your photos in `photos/` are gitignored by default. The repo only ever tracks the template (`content.example.js`) and an empty `photos/` folder, so you can safely fork/publish this without leaking your personal letter or family photos.

When you deploy your real version, make sure your host serves `content.js` and the photos — those files exist on your machine, just not in git.

## Customize further

- **Box color**: edit the CSS custom properties at the top of `styles.css` (`--box-color`, `--box-color-shade`, `--ribbon-color`).
- **Tap count**: change the `REQUIRED_TAPS` constant at the top of `script.js`.
- **Confetti colors**: edit the `CONFETTI_COLORS` array in `script.js`.

## File map

```
index.html             markup
styles.css             3D box, spotlight, animations, layout
script.js              tap logic, confetti, reveal sequence
content.example.js     public template content (committed)
content.js             your personal content (gitignored)
photos/                your photos (gitignored)
```
