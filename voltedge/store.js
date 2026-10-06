/* VoltEdge store engine: cart, wishlist, filters, countdown, UI */
(function(){
  "use strict";

  var PRODUCTS = window.VOLTEDGE_PRODUCTS || [];

  /* ---------- storage ---------- */
  function read(key, fb){ try { return JSON.parse(localStorage.getItem(key)) || fb; } catch(e){ return fb; } }
  function write(key, val){ try { localStorage.setItem(key, JSON.stringify(val)); } catch(e){} }
  var cart = read("voltedge_cart", {});
  var wishlist = read("voltedge_wish", []);

  function money(n){ return "$" + n.toFixed(2); }
  function findProduct(slug){ return PRODUCTS.find(function(p){ return p.slug === slug; }); }
  function cartCount(){ return Object.values(cart).reduce(function(a,b){ return a+b; }, 0); }
  function cartTotal(){ return Object.entries(cart).reduce(function(sum, kv){
    var p = findProduct(kv[0]); return p ? sum + p.price * kv[1] : sum;
  }, 0); }

  /* ---------- toast ---------- */
  var toastEl = null, toastTimer = null;
  function toast(html){
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = html;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toastEl.classList.remove("show"); }, 2600);
  }

  /* ---------- badges ---------- */
  function refreshBadges(){
    document.querySelectorAll(".js-cart-count").forEach(function(el){ el.textContent = cartCount(); });
    document.querySelectorAll(".js-wish-count").forEach(function(el){ el.textContent = wishlist.length; });
  }

  /* ---------- cart ops ---------- */
  function addToCart(slug, qty){
    qty = qty || 1;
    cart[slug] = (cart[slug] || 0) + qty;
    write("voltedge_cart", cart);
    refreshBadges(); renderDrawer();
    var p = findProduct(slug);
    toast("<b>" + (p ? p.name : "Item") + "</b> added to cart");
    openDrawer();
  }
  function setQty(slug, qty){
    if (qty <= 0) delete cart[slug]; else cart[slug] = qty;
    write("voltedge_cart", cart);
    refreshBadges(); renderDrawer(); renderCartPage();
  }
  function toggleWish(slug){
    var i = wishlist.indexOf(slug);
    if (i >= 0) { wishlist.splice(i, 1); toast("Removed from wishlist"); }
    else { wishlist.push(slug); toast("Saved to <b>wishlist</b>"); }
    write("voltedge_wish", wishlist);
    refreshBadges(); paintWishButtons(); renderWishPage();
  }
  function paintWishButtons(){
    document.querySelectorAll("[data-wish]").forEach(function(btn){
      var on = wishlist.indexOf(btn.getAttribute("data-wish")) >= 0;
      btn.classList.toggle("on", on);
      btn.innerHTML = on ? "&#10084;" : "&#9825;";
      btn.style.color = on ? "#ff4d24" : "";
    });
  }

  /* ---------- drawer ---------- */
  var veil = document.getElementById("drawerVeil");
  var drawer = document.getElementById("cartDrawer");
  function openDrawer(){ if (drawer){ drawer.classList.add("open"); veil.classList.add("open"); } }
  function closeDrawer(){ if (drawer){ drawer.classList.remove("open"); veil.classList.remove("open"); } }
  if (veil) veil.addEventListener("click", closeDrawer);
  var dc = document.querySelector(".cd-close");
  if (dc) dc.addEventListener("click", closeDrawer);

  function renderDrawer(){
    var box = document.querySelector(".cd-items");
    if (!box) return;
    var entries = Object.entries(cart);
    if (!entries.length) {
      box.innerHTML = '<div class="cd-empty">Your cart is empty.<br><br><button class="btn solid" onclick="document.getElementById(\'cartDrawer\').classList.remove(\'open\');document.getElementById(\'drawerVeil\').classList.remove(\'open\')">Start Shopping</button></div>';
    } else {
      box.innerHTML = entries.map(function(kv){
        var p = findProduct(kv[0]); if (!p) return "";
        return '<div class="cd-line"><img src="images/' + p.img + '" alt="' + p.name + '">' +
          '<div><h4>' + p.name + '</h4><div class="cdp">' + money(p.price) + ' &times; ' + kv[1] + '</div></div>' +
          '<div><button class="cl-remove" data-rm="' + p.slug + '">Remove</button></div></div>';
      }).join("");
    }
    var foot = document.querySelector(".cd-foot");
    if (foot) {
      foot.innerHTML = entries.length
        ? '<div class="sum-row total" style="display:flex;justify-content:space-between;font-weight:800;margin-bottom:1rem"><span>Subtotal</span><span>' + money(cartTotal()) + '</span></div>' +
          '<a class="btn solid" href="cart.html" style="width:100%;margin-bottom:.6rem">View Cart</a>' +
          '<a class="btn dark" href="checkout.html" style="width:100%">Checkout</a>'
        : "";
    }
    box.querySelectorAll("[data-rm]").forEach(function(b){
      b.addEventListener("click", function(){ setQty(b.getAttribute("data-rm"), 0); });
    });
  }

  /* ---------- cart page ---------- */
  function renderCartPage(){
    var box = document.getElementById("cartLines");
    if (!box) return;
    var entries = Object.entries(cart);
    if (!entries.length) {
      box.innerHTML = '<div class="empty-state"><h3>Your cart is empty</h3><p>Looks like you have not added anything yet.</p><br><a class="btn solid" href="shop.html">Browse Products</a></div>';
    } else {
      box.innerHTML = entries.map(function(kv){
        var p = findProduct(kv[0]); if (!p) return "";
        return '<div class="cart-line"><img src="images/' + p.img + '" alt="' + p.name + '">' +
          '<div><h3><a href="product-' + p.slug + '.html">' + p.name + '</a></h3>' +
          '<div class="cl-price">' + money(p.price) + ' each</div></div>' +
          '<div class="cl-right"><div class="qty"><button data-dec="' + p.slug + '">&minus;</button><span>' + kv[1] + '</span><button data-inc="' + p.slug + '">+</button></div>' +
          '<div style="font-weight:700">' + money(p.price * kv[1]) + '</div>' +
          '<button class="cl-remove" data-rm="' + p.slug + '">Remove</button></div></div>';
      }).join("");
    }
    box.querySelectorAll("[data-inc]").forEach(function(b){ b.addEventListener("click", function(){ setQty(b.getAttribute("data-inc"), (cart[b.getAttribute("data-inc")]||0)+1); }); });
    box.querySelectorAll("[data-dec]").forEach(function(b){ b.addEventListener("click", function(){ setQty(b.getAttribute("data-dec"), (cart[b.getAttribute("data-dec")]||0)-1); }); });
    box.querySelectorAll("[data-rm]").forEach(function(b){ b.addEventListener("click", function(){ setQty(b.getAttribute("data-rm"), 0); }); });

    var sub = cartTotal(), ship = sub === 0 ? 0 : (sub >= 75 ? 0 : 9.95);
    var set = function(id, v){ var el = document.getElementById(id); if (el) el.textContent = v; };
    set("sumSubtotal", money(sub));
    set("sumShipping", sub === 0 ? money(0) : (ship === 0 ? "FREE" : money(ship)));
    set("sumTotal", money(sub + ship));
    var bar = document.getElementById("shipBar"), note = document.getElementById("shipNote");
    if (bar && note) {
      var pct = Math.min(100, sub / 75 * 100);
      bar.style.width = pct + "%";
      note.innerHTML = sub >= 75 ? "You unlocked <b>FREE shipping</b>." :
        "Add <b>" + money(75 - sub) + "</b> more for free shipping.";
    }
    var coBtn = document.getElementById("goCheckout");
    if (coBtn) coBtn.disabled = !entries.length;
  }

  /* ---------- wishlist page ---------- */
  function renderWishPage(){
    var box = document.getElementById("wishGrid");
    if (!box) return;
    if (!wishlist.length) {
      box.innerHTML = '<div class="empty-state"><h3>Your wishlist is empty</h3><p>Tap the heart on any product to save it here.</p><br><a class="btn solid" href="shop.html">Browse Products</a></div>';
      return;
    }
    box.innerHTML = wishlist.map(function(slug){
      var p = findProduct(slug); if (!p) return "";
      return window.VOLTEDGE_CARD(p);
    }).join("");
    wireCards(box);
  }

  /* ---------- product cards ---------- */
  function stars(r){
    var full = Math.round(r), s = "";
    for (var i = 0; i < 5; i++) s += i < full ? "&#9733;" : "&#9734;";
    return s;
  }
  window.VOLTEDGE_STARS = stars;
  if (!window.VOLTEDGE_CARD) {
    window.VOLTEDGE_CARD = function(p){
      var badge = p.badge ? '<span class="prod-badge' + (p.badge === "New" ? " new" : "") + '">' + p.badge + '</span>' : "";
      var was = p.was ? '<span class="was">' + money(p.was) + '</span>' : "";
      return '<div class="prod-card reveal"><div class="prod-img"><a href="product-' + p.slug + '.html"><img src="images/' + p.img + '" alt="' + p.name + '" loading="lazy"></a>' + badge +
        '<div class="prod-actions"><button class="pa-btn" data-add="' + p.slug + '" aria-label="Add to cart">&#128722;</button>' +
        '<button class="pa-btn" data-wish="' + p.slug + '" aria-label="Wishlist">&#9825;</button>' +
        '<a class="pa-btn" href="product-' + p.slug + '.html" aria-label="View">&#128065;</a></div></div>' +
        '<div class="prod-body"><span class="prod-cat">' + p.cat + '</span><h3><a href="product-' + p.slug + '.html">' + p.name + '</a></h3>' +
        '<div class="stars">' + stars(p.rating) + ' <span>(' + p.reviews + ')</span></div>' +
        '<div class="prod-price"><span class="now">' + money(p.price) + '</span>' + was + '</div></div></div>';
    };
  }
  function wireCards(root){
    (root || document).querySelectorAll("[data-add]").forEach(function(b){
      b.addEventListener("click", function(e){ e.preventDefault(); addToCart(b.getAttribute("data-add"), 1); });
    });
    (root || document).querySelectorAll("[data-wish]").forEach(function(b){
      b.addEventListener("click", function(e){ e.preventDefault(); toggleWish(b.getAttribute("data-wish")); });
    });
    paintWishButtons();
  }

  /* render grids marked with data-grid */
  document.querySelectorAll("[data-grid]").forEach(function(grid){
    var mode = grid.getAttribute("data-grid");
    var list = PRODUCTS.slice();
    if (mode === "bestsellers") list = list.filter(function(p){ return p.best; });
    else if (mode === "sale") list = list.filter(function(p){ return p.was; });
    else if (mode === "new") list = list.filter(function(p){ return p.badge === "New"; });
    var n = parseInt(grid.getAttribute("data-limit") || "0", 10);
    if (n) list = list.slice(0, n);
    grid.innerHTML = list.map(window.VOLTEDGE_CARD).join("");
  });
  wireCards(document);

  /* ---------- shop filters ---------- */
  var shopGrid = document.getElementById("shopGrid");
  if (shopGrid) {
    var state = { cats: [], max: 1200, q: "", sort: "featured" };
    function applyFilters(){
      var list = PRODUCTS.filter(function(p){
        if (state.cats.length && state.cats.indexOf(p.cat) < 0) return false;
        if (p.price > state.max) return false;
        if (state.q && (p.name + " " + p.cat + " " + p.desc).toLowerCase().indexOf(state.q) < 0) return false;
        return true;
      });
      if (state.sort === "low") list.sort(function(a,b){ return a.price - b.price; });
      else if (state.sort === "high") list.sort(function(a,b){ return b.price - a.price; });
      else if (state.sort === "rating") list.sort(function(a,b){ return b.rating - a.rating; });
      shopGrid.innerHTML = list.length ? list.map(window.VOLTEDGE_CARD).join("")
        : '<div class="empty-state"><h3>No products match</h3><p>Try clearing a filter or two.</p></div>';
      wireCards(shopGrid);
      var c = document.getElementById("resultCount");
      if (c) c.textContent = list.length + " product" + (list.length === 1 ? "" : "s");
      if (window.VOLTEDGE_REVEAL) window.VOLTEDGE_REVEAL(shopGrid);
    }
    document.querySelectorAll(".f-check input[data-cat]").forEach(function(cb){
      cb.addEventListener("change", function(){
        state.cats = Array.from(document.querySelectorAll('.f-check input[data-cat]:checked')).map(function(x){ return x.getAttribute("data-cat"); });
        applyFilters();
      });
    });
    var pr = document.getElementById("priceRange"), pv = document.getElementById("priceVal");
    if (pr) pr.addEventListener("input", function(){
      state.max = parseInt(pr.value, 10);
      if (pv) pv.textContent = "Up to $" + state.max;
      applyFilters();
    });
    var si = document.getElementById("shopSearch");
    if (si) si.addEventListener("input", function(){ state.q = si.value.trim().toLowerCase(); applyFilters(); });
    var ss = document.getElementById("sortSel");
    if (ss) ss.addEventListener("change", function(){ state.sort = ss.value; applyFilters(); });
    var clr = document.getElementById("clearFilters");
    if (clr) clr.addEventListener("click", function(){
      state = { cats: [], max: 1200, q: "", sort: "featured" };
      document.querySelectorAll('.f-check input[data-cat]').forEach(function(x){ x.checked = false; });
      if (pr) pr.value = 1200; if (pv) pv.textContent = "Up to $1200";
      if (si) si.value = ""; if (ss) ss.value = "featured";
      applyFilters();
    });
    applyFilters();
  }

  /* ---------- product page ---------- */
  var qtyVal = 1;
  document.querySelectorAll(".qty button").forEach(function(b){
    if (b.hasAttribute("data-inc") || b.hasAttribute("data-dec")) return;
    b.addEventListener("click", function(){
      var span = b.parentElement.querySelector("span");
      qtyVal = parseInt(span.textContent, 10) || 1;
      qtyVal = b.classList.contains("qminus") ? Math.max(1, qtyVal - 1) : Math.min(9, qtyVal + 1);
      span.textContent = qtyVal;
    });
  });
  var buyBtn = document.getElementById("buyNow");
  if (buyBtn) buyBtn.addEventListener("click", function(){
    addToCart(buyBtn.getAttribute("data-slug"), qtyVal);
  });
  var wishBtn = document.getElementById("wishBtn");
  if (wishBtn) wishBtn.addEventListener("click", function(){
    toggleWish(wishBtn.getAttribute("data-slug"));
    var on = wishlist.indexOf(wishBtn.getAttribute("data-slug")) >= 0;
    wishBtn.innerHTML = (on ? "&#10084;" : "&#9825;") + " Wishlist";
    wishBtn.style.color = on ? "#ff4d24" : "";
  });
  document.querySelectorAll(".swatch").forEach(function(s){
    s.addEventListener("click", function(){
      s.parentElement.querySelectorAll(".swatch").forEach(function(x){ x.classList.remove("on"); });
      s.classList.add("on");
    });
  });
  document.querySelectorAll(".tab-btn").forEach(function(b){
    b.addEventListener("click", function(){
      document.querySelectorAll(".tab-btn").forEach(function(x){ x.classList.remove("on"); });
      document.querySelectorAll(".tab-panel").forEach(function(x){ x.classList.remove("on"); });
      b.classList.add("on");
      document.getElementById("tab-" + b.getAttribute("data-tab")).classList.add("on");
    });
  });

  /* ---------- countdown ---------- */
  var cd = document.getElementById("countdown");
  if (cd) {
    var end = Date.now() + 2 * 864e5 + 14 * 36e5 + 22 * 6e4;
    function pad(n){ return String(n).padStart(2, "0"); }
    function tick(){
      var d = Math.max(0, end - Date.now());
      var days = Math.floor(d / 864e5), hrs = Math.floor(d % 864e5 / 36e5),
          min = Math.floor(d % 36e5 / 6e4), sec = Math.floor(d % 6e4 / 1e3);
      cd.querySelector("[data-d]").textContent = pad(days);
      cd.querySelector("[data-h]").textContent = pad(hrs);
      cd.querySelector("[data-m]").textContent = pad(min);
      cd.querySelector("[data-s]").textContent = pad(sec);
    }
    tick(); setInterval(tick, 1000);
  }

  /* ---------- faq ---------- */
  document.querySelectorAll(".acc-item").forEach(function(item){
    var q = item.querySelector(".acc-q"); if (!q) return;
    q.addEventListener("click", function(){
      var was = item.classList.contains("open");
      item.parentElement.querySelectorAll(".acc-item.open").forEach(function(o){ o.classList.remove("open"); });
      if (!was) item.classList.add("open");
    });
  });

  /* ---------- nav / search / mobile ---------- */
  var burger = document.querySelector(".burger"), mnav = document.getElementById("mobileNav");
  if (burger && mnav) {
    burger.addEventListener("click", function(){ mnav.classList.add("open"); });
    mnav.querySelector(".mclose").addEventListener("click", function(){ mnav.classList.remove("open"); });
    mnav.querySelectorAll("a").forEach(function(a){ a.addEventListener("click", function(){ mnav.classList.remove("open"); }); });
  }
  document.querySelectorAll(".js-search-toggle").forEach(function(b){
    b.addEventListener("click", function(){
      document.querySelectorAll(".search-bar").forEach(function(s){ s.classList.toggle("open"); });
    });
  });
  document.querySelectorAll(".search-bar input").forEach(function(inp){
    inp.addEventListener("keydown", function(e){
      if (e.key === "Enter" && inp.value.trim()) {
        window.location.href = "shop.html?q=" + encodeURIComponent(inp.value.trim());
      }
    });
  });
  document.querySelectorAll(".js-cart-open").forEach(function(b){ b.addEventListener("click", openDrawer); });

  /* search param on shop page */
  var qs = new URLSearchParams(window.location.search).get("q");
  if (qs && document.getElementById("shopSearch")) {
    document.getElementById("shopSearch").value = qs;
    document.getElementById("shopSearch").dispatchEvent(new Event("input"));
  }

  /* ---------- checkout ---------- */
  var coForm = document.getElementById("checkoutForm");
  if (coForm) {
    if (!cartCount()) {
      coForm.innerHTML = '<div class="empty-state"><h3>Your cart is empty</h3><p>Add something before checking out.</p><br><a class="btn solid" href="shop.html">Browse Products</a></div>';
    } else {
      var lines = Object.entries(cart).map(function(kv){
        var p = findProduct(kv[0]);
        return '<div class="order-line"><span>' + p.name + ' <span class="oq">&times; ' + kv[1] + '</span></span><span>' + money(p.price * kv[1]) + '</span></div>';
      }).join("");
      var sub = cartTotal(), ship = sub >= 75 ? 0 : 9.95;
      document.getElementById("orderLines").innerHTML = lines +
        '<div class="order-line"><span>Shipping</span><span>' + (ship === 0 ? "FREE" : money(ship)) + '</span></div>' +
        '<div class="order-line" style="font-weight:800;font-size:1.05rem"><span>Total</span><span>' + money(sub + ship) + '</span></div>';
      document.getElementById("payTotal").textContent = money(sub + ship);
    }
    coForm.addEventListener("submit", function(e){
      e.preventDefault();
      var ok = true;
      coForm.querySelectorAll("[required]").forEach(function(f){
        var bad = !f.value.trim() || (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
        f.style.borderColor = bad ? "#b34444" : "";
        if (bad) ok = false;
      });
      if (!ok) { toast("Please complete the highlighted fields"); return; }
      var orderNo = "VE-" + Math.floor(100000 + Math.random() * 900000);
      write("voltedge_last_order", { no: orderNo, total: money(sub + (sub >= 75 ? 0 : 9.95)), email: coForm.querySelector('[name=email]').value });
      cart = {}; write("voltedge_cart", cart);
      window.location.href = "order-success.html";
    });
  }
  var ordNo = document.getElementById("orderNo");
  if (ordNo) {
    var last = read("voltedge_last_order", null);
    if (last) {
      ordNo.textContent = last.no;
      var oe = document.getElementById("orderEmail");
      if (oe) oe.textContent = last.email;
    }
  }

  /* ---------- forms ---------- */
  document.querySelectorAll("form.js-form").forEach(function(form){
    if (form.id === "checkoutForm") return;
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var ok = true;
      form.querySelectorAll("[required]").forEach(function(f){
        var bad = !f.value.trim() || (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
        f.style.borderColor = bad ? "#b34444" : "";
        if (bad) ok = false;
      });
      if (!ok) return;
      var s = form.querySelector(".form-success");
      if (s) s.hidden = false;
      form.querySelectorAll("input,textarea,select").forEach(function(f){ f.disabled = true; });
      var btn = form.querySelector("button[type=submit]"); if (btn) btn.disabled = true;
    });
  });

  /* ---------- reveal ---------- */
  function revealAll(root){
    (root || document).querySelectorAll(".reveal:not(.visible)").forEach(function(el){ el.classList.add("visible"); });
  }
  window.VOLTEDGE_REVEAL = revealAll;
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add("visible"); io.unobserve(e.target); } });
    }, { threshold: .08 });
    document.querySelectorAll(".reveal").forEach(function(el){ io.observe(el); });
    var mo = new MutationObserver(function(){ document.querySelectorAll(".reveal:not(.visible)").forEach(function(el){ io.observe(el); }); });
    mo.observe(document.body, { childList: true, subtree: true });
  } else revealAll(document);

  /* ---------- init ---------- */
  refreshBadges(); renderDrawer(); renderCartPage(); renderWishPage(); paintWishButtons();
  document.querySelectorAll(".js-year").forEach(function(el){ el.textContent = new Date().getFullYear(); });
})();
