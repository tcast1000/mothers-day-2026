# Mother's Day E-Card

A tappable 3D gift-box e-card. The recipient taps the gift three times — it shakes, the lid pops off with confetti, the sides fall open, and a personal letter and photos are revealed.

Pure HTML / CSS / JS. No build step, no dependencies. Drop it on any static host (Netlify, Vercel, GitHub Pages, S3) or open `index.html` directly in a browser.

> **This repo is a template.** It does not contain anyone's letter or photos — those files (`content.js` and the contents of `photos/`) are gitignored. Fork or clone freely; you'll need to add your own message and photos to make it personal.

## Quick start

1. Copy `content.example.js` to `content.js` (or rename it).
2. Edit `content.js` — replace the placeholder body, signature, and (optionally) the passphrase.
3. Drop your photos into the `photos/` folder. The example expects `photo1.jpg` through `photo4.jpg`, but any path works — just match what you set in `content.js`.
4. Open `index.html` in a browser, or deploy the folder to any static host.

## Privacy

`content.js` and your photos in `photos/` are gitignored by default. The repo only ever tracks the template (`content.example.js`) and an empty `photos/` folder, so you can safely fork/publish this without leaking your letter or family photos.

When you deploy, make sure your host actually receives `content.js` and the photo files — they exist on your machine but not in git, so a deploy that mirrors only the GitHub repo will fall back to the placeholder template. (For Vercel, define a `.vercelignore` to override the default `.gitignore`-based exclusion — see this repo's `.vercelignore`.)

## Optional passphrase gate

Set `passphrase` in `content.js` to gate the card behind a phrase the recipient has to type. Comparison is case-insensitive and trimmed, so spelling/spacing is forgiving. **This is client-side only** — anyone who views page source can find the phrase. It's a casual filter to keep stumbled-upon URLs from showing the letter, not real access control.

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
