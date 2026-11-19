# Makros Solutions website

A static site in plain HTML, CSS and JavaScript. It has no build step and no server code, and every library is stored inside the project, so it runs on any web host.

## Structure

```
/
├── index.html            Home
├── technology.html       Technology
├── operations.html       Operations (outsourcing)
├── studio.html           Studio
├── about.html            About
├── contact.html          Contact
├── 404.html              Shown for broken links
├── .htaccess             Apache: HTTPS, clean addresses, compression, caching, 404 page
├── robots.txt
├── sitemap.xml
└── assets/
    ├── css/
    │   ├── fonts.css     @font-face rules for the self-hosted fonts
    │   ├── site.css      Layout, components and pages
    │   └── motion.css    Animation styles
    ├── js/
    │   └── site.js       All site behaviour (3D cube, scroll, menus, forms)
    ├── vendor/           Third-party libraries, unmodified
    │   ├── three.min.js        three.js r128
    │   ├── gsap.min.js         GSAP 3.12.5
    │   ├── ScrollTrigger.min.js
    │   └── lenis.min.js        Lenis 1.1.13 (smooth scrolling)
    ├── fonts/            Sora and Inter, woff2, Latin subset
    ├── img/              Logo, favicon, share image, icons
    │   └── team/         Director avatars
    └── video/            Trailer in 1080p (wide screens) and 720p (phones), plus its poster
```

## Running it locally

Serve the folder with any static server. For example, from the project root:

```
python3 -m http.server 8000
```

Then open http://localhost:8000. Opening the files directly from disk also works, except for the contact form.

## Caching

CSS, JS and video links end in `?v=13`. After changing any of those files, raise the number in every HTML page so that browsers fetch the new version.

## Contact forms

The contact form and the short form at the end of each page send to hello@makrossolutions.com through FormSubmit. The first submission sends an "Activate Form" email to that inbox, and nothing is delivered until someone clicks the link in it.

## Deploying

Upload the contents of this folder to the web root over SFTP. Do not delete or overwrite the `.well-known` directory on the server, because it holds the SSL certificate validation files.

## Before going live on makrossolutions.com

Each page has `<meta name="robots" content="noindex">`, which keeps the preview out of search engines. Remove that line from all seven pages when the site goes live.
