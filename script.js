(function() {
  var line = "Welcome! I'm a bit of a writer, photographer, but a BIG Paramore fan :D";
  var say = document.getElementById('say');
  
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    say.textContent = line;
  } else {
    var i = 0;
    var cur = '<span class="cursor" aria-hidden="true"></span>';
    (function tick() {
      say.innerHTML = line.slice(0, i) + cur;
      if (i++ < line.length) setTimeout(tick, 30);
    })();
  }

  var cal = document.getElementById('cal');
  if (cal) {
    for (var d = 1; d <= 31; d++) {
      var c = document.createElement('span');
      c.textContent = d === 20 ? '🎁' : d;
      if (d === 20) {
        c.className = 'bday';
        c.title = 'Birthday';
      }
      cal.appendChild(c);
    }
  }








  var gift = cal && cal.querySelector('.bday');
  if (gift) {
    var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var clicks = 0, resetT = null, opened = 0;
    var TRIGGER = 4; 
    
    gift.setAttribute('role', 'button');
    gift.setAttribute('tabindex', '0');
    gift.setAttribute('aria-label', 'Birthday gift');

  
    var ac;
    function tone(freq, start, dur) {
      try {
        ac = ac || new (window.AudioContext || window.webkitAudioContext)();
        if (ac.state === 'suspended') ac.resume();
        var o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + start;
        o.type = 'square';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.04, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g);
        g.connect(ac.destination);
        o.start(t);
        o.stop(t + dur + 0.02);
      } catch (e) {}
    }
    function jingle(notes) {
      notes.forEach(function(n, i) { tone(n, i * 0.1, 0.14); });
    }


    function confetti(n) {
      if (calm) return;
      var host = document.createElement('div');
      host.className = 'confetti';
      host.setAttribute('aria-hidden', 'true');
      var bits = ['🎂', '🎸', '📷', '🍫', '✨', '🎉', '♡'];
      var cols = ['#ffd36b', '#4da3ff', '#ff6b8b', '#5aa96a', '#c08bff', '#ffffff'];
      for (var i = 0; i < n; i++) {
        var s = document.createElement('i');
        if (Math.random() < 0.3) s.textContent = bits[Math.floor(Math.random() * bits.length)];
        else s.style.background = cols[Math.floor(Math.random() * cols.length)];
        s.style.left = Math.random() * 100 + 'vw';
        s.style.setProperty('--dx', (Math.random() * 200 - 100) + 'px');
        s.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
        s.style.animationDuration = (2 + Math.random() * 2) + 's';
        s.style.animationDelay = (Math.random() * 0.5) + 's';
        host.appendChild(s);
      }
      document.body.appendChild(host);
      setTimeout(function() { host.remove(); }, 5000);
    }

    function daysToBday() {
      var now = new Date();
      var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      var b = new Date(now.getFullYear(), 11, 20);
      if (b < today) b = new Date(now.getFullYear() + 1, 11, 20);
      return Math.round((b - today) / 86400000);
    }


    function script(days, again) {
      var intro = again
        ? "Binuksan mo na 'to kanina, e. Wala nang laman. Napunta na lahat sakin. Balik ka na lang sa Dec 20. 😌"
        : "Aba, curiois ah"
      var count;
      if (days === 0) {
        count = "YAY, birthday ko na! 🎉";
      } else if (days === 1) {
        count = "Bukas na birthday ko.";
      } else {
        count = "Wala 'tong laman na pera, sorry 😭 Pero may countdown: " + days + " days na lang bago Dec 20" +
          (days >= 14 ? " — halos " + (days / 28).toFixed(1) + " Stardew seasons. May finals pa, so good luck sa atin." : ".");
      }
      var side = "While waiting, you could do this";
      return again ? [intro, side] : [intro, count, side];
    }

    var bundle = [
      { icon: '💬', name: 'Bumati', note: "Kahit 'hbd' lang, valid na 'yan." },
      { icon: '🍫', name: 'Chocolates', note: "Any brand. Di naman ako choosey" },
      { icon: '🍗', name: 'Sisig', note: "Extra sili. Then inasal na may toyo, sili, at kalamansi." }
    ];
    var got = [false, false, false];
    var heartsFor = [0, 4, 7, 10];

    function openEgg() {
      if (document.querySelector('.egg')) return;
      var again = opened++ > 0;
      var lines = script(daysToBday(), again);
      var page = 0, timer = null, typing = false;
      var prevFocus = document.activeElement;

      var egg = document.createElement('div');
      egg.className = 'egg';
      egg.innerHTML =
        '<div class="egg-box" role="dialog" aria-modal="true" aria-labelledby="egg-title">' +
          '<button type="button" class="egg-x" aria-label="Close">✕</button>' +
          '<h2 id="egg-title">🎁 Birthday Event</h2>' +
          '<div class="egg-item"><span class="slot">🎂</span>' +
            '<div><b>Birthday Wish</b> ×1<br><span class="iri">★ Iridium quality</span></div></div>' +
          '<p class="egg-say" aria-live="polite"></p>' +
          '<div class="egg-bundle" hidden>' +
            '<h3>Birthday Bundle</h3>' +
            '<div class="slots"></div>' +
            '<p class="hearts" aria-live="polite"></p>' +
            '<p class="reward" hidden><b class="iri">★</b> Bundle Complete! Reward: 1x Good Vibes (Iridium quality). ' +
            'Thank you for spending some time on my little website. Kung may isang trabaho man ako na gusto ko talagang gawin, that would be building and designing websites ♡</p>' +
          '</div>' +
          '<div class="egg-actions"><button type="button" class="egg-next">Next ▶</button></div>' +
        '</div>';
      document.body.appendChild(egg);
      document.body.style.overflow = 'hidden';

      var sayEl = egg.querySelector('.egg-say');
      var next = egg.querySelector('.egg-next');
      var bundleEl = egg.querySelector('.egg-bundle');
      var slotsEl = egg.querySelector('.slots');
      var heartsEl = egg.querySelector('.hearts');
      var rewardEl = egg.querySelector('.reward');

      function update(celebrate) {
        var n = got.filter(Boolean).length;
        var k = heartsFor[n];
        heartsEl.textContent = 'Friendship ' + k + '/10\n' + '♥'.repeat(k) + '♡'.repeat(10 - k);
        Array.prototype.forEach.call(slotsEl.children, function(el, i) {
          el.setAttribute('aria-pressed', String(got[i]));
          el.classList.toggle('on', got[i]);
        });
        rewardEl.hidden = n < 3;
        if (celebrate && n === 3) {
          jingle([523, 659, 784, 1047, 1319, 1047, 1319, 1568]);
          confetti(60);
        }
      }

      bundle.forEach(function(b, i) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'bslot';
        btn.innerHTML = '<span class="slot">' + b.icon + '</span><span class="bname">' + b.name +
          '</span><span class="bnote">' + b.note + '</span>';
        btn.addEventListener('click', function() {
          got[i] = !got[i];
          if (got[i]) tone(784, 0, 0.12);
          update(true);
        });
        slotsEl.appendChild(btn);
      });
      update(false);

      function typeText(txt) {
        clearInterval(timer);
        sayEl.textContent = '';
        if (calm) { sayEl.textContent = txt; typing = false; return; }
        var chars = Array.from(txt), i = 0;
        typing = true;
        timer = setInterval(function() {
          i++;
          sayEl.textContent = chars.slice(0, i).join('');
          if (i >= chars.length) { clearInterval(timer); typing = false; }
        }, 22);
      }

      function show() {
        var last = page === lines.length - 1;
        bundleEl.hidden = !last;
        next.textContent = last ? 'Close ✕' : 'Next ▶';
        typeText(lines[page]);
      }

      function close() {
        clearInterval(timer);
        document.removeEventListener('keydown', onKey);
        egg.remove();
        document.body.style.overflow = '';
        if (prevFocus && prevFocus.focus) prevFocus.focus();
      }

      function onKey(e) {
        if (e.key === 'Escape') { close(); return; }
        if (e.key !== 'Tab') return;
        var f = egg.querySelectorAll('button');
        if (!f.length) return;
        var first = f[0], lastEl = f[f.length - 1];
        if (!egg.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
        else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
      }

      next.addEventListener('click', function() {
        if (typing) {
          clearInterval(timer);
          sayEl.textContent = lines[page];
          typing = false;
          return;
        }
        if (page >= lines.length - 1) { close(); return; }
        page++;
        tone(659, 0, 0.08);
        show();
      });
      egg.querySelector('.egg-x').addEventListener('click', close);
      egg.addEventListener('click', function(e) { if (e.target === egg) close(); });
      document.addEventListener('keydown', onKey);

      show();
      next.focus();
    }

    function onGift() {
      clicks++;
      clearTimeout(resetT);
      resetT = setTimeout(function() { clicks = 0; }, 1500);
      if (clicks < TRIGGER) return; 
      clicks = 0;
      clearTimeout(resetT);
      if (!calm) {
        var w = document.querySelector('.wrap');
        w.classList.add('shake');
        setTimeout(function() { w.classList.remove('shake'); }, 600);
      }
      jingle([523, 659, 784, 1047, 784, 1047]);
      confetti(48);
      openEgg();
    }

    gift.addEventListener('click', onGift);
    gift.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onGift(); }
    });
  }

  var root = document.documentElement;
  document.getElementById('mode').addEventListener('click', function() {
    root.setAttribute('data-theme', root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
  });


  function route() {
    var hash = location.hash.slice(1);
    var el = document.getElementById("v-" + hash);
    
    document.querySelectorAll(".view").forEach(function(v) {
      v.classList.toggle("on", v === el);
    });
    
    document.body.classList.toggle("pg", !!el);
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', route);
  route();
})();
