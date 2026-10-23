# RCB Tamil Community

Static site: plain HTML, CSS and JavaScript. No build step.

## Run
Open `index.html` in a browser, or serve the folder (for example `npx serve .`). Fonts load from Google Fonts, so an internet connection is needed for Outfit, Poppins and Noto Sans Tamil.

## Structure
```
index.html            Page markup and section skeletons
css/styles.css        All styles, theme variables (dark/light), responsive rules
js/data.js            Copy (English + Tamil), journey, FAQ, feed data, CONFIG links
js/main.js            Theme and language toggles, rendering, menu, lightbox, reveal-on-scroll
js/hero-glimmer.js    Banner glimmer particle canvas
js/cricket-hit.js     Scroll-driven bat and ball animation
assets/icons/         Favicon and social icon SVGs
assets/images/        Drop your photos here (see below)
```

## Configure
Edit `CONFIG` at the top of `js/data.js`: `inviteUrl`, `instagram`, `youtube`, `whatsapp`, `contactEmail`. Buttons show a notice until a link is set. Add real events to `EVENTS` in the same file.

## Images
Photo areas show a striped red and black placeholder. To use real photos, put files in `assets/images/` and add an `<img>` inside the placeholder:
- About Us: the commented line inside `.photo` in `index.html` (`community.jpg`)
- Events & Match Day: the commented line inside `.empty .img` (`matchday.jpg`)
- Squad: add `<img src="assets/images/squad/player-N.jpg" alt="">` inside each `.pl` card in `js/main.js`, and update the names

Story, gallery and feed tiles are CSS placeholders marked SAMPLE. Replace them with authorised community content.
