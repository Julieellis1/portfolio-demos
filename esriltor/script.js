/* ═══════════ Esriltor · original behaviour ═══════════ */
(function () {
  "use strict";

  /* ---------- Listing data ---------- */
  var LISTINGS = [
    {
      id: 1, mode: "sale", price: 685000, priceLabel: "£685,000",
      address: "14 Palatine Road", area: "Didsbury, Manchester M20",
      type: "Terrace", beds: 4, baths: 2, recep: 2, sqft: "1,842",
      img: "images/listing-terrace.jpg",
      alt: "Victorian red-brick terraced house in Didsbury"
    },
    {
      id: 2, mode: "sale", price: 325000, priceLabel: "£325,000",
      address: "Apt 12, Anchorage Quay", area: "Salford Quays, M50",
      type: "Apartment", beds: 2, baths: 2, recep: 1, sqft: "894",
      img: "images/listing-apartment.jpg",
      alt: "Modern apartment building at Salford Quays"
    },
    {
      id: 3, mode: "sale", price: 1150000, priceLabel: "£1,150,000",
      address: "7 Woodlands Road", area: "Altrincham, WA14",
      type: "Detached", beds: 5, baths: 4, recep: 3, sqft: "3,410",
      img: "images/listing-detached.jpg",
      alt: "Detached family house in Altrincham"
    },
    {
      id: 4, mode: "rent", price: 2400, priceLabel: "£2,400",
      per: "pcm", address: "Penthouse 3, No.1 Deansgate", area: "City Centre, M3",
      type: "Penthouse", beds: 3, baths: 3, recep: 2, sqft: "1,976",
      img: "images/listing-penthouse.jpg",
      alt: "Luxury penthouse living room in Manchester city centre"
    },
    {
      id: 5, mode: "sale", price: 495000, priceLabel: "£495,000",
      address: "22 Beech Road", area: "Chorlton, Manchester M21",
      type: "Cottage", beds: 3, baths: 2, recep: 1, sqft: "1,204",
      img: "images/listing-cottage.jpg",
      alt: "Stone cottage with front garden in Chorlton"
    },
    {
      id: 6, mode: "rent", price: 1650, priceLabel: "£1,650",
      per: "pcm", address: "9 Scholars Walk", area: "New Islington, M4",
      type: "Townhouse", beds: 3, baths: 3, recep: 2, sqft: "1,388",
      img: "images/listing-townhouse.jpg",
      alt: "Contemporary townhouses in New Islington"
    }
  ];

  var grid = document.getElementById("listingGrid");
  var emptyNote = document.getElementById("emptyNote");
  var activeMode = "all";   // all | sale | rent (pills)
  var searchFilters = null; // {mode, location, type, maxPrice}

  function bedIcon() {
    return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M2 17h20"/></svg>';
  }
  function bathIcon() {
    return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2Z"/><path d="M6 12V5a2 2 0 0 1 4 0"/><path d="M8 21l-1-2M16 21l1-2"/></svg>';
  }
  function areaIcon() {
    return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/></svg>';
  }

  function renderListings() {
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
      var tag = l.mode === "sale" ? "For sale" : "To let";
      var tagCls = l.mode === "sale" ? "card-tag" : "card-tag let";
      var per = l.per ? " <small>" + l.per + "</small>" : "";
      var card = document.createElement("article");
      card.className = "card visible reveal";
      card.innerHTML =
        '<div class="card-media"><img src="' + l.img + '" alt="' + l.alt + '" loading="lazy">' +
        '<span class="' + tagCls + '">' + tag + "</span></div>" +
        '<div class="card-body">' +
        '<p class="card-price">' + l.priceLabel + per + "</p>" +
        '<p class="card-address">' + l.address + "</p>" +
        '<p class="card-area">' + l.area + " · " + l.type + "</p>" +
        '<div class="card-specs"><span>' + bedIcon() + l.beds + " beds</span>" +
        "<span>" + bathIcon() + l.baths + " baths</span>" +
        "<span>" + areaIcon() + l.sqft + " sq ft</span></div>" +
        "</div>";
      grid.appendChild(card);
    });
    emptyNote.hidden = shown > 0;
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
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      searchMode = tab.getAttribute("data-mode");
      fillPrices();
    });
  });

  // Nav "Rent" link presets the search tab
  document.querySelectorAll('[data-mode="rent"]').forEach(function (link) {
    link.addEventListener("click", function () {
      tabs.forEach(function (t) {
        var on = t.getAttribute("data-mode") === "rent";
        t.classList.toggle("active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      searchMode = "rent";
      fillPrices();
    });
  });

  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var loc = document.getElementById("fLocation").value;
    var type = document.getElementById("fType").value;
    var max = priceSelect.value ? parseInt(priceSelect.value, 10) : null;
    searchFilters = { mode: searchMode, location: loc, type: type, maxPrice: max };
    // Sync pills with the searched mode
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

  renderListings();

  /* ---------- Header + mobile nav ---------- */
  var header = document.getElementById("siteHeader");
  window.addEventListener("scroll", function () {
    header.classList.toggle("scrolled", window.scrollY > 12);
  }, { passive: true });

  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  navToggle.addEventListener("click", function () {
    var open = mainNav.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  mainNav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      mainNav.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("visible");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      cio.unobserve(el);
      var target = parseFloat(el.getAttribute("data-count"));
      var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      var prefix = el.getAttribute("data-prefix") || "";
      var suffix = el.getAttribute("data-suffix") || "";
      var start = null, dur = 1400;
      function tick(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });
  counters.forEach(function (c) { cio.observe(c); });

  /* ---------- Testimonial slider ---------- */
  var slidesBox = document.getElementById("reviewSlides");
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
    // Track is slides.length × 100% wide, so each step is 100/length %
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

  /* ---------- Valuation form ---------- */
  var form = document.getElementById("valuationForm");
  var success = document.getElementById("valuationSuccess");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var valid = true;
    form.querySelectorAll("[required]").forEach(function (input) {
      var bad = !input.value.trim() ||
        (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value));
      input.classList.toggle("invalid", bad);
      if (bad) valid = false;
    });
    if (!valid) return;
    form.querySelectorAll("input").forEach(function (input) { input.disabled = true; });
    form.querySelector("button[type=submit]").disabled = true;
    success.hidden = false;
    success.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
