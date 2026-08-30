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
  icon-512-maskable.png     adaptive icon (Android circles/squircles) -
                            the artwork is inset to 72% so the circle crop
                            does not cut into it
  apple-touch-icon.png      iOS home screen

After changing index.html
-------------------------
Bump CACHE_VERSION at the top of sw.js (e.g. sire2-v1.0.1) and re-upload.
Without that, phones already carrying the old service worker may keep
serving the previous copy from cache.

Back button
-----------
The back gesture moves through the app rather than leaving it:
  * an open sheet or report preview closes first
  * from any page it returns to the previous one, or to the dashboard
  * on the dashboard it asks once, and a second press within two
    seconds closes the app

Keyboard shortcuts
------------------
With a keyboard attached, select text in the library and press Ctrl+1
to Ctrl+4 for highlights, Ctrl+B / Ctrl+I / Ctrl+U for emphasis, and
Ctrl+0 to remove marks. They can be reassigned under Settings.

Follow-up roles
---------------
Every question carries a "Follow up with" list - Office, Master, C/O and
so on - which can be set to several people at once. Edit, reorder or add
to that list under Settings; removing a role there never clears it from
questions it is already set on. The "Follow-up by role" report prints a
separate section per person.

Library: walk mode and bulk edit
--------------------------------
"ROVIQ walk" reorders the library into the route an inspector takes -
boarding, documents, bridge and cargo control, accommodation, main deck,
forward, mooring, aft, machinery, then interviews. A question tagged with
several locations appears at each of them, which is how it is inspected.

"Select" turns on tick boxes. Choose several questions, or "All shown"
to take everything matching the current filters, then set status,
follow-up roles or the responsible person on all of them at once.

Search and publications
-----------------------
The library search covers the whole OCIMF text - objective, guidance,
inspector actions, expected evidence and negative-observation grounds -
not just the question titles. Matching rows show a snippet with the term
highlighted and name the field it came from. Put a phrase in quotes to
search it as a phrase. "Search all text" can be switched off to search
titles only.

More -> Publications inverts the library: every publication the questions
rest on, with how many questions need each, narrowed to the ones that
apply to your vessel. Tap Show to see those questions, or tap a
publication on any question to do the same. There is a matching report
for gathering paperwork before an inspection.

Quick status, sharing and backup reminders
------------------------------------------
Press and hold a row in the library (right-click on a computer) to set
status and follow-up without opening the question.

"Share" on a question or a finding hands it to the phone's share sheet -
WhatsApp, email, anything installed - with its photos attached where the
platform allows. On a computer there is no share sheet, so it copies the
text to the clipboard instead.

The dashboard reminds you to export a backup when there are changes that
have never been saved out. Change the interval, or switch it off, under
Settings -> Export and import.

Text size and the countdown
---------------------------
Settings -> Appearance has a text size control, and More has A- / A+ for
adjusting it on deck without digging. It scales the text you read, not
the buttons and navigation, so nothing breaks at the largest setting.
Printed reports keep their own typography either way. The size is stored
per device and is deliberately not synced.

Give an inspection a planned date and the dashboard counts down to it,
draws a readiness trend from a daily sample, and says whether the rate
you are actually working at will get you there in time.

Interview prep packs
--------------------
The OCIMF library marks which questions an inspector puts to a person
rather than to the ship - nine interviews in all, from Senior Officer
down to Galley Rating. Reports -> Interview prep packs prints one sheet
per interview, written for the person being asked: what you may be
asked, what to have ready as a tick list, and what would read badly.
Pick which interviews to print, and use the short version to leave out
the negative-observation grounds.

Notes
-----
  * The manifest deliberately uses the .json extension. GitHub Pages
    serves .webmanifest with the wrong content type and Chrome then
    ignores it, so installation silently never becomes available.
  * The service worker caches each asset individually rather than with
    cache.addAll(), which is atomic - one missing file would otherwise
    leave the app with no offline copy at all.
  * If the Install button stays greyed out, open Settings -> Install on
    this device -> Run installation checks. It tests each of Chrome's
    requirements and names the one that is failing.
  * iOS never fires the install event. On iPhone or iPad use
    Share -> Add to Home Screen instead.
  * Your data lives in the browser's storage for this origin. Moving the
    files to a different URL starts an empty app - use Settings ->
    Export backup first, then import it on the new address.
