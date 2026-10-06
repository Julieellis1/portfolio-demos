/* ═══════════ Esriltor · listings page ═══════════ */
(function () {
  "use strict";
  var LISTINGS = window.ESRILTOR_LISTINGS || [];
  var grid = document.getElementById("resultsGrid");
  var countNote = document.getElementById("resultCount");
  var emptyNote = document.getElementById("emptyNote");
  if (!grid) return;

  var params = new URLSearchParams(window.location.search);
  var fMode = document.getElementById("flMode");
  var fArea = document.getElementById("flArea");
  var fType = document.getElementById("flType");
  var fBeds = document.getElementById("flBeds");
  var fMax = document.getElementById("flMax");

  // Preset from URL (?mode=rent, ?area=Didsbury, ...)
  if (params.get("mode") === "rent" || params.get("mode") === "sale") fMode.value = params.get("mode");
  if (params.get("area")) fArea.value = params.get("area");
  if (params.get("type")) fType.value = params.get("type");

  var SALE_MAX = [[300000, "Up to £300k"], [500000, "Up to £500k"], [750000, "Up to £750k"], [1000000, "Up to £1m"], [2000000, "Up to £2m"]];
  var RENT_MAX = [[1250, "Up to £1,250 pcm"], [1750, "Up to £1,750 pcm"], [2500, "Up to £2,500 pcm"], [4000, "Up to £4,000 pcm"]];

  function fillMax() {
    var list = fMode.value === "rent" ? RENT_MAX : SALE_MAX;
    fMax.innerHTML = '<option value="">No max</option>';
    list.forEach(function (pair) {
      var o = document.createElement("option");
      o.value = pair[0];
      o.textContent = pair[1];
      fMax.appendChild(o);
    });
  }
  fillMax();

  function apply() {
    var mode = fMode.value, area = fArea.value, type = fType.value;
    var beds = fBeds.value ? parseInt(fBeds.value, 10) : 0;
    var max = fMax.value ? parseInt(fMax.value, 10) : 0;
    grid.innerHTML = "";
    var shown = 0;
    LISTINGS.forEach(function (l) {
      if (mode !== "all" && l.mode !== mode) return;
      if (area && l.area !== area) return;
      if (type && l.type !== type) return;
      if (beds && l.beds < beds) return;
      if (max && l.price > max) return;
      shown++;
      var wrap = document.createElement("div");
      wrap.innerHTML = listingCardHTML(l);
      grid.appendChild(wrap.firstChild);
    });
    emptyNote.hidden = shown > 0;
    countNote.textContent = shown + (shown === 1 ? " home" : " homes") + " available";
  }

  [fMode, fArea, fType, fBeds, fMax].forEach(function (el) {
    el.addEventListener("change", function () {
      if (el === fMode) fillMax();
      apply();
    });
  });
  document.getElementById("clearFilters").addEventListener("click", function () {
    fMode.value = "all"; fArea.value = ""; fType.value = ""; fBeds.value = "";
    fillMax(); apply();
  });

  apply();
})();
