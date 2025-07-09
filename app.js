window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".header");
    if (window.scrollY > 0) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const el = document.querySelector('.typewriter');
    const html = el.innerHTML;
    el.innerHTML = '';           
    let idx = 0;

    function type() {
        if (idx < html.length) {
            if (html[idx] === '<') {
                const close = html.indexOf('>', idx);
                el.innerHTML += html.slice(idx, close + 1);
                idx = close + 1;
            } else {
                el.innerHTML += html[idx++];
            }
            setTimeout(type, 20);
        } else {
            el.classList.add('typing-complete');
        }
    }

    const io = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                type();
                observer.unobserve(el);
            }
        });
    }, {
        threshold: 0.1
    });

    io.observe(el);
});


document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,   
    rootMargin: '0px 0px -50px 0px'  
  });

  document.querySelectorAll('.fade-in')
    .forEach(el => observer.observe(el));
});
