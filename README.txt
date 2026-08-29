SIRE 2.0 Prep — Android PWA
===========================

Upload every file in this folder to a GitHub Pages repository, keeping
them together in one directory. Then open that URL in Chrome on Android
and use "Install app" (Settings -> Install on this device), or Chrome's
own menu -> Install app.

Files
-----
  index.html                the whole application (same bytes as the
                            desktop build's ui\sire2-prep.html)
  manifest.json             web app manifest
  sw.js                     service worker
  offline.html              shown only before the first successful load
  icon-192.png              home screen icon
  icon-512.png              splash / store icon
  icon-512-maskable.png     adaptive icon (Android circles/squircles)
  apple-touch-icon.png      iOS home screen

After changing index.html
-------------------------
Bump CACHE_VERSION at the top of sw.js (e.g. sire2-v1.0.1) and re-upload.
Without that, phones already carrying the old service worker may keep
serving the previous copy from cache.

Notes
-----
  * The manifest deliberately uses the .json extension. GitHub Pages
    serves .webmanifest with the wrong content type and Chrome then
    ignores it, so installation silently never becomes available.
  * index.html carries <link rel="manifest" href="manifest.json"> in the
    markup, not added later from script. Chrome decides installability
    while it parses the document, so a manifest attached afterwards is
    too late and the install option never appears.
  * manifest.json sets no "id". Chrome resolves a relative id against the
    origin rather than the manifest's folder, which on a GitHub project
    page (user.github.io/repo/) points at the wrong place. Left out, the
    identity defaults to start_url, which resolves correctly wherever the
    folder is uploaded.
  * Keep all the files in one directory. start_url and scope are relative
    to it, so the app installs from whatever path it is served at.
  * The service worker caches each asset individually rather than with
    cache.addAll(), which is atomic - one missing file would otherwise
    leave the app with no offline copy at all.
  * If the Install button stays greyed out, open Settings -> Install on
    this device -> Run installation checks. It tests each of Chrome's
    requirements and names the one that is failing. Chrome also caches
    its verdict: after re-uploading, close every tab for the site, then
    Chrome -> Settings -> Privacy -> Delete browsing data for it, and
    load the page again.
  * iOS never fires the install event. On iPhone or iPad use
    Share -> Add to Home Screen instead.
  * Your data lives in the browser's storage for this origin. Moving the
    files to a different URL starts an empty app - use Settings ->
    Export backup first, then import it on the new address.
