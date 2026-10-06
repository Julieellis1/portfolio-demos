/* ═══════════ Esriltor · home page behaviour ═══════════ */
(function () {
  "use strict";
  var LISTINGS = window.ESRILTOR_LISTINGS || [];

  var grid = document.getElementById("listingGrid");
  var emptyNote = document.getElementById("emptyNote");
  var activeMode = "all";
  var searchFilters = null;

  function renderListings() {
    if (!grid) return;
    grid.innerHTML = "";
    var shown = 0;
    LISTINGS.forEach(function (l) {
      if (activeMode !== "all" && l.mode !== activeMode) return;
      if (searchFilters) {
        if (searchFilters.mode && l.mode !== searchFilters.mode) return;
        if (searchFilters.location && l.area.indexOf(searchFilters.location) === -1) return;
        if (searchFilters.type && l.type !== searchFilters.type) return;
        if (searchFilters.maxPrice && l.price > searchFilters.maxPrice) return;
      }
      shown++;
      var wrap = document.createElement("div");
      wrap.innerHTML = listingCardHTML(l);
      var card = wrap.firstChild;
      card.classList.add("visible", "reveal");
      grid.appendChild(card);
    });
    if (emptyNote) emptyNote.hidden = shown > 0;
  }

  /* ---------- Filter pills ---------- */
  var pills = document.querySelectorAll(".pill");
  pills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      pills.forEach(function (p) {
        p.classList.remove("active");
        p.setAttribute("aria-selected", "false");
      });
      pill.classList.add("active");
      pill.setAttribute("aria-selected", "true");
      activeMode = pill.getAttribute("data-filter");
      renderListings();
    });
  });

  /* ---------- Search ---------- */
  var searchForm = document.getElementById("searchForm");
  if (searchForm) {
    var searchNote = document.getElementById("searchNote");
    var priceSelect = document.getElementById("fPrice");
    var priceLabel = document.getElementById("priceLabel");
    var searchMode = "sale";
    var SALE_PRICES = [200000, 300000, 400000, 500000, 750000, 1000000, 1500000];
    var RENT_PRICES = [1000, 1250, 1500, 2000, 2500, 3500];

    function fillPrices() {
      var list = searchMode === "sale" ? SALE_PRICES : RENT_PRICES;
      priceSelect.innerHTML = '<option value="">No max</option>';
      list.forEach(function (p) {
        var o = document.createElement("option");
        o.value = p;
        o.textContent = searchMode === "sale"
          ? "£" + p.toLocaleString("en-GB")
          : "£" + p.toLocaleString("en-GB") + " pcm";
        priceSelect.appendChild(o);
      });
      priceLabel.textContent = searchMode === "sale" ? "Max price" : "Max rent";
    }
    fillPrices();

    var tabs = document.querySelectorAll(".search-tab");
    function setMode(mode) {
      searchMode = mode;
      tabs.forEach(function (t) {
        var on = t.getAttribute("data-mode") === mode;
        t.classList.toggle("active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      fillPrices();
    }
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () { setMode(tab.getAttribute("data-mode")); });
    });

    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var loc = document.getElementById("fLocation").value;
      var type = document.getElementById("fType").value;
      var max = priceSelect.value ? parseInt(priceSelect.value, 10) : null;
      searchFilters = { mode: searchMode, location: loc, type: type, maxPrice: max };
      pills.forEach(function (p) {
        var on = p.getAttribute("data-filter") === searchMode;
        p.classList.toggle("active", on);
        p.setAttribute("aria-selected", on ? "true" : "false");
      });
      activeMode = searchMode;
      renderListings();
      var bits = [];
      if (loc) bits.push(loc);
      if (type) bits.push(type.toLowerCase() + "s");
      var n = grid.children.length;
      searchNote.textContent = n + (n === 1 ? " home" : " homes") + " found" +
        (bits.length ? " in " + bits.join(", ") : "") + ".";
      document.getElementById("listings").scrollIntoView({ behavior: "smooth" });
    });
  }

  renderListings();

  /* ---------- Testimonial slider ---------- */
  var slidesBox = document.getElementById("reviewSlides");
  if (slidesBox) {
    var slides = slidesBox.children;
    var dotsBox = document.getElementById("slideDots");
    var idx = 0, timer = null;

    for (var i = 0; i < slides.length; i++) {
      (function (n) {
        var d = document.createElement("button");
        d.setAttribute("role", "tab");
        d.setAttribute("aria-label", "Show review " + (n + 1));
        d.addEventListener("click", function () { goTo(n); restart(); });
        dotsBox.appendChild(d);
      })(i);
    }
    var dots = dotsBox.children;

    function goTo(n) {
      idx = (n + slides.length) % slides.length;
      slidesBox.style.transform = "translateX(-" + (idx * 100 / slides.length) + "%)";
      for (var j = 0; j < dots.length; j++) {
        dots[j].classList.toggle("active", j === idx);
      }
    }
    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () { goTo(idx + 1); }, 7000);
    }
    document.getElementById("slidePrev").addEventListener("click", function () { goTo(idx - 1); restart(); });
    document.getElementById("slideNext").addEventListener("click", function () { goTo(idx + 1); restart(); });
    slidesBox.style.transition = "transform .55s ease";
    goTo(0);
    restart();
  }
})();
