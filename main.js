/* Scroll-reveal animations */
(function(){
  var els = document.querySelectorAll('.reveal, .stagger');
  if (!els.length) return;

  /* Fallback: no IntersectionObserver → show everything */
  if (!('IntersectionObserver' in window)){
    els.forEach(function(el){ el.classList.add('in-view'); });
    return;
  }

  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },{ threshold:0.08, rootMargin:'0px 0px -50px 0px' });

  els.forEach(function(el){ observer.observe(el); });
})();
