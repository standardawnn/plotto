/* Briefing/project home: notifications (bell) and My page (profile icon). Plain overlay screens that stack. */
(function () {
  if (window.__plottoExtra) return; window.__plottoExtra = true;
  var css = document.createElement('style');
  css.textContent = [
    '.px-screen{position:fixed;left:0;top:0;width:100%;height:100vh;height:100lvh;z-index:200;background:#f4f7fd;font-family:Pretendard,sans-serif;color:#354052;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .28s cubic-bezier(.22,.8,.25,1)}',
    '.px-screen.in{transform:none}',
    '.px-screen *{box-sizing:border-box}',
    '.px-head{flex:none;display:flex;align-items:center;gap:8px;padding:calc(env(safe-area-inset-top,0px) + 10px) 12px 10px;background:#f4f7fd}',
    '.px-back{width:40px;height:40px;border:0;background:none;display:grid;place-items:center;padding:0;color:#354052}',
    '.px-title{font-size:18px;font-weight:600;line-height:26px;letter-spacing:-.2px}',
    '.px-body{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch}',
    '.px-body::-webkit-scrollbar{display:none}',
    '.px-pad{padding:4px 20px calc(env(safe-area-inset-bottom,0px) + 36px)}',
    '.px-pad.cta{padding-bottom:calc(env(safe-area-inset-bottom,0px) + 110px)}',
    '.px-sec{font-size:13px;font-weight:600;color:#929aaa;margin:22px 4px 8px}',
    '.px-h{font-size:17px;font-weight:600;color:#070055;line-height:24px;margin:24px 2px 10px}',
    '.px-h:first-child{margin-top:8px}',
    '.px-ava{flex:none;width:52px;height:52px;border-radius:50%;background:#eceaff;display:grid;place-items:center;overflow:hidden}',
    '.px-ava img{width:40px;height:40px;object-fit:contain}',
    '.px-ava.b{background:#dfe8ff}.px-ava.p{background:#f1e3ff}.px-ava.m{background:#ddf4ee}.px-ava.y{background:#fff0d9}',
    '.px-list{background:#fff;border-radius:22px;box-shadow:0 0 5px rgba(0,0,0,.08);overflow:hidden}',
    '.px-row{display:flex;align-items:center;gap:14px;width:100%;border:0;background:none;text-align:left;padding:17px 18px;font:500 16px Pretendard,sans-serif;color:#070055}',
    '.px-row+.px-row{border-top:1px solid #eef0f6}',
    '.px-menu{background:none;box-shadow:none;border-radius:0;overflow:visible;display:flex;flex-direction:column;gap:12px}',
    '.px-menu .px-row{background:#fff;border-radius:22px;box-shadow:0 0 5px rgba(0,0,0,.08);padding:20px 18px}',
    '.px-menu .px-row+.px-row{border-top:0}',
    '.px-row .nm{flex:1}',
    '.px-row .v{font-size:13.5px;font-weight:400;color:#929aaa}',
    '.px-row svg.ic{flex:none;color:#536ffa}',
    '.px-row svg.ch{flex:none;color:#b4b9c5}',
    '.px-cta{position:absolute;left:0;right:0;bottom:0;padding:14px 20px calc(env(safe-area-inset-bottom,0px) + 16px);background:linear-gradient(rgba(244,247,253,0),#f4f7fd 28%)}',
    '.px-btn{display:block;width:100%;height:54px;border:0;border-radius:14px;background:#536ffa;color:#fff;font:600 16px Pretendard,sans-serif}',
    '.px-btn:disabled{background:#c9cfe8}',
    '.px-btn.ghost{background:#fff;color:#536ffa;box-shadow:inset 0 0 0 1.5px #c7cffd}',
    '.px-btn.danger{background:#fff;color:#e5483a;box-shadow:inset 0 0 0 1.5px #f3cfca}',
    '.px-chips{display:flex;gap:8px;flex-wrap:wrap}',
    '.px-chip{border:1.5px solid #c2c5cf;background:#ebedf6;border-radius:23px;padding:7px 14px;font:500 14px Pretendard,sans-serif;color:#000;white-space:nowrap}',
    '.px-chip.on{background:rgba(83,111,250,.2);border-color:#536ffa}',
    '.px-field{width:100%;border:1.5px solid #dcdff0;border-radius:14px;background:#fff;padding:13px 14px;font:500 16px Pretendard,sans-serif;color:#070055;outline:none}',
    '.px-field:focus{border-color:#536ffa}',
    'textarea.px-field{min-height:110px;resize:none;line-height:1.5}',
    '.px-toast{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 100px);transform:translate(-50%,20px);opacity:0;background:#1c1a3c;color:#fff;font:500 14px Pretendard,sans-serif;border-radius:20px;padding:10px 18px;transition:all .25s;z-index:400;white-space:nowrap}',
    '.px-toast.on{opacity:1;transform:translate(-50%,0)}',
    '.px-sw{width:46px;height:28px;border-radius:14px;background:#d3d7e6;position:relative;flex:none;border:0;padding:0;transition:background .2s}',
    '.px-sw:after{content:"";position:absolute;left:3px;top:3px;width:22px;height:22px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.2)}',
    '.px-sw.on{background:#536ffa}.px-sw.on:after{transform:translateX(18px)}',
    '@keyframes px-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}',
    '.px-banner{position:relative;margin:6px 0 4px;border-radius:24px;background:linear-gradient(135deg,#e4e1fb,#d5dcff);padding:18px 130px 18px 20px;min-height:96px}',
    '.px-banner b{display:block;font-size:17px;line-height:25px;color:#070055}',
    '.px-banner span{display:block;font-size:12.5px;color:#6b72a6;margin-top:2px}',
    '.px-banner img{position:absolute;right:10px;bottom:6px;width:112px;height:auto;animation:px-bob 2.6s ease-in-out infinite}',
    '.px-item{position:relative;display:flex;gap:12px;align-items:center;background:#fff;border-radius:20px;padding:12px 14px 12px 12px;margin-bottom:8px;box-shadow:0 0 5px rgba(0,0,0,.08)}',
    '.px-item.new{box-shadow:0 0 0 1.5px #bebfff,0 0 8px rgba(83,111,250,.12)}',
    '.px-txt{flex:1;min-width:0}',
    '.px-main{font-size:14.5px;font-weight:500;line-height:21px;color:#070055}',
    '.px-main b{font-weight:700;color:#536ffa}',
    '.px-sub{font-size:12.5px;line-height:18px;color:#929aaa;margin-top:2px}',
    '.px-dot{position:absolute;right:14px;top:14px;width:9px;height:9px;border-radius:50%;background:#ff5a3c;box-shadow:0 0 0 3px #fff}',
    '.px-end{text-align:center;padding:22px 0 6px;color:#9aa1b4;font-size:13px}',
    '.px-end img{display:block;margin:0 auto 6px;width:96px;height:auto;animation:px-bob 3s ease-in-out infinite}',
    '.px-hbtn{margin-left:auto;border:0;background:none;color:#536ffa;font:600 14px Pretendard,sans-serif;padding:8px 10px}',
    '.px-hbtn:disabled{color:#b4b9c5}',
    '.px-screen.purple .px-head{background:#3550d4}',
    '.px-screen.purple .px-pad{padding-top:0}',
    '.px-screen.purple .px-title,.px-screen.purple .px-back{color:#fff}',
    '.px-top{display:flex;align-items:center;gap:6px;margin:0 -20px;padding:0 20px 24px 14px;background:linear-gradient(#3550d4,#8da0ff);border-radius:0 0 36px 36px}',
    '.px-pl{position:relative;flex:none;width:128px;height:134px;margin-top:-2px}',
    '.px-pl img{position:absolute;display:block;transition:opacity .3s}',
    '.px-pl .b{left:0;top:0;width:100%;height:100%}',
    '.px-pl .tb,.px-pl .tf{left:0;top:0;width:100%;height:100%;transform-origin:72% 22%;animation:px-sway 2.8s ease-in-out infinite}',
    '.px-pl .tf{animation-delay:-.5s;animation-duration:3.1s}',
    '.px-pl .eye{top:41.87%;width:9.7%;height:13.96%;transform-origin:50% 50%;animation:px-blink 4.6s infinite}',
    '.px-pl .e0{left:33.86%}.px-pl .e1{left:60.87%;animation-delay:.02s}',
    '.px-pl .file{left:-12%;top:-8%;width:128%;height:auto;opacity:0}',
    '.px-pl.has .tb,.px-pl.has .tf,.px-pl.has .b,.px-pl.has .eye{opacity:0}',
    '.px-pl.has .file{opacity:1}',
    '@keyframes px-sway{0%,100%{transform:rotate(-3.5deg)}50%{transform:rotate(4deg)}}',
    '@keyframes px-blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.06)}}',
    '.px-bubble{position:relative;flex:1;background:#fff;border-radius:18px;padding:12px 14px;font-size:14px;line-height:21px;color:#354052;box-shadow:0 4px 14px rgba(20,30,120,.18)}',
    '.px-bubble b{display:block;font-size:15px;color:#070055;margin-bottom:2px}',
    '.px-bubble:before{content:"";position:absolute;left:-7px;top:50%;margin-top:-7px;width:14px;height:14px;background:#fff;transform:rotate(45deg);border-radius:3px}',
    '.px-hero{text-align:center;padding:2px 0 0;margin-bottom:-26px;position:relative;z-index:1}',
    '.px-hero img{width:190px;height:auto;animation:px-bob 2.8s ease-in-out infinite;filter:drop-shadow(0 8px 14px rgba(83,111,250,.22))}',
    '.px-say{background:#fff;border-radius:24px;box-shadow:0 0 5px rgba(0,0,0,.08);padding:14px;margin-top:12px}',
    '.px-say .tabs{display:flex;gap:6px;margin-bottom:10px}',
    '.px-say .tab{border:0;background:#eef0f8;color:#7c8494;border-radius:16px;padding:6px 12px;font:600 13px Pretendard,sans-serif}',
    '.px-say .tab.on{background:rgba(83,111,250,.14);color:#536ffa}',
    '.px-say .box{display:flex;align-items:flex-end;gap:8px;background:#f4f7fd;border-radius:18px;padding:8px 8px 8px 14px}',
    '.px-say textarea{flex:1;border:0;outline:none;background:transparent;resize:none;font:500 16px/22px Pretendard,sans-serif;color:#070055;height:44px;padding:2px 0}',
    '.px-say .send{flex:none;width:38px;height:38px;border:0;border-radius:50%;background:#536ffa;display:grid;place-items:center;color:#fff}',
    '.px-say .send:disabled{background:#c9cfe8}',
    '.px-say .reply{display:flex;align-items:center;gap:10px;margin-top:10px;background:rgba(83,111,250,.08);border-radius:16px;padding:8px 12px;font-size:13.5px;line-height:20px;color:#354052}',
    '.px-say .reply img{width:44px;height:auto;flex:none}',
    '.px-me{display:flex;align-items:center;gap:14px;background:#fff;border-radius:24px;box-shadow:0 0 5px rgba(0,0,0,.08);padding:16px;margin-top:6px}',
    '.px-me .px-ava{width:64px;height:64px}.px-me .px-ava img{width:50px;height:50px}',
    '.px-me b{display:block;font-size:19px;color:#070055;line-height:26px}',
    '.px-me small{display:block;font-size:13px;color:#7c8494;margin-top:1px}',
    '.px-ask{display:flex;align-items:center;gap:12px;width:100%;margin-top:12px;border:0;text-align:left;background:linear-gradient(135deg,#2540c7,#8da0ff);border-radius:24px;padding:16px 8px 16px 20px;color:#fff}',
    '.px-ask .t{flex:1}',
    '.px-ask b{display:block;font-size:17px;line-height:24px}',
    '.px-ask small{display:block;font-size:12.5px;opacity:.88;margin-top:2px;line-height:18px}',
    '.px-ask img{width:84px;height:auto;margin:-22px 4px -4px 0;animation:px-bob 3s ease-in-out infinite;filter:drop-shadow(0 4px 8px rgba(20,30,120,.25))}',
    '.px-ver{text-align:center;font-size:12px;color:#b4b9c5;margin-top:22px}',
    '.px-types{display:grid;grid-template-columns:1fr 1fr;gap:10px}',
    '.px-type{display:flex;align-items:center;gap:10px;border:1.5px solid transparent;background:#fff;border-radius:18px;box-shadow:0 0 5px rgba(0,0,0,.08);padding:12px;text-align:left;font:600 15px Pretendard,sans-serif;color:#070055}',
    '.px-type.on{border-color:#536ffa;background:rgba(83,111,250,.08)}',
    '.px-type .px-ava{width:42px;height:42px}.px-type .px-ava img{width:32px;height:32px}',
    '.px-type small{display:block;font-size:11.5px;font-weight:400;color:#929aaa;margin-top:1px}',
    '.px-done{text-align:center;padding:30px 4px 0}',
    '.px-done img{width:120px;height:auto;animation:px-bob 2.8s ease-in-out infinite}',
    '.px-done h2{margin:10px 0 4px;font-size:21px;color:#070055}',
    '.px-done p{margin:0 0 20px;font-size:14px;color:#7c8494;line-height:21px}',
    '.px-sum{background:#fff;border-radius:20px;box-shadow:0 0 5px rgba(0,0,0,.08);padding:6px 18px;text-align:left;margin-bottom:18px}',
    '.px-sum div{display:flex;justify-content:space-between;gap:12px;padding:12px 0;font-size:14.5px;color:#070055}',
    '.px-sum div+div{border-top:1px solid #eef0f6}',
    '.px-sum span{color:#929aaa}',
    '.px-sum b{font-weight:600;text-align:right}',
    '.px-avas{display:flex;gap:10px;flex-wrap:wrap}',
    '.px-avas button{border:2px solid transparent;border-radius:50%;padding:0;background:none}',
    '.px-avas button.on{border-color:#536ffa}',
    '.px-avas .px-ava{width:62px;height:62px}.px-avas .px-ava img{width:48px;height:48px}',
    '.px-lbl{font-size:13px;font-weight:600;color:#7c8494;margin:18px 2px 8px}',
    '.px-proj{background:#fff;border-radius:20px;box-shadow:0 0 5px rgba(0,0,0,.08);padding:14px 16px;margin-bottom:8px}',
    '.px-proj .top{display:flex;align-items:center;justify-content:space-between;gap:10px}',
    '.px-proj b{font-size:15.5px;color:#070055}',
    '.px-proj small{display:block;font-size:12.5px;color:#929aaa;margin-top:3px}',
    '.px-proj .st{flex:none;font-size:12px;font-weight:600;color:#536ffa;background:rgba(83,111,250,.12);border-radius:12px;padding:4px 9px}',
    '.px-proj .st.done{color:#2f9e82;background:rgba(79,168,150,.15)}',
    '.px-proj .bar{height:6px;border-radius:3px;background:#e7eaf7;margin-top:10px;overflow:hidden}',
    '.px-proj .bar i{display:block;height:100%;border-radius:3px;background:linear-gradient(90deg,#8da0ff,#536ffa)}'
  ].join('');
  document.head.appendChild(css);

  var BACK = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M16.136 3.363a.9.9 0 0 1 0 1.273L8.773 12l7.363 7.363a.9.9 0 1 1-1.272 1.273l-8-8a.9.9 0 0 1 0-1.273l8-8a.9.9 0 0 1 1.272 0Z" fill="currentColor"/></svg>';
  var CHEV = '<svg class="ch" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICONS = {
    user: '<svg class="ic" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4.5 20c.8-3.6 3.8-5.5 7.5-5.5s6.7 1.9 7.5 5.5"/></svg>',
    gear: '<svg class="ic" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/></svg>',
    hist: '<svg class="ic" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v4h4"/><path d="M12 8v4l3 2"/></svg>'
  };
  var stack = [];
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function img(n) { return '<img alt="" src="/extra/' + n + '.png">'; }
  function nick() { try { return localStorage.getItem('plotto-nickname') || '서연'; } catch (e) { return '서연'; } }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem('plotto-' + k); localStorage.setItem('plotto-' + k, v); } catch (e) { return null; } }
  function toast(msg) {
    var t = el('div', 'px-toast', msg); document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('on'); });
    setTimeout(function () { t.classList.remove('on'); setTimeout(function () { t.remove(); }, 300); }, 1800);
  }
  function closeTop() {
    var s = stack.pop(); if (!s) return;
    s.classList.remove('in'); setTimeout(function () { s.remove(); }, 300);
  }
  /* Each overlay is a history entry (window.history.state.pxLayer = how many are open), so the in-app back
     and the browser back both close the top overlay first and never skip past it. */
  function pop() {
    /* close the overlay in place. history.back() could land on an earlier page of the onboarding (the splash) */
    if (!stack.length) return;
    var st = window.history.state || {};
    closeTop();
    if (st.pxLayer) { try { window.history.replaceState(Object.assign({}, st, { pxLayer: stack.length }), ''); } catch (e) { /* ignore */ } }
  }
  addEventListener('popstate', function () {
    var want = (window.history.state && window.history.state.pxLayer) || 0;
    while (stack.length > want) closeTop();
  });
  function push(title, bodyHtml, cta) {
    var s = el('div', 'px-screen'), hd = el('div', 'px-head'), b = el('button', 'px-back', BACK);
    b.setAttribute('aria-label', '뒤로'); b.type = 'button';
    hd.appendChild(b); hd.appendChild(el('div', 'px-title', title));
    var c = el('div', 'px-body'); c.innerHTML = '<div class="px-pad' + (cta ? ' cta' : '') + '">' + bodyHtml + '</div>';
    s.appendChild(hd); s.appendChild(c);
    if (cta) s.appendChild(el('div', 'px-cta', cta));
    document.body.appendChild(s); stack.push(s);
    try { window.history.pushState(Object.assign({}, window.history.state || {}, { pxLayer: stack.length }), ''); } catch (e) { /* ignore */ } /* window.: this file has its own history() screen */
    requestAnimationFrame(function () { requestAnimationFrame(function () { s.classList.add('in'); }); });
    b.onclick = function () { pop(); };
    return { s: s, c: c, hd: hd };
  }
  function item(av, cls, main, sub, isNew) {
    return '<div class="px-item' + (isNew ? ' new' : '') + '"><div class="px-ava ' + cls + '">' + img(av) + '</div><div class="px-txt"><div class="px-main">' + main + '</div><div class="px-sub">' + sub + '</div></div>' + (isNew ? '<span class="px-dot"></span>' : '') + '</div>';
  }

  /* merge: '모두 읽음' also marks the work status notifications read (src/workStatus.ts, sessionStorage), so the home bell dot follows */
  function markWorkRead() {
    try { var k = 'plotto-work-status-v1', s = JSON.parse(sessionStorage.getItem(k) || '{}') || {}, ids = s.readNotificationIds || [];
      if (ids.indexOf('taehun-files') < 0) ids.push('taehun-files'); s.readNotificationIds = ids; sessionStorage.setItem(k, JSON.stringify(s));
      window.dispatchEvent(new Event('plotto:work-status')); } catch (e) { /* storage unavailable */ }
  }
  function notifications() {
    var r = push('알림',
      '<div class="px-banner"><b>안 읽은 알림이 2개 있어요</b><span>오른쪽 위 \'모두 읽음\'을 누르면 한꺼번에 읽음 처리돼요</span>' + img('q1') + '</div>' +
      '<div class="px-sec">새로운 알림</div>' +
      item('q2', 'b', '<b>태훈</b>님이 2개의 파일을 전달했어요.', 'AI분석프로젝트 · 1시간 전', true) +
      item('p1', 'y', '<b>기획안 수정하기</b> 마감이 오늘이에요!', '마케팅 공모전 · 3시간 전', true) +
      '<div class="px-sec">어제</div>' +
      item('q0', 'p', '<b>유진</b>님이 PPT 제작 일정을 변경했어요.', 'AI분석프로젝트 · 어제 오후 4:12') +
      item('p3', 'm', '자리를 비운 동안 회의가 진행됐어요. 브리핑을 확인해 보세요.', '어제 오후 2:30') +
      item('p0', 'b', '<b>하이</b>님이 디자인 시안에 의견을 남겼어요.', '마케팅 공모전 · 어제 오전 11:05') +
      '<div class="px-sec">이번 주</div>' +
      item('q3', 'y', '청년 도움 프로젝트의 GUI 제작이 40%에 도달했어요.', '10/26 월') +
      item('p1', 'm', '<b>태훈</b>님이 자료조사를 완료했어요.', 'AI분석프로젝트 · 10/25 일') +
      '<div class="px-end">' + img('p2') + '여기까지가 전부예요</div>');
    var hb = el('button', 'px-hbtn', '모두 읽음'); hb.type = 'button'; r.hd.appendChild(hb);
    hb.onclick = function () {
      r.c.querySelectorAll('.px-dot').forEach(function (d) { d.remove(); });
      r.c.querySelectorAll('.px-item.new').forEach(function (d) { d.classList.remove('new'); });
      var bn = r.c.querySelector('.px-banner'); bn.querySelector('b').textContent = '안 읽은 알림이 없어요'; bn.querySelector('span').textContent = '모두 읽음으로 표시했어요';
      hb.disabled = true; toast('모든 알림을 읽음으로 표시했어요'); markWorkRead();
    };
  }

  function mypage() {
    var role = store('role') || '기획', ava = store('ava') || 'q0';
    var r = push('마이페이지',
      '<div class="px-top"><div class="px-pl"><img class="tb" alt="" src="/extra/pl-tail-back.png"><img class="b" alt="" src="/extra/pl-body.png"><img class="eye e0" alt="" src="/extra/pl-eye0.png"><img class="eye e1" alt="" src="/extra/pl-eye1.png"><img class="tf" alt="" src="/extra/pl-tail-front.png"><img class="file" alt="" src="/extra/pl-file.png"></div>' + '<div class="px-bubble"><b>' + nick() + '님, 안녕하세요!</b>오늘은 어떤 일을<br>도와드릴까요?</div></div>' +
      '<div class="px-me" style="margin-top:18px"><div class="px-ava b">' + img(ava) + '</div><div><b>' + nick() + '님</b><small>' + role + ' · plotto 워크스페이스</small></div></div>' +
            '<div class="px-say"><div class="tabs"><button type="button" class="tab on" data-m="0">일 맡기기</button><button type="button" class="tab" data-m="1">할 말 전하기</button></div><div class="box"><textarea rows="2" maxlength="200" placeholder="예) 어제 회의록을 요약해 줘"></textarea><button type="button" class="send" disabled aria-label="보내기"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button></div><div class="rp"></div></div>' +
      '<div class="px-list px-menu" style="margin-top:14px">' +
      '<button type="button" class="px-row" data-go="profile">' + ICONS.user + '<span class="nm">내 프로필 관리</span>' + CHEV + '</button>' +
      '<button type="button" class="px-row" data-go="settings">' + ICONS.gear + '<span class="nm">환경설정</span>' + CHEV + '</button>' +
      '<button type="button" class="px-row" data-go="history">' + ICONS.hist + '<span class="nm">프로젝트 히스토리</span>' + CHEV + '</button>' +
      '</div><div class="px-ver">plotto 1.0.0</div>');
    r.s.classList.add('purple');
    var say = r.c.querySelector('.px-say'), tx = say.querySelector('textarea'), sd = say.querySelector('.send'), mode = 0;
    var PH = ['예) 어제 회의록을 요약해 줘', '예) 팀원들에게 내일 회의 시간 바뀐다고 전해 줘'];
    say.querySelectorAll('.tab').forEach(function (b) { b.onclick = function () { mode = +b.getAttribute('data-m'); say.querySelectorAll('.tab').forEach(function (x) { x.classList.toggle('on', x === b); }); tx.placeholder = PH[mode]; }; });
    var pl = r.c.querySelector('.px-pl');
    tx.addEventListener('input', function () { sd.disabled = tx.value.trim().length < 2; pl.classList.toggle('has', tx.value.trim().length > 0); });
    sd.onclick = function () {
      var v = tx.value.trim(); if (v.length < 2) return;
      jobs.unshift({ title: v, type: mode ? '전달' : '맡긴 일', proj: '', due: '' });
      say.querySelector('.rp').innerHTML = '<div class="reply">' + img('q1') + '<span>' + (mode ? '알겠어요! 팀원들에게 전달할게요.' : '알겠어요! 바로 시작할게요. 끝나면 알림으로 알려 드릴게요.') + '</span></div>';
      tx.value = ''; sd.disabled = true; pl.classList.remove('has');
    };
    r.c.addEventListener('click', function (e) {
      var g = e.target.closest('[data-go]'); if (!g) return;
      var k = g.getAttribute('data-go');
      if (k === 'profile') profile(); else if (k === 'settings') settings(); else history();
    });
  }

  var jobs = [];
  var AVAS = ['q0', 'p1', 'q3', 'p3', 'q2', 'p0'];
  var ROLES = ['기획', '디자인', '개발', '마케팅', '기타'];
  function profile() {
    var st = { ava: store('ava') || 'q0', role: store('role') || '기획' };
    var r = push('내 프로필 관리',
      '<div class="px-lbl">프로필 캐릭터</div><div class="px-avas">' + AVAS.map(function (a) { return '<button type="button" data-a="' + a + '" class="' + (a === st.ava ? 'on' : '') + '"><span class="px-ava b">' + img(a) + '</span></button>'; }).join('') + '</div>' +
      '<div class="px-lbl">이름</div><input class="px-field" type="text" maxlength="12" value="' + nick() + '">' +
      '<div class="px-lbl">맡은 역할</div><div class="px-chips" data-r>' + ROLES.map(function (x) { return '<button type="button" class="px-chip' + (x === st.role ? ' on' : '') + '">' + x + '</button>'; }).join('') + '</div>' +
      '<div class="px-lbl">이메일</div><input class="px-field" type="text" value="seoyeon@plotto.app" readonly style="color:#929aaa;background:#f1f3fa">',
      '<button type="button" class="px-btn">저장</button>');
    r.c.querySelectorAll('.px-avas button').forEach(function (b) { b.onclick = function () { st.ava = b.getAttribute('data-a'); r.c.querySelectorAll('.px-avas button').forEach(function (x) { x.classList.toggle('on', x === b); }); }; });
    r.c.querySelectorAll('[data-r] .px-chip').forEach(function (b) { b.onclick = function () { st.role = b.textContent; r.c.querySelectorAll('[data-r] .px-chip').forEach(function (x) { x.classList.toggle('on', x === b); }); }; });
    r.s.querySelector('.px-btn').onclick = function () {
      var n = r.c.querySelector('input').value.trim() || '서연';
      store('nickname', n); store('ava', st.ava); store('role', st.role);
      pop();
      var top = stack[stack.length - 1], me = top && top.querySelector('.px-me');
      if (me) { me.querySelector('b').textContent = n + '님'; me.querySelector('small').textContent = st.role + ' · plotto 워크스페이스'; me.querySelector('.px-ava').innerHTML = img(st.ava); }
      toast('프로필을 저장했어요');
    };
  }

  var SET = [['알림', [['push', '푸시 알림 받기', 1], ['due', '마감 임박 알림', 1], ['brief', '회의 브리핑 자동 생성', 1]]], ['방해 금지', [['quiet', '밤 10시 ~ 아침 8시 알림 끄기', 0]]]];
  function settings() {
    var html = SET.map(function (g) {
      return '<div class="px-sec">' + g[0] + '</div><div class="px-list">' + g[1].map(function (s) {
        var on = store('set-' + s[0]); on = on === null ? s[2] : +on;
        return '<div class="px-row"><span class="nm">' + s[1] + '</span><button type="button" class="px-sw' + (on ? ' on' : '') + '" data-k="' + s[0] + '" role="switch" aria-checked="' + (on ? 'true' : 'false') + '" aria-label="' + s[1] + '"></button></div>';
      }).join('') + '</div>';
    }).join('') +
      '<div class="px-sec">일반</div><div class="px-list"><div class="px-row"><span class="nm">연결된 앱</span><span class="v">Drive, Slack</span></div><div class="px-row"><span class="nm">언어</span><span class="v">한국어</span></div></div>' +
      '<div style="height:22px"></div><button type="button" class="px-btn danger">로그아웃</button>';
    var r = push('환경설정', html);
    r.c.querySelectorAll('.px-sw').forEach(function (b) { b.onclick = function () { var on = !b.classList.contains('on'); b.classList.toggle('on', on); b.setAttribute('aria-checked', on ? 'true' : 'false'); store('set-' + b.getAttribute('data-k'), on ? 1 : 0); }; });
    r.c.querySelector('.px-btn.danger').onclick = function () { toast('데모에서는 로그아웃되지 않아요'); };
  }

  var HIST = [['AI분석프로젝트', '10/12 ~ 진행 중', 55, 0], ['마케팅 공모전', '10/01 ~ 진행 중', 72, 0], ['청년 도움 프로젝트', '09/18 ~ 진행 중', 40, 0], ['자원순환프로젝트', '09/02 ~ 10/10', 100, 1], ['아동자립캠프', '08/11 ~ 09/20', 100, 1]];
  function history() {
    var r = push('프로젝트 히스토리',
      '<div class="px-chips" data-f style="margin:6px 0 14px"><button type="button" class="px-chip on" data-v="all">전체</button><button type="button" class="px-chip" data-v="0">진행 중</button><button type="button" class="px-chip" data-v="1">완료</button></div>' +
      (jobs.length ? '<div class="px-sec" style="margin-top:6px">플로토에게 맡긴 일</div>' + jobs.map(function (j) { return '<div class="px-proj"><div class="top"><b>' + j.title + '</b><span class="st">진행 중</span></div><small>' + j.type + ' · ' + j.proj + ' · ' + j.due + '까지</small><div class="bar"><i style="width:30%"></i></div></div>'; }).join('') : '') +
      '<div class="px-sec" style="margin-top:' + (jobs.length ? 18 : 6) + 'px">프로젝트</div><div data-list>' + HIST.map(function (p) { return '<div class="px-proj" data-d="' + p[3] + '"><div class="top"><b>' + p[0] + '</b><span class="st' + (p[3] ? ' done' : '') + '">' + (p[3] ? '완료' : '진행 중') + '</span></div><small>' + p[1] + '</small><div class="bar"><i style="width:' + p[2] + '%"></i></div></div>'; }).join('') + '</div>');
    var chips = r.c.querySelectorAll('[data-f] .px-chip');
    chips.forEach(function (b) { b.onclick = function () { chips.forEach(function (x) { x.classList.toggle('on', x === b); }); var v = b.getAttribute('data-v'); r.c.querySelectorAll('[data-list] .px-proj').forEach(function (p) { p.style.display = (v === 'all' || p.getAttribute('data-d') === v) ? '' : 'none'; }); }; });
  }

  document.addEventListener('click', function (e) {
    var flow = document.documentElement.getAttribute('data-flow');
    if (flow !== 'briefing' && flow !== 'project' && flow !== 'session') return;
    var t = e.target;
    if (t.closest && t.closest('.px-screen')) return;
    if (stack.length) return;
    if (flow === 'project' || flow === 'session') { /* session: GNB 4th = 내 정보 (merge) */
      var pn = t.closest && t.closest(flow === 'session' ? '.home-navigation' : '.bottom-nav');
      if (!pn) return;
      var btns = pn.querySelectorAll('button'), lastBtn = btns[btns.length - 1];
      if (lastBtn && lastBtn.contains(t)) { e.stopPropagation(); e.preventDefault(); mypage(); }
      return;
    }
    var bell = t.closest && t.closest('div.size-6') && t.closest('div.size-6').querySelector('img[alt="알림"]');
    if (bell) { e.stopPropagation(); notifications(); return; }
    var nav = t.closest && t.closest('nav');
    if (nav) {
      var imgs = nav.querySelectorAll('img'), last = imgs[imgs.length - 1];
      if (last && (t === last || last.contains(t))) { e.stopPropagation(); mypage(); }
    }
  }, true);
})();

