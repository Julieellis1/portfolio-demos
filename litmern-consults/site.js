/* Litmern Consults - shared interactions */
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

  /* Testimonial slider */
  var slides = document.querySelectorAll(".tslide");
  if (slides.length > 1) {
    var idx = 0, dotsWrap = document.querySelector(".tdots"), dots = [];
    if (dotsWrap) slides.forEach(function(_, i){
      var d = document.createElement("button");
      d.setAttribute("aria-label", "Show testimonial " + (i + 1));
      d.addEventListener("click", function(){ show(i); });
      dotsWrap.appendChild(d); dots.push(d);
    });
    function show(n){
      idx = (n + slides.length) % slides.length;
      slides.forEach(function(s, i){ s.classList.toggle("active", i === idx); });
      dots.forEach(function(d, i){ d.classList.toggle("on", i === idx); });
    }
    var prev = document.querySelector(".tnav.prev"), next = document.querySelector(".tnav.next");
    if (prev) prev.addEventListener("click", function(){ show(idx - 1); });
    if (next) next.addEventListener("click", function(){ show(idx + 1); });
    show(0); setInterval(function(){ show(idx + 1); }, 9000);
  }

  /* FAQ accordion */
  document.querySelectorAll(".acc-item").forEach(function(item){
    var q = item.querySelector(".acc-q"); if (!q) return;
    q.addEventListener("click", function(){
      var wasOpen = item.classList.contains("open");
      item.parentElement.querySelectorAll(".acc-item.open").forEach(function(o){
        o.classList.remove("open");
        var pm = o.querySelector(".pm"); if (pm) pm.textContent = "+";
      });
      if (!wasOpen) {
        item.classList.add("open");
        var pm2 = item.querySelector(".pm"); if (pm2) pm2.textContent = "–";
      }
    });
  });

  /* Highlight-to-reveal (word-by-word scroll illumination) */
  document.querySelectorAll("[data-hl]").forEach(function(section){
    var p = section.querySelector(".hl-text"); if (!p) return;
    var words = p.textContent.trim().split(/\s+/);
    p.innerHTML = words.map(function(w){ return '<span class="w">' + w + "</span>"; }).join(" ");
    var spans = p.querySelectorAll(".w");
    var sticky = section.querySelector(".hl-sticky");
    function update(){
      var rect = section.getBoundingClientRect();
      var total = section.offsetHeight - window.innerHeight;
      var progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, total)));
      var lit = Math.floor(progress * spans.length);
      spans.forEach(function(s, i){ s.classList.toggle("lit", i < lit); });
    }
    window.addEventListener("scroll", update, {passive:true});
    window.addEventListener("resize", update);
    update();
  });

  /* Reveal on scroll */
  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && els.length) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, {threshold:.1});
    els.forEach(function(el){ io.observe(el); });
  } else els.forEach(function(el){ el.classList.add("visible"); });

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
      } else if (success) success.hidden = true;
    });
  });

  /* Footer year */
  document.querySelectorAll(".js-year").forEach(function(el){
    el.textContent = new Date().getFullYear();
  });
})();
