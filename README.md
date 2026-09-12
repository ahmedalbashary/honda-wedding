# Honda & Salma — Wedding Invitation 💍

A clean, self-contained static Arabic wedding invitation website. Just open `index.html` — no build step, no dependencies.

## ✨ Features

- Envelope cover with gold wax seal animation
- Live countdown timer to the wedding date
- Hero section with Arabic typography (Amiri + Aref Ruqaa + Cormorant Garamond)
- Quran verse section, story timeline, event details with map link
- Photo gallery grid, RSVP form, footer
- Optional background music toggle (WebAudio fallback)
- Fully RTL Arabic layout
- Mobile responsive
- Smooth scroll fade-in animations using IntersectionObserver

## 📁 Files

```
wedding-site/
├── index.html     # main page (Arabic, RTL)
├── styles.css     # all styling (cream + gold palette)
├── script.js      # countdown, music, form, animations
└── README.md
```

## 🚀 How to use

### Local preview
Just double-click `index.html` — it works straight from the file system.

### GitHub Pages (public URL)
1. Push the folder to a GitHub repository.
2. Go to **Settings → Pages**.
3. Set source to `main` branch / root (`/`).
4. Visit `https://<your-user>.github.io/<repo>/`.

### Customize

#### Change wedding date (script.js)
```js
const WEDDING_DATE = new Date('2026-10-12T19:00:00').getTime();
```
Replace with your date in ISO format (year-month-dayThour:minute:second).

#### Replace names, dates, venue (index.html)
- Hero names → `.hero-names`
- Date → `.hero-date`
- Event card 1 → `.event-card:nth-child(1)`
- Map link → `href="https://maps.google.com"` inside that card

#### Replace background music (index.html)
```html
<audio id="bgMusic" loop preload="none">
  <source src="YOUR_MP3_URL" type="audio/mpeg">
</audio>
```
Put your audio file at `assets/song.mp3` and reference it as `src="assets/song.mp3"`.

#### Replace gallery images
Add actual photos to `assets/` and update `.g1` … `.g6` in `styles.css`:
```css
.g1 { background-image: url('assets/photo1.jpg'); }
```

## 🎨 Color palette (customize in `:root` of styles.css)

| Variable        | Value     | Use            |
|-----------------|-----------|----------------|
| `--bg-cream`    | `#f5efe6` | Page bg        |
| `--bg-paper`    | `#fbf6ee` | Cards          |
| `--gold`        | `#b8862d` | Accents        |
| `--gold-dark`   | `#8a6419` | Headings       |
| `--ink`         | `#3a2a1a` | Body text      |

## 💌 Credits
Fonts: Google Fonts (Amiri, Aref Ruqaa, Cormorant Garamond).
Wax seal SVG: hand-crafted.

Made with ❤ for Honda & Salma — ١٢ . ١٠ . ٢٠٢٦
