/* ============================================================
   МЕМЧИКИ ЗА РЕЗУЛЬТАТ ТЕСТУ
   Підключається в кінці тесту одним рядком перед </body>:
       <script src="memes.js"></script>
   Сам нічого в тесті не змінює: чекає, поки з'явиться екран
   «результат» (.done-screen), і додає під кільцем із балами мемчик
   відповідно до відсотка правильних відповідей.
   Картинки лежать у папці memes/ поруч із цим файлом.
   ============================================================ */
(function () {
  // true — додати під мемчиком коротку підписку; false — лише картинка
  var SHOW_CAPTION = true;

  // Рівні за відсотком правильних відповідей (від найвищого до найнижчого)
  var TIERS = [
    { min: 90, files: ["a1.jpg", "a2.jpg", "a3.jpg", "a4.jpg", "a5.jpg", "a6.jpg", "a7.jpg", "a8.jpg", "a9.jpg", "a10.jpg"],
      captions: ["Бездоганно! 🔥", "Так тримати!", "Ось це результат!"] },
    { min: 75, files: ["b1.jpg", "b2.jpg", "b3.jpg", "b4.jpg", "b5.jpg", "b6.jpg", "b7.jpg", "b8.jpg", "b9.jpg", "b10.jpg"],
      captions: ["Дуже добре!", "Майже ідеально!", "Гарний результат!"] },
    { min: 55, files: ["c1.jpg", "c2.jpg", "c3.jpg", "c4.jpg", "c5.jpg", "c6.jpg", "c7.jpg", "c8.jpg", "c9.jpg", "c10.jpg", "c11.jpg", "c12.jpg"],
      captions: ["Непогано, але є що підтягнути", "Ще трохи — і буде краще", "Потрібно ще трішки практики"] },
    { min: 35, files: ["d1.jpg", "d2.jpg", "d3.jpg", "d4.jpg", "d5.jpg", "d6.jpg", "d7.jpg", "d8.jpg", "d9.jpg", "d10.jpg", "d11.jpg"],
      captions: ["Тема ще потребує повторення", "Не здавайся — повтори й спробуй ще", "Є над чим попрацювати"] },
    { min: 0, files: ["e1.jpg", "e2.jpg", "e3.jpg", "e4.jpg", "e5.jpg", "e6.jpg", "e7.jpg", "e8.jpg", "e9.jpg", "e10.jpg", "e11.jpg", "e12.jpg", "e13.jpg", "e14.jpg", "e15.jpg", "e16.jpg"],
      captions: ["Нічого, наступного разу вийде краще 💪", "Повтори урок і спробуй ще раз", "Починаємо спочатку — у тебе вийде!"] }
  ];

  var script = document.currentScript;
  var BASE = (script && script.src) ? script.src.replace(/[^\/]*$/, "") : "";

  function pick(arr, avoid) {
    if (arr.length === 1) return arr[0];
    var item;
    var guard = 0;
    do { item = arr[Math.floor(Math.random() * arr.length)]; guard++; }
    while (item === avoid && guard < 10);
    return item;
  }

  function lastShown() {
    try { return localStorage.getItem("lastResultMeme") || ""; } catch (e) { return ""; }
  }
  function rememberShown(f) {
    try { localStorage.setItem("lastResultMeme", f); } catch (e) {}
  }

  // Щоб при перемальовуванні екрана мемчик не мінявся, запам'ятовуємо вибір для даного результату
  var chosen = { key: "", file: "", caption: "" };

  function addStyles() {
    if (document.getElementById("resultMemeStyles")) return;
    var st = document.createElement("style");
    st.id = "resultMemeStyles";
    st.textContent =
      ".result-meme{margin:4px auto 14px;text-align:center;animation:memePop .45s cubic-bezier(.34,1.56,.64,1);}" +
      ".result-meme img{display:block;margin:0 auto;max-width:min(260px,70vw);max-height:260px;width:auto;height:auto;" +
      "border-radius:20px;box-shadow:0 14px 30px -18px rgba(19,33,59,.5);background:#fff;}" +
      ".result-meme .meme-cap{margin-top:10px;font-family:'Manrope',sans-serif;font-weight:800;font-size:14px;color:#13213B;}" +
      "@keyframes memePop{from{opacity:0;transform:scale(.85) translateY(8px);}to{opacity:1;transform:none;}}";
    document.head.appendChild(st);
  }

  function tierFor(percent) {
    for (var i = 0; i < TIERS.length; i++) {
      if (percent >= TIERS[i].min) return TIERS[i];
    }
    return TIERS[TIERS.length - 1];
  }

  function tryInsert() {
    // Сторінка «розбір відповідей» для вчителя — мемчик не потрібен
    if (document.querySelector(".review-banner.show")) return;

    var done = document.querySelector(".done-screen");
    if (!done || done.querySelector(".result-meme")) return;

    var big = done.querySelector(".big");
    var m = big && big.textContent.match(/(\d+)\s*\/\s*(\d+)/);
    if (!m) return;
    var correct = parseInt(m[1], 10), answered = parseInt(m[2], 10);
    if (!answered) return;

    var key = correct + "/" + answered;
    if (chosen.key !== key) {
      var tier = tierFor(Math.round(correct / answered * 100));
      var file = pick(tier.files, lastShown());
      chosen = { key: key, file: file, caption: pick(tier.captions, "") };
      rememberShown(file);
    }

    addStyles();
    var box = document.createElement("div");
    box.className = "result-meme";
    var img = new Image();
    img.alt = "";
    img.onerror = function () { box.remove(); };
    img.src = BASE + "memes/" + chosen.file;
    box.appendChild(img);
    if (SHOW_CAPTION) {
      var cap = document.createElement("div");
      cap.className = "meme-cap";
      cap.textContent = chosen.caption;
      box.appendChild(cap);
    }

    var ring = done.querySelector(".ring");
    if (ring && ring.parentNode) ring.parentNode.insertBefore(box, ring.nextSibling);
    else done.insertBefore(box, done.firstChild);
  }

  function start() {
    tryInsert();
    new MutationObserver(tryInsert).observe(document.body, { childList: true, subtree: true });
  }

  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start);
})();
