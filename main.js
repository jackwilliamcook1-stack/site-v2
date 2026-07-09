/* Scroll-reveal + dynamic animations */
(function(){
  var els = document.querySelectorAll('.reveal, .stagger');

  /* Fallback: no IntersectionObserver → show everything immediately */
  if (!els.length || !('IntersectionObserver' in window)){
    if (els.length) els.forEach(function(el){ el.classList.add('in-view'); });
    return;
  }

  /* --- Prepare bar fills (store target, set to 0) --- */
  document.querySelectorAll('.bar-fill').forEach(function(bar){
    bar.dataset.w = bar.style.width;
    bar.style.width = '0';
  });

  /* --- Prepare stat counters --- */
  document.querySelectorAll('.stagger .n').forEach(function(num){
    var text = num.textContent.trim();
    var m = text.match(/(.*?)([\d,.]+)(.*)/);
    if (m){
      num.dataset.prefix = m[1];
      num.dataset.val = m[2];
      num.dataset.suffix = m[3];
      num.dataset.full = text;
      num.textContent = m[1] + '0' + m[3];
    }
  });

  /* --- Observer --- */
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');

        /* Animate bar fills with stagger */
        var bars = entry.target.querySelectorAll('.bar-fill[data-w]');
        bars.forEach(function(bar, i){
          setTimeout(function(){ bar.style.width = bar.dataset.w; }, i * 100);
        });

        /* Animate stat counters */
        var nums = entry.target.querySelectorAll('.n[data-val]');
        nums.forEach(function(el, i){
          setTimeout(function(){ countUp(el); }, i * 100);
        });

        observer.unobserve(entry.target);
      }
    });
  },{ threshold:0.08, rootMargin:'0px 0px -50px 0px' });

  els.forEach(function(el){ observer.observe(el); });

  /* --- Count-up animation --- */
  function countUp(el){
    var raw = el.dataset.val;
    var target = parseFloat(raw.replace(/,/g, ''));
    var hasComma = raw.indexOf(',') > -1;
    var hasDecimal = raw.indexOf('.') > -1;
    var decimals = hasDecimal ? raw.split('.')[1].length : 0;
    var prefix = el.dataset.prefix;
    var suffix = el.dataset.suffix;
    var dur = 900;
    var t0 = performance.now();

    (function tick(now){
      var p = Math.min((now - t0) / dur, 1);
      p = 1 - Math.pow(1 - p, 3); /* ease-out cubic */
      var v = p * target;
      var s;
      if (hasDecimal){
        s = v.toFixed(decimals);
      } else {
        s = String(Math.round(v));
        if (hasComma) s = Number(s).toLocaleString();
      }
      el.textContent = prefix + s + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = el.dataset.full;
    })(t0);
  }
})();
