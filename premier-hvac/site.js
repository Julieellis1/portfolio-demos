/* Premier HVAC Services LLC - shared interactions */
(function(){
  "use strict";

  /* Mobile nav */
  var burger = document.querySelector(".burger");
  var nav = document.getElementById("mainNav");
  if (burger && nav) {
    burger.addEventListener("click", function(){
      nav.classList.toggle("open");
      var open = nav.classList.contains("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){ nav.classList.remove("open"); });
    });
  }

  /* FAQ accordion */
  document.querySelectorAll(".accordion-item").forEach(function(item){
    var q = item.querySelector(".accordion-q");
    if (!q) return;
    q.addEventListener("click", function(){
      var wasOpen = item.classList.contains("open");
      document.querySelectorAll(".accordion-item.open").forEach(function(o){
        o.classList.remove("open");
        var pm = o.querySelector(".pm"); if (pm) pm.textContent = "+";
      });
      if (!wasOpen) {
        item.classList.add("open");
        var pm2 = item.querySelector(".pm"); if (pm2) pm2.textContent = "–";
      }
    });
  });

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, {threshold: .12});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add("visible"); });
  }

  /* Testimonial slider */
  var slides = document.querySelectorAll(".review-slide");
  if (slides.length > 1) {
    var idx = 0;
    var prev = document.getElementById("revPrev");
    var next = document.getElementById("revNext");
    function show(n){
      idx = (n + slides.length) % slides.length;
      slides.forEach(function(s, i){ s.classList.toggle("active", i === idx); });
    }
    if (prev) prev.addEventListener("click", function(){ show(idx - 1); });
    if (next) next.addEventListener("click", function(){ show(idx + 1); });
    setInterval(function(){ show(idx + 1); }, 8000);
  }

  /* Forms: validate then show success (front-end demo, no backend) */
  document.querySelectorAll("form.js-form").forEach(function(form){
    form.addEventListener("submit", function(ev){
      ev.preventDefault();
      var ok = true;
      form.querySelectorAll("[required]").forEach(function(f){
        var bad = !f.value.trim() ||
          (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim())) ||
          (f.type === "tel" && f.value.replace(/\D/g,"").length < 7);
        f.style.borderColor = bad ? "#dc2626" : "";
        if (bad) ok = false;
      });
      var success = form.querySelector(".form-success");
      if (ok) {
        if (success) success.hidden = false;
        form.querySelectorAll("input, select, textarea, button[type=submit]").forEach(function(f){
          if (!f.classList.contains("keep")) f.disabled = true;
        });
        form.scrollIntoView({behavior:"smooth", block:"center"});
      } else if (success) {
        success.hidden = true;
      }
    });
  });

  /* Footer year */
  document.querySelectorAll(".js-year").forEach(function(el){
    el.textContent = new Date().getFullYear();
  });
})();
