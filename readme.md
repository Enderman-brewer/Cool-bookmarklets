># Useful & Cool bookmarklets
>### By Enderman-brewer

##### Do you love customizing your web experience with mods or extensions, but hate the hassle of manual installation? The Mod Loader is here to streamline the process and give you full control over your custom mods – all for free!

Key Features:
 * Easy Installation: With just one click, you can load selected mods into your browser with minimal effort.
 * Clear UI: A simple, intuitive interface displays the available mods with descriptions, so you know exactly what you're installing.
 * Mod Management: Select and load only the mods you need, directly from trusted sources, without any unnecessary steps.
 * Automatic Updates: Always up to date with the latest versions of mods, thanks to seamless fetching of mod lists.
How It Works:
   * The Mod Loader fetches a list of available mods from a trusted source.
   * It displays them in a user-friendly interface, allowing you to select mods using checkboxes.
   * Once you've chosen your mods, click the “Load Selected Mods” button, and the tool will fetch and load them into your browser automatically.
   * Conflict warnings will appear next to mods that may cause issues with others.
   * Enjoy your mods without needing to manually install or manage them!
 * Why You Should Use Mod Loader:
   * Free & Open Source: No cost, no hidden fees, just an easy-to-use tool for everyone.
   * No Technical Skills Required: Anyone can use it, from beginners to experienced users.
   * Safe and Secure: Mods are sourced from trusted URLs and can be read by the standard user, with the format ```Bookmarklet name <> url.com```
   * Old versions do not get removed, but instead archived, while the modloader no longer can get updated mods, you can still inject the updated or legacy modloader as a mod itself.

Whether you're customizing a web app or enhancing your browser experience, the Mod Loader makes managing mods easier and more efficient than ever before.
You can even use it for fun.


>## How to import
>##### You may be wondering, how do you install this bookmarklet, honestly, this is the hardest part, but is the most rewarding.

>[!Note]
> I'm not responsible for any bugs if you fail to do these.


Here's how you do it:
* Pre-compiled:
  1. Copy this code (this is the dynamic modloader)
  ```javascript
  javascript:void function(){(function(){function a(a,b=!1,c=2e3){const d=document.createElement("div");d.style.cssText=`            position: fixed;            top: 10px;            left: 10px;            background-color: rgba(0, 0, 0, 0.7);            color: white;            padding: 8px 12px;            border-radius: 5px;            z-index: 10001;            font-size: 14px;            opacity: 0;            transition: opacity 0.3s ease-in-out;        `,b%26%26(d.style.color="red"),d.textContent=a,document.body.appendChild(d),d.offsetHeight,d.style.opacity=1,setTimeout(()=>{d.style.opacity=0,setTimeout(()=>d.remove(),300)},c)}function b(b){fetch(b,{cache:"no-store"}).then(a=>{if(!a.ok)throw new Error("Failed to fetch "+b);return a.text()}).then(c=>{const d=document.createElement("script");d.textContent=c,document.body.appendChild(d),a(`Loaded: ${b}`)}).catch(c=>{console.error("Error loading mod:",c),a(`Failed to load: ${b}`,!0)})}(function(){a("Fetching mod list..."),fetch("https://raw.githubusercontent.com/Enderman-brewer/Cool-bookmarklets/refs/heads/main/ModloaderDynamicLatestURL.txt",{cache:"no-store"}).then(a=>{if(!a.ok)throw new Error("Failed to fetch mod list");return a.text()}).then(c=>{const d=c.split("\n").map(a=>a.split("<>")).filter(a=>2===a.length);return 0===d.length%3Fvoid a("No valid mods found.",!0):void(a(`Loading ${d.length} mods...`),d.forEach(([a,c])=>b(c.trim())))}).catch(b=>{console.error("Error fetching mod list:",b),a("Error fetching mod list.",!0)})})()})()}();
  ```
  2. Save it as a bookmark.

* Full manual
  1. Paste the contents of any of these files, such as the previously advertised [modloaderV3.js](/modloaderV3.js) to [this site using default settings](https://chriszarate.github.io/bookmarkleter/)
  2. Create the bookmarklet and put it in your bookmark bar
  3. Go to any website
  4. Click the bookmark
  5. Press `ESC` to deload the game/bookmarklet, or refresh the site to revert to the original site.
