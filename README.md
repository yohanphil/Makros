# Makros Solutions website

Six pages plus a page for broken links:

| File | Page |
|---|---|
| index.html | Home |
| technology.html | Technology |
| operations.html | Operations |
| studio.html | Studio |
| about.html | About |
| contact.html | Contact |
| 404.html | Shown automatically when a link is wrong |

## Put it live on GitHub Pages

1. Sign in at github.com and create a new repository called **makros**. Set it to **Public** (Pages on a private repository needs a paid plan). Leave the other boxes unticked.
2. On the empty repository page, click **uploading an existing file**.
3. Open the makros folder on your computer, select everything inside it (all the .html files, README.md and the **assets** folder) and drag it into the browser window. Wait until every file shows in the list, then click **Commit changes**.
4. Go to **Settings**, then **Pages**. Under Build and deployment, set Source to **Deploy from a branch**, choose the **main** branch and the **/ (root)** folder, then click **Save**.
5. Wait one or two minutes and refresh that screen. Your public link appears at the top:
   `https://YOURNAME.github.io/makros/`

Each page has its own address, for example `https://YOURNAME.github.io/makros/technology.html`.

## Make the link preview picture show

WhatsApp, LinkedIn and Facebook need the full web address of the preview picture. Every page has this line:

```html
<meta property="og:image" content="https://USERNAME.github.io/makros/assets/img/share.png">
```

Swap **USERNAME** for your GitHub username in all seven HTML files. The quickest way: on the repository page press the full stop key ( . ) to open the web editor, press Ctrl+Shift+H (Cmd+Shift+H on a Mac) to search and replace across every file, replace USERNAME with your username, then commit from the Source Control panel on the left.

## Updating a page

Open the file on GitHub and click the pencil icon, or upload a new version with the same file name. The live site updates within a minute or two.

## Using the command line instead of uploading

```bash
cd makros
git init
git add .
git commit -m "Makros website"
git branch -M main
git remote add origin https://github.com/YOURNAME/makros.git
git push -u origin main
```

Then do step 4 above.

## Using a Makros domain later

In Settings, Pages, Custom domain, enter something like `preview.makrossolutions.com`. At the company's domain provider, add a CNAME record for `preview` that points to `YOURNAME.github.io`. Tick Enforce HTTPS once it becomes available, and update the og:image lines to the new address.

## Before this becomes the real Makros site

* Every page has `<meta name="robots" content="noindex">` so search engines don't list the preview. Delete that line from every page when it goes live.
* The footer says "Website design preview". Remove it at the same time.
* The contact form opens the visitor's email app with the message written out and addressed to hello@makrossolutions.com. To receive messages without the email app, connect a form service such as Formspree.
* The figures in the home page reports are examples and are labelled that way.
* About uses vision and mission Option 1 until the directors choose.

## What's inside

* `assets/css/site.css` holds all the styles.
* `assets/js/site.js` runs the motion, the cube, the problem picker, the tabs and the form.
* `assets/img` holds the browser tab icon, the phone home screen icon and the link preview picture.
* Libraries load from public CDNs: three.js r128 (home page only), GSAP 3.12.5 with ScrollTrigger, and Lenis 1.1.13. Fonts are Sora and Inter from Google Fonts.
