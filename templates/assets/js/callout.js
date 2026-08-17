/*!
 * Obsidian-style Callout support for Fluid theme
 * Transforms blockquotes with [!type] syntax into styled callout blocks.
 * Supports: quote, abstract, info, tip, warning, danger, success, question, note, bug, example, tldr
 */
(function(){
  function transformCallouts(){
    var bqs = document.querySelectorAll("blockquote");
    if (!bqs.length) return;
    bqs.forEach(function(b){
      var p = b.querySelector("p");
      if (!p) return;
      var txt = (p.textContent || "").replace(/^\s*/, "");
      var m = txt.match(/^\[!(\w+)\] *([^\n]*)/);
      if (!m) return;
      var t = m[1].toLowerCase(),
          lb = m[2].trim() || t.charAt(0).toUpperCase() + t.slice(1);
      var icons = {
        quote: "\uD83D\uDCAC", abstract: "\uD83D\uDCA1", info: "\u2139\uFE0F",
        tip: "\uD83D\uDCA1", warning: "\u26A0\uFE0F", danger: "\uD83D\uDD25",
        success: "\u2705", question: "\u2753", note: "\uD83D\uDCDD",
        bug: "\uD83D\uDC1E", example: "\uD83D\uDCCC", tldr: "\uD83D\uDCCD"
      };
      var icon = icons[t] || "\uD83D\uDCCC";
      p.innerHTML = p.innerHTML.replace(/^\s*\[\!\w+\] *[^\n]*\n?/, "");
      var w = document.createElement("div");
      w.className = "callout callout-" + t;
      var d = document.createElement("div");
      d.className = "callout-title";
      d.innerHTML = icon + " " + lb;
      w.appendChild(d);
      var v = document.createElement("div");
      v.className = "callout-body";
      while (b.firstChild) v.appendChild(b.firstChild);
      w.appendChild(v);
      b.parentNode.replaceChild(w, b);
    });
  }
  if (typeof document !== "undefined") {
    if (document.readyState === "loading")
      document.addEventListener("DOMContentLoaded", transformCallouts);
    else transformCallouts();
  }
})();
