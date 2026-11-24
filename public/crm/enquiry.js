/*! Nature Nest CRM — resort enquiry form */
(function () {
  'use strict';
  var script = document.currentScript;
  if (!script) return;
  var siteKey = (script.getAttribute('data-site-key') || '').trim();
  var api = (script.getAttribute('data-api') || '').trim().replace(/\/$/, '');
  if (!api) {
    try { api = new URL(script.src).origin + '/api/v1/public/enquiries'; }
    catch (_) { api = '/api/v1/public/enquiries'; }
  }
  var title = script.getAttribute('data-title') || 'Enquire about a stay';
  var subtitle = script.getAttribute('data-subtitle') || 'Share your dates and we will confirm availability.';
  var button = script.getAttribute('data-button') || 'Send enquiry';
  var theme = script.getAttribute('data-theme') || 'glass';
  var prefArrival = (script.getAttribute('data-arrival') || '').trim();
  var prefDeparture = (script.getAttribute('data-departure') || '').trim();
  var prefGuests = (script.getAttribute('data-guests') || '').trim();
  var prefRoom = (script.getAttribute('data-room') || '').trim();
  var target = script.getAttribute('data-target');
  var mount = (target && document.querySelector(target)) || document.createElement('div');
  if (!target) script.parentNode.insertBefore(mount, script.nextSibling);
  if (!siteKey) {
    mount.innerHTML = '<p style="color:#8b2727;font:14px/1.5 system-ui,sans-serif">Missing data-site-key on the enquiry script.</p>';
    return;
  }

  if (!document.getElementById('nn-enquiry-fonts')) {
    var fonts = document.createElement('link');
    fonts.id = 'nn-enquiry-fonts';
    fonts.rel = 'stylesheet';
    fonts.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Manrope:wght@400;500;600;700&display=swap';
    document.head.appendChild(fonts);
  }

  var rooms = [
    { value: 'Villa', hint: 'Private' },
    { value: 'Cottage', hint: 'Garden' },
    { value: 'Deluxe', hint: 'Comfort' },
    { value: 'Suite', hint: 'Spacious' },
    { value: 'Any', hint: 'Flexible' },
    { value: 'Other', hint: 'Custom' }
  ];

  var brandMark = 'The Nature Nest';
  var brandGold = '#d4af37';
  var brandGoldSoft = '#e8d28a';

  function shortBrand(name) {
    var n = String(name || '').trim();
    if (!n) return 'The Nature Nest';
    if (/nature nest/i.test(n)) return 'The Nature Nest';
    return n.length > 28 ? n.slice(0, 26).trim() + '…' : n;
  }

  function applyBrand(b) {
    if (!b) return;
    if (b.displayName) brandMark = shortBrand(b.displayName);
    if (b.accentGold) brandGold = b.accentGold;
    if (b.goldSoft) brandGoldSoft = b.goldSoft;
    var formEl = mount.querySelector('.nn-enquiry');
    if (formEl) {
      formEl.style.setProperty('--nn-gold', brandGold);
      formEl.style.setProperty('--nn-gold-soft', brandGoldSoft);
      var mark = formEl.querySelector('.nn-enquiry-mark small');
      if (mark) mark.textContent = brandMark;
    }
  }

  try {
    var brandingUrl = (script.getAttribute('data-branding') || '').trim();
    var brandOrigin = (script.getAttribute('data-crm-origin') || '').trim().replace(/\/$/, '');
    if (!brandingUrl) {
      try { if (!brandOrigin) brandOrigin = new URL(api).origin; } catch (_) {
        try { brandOrigin = new URL(script.src).origin; } catch (__) { brandOrigin = ''; }
      }
      if (brandOrigin) brandingUrl = brandOrigin + '/api/v1/public/branding?siteKey=' + encodeURIComponent(siteKey);
    } else if (brandingUrl.indexOf('siteKey=') === -1) {
      brandingUrl += (brandingUrl.indexOf('?') >= 0 ? '&' : '?') + 'siteKey=' + encodeURIComponent(siteKey);
    }
    if (brandingUrl) {
      fetch(brandingUrl, { headers: { Accept: 'application/json' } })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (body) { if (body && body.data && body.data.branding) applyBrand(body.data.branding); })
        .catch(function () {});
    }
  } catch (_) {}

  var css = document.createElement('style');
  css.textContent = [
    '.nn-enquiry{--nn-ink:#1c2e24;--nn-muted:#5c6d60;--nn-line:rgba(28,46,36,.14);--nn-field:#fff;--nn-field-ink:#1c2e24;--nn-card:#f7f4ec;--nn-gold:' + brandGold + ';--nn-gold-soft:' + brandGoldSoft + ';--nn-ok-bg:#e7f0df;--nn-ok-ink:#234a2a;--nn-err-bg:#f6e4de;--nn-err-ink:#7a2e22;--nn-chip:#ffffffa8;--nn-chip-on:linear-gradient(135deg,#ead28a,#d4af37 58%,#b8902f);font-family:Manrope,system-ui,sans-serif;color:var(--nn-ink);background:var(--nn-card);border:1px solid var(--nn-line);border-radius:24px;padding:clamp(22px,3vw,32px);max-width:560px;width:100%;box-sizing:border-box;box-shadow:0 24px 60px rgba(8,20,12,.18)}',
    '.nn-enquiry *{box-sizing:border-box}',
    '.nn-enquiry[data-theme=forest],.nn-enquiry[data-theme=glass],.nn-enquiry[data-theme=dark]{--nn-ink:#f4f0e4;--nn-muted:#b9c7b0;--nn-line:rgba(255,255,255,.16);--nn-field:rgba(255,255,255,.08);--nn-field-ink:#f7f3e8;--nn-card:transparent;--nn-ok-bg:rgba(90,150,90,.2);--nn-ok-ink:#d8f0c8;--nn-err-bg:rgba(160,50,40,.26);--nn-err-ink:#ffd4c8;--nn-chip:rgba(255,255,255,.07);color-scheme:dark;box-shadow:none;border:0;padding:4px 2px 0}',
    '.nn-enquiry[data-theme=light]{--nn-card:#fbfaf6}',
    '.nn-enquiry-head{margin:0 0 22px;text-align:center}',
    '.nn-enquiry-mark{display:inline-flex;align-items:center;justify-content:center;gap:10px;margin:0 0 12px}',
    '.nn-enquiry-mark span{width:22px;height:1px;background:linear-gradient(90deg,transparent,var(--nn-gold-soft),transparent)}',
    '.nn-enquiry-mark small{letter-spacing:.2em;text-transform:uppercase;font-size:.65rem;font-weight:700;color:var(--nn-gold-soft)}',
    '.nn-enquiry h3{margin:0 0 8px;font:600 clamp(1.7rem,4vw,2.15rem)/1.1 "Cormorant Garamond",Georgia,serif;letter-spacing:-.02em;color:var(--nn-ink)}',
    '.nn-enquiry-head p{margin:0 auto;max-width:34ch;font-size:.9rem;line-height:1.55;color:var(--nn-muted)}',
    '.nn-enquiry .nn-section{margin:4px 0 14px}',
    '.nn-enquiry .nn-section>span,.nn-enquiry .nn-label{display:block;margin:0 0 8px;font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--nn-muted)}',
    '.nn-enquiry label{display:grid;gap:7px;margin:0 0 12px;font-size:.7rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--nn-muted)}',
    '.nn-enquiry .nn-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}',
    '.nn-enquiry input,.nn-enquiry select,.nn-enquiry textarea{width:100%;min-height:50px;padding:13px 15px;border:1px solid var(--nn-line);border-radius:14px;background:var(--nn-field);color:var(--nn-field-ink);font:500 .95rem/1.3 Manrope,system-ui,sans-serif;text-transform:none;letter-spacing:0;transition:border-color .18s ease, box-shadow .18s ease, background .18s ease}',
    '.nn-enquiry select{appearance:none;background-image:linear-gradient(45deg,transparent 50%,var(--nn-gold-soft) 50%),linear-gradient(135deg,var(--nn-gold-soft) 50%,transparent 50%);background-position:calc(100% - 18px) calc(50% - 3px),calc(100% - 12px) calc(50% - 3px);background-size:6px 6px,6px 6px;background-repeat:no-repeat;padding-right:34px}',
    '.nn-enquiry textarea{min-height:96px;resize:vertical;padding-top:14px}',
    '.nn-enquiry input::placeholder,.nn-enquiry textarea::placeholder{color:var(--nn-muted);opacity:.7;font-weight:500}',
    '.nn-enquiry input[type=date]{color-scheme:inherit}',
    '.nn-enquiry input:hover,.nn-enquiry select:hover,.nn-enquiry textarea:hover{border-color:rgba(232,210,138,.45)}',
    '.nn-enquiry input:focus-visible,.nn-enquiry select:focus-visible,.nn-enquiry textarea:focus-visible{outline:none;border-color:rgba(232,210,138,.8);box-shadow:0 0 0 3px rgba(212,175,55,.2);background:rgba(255,255,255,.12)}',
    '.nn-enquiry[data-theme=light] input:focus-visible,.nn-enquiry[data-theme=light] select:focus-visible,.nn-enquiry[data-theme=light] textarea:focus-visible{background:#fff}',
    '.nn-enquiry .nn-rooms{display:flex;flex-wrap:wrap;gap:8px}',
    '.nn-enquiry .nn-room{appearance:none;display:inline-flex;flex-direction:column;align-items:flex-start;gap:2px;min-width:calc(33.333% - 6px);flex:1 1 calc(33.333% - 6px);min-height:58px;padding:11px 12px;border:1px solid var(--nn-line);border-radius:14px;background:var(--nn-chip);color:var(--nn-ink);text-align:left;cursor:pointer;transition:transform .16s ease, border-color .16s ease, background .16s ease, box-shadow .16s ease}',
    '.nn-enquiry .nn-room strong{font:700 .82rem/1.2 Manrope,system-ui,sans-serif}',
    '.nn-enquiry .nn-room small{font:500 .68rem/1.2 Manrope,system-ui,sans-serif;color:var(--nn-muted);text-transform:none;letter-spacing:0}',
    '.nn-enquiry .nn-room:hover{border-color:rgba(232,210,138,.5);transform:translateY(-1px)}',
    '.nn-enquiry .nn-room:focus-visible{outline:none;box-shadow:0 0 0 3px rgba(212,175,55,.25)}',
    '.nn-enquiry .nn-room[aria-pressed=true]{background:var(--nn-chip-on);border-color:rgba(242,206,127,.65);color:#1a1608;box-shadow:0 8px 18px rgba(169,129,52,.25)}',
    '.nn-enquiry .nn-room[aria-pressed=true] small{color:rgba(26,22,8,.7)}',
    '.nn-enquiry .nn-other{display:none;margin-top:10px}',
    '.nn-enquiry .nn-other.is-open{display:grid}',
    '.nn-enquiry .nn-hint{margin:8px 0 0;font-size:.72rem;line-height:1.4;color:var(--nn-muted);text-transform:none;letter-spacing:0;font-weight:500}',
    '.nn-enquiry .nn-actions{margin-top:6px;padding-top:8px}',
    '.nn-enquiry button[type=submit]{width:100%;min-height:54px;border:1px solid rgba(242,206,127,.45);border-radius:16px;background:linear-gradient(120deg,#e8d08a,#d4af37 48%,#a9832f);color:#1a1608;font:700 1rem/1 Manrope,system-ui,sans-serif;cursor:pointer;box-shadow:0 12px 28px rgba(169,129,52,.28);transition:transform .16s ease, filter .16s ease, box-shadow .16s ease}',
    '.nn-enquiry button[type=submit]:hover:enabled{filter:brightness(1.04);transform:translateY(-1px)}',
    '.nn-enquiry button[type=submit]:active:enabled{transform:none}',
    '.nn-enquiry button[type=submit]:disabled{opacity:.58;cursor:wait;transform:none}',
    '.nn-enquiry .nn-note{margin:12px 0 0;padding:12px 14px;border-radius:12px;font-size:.86rem;line-height:1.45}',
    '.nn-enquiry .nn-ok{background:var(--nn-ok-bg);color:var(--nn-ok-ink);border:1px solid rgba(160,220,140,.3)}',
    '.nn-enquiry .nn-err{background:var(--nn-err-bg);color:var(--nn-err-ink);border:1px solid rgba(240,160,144,.35)}',
    '.nn-enquiry .nn-hp{position:absolute!important;left:-10000px!important;width:1px!important;height:1px!important;opacity:0!important}',
    '@media(max-width:560px){.nn-enquiry .nn-row{grid-template-columns:1fr 1fr;gap:10px}.nn-enquiry .nn-room{min-width:calc(50% - 4px);flex-basis:calc(50% - 4px)}.nn-enquiry{border-radius:20px;padding:18px}}',
    '@media(max-width:380px){.nn-enquiry .nn-row{grid-template-columns:1fr}}',
    '@media(prefers-reduced-motion:reduce){.nn-enquiry button[type=submit],.nn-enquiry .nn-room{transition:none}}'
  ].join('');
  document.head.appendChild(css);

  var today = new Date().toLocaleDateString('en-CA');
  var roomButtons = rooms.map(function (r, i) {
    return '<button type="button" class="nn-room" data-room="' + escapeHtml(r.value) + '" aria-pressed="' + (i === 0 ? 'true' : 'false') + '">' +
      '<strong>' + escapeHtml(r.value) + '</strong>' +
      '<small>' + escapeHtml(r.hint) + '</small>' +
      '</button>';
  }).join('');

  mount.innerHTML =
    '<form class="nn-enquiry" data-theme="' + theme.replace(/"/g, '') + '" novalidate>' +
      '<div class="nn-enquiry-head">' +
        '<div class="nn-enquiry-mark" aria-hidden="true"><span></span><small>' + escapeHtml(brandMark) + '</small><span></span></div>' +
        '<h3>' + escapeHtml(title) + '</h3>' +
        '<p>' + escapeHtml(subtitle) + '</p>' +
      '</div>' +
      '<label>Your name<input name="name" required maxlength="120" autocomplete="name" placeholder="Full name"/></label>' +
      '<div class="nn-row">' +
        '<label>Email<input name="email" type="email" maxlength="254" autocomplete="email" placeholder="you@example.com"/></label>' +
        '<label>Phone<input name="phone" type="tel" maxlength="40" autocomplete="tel" placeholder="Mobile number"/></label>' +
      '</div>' +
      '<div class="nn-row">' +
        '<label>Check-in<input name="arrival" type="date" required min="' + today + '"/></label>' +
        '<label>Check-out<input name="departure" type="date" required min="' + today + '"/></label>' +
      '</div>' +
      '<div class="nn-row">' +
        '<label>Guests<select name="adults">' + guestOptions() + '</select></label>' +
        '<label>Children<select name="children">' + childOptions() + '</select></label>' +
      '</div>' +
      '<div class="nn-section">' +
        '<span>Room preference</span>' +
        '<div class="nn-rooms" role="group" aria-label="Room preference">' + roomButtons + '</div>' +
        '<div class="nn-other" id="nn-other-wrap">' +
          '<label>Other preference<input name="roomOther" maxlength="120" placeholder="e.g. Pool villa, family cottage"/></label>' +
        '</div>' +
        '<p class="nn-hint">Pick a stay type, or Other to type your own.</p>' +
        '<input type="hidden" name="roomPreference" value="Villa"/>' +
      '</div>' +
      '<label>Message<textarea name="requirement" maxlength="2000" rows="3" placeholder="Anything we should know about your stay…"></textarea></label>' +
      '<input class="nn-hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"/>' +
      '<div class="nn-actions"><button type="submit">' + escapeHtml(button) + '</button><div class="nn-status" aria-live="polite"></div></div>' +
    '</form>';

  var form = mount.querySelector('form');
  var status = mount.querySelector('.nn-status');
  var arrival = form.elements.arrival;
  var departure = form.elements.departure;
  var roomHidden = form.elements.roomPreference;
  var otherWrap = mount.querySelector('#nn-other-wrap');
  var roomChoice = 'Villa';

  if (prefArrival && prefArrival >= today) {
    arrival.value = prefArrival;
    departure.min = prefArrival;
  }
  if (prefDeparture && (!arrival.value || prefDeparture > arrival.value)) {
    departure.value = prefDeparture;
  }
  if (prefGuests) {
    var guestNum = String(Math.min(10, Math.max(1, parseInt(prefGuests, 10) || 2)));
    form.elements.adults.value = guestNum;
  }

  arrival.addEventListener('change', function () {
    if (arrival.value) departure.min = arrival.value;
  });

  function selectRoom(value, customLabel) {
    roomChoice = value || 'Any';
    Array.prototype.forEach.call(mount.querySelectorAll('.nn-room'), function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-room') === roomChoice ? 'true' : 'false');
    });
    var isOther = roomChoice === 'Other';
    otherWrap.classList.toggle('is-open', isOther);
    if (isOther) {
      roomHidden.value = '';
      if (customLabel) form.elements.roomOther.value = customLabel;
    } else {
      roomHidden.value = roomChoice;
      form.elements.roomOther.value = '';
    }
  }

  Array.prototype.forEach.call(mount.querySelectorAll('.nn-room'), function (btn) {
    btn.addEventListener('click', function () {
      selectRoom(btn.getAttribute('data-room') || 'Any');
      if (roomChoice === 'Other') form.elements.roomOther.focus();
    });
  });

  if (prefRoom) {
    var match = Array.prototype.find.call(mount.querySelectorAll('.nn-room'), function (btn) {
      return (btn.getAttribute('data-room') || '').toLowerCase() === prefRoom.toLowerCase();
    });
    if (match) selectRoom(match.getAttribute('data-room'));
    else selectRoom('Other', prefRoom);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.innerHTML = '';
    if (form.elements.website.value) return;
    var name = form.elements.name.value.trim();
    var email = form.elements.email.value.trim();
    var phone = form.elements.phone.value.trim();
    var roomPreference = roomChoice === 'Other'
      ? form.elements.roomOther.value.trim()
      : (roomHidden.value || roomChoice);
    if (!name) return show('Please enter your name.', true);
    if (!email && !phone) return show('Email or phone is required.', true);
    if (!arrival.value || !departure.value) return show('Check-in and check-out dates are required.', true);
    if (departure.value <= arrival.value) return show('Check-out must be after check-in.', true);
    if (!roomPreference) return show('Please choose a room preference, or type your own.', true);
    var btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    btn.textContent = 'Sending…';
    var body = {
      siteKey: siteKey,
      name: name,
      email: email || undefined,
      phone: phone || undefined,
      requirement: form.elements.requirement.value.trim() || undefined,
      roomPreference: roomPreference,
      arrival: arrival.value || undefined,
      departure: departure.value || undefined,
      adults: Number(form.elements.adults.value) || undefined,
      children: Number(form.elements.children.value) || 0,
      source: 'Website'
    };
    fetch(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (!res.ok) throw new Error((res.d.errors && res.d.errors[0] && res.d.errors[0].message) || res.d.message || 'Could not send enquiry.');
        form.reset();
        roomChoice = 'Villa';
        roomHidden.value = 'Villa';
        otherWrap.classList.remove('is-open');
        Array.prototype.forEach.call(mount.querySelectorAll('.nn-room'), function (b, i) {
          b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
        });
        show('Thank you. Our resort team will get back to you shortly.', false);
      })
      .catch(function (err) { show(err.message || 'Could not send enquiry.', true); })
      .finally(function () { btn.disabled = false; btn.textContent = button; });
  });

  function guestOptions() {
    var out = '';
    for (var i = 1; i <= 10; i++) out += '<option value="' + i + '"' + (i === 2 ? ' selected' : '') + '>' + i + (i === 1 ? ' guest' : ' guests') + '</option>';
    return out;
  }
  function childOptions() {
    var out = '';
    for (var i = 0; i <= 6; i++) out += '<option value="' + i + '"' + (i === 0 ? ' selected' : '') + '>' + i + (i === 1 ? ' child' : ' children') + '</option>';
    return out;
  }
  function show(msg, isError) {
    status.innerHTML = '<p class="nn-note ' + (isError ? 'nn-err' : 'nn-ok') + '" role="' + (isError ? 'alert' : 'status') + '">' + escapeHtml(msg) + '</p>';
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }
})();
