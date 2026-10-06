/* Bomorn Haven - shared interactions */
(function(){
  "use strict";

  /* Mobile nav */
  var burger = document.querySelector(".burger");
  var mnav = document.getElementById("mobileNav");
  var mclose = document.querySelector(".mclose");
  if (burger && mnav) {
    burger.addEventListener("click", function(){ mnav.classList.add("open"); });
    if (mclose) mclose.addEventListener("click", function(){ mnav.classList.remove("open"); });
    mnav.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){ mnav.classList.remove("open"); });
    });
  }

  /* Menu tabs */
  document.querySelectorAll("[data-tabs]").forEach(function(group){
    var btns = group.querySelectorAll(".tab-btn");
    var scope = document.querySelector(group.getAttribute("data-tabs-scope") || "body");
    btns.forEach(function(btn){
      btn.addEventListener("click", function(){
        btns.forEach(function(b){ b.classList.remove("active"); });
        btn.classList.add("active");
        var target = btn.getAttribute("data-tab");
        scope.querySelectorAll(".tab-panel").forEach(function(p){
          p.classList.toggle("active", p.id === target);
        });
      });
    });
  });

  /* Testimonial slider */
  var slides = document.querySelectorAll(".tslide");
  if (slides.length > 1) {
    var idx = 0;
    var dotsWrap = document.querySelector(".tdots");
    var dots = [];
    if (dotsWrap) {
      slides.forEach(function(_, i){
        var d = document.createElement("button");
        d.setAttribute("aria-label", "Show testimonial " + (i + 1));
        d.addEventListener("click", function(){ show(i); });
        dotsWrap.appendChild(d); dots.push(d);
      });
    }
    function show(n){
      idx = (n + slides.length) % slides.length;
      slides.forEach(function(s, i){ s.classList.toggle("active", i === idx); });
      dots.forEach(function(d, i){ d.classList.toggle("on", i === idx); });
    }
    var prev = document.querySelector(".tnav.prev");
    var next = document.querySelector(".tnav.next");
    if (prev) prev.addEventListener("click", function(){ show(idx - 1); });
    if (next) next.addEventListener("click", function(){ show(idx + 1); });
    show(0);
    setInterval(function(){ show(idx + 1); }, 9000);
  }

  /* FAQ accordion */
  document.querySelectorAll(".accordion-item").forEach(function(item){
    var q = item.querySelector(".accordion-q");
    if (!q) return;
    q.addEventListener("click", function(){
      var wasOpen = item.classList.contains("open");
      item.parentElement.querySelectorAll(".accordion-item.open").forEach(function(o){
        o.classList.remove("open");
        var pm = o.querySelector(".pm"); if (pm) pm.textContent = "+";
      });
      if (!wasOpen) {
        item.classList.add("open");
        var pm2 = item.querySelector(".pm"); if (pm2) pm2.textContent = "–";
      }
    });
  });

  /* Gallery filter */
  var gbtns = document.querySelectorAll(".gal-filters .tab-btn");
  if (gbtns.length) {
    gbtns.forEach(function(btn){
      btn.addEventListener("click", function(){
        gbtns.forEach(function(b){ b.classList.remove("active"); });
        btn.classList.add("active");
        var f = btn.getAttribute("data-filter");
        document.querySelectorAll(".gal-grid figure").forEach(function(fig){
          fig.classList.toggle("hide", f !== "all" && fig.getAttribute("data-cat") !== f);
        });
      });
    });
  }

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, {threshold: .1});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add("visible"); });
  }

  /* Forms */
  document.querySelectorAll("form.js-form").forEach(function(form){
    form.addEventListener("submit", function(ev){
      ev.preventDefault();
      var ok = true;
      form.querySelectorAll("[required]").forEach(function(f){
        var bad = !f.value.trim() ||
          (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
        f.style.borderColor = bad ? "#b34444" : "";
        if (bad) ok = false;
      });
      var success = form.querySelector(".form-success");
      if (ok) {
        if (success) success.hidden = false;
        form.querySelectorAll("input, select, textarea").forEach(function(f){ f.disabled = true; });
        var btn = form.querySelector("button[type=submit]"); if (btn) btn.disabled = true;
        form.scrollIntoView({behavior:"smooth", block:"center"});
      } else if (success) { success.hidden = true; }
    });
  });

  /* Footer year */
  document.querySelectorAll(".js-year").forEach(function(el){
    el.textContent = new Date().getFullYear();
  });
})();