/* tap-fallback: iOS sometimes swallows the first tap after a screen change (no click arrives). If a short, still touch ends on a
   tappable element and no click follows within 300 ms, fire the click ourselves. A real click cancels it, so nothing runs twice. */
(function () {
  var lastClick = 0, st = null;
  var fbAt = 0;
  /* if we already fired the click ourselves, swallow the real click that arrives late so the action never runs twice */
  document.addEventListener('click', function (e) {
    if (e.isTrusted && Date.now() - fbAt < 900) { e.stopImmediatePropagation(); e.preventDefault(); return; }
    lastClick = Date.now();
  }, true);
  function tappable(el) {
    while (el && el !== document.body && el !== document.documentElement) {
      if (el.matches && el.matches('input,textarea,select')) return null;
      if (el.matches && el.matches('button,a[href],[role="button"],[role="tab"],summary')) return el;
      try { if (getComputedStyle(el).cursor === 'pointer') return el; } catch (e) { /* ignore */ }
      el = el.parentElement;
    }
    return null;
  }
  document.addEventListener('touchstart', function (e) {
    var t = e.touches[0]; st = e.touches.length === 1 ? { x: t.clientX, y: t.clientY, t: Date.now(), el: e.target } : null;
  }, { capture: true, passive: true });
  document.addEventListener('touchend', function (e) {
    if (!st) return; var s0 = st; st = null;
    var t = e.changedTouches[0];
    if (Math.abs(t.clientX - s0.x) > 10 || Math.abs(t.clientY - s0.y) > 10 || Date.now() - s0.t > 600) return;
    var el = tappable(s0.el); if (!el || el.disabled) return;
    var t0 = Date.now();
    setTimeout(function () { if (lastClick >= t0 - 30) return; fbAt = Date.now(); try { el.click(); } catch (err) { /* ignore */ } }, 450);
  }, { capture: true, passive: true });
})();

/* 브리핑: 앱을 나갔다(백그라운드) 돌아오면 초기 화면부터 다시 시작 */
(function () {
  try {
    var f = new URLSearchParams(location.search).get('flow');
    if (f && f !== 'briefing') return;
    var hiddenAt = 0;
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') { hiddenAt = Date.now(); return; }
      if (hiddenAt && Date.now() - hiddenAt > 1500) { hiddenAt = 0; location.reload(); }
    });
    addEventListener('pageshow', function (e) { if (e.persisted) location.reload(); });
  } catch (e) {}
})();
