/* ================================================================
   ANIFX 2026 — SHARED CONFIG + LOGIC
   Loaded by every page. Edit CONFIG below and it updates everywhere.

   How a page uses this file:
   - Set `window.PAGE_TRACK = "valorant"` (or "fc26"/"gamejam"/"film")
     in an inline <script> BEFORE loading this file, on every event
     page. Leave it unset on index.html.
   - Every render function below checks its own target element exists
     before doing anything, so a page that doesn't have e.g. a
     bracket section on it just skips that function safely. You don't
     need to call anything yourself — this file wires up the whole
     page on load.
   ================================================================ */

/* ---------- browsers restore the last scroll position on reload/revisit
   by default. On the landing page that would let a returning visitor land
   mid-page — skipping the intro at random, or landing scrolled deep into
   content that hasn't finished its own reveal yet. Forcing manual
   restoration so every fresh load genuinely starts at the top. ---------- */
if("scrollRestoration" in history) history.scrollRestoration="manual";
if("scrollY" in window) window.scrollTo(0,0);

/* ---------- debug: surface any runtime error with exactly where it
   happened (file, line, column) and why, instead of failing silently.
   Registered first, before anything else can throw. ---------- */
window.addEventListener("error",e=>{
  const file=(e.filename||"?").split("/").pop();
  console.error("[AniFX] "+e.message+" — "+file+":"+e.lineno+":"+e.colno+(e.error&&e.error.stack?"\n"+e.error.stack:""));
});
window.addEventListener("unhandledrejection",e=>{
  console.error("[AniFX] Unhandled promise rejection:",e.reason);
});

const CONFIG = {

  /* --- where form submissions go ---------------------------------
     Deploy the Apps Script (sent separately) from YOUR Google
     account, then paste the Web App URL here. Data lands in your
     own Google Sheet. Leave empty and the form will tell people
     registration is not open yet instead of failing silently.     */
  sheetEndpoint: "https://script.google.com/macros/s/AKfycbxYMZZT8Z4zCgLxq_nPibBkQlBsVx36D2mqNIbXa8H7cJ3Zu1_OGBYgbu3LoaIGvfUMsg/exec",

  /* --- your details ---------------------------------------------- */
  contactEmail: "",              // e.g. "anifx@dypatil.edu"
  contactPhone: "",              // e.g. "+91 70451 95922"
  instagram:    "dypu.socs",

  /* --- background video --------------------------------------------
     Hero loop (both the landing hero and each event-page hero use
     this same slot pattern) + one per track card. WebM/MP4, muted/
     loop, 10-15s, <4MB. Leave empty — the poster/tint placeholder
     holds the layout until real footage exists, nothing breaks.    */
  heroVideo:    "",              // festival/landing hero background loop
  heroPoster:   "anifx-banner.jpg", // four-panel banner (Film/FC26/VALORANT/Game Jam)

  /* --- headline numbers ------------------------------------------ */
  festivalStart: "2026-10-23T09:00:00+05:30",

  /* --- community links -------------------------------------------
     Use a REDIRECT link (Bitly or a page you control), never the
     raw WhatsApp invite — so you can swap the group without
     re-contacting everyone.                                        */
  whatsappLink: "",
  discordLink:  "",

  /* --- on-campus schedule ------------------------------------------
     The offline weekend, hour by hour. Shown in full on the landing
     page; each event page shows only the rows that mention it.
     FC26's own on-campus timing was confirmed: 11:00, rooms 204/205. */
  schedule: [
    {
      day:"Friday 23 October",
      items:[
        {time:"10:00", title:"Character design",                     where:"Media Lab"},
        {time:"10:00", title:"VALORANT grand final",                 where:"Game Lab", feature:true},
        {time:"11:00", title:"FC26",                                 where:"204, 205"}
      ]
    },
    {
      day:"Saturday 24 October",
      items:[
        {time:"10:00", title:"Screening 1 — film and animation",     where:"Auditorium"},
        {time:"14:00", title:"Game jam screening",                   where:"Auditorium", feature:true},
        {time:"16:00", title:"Prize distribution — all categories",  where:"Auditorium", feature:true}
      ]
    }
  ],
  scheduleNote:"Times are fixed.",

  /* --- competitions ---------------------------------------------- */
  tracks: [
    {
      id:"valorant",
      name:"VALORANT",
      page:"/valorant",
      format:"32 teams · Best of 3 · Online groups, offline final",
      blurb:"Open bracket to 32 teams. Group stage runs online through October, semi-finals online, and the grand final is played offline on campus in front of a crowd.",
      isTeam:true,
      leadLabel:"Captain",
      facts:[
        ["Entry fee","₹1,000 per team"],
        ["Team size","5 players + up to 2 named subs"],
        ["Prize","Prize pool ₹17,500"],
        ["Registration closes","9 October 2026"],
        ["Group stage","October, evenings, online"],
        ["Grand final","23 October, 10:00, on campus"]
      ],
      eligibility:"Open to all currently enrolled college students, 18 or older. One roster per player — you may not appear on two VALORANT teams.",
      fee:1000,
      feeNote:"₹1,000 per team",
      slots:32,
      closes:"9 October 2026",
      closesAt:"2026-10-09T23:59:59+05:30",
      open:true,
      payUrl:"",                 // paste Razorpay payment link
      video:"",                  // card/hero background loop — see CONFIG.heroVideo note
      cardImage:"valorant.jpg",  // fan art, made by a friend of the client's — free of
                                 // copyright per the client; used for both the index
                                 // card and (via the hero-wiring image fallback) this
                                 // track's own page hero, since there's no video yet.
      rosterLabel:"Squad — one player per line",
      rosterHint:"Name, Riot ID with tagline, phone, email. All 5 players plus any subs. Riot IDs are how we invite you to the lobby — a wrong ID means a forfeit.",
      rosterPlaceholder:"Name, Riot ID#TAG, phone, email",
      rosterRequired:true
    },
    {
      id:"fc26",
      name:"FC26",
      page:"/fc26",
      format:"Solo knockout · One day · On campus",
      blurb:"Single-elimination solo knockout played on PlayStation on campus, one player at a time — no teams.",
      isTeam:false,
      leadLabel:"",
      facts:[
        ["Entry fee","₹100 per player"],
        ["Format","Solo, single elimination"],
        ["Prize","1st — ₹5,000 · 2nd — ₹3,000"],
        ["Registration closes","20 October 2026"],
        ["Played","23 October, on campus"],
        ["Match length","6-minute halves"]
      ],
      eligibility:"Open to all currently enrolled college students, 18 or older. Solo entry only — there is no team registration for FC26.",
      fee:100,
      feeNote:"₹100 per player",
      slots:0,
      closes:"20 October 2026",
      closesAt:"2026-10-20T23:59:59+05:30",
      open:true,
      payUrl:"",
      video:"",
      cardImage:"fc26.jpg",     // official EA Sports FC26 key art — same category of
                                // asset as the Riot VALORANT key art declined earlier
                                // per hard rule #3, but the client was told directly
                                // and explicitly said to use it anyway (their own
                                // promotional rights/risk to manage for their own
                                // event page). Client's explicit call, not an
                                // oversight — see CHANGELOG-v3.20.md.
      cardImageOnly:true,       // index card ONLY — FC26's own page hero keeps its
                                // custom pitch/floodlight/ball decoration instead.
                                // That decoration is the intended hero and always
                                // was — it is NOT a placeholder, do not hide it
                                // again just because a cardImage exists.
      rosterLabel:"",
      rosterHint:"",
      rosterRequired:false
    },
    {
      id:"gamejam",
      name:"Game jam",
      page:"/game-jam",
      format:"100 hours · Online · Side-scroller action",
      blurb:"Design, build and ship an original side-scrolling action game in 100 hours. 2D, 3D or anything between. Judged live on campus at the end.",
      isTeam:true,
      soloTeamChoice:true,
      entrySoloNote:"Just you. No team name or roster.",
      entryTeamNote:"Up to 5 members, one lead.",
      leadLabel:"Team Lead",
      facts:[
        ["Entry fee","₹1,000 per team"],
        ["Team size","1 to 5"],
        ["Prize","Winner — ₹10,000"],
        ["Genre","Side-scroller action"],
        ["Duration","100 hours, online"],
        ["Jury round","24 October, 14:00, on campus"]
      ],
      eligibility:"Open to all currently enrolled college students, 18 or older. Teams of 1-5 — each person may register with only one team. Solo entries are welcome.",
      fee:1000,
      feeNote:"₹1,000 per team",
      slots:0,
      closes:"To be announced",
      closesAt:"",
      open:true,
      payUrl:"",
      video:"gamejam-clip.mp4",   // gameplay capture — blended full-bleed via has-video (same treatment index card + own page both use)
      rosterLabel:"Team — one member per line",
      rosterHint:"Name, role, email. Up to 5 members. Solo entries are welcome.",
      rosterPlaceholder:"Name, role, email",
      rosterRequired:true
    },
    {
      id:"film",
      name:"Film & animation",
      page:"/film-festival",
      format:"Submission based · 2D, 3D, stop motion, VFX, live action",
      blurb:"A showcase for student films and animation. Animated work and live action are judged separately by industry juries, screened on campus during the festival.",
      isTeam:true,
      soloTeamChoice:true,
      entrySoloNote:"One filmmaker, your details only.",
      entryTeamNote:"Team name, lead and crew.",
      leadLabel:"Team Lead",
      categories:["2D Animation","3D Animation","Stop Motion","Live Action","Others"],
      facts:[
        ["Entry fee","Free for all"],
        ["Categories","2D Animation · 3D Animation · Stop Motion · Live Action · Others"],
        ["Prize","Prize pool ₹55,000+"],
        ["Formats","2D, 3D, stop motion, VFX"],
        ["Screening","24 October, 10:00, on campus"],
        ["Jury","Industry panel"]
      ],
      eligibility:"Free for all entrants — students (DY Patil or any other college), animation hobbyists and professionals. Individual or team submissions welcome.",
      prizeBreakdown:[
        ["Big Screen Award","Best Short Film","₹10,000"],
        ["Magic Frame Award","Best Animation Short Film","₹10,000"],
        ["Storyteller Award","Best Screenplay Writer","₹5,000"],
        ["Vision Award","Best Direction","₹8,000"],
        ["Aperture Award","Best Cinematography","₹5,000"],
        ["Cut To Award","Best Editing","₹5,000"],
        ["Sound Design Award","Sound & Music","₹5,000"],
        ["Spotlight Award","Best Performance","₹3,000"],
        ["Character Award","Best Character Design","₹3,000"],
        ["Rising Star Award","Emerging Filmmaker","Filmmaking Gear / Voucher (Worth ₹5,000)"],
        ["Wild Card Award","Most Unexpected / Experimental Film","₹3,000"]
      ],
      fee:0,
      feeNote:"Entry fee",
      slots:0,
      closes:"To be announced",
      closesAt:"",
      open:true,
      payUrl:"",
      video:"film-vfx-clip.mp4",  // restored — client wants it actually playing, not
                                  // the static image. Paritosh Khairwal | RRS's reel,
                                  // same credit caption as before.
      rosterLabel:"Team — one member per line",
      rosterHint:"Name, role, email. Solo submissions are welcome.",
      rosterPlaceholder:"Name, role, email",
      rosterRequired:false
    },
    {
      id:"character",
      name:"Character design",
      page:"/character-design",
      format:"Free entry · Solo · Held 23 October, on campus",
      blurb:"Design an original character live at the venue, on a theme announced at the start of the competition. In association with Katha Film Club.",
      isTeam:false,
      leadLabel:"",
      facts:[
        ["Entry fee","Free"],
        ["Format","Solo — one character per participant"],
        ["Prize","XP-Pen tablet + winner certificate"],
        ["Venue","Media Lab, COE Building, Nerul"],
        ["Competition","23 October 2026, 10:00"],
        ["Prize distribution","24 October 2026"]
      ],
      eligibility:"Open to students from colleges and educational institutes. Each participant must register and submit individually — one character design per participant. A valid college/institute ID is required at the venue.",
      fee:0,
      feeNote:"Free entry",
      slots:0,
      closes:"To be announced",
      closesAt:"",
      open:true,
      payUrl:"",
      video:"",
      cardGallery:["char-rat.png","char-alien.png","char-monkey.png","char-centaur.png"], // student sketches, right-aligned grid
      rosterLabel:"",
      rosterHint:"",
      rosterRequired:false
    }
  ],

  /* --- sponsors ---------------------------------------------------- */
  sponsors: [
    { name:"XP-Pen — Character Design", logoUrl:"", url:"" }
  ],

  /* --- faq (general — shown on the landing page and on every event
     page's FAQ tab) ---------------------------------------------- */
  faq:[
    { q:"Can I register for more than one competition?",
      a:"Yes, you can enter as many of the five competitions as you like." },
    { q:"What happens if a registered team drops out before the event?",
      a:"That slot is not reassigned." },
    { q:"Is there an age requirement?",
      a:"Yes, all participants must be 18 or older." },
    { q:"What's the refund policy?",
      a:"No refunds at any cost." },
    { q:"What do I need to bring for the offline final?",
      a:"For VALORANT: your own keyboard, mouse, mousepad, and headphones/earphones. Not applicable for FC26." },
    { q:"Is the game jam fully online?",
      a:"Yes, apart from the final, which happens on campus." },
    { q:"How do I know my registration went through?",
      a:"You'll get a confirmation email after payment." }
  ],

  /* --- rules ------------------------------------------------------
     `track` ties a rules block to one event's dedicated page (that
     page shows this block plus the two general ones below). Blocks
     with no `track` are general and show on every event page.      */
  rules:[
    {
      q:"VALORANT", track:"valorant",
      items:[
        "<b>Entry.</b> ₹1,000 per team, paid in one transaction by the Captain. Registration closes 9 October 2026.",
        "<b>Roster.</b> Five players plus up to two named substitutes, locked at registration. No additions after the deadline. Every player's Riot ID with tagline is required.",
        "<b>Format.</b> Best of three throughout. Grand final best of five, played offline on campus.",
        "<b>Lobbies.</b> Every match lobby is created by an admin on the Mumbai server. An admin observes each match.",
        "<b>Waiting time.</b> Ten minutes from the scheduled start. After that the map is forfeit. Twenty minutes forfeits the series.",
        "<b>Timeouts.</b> Two per team per map, two minutes each.",
        "<b>Ghost mode is not permitted.</b>",
        "<b>Connection.</b> Teams are responsible for their own internet. Disconnections caused by a player's own connection are not grounds for a rematch or rehost.",
        "<b>Proof.</b> Both teams post the end-game scoreboard in the match channel immediately after each map.",
        "<b>Peripherals, offline final.</b> Finalists bring their own keyboard, mouse, mousepad and headphones. These are not provided. PC, monitor, desk and chair are provided, and system specifications are published in advance.",
        "<b>Wired peripherals only.</b> Wireless keyboards, mice and headsets are not permitted.",
        "<b>Setup.</b> Players arrive 45 minutes before match time for setup and peripheral inspection.",
        "<b>Macros.</b> Any device found running macros, scripts or bound automation results in immediate disqualification and forfeit of the match.",
        "<b>Equipment failure.</b> Players whose own equipment fails may continue on organiser-provided backup equipment or forfeit. No rematch is granted.",
        "<b>Disputes.</b> Raised within 15 minutes of a match ending, in the official Discord, with evidence. Later disputes are not considered."
      ],
      warn:"Map veto order, overtime rule and the seeding method are published in full with the bracket, before the first match is played."
    },
    {
      q:"FC26", track:"fc26",
      items:[
        "<b>Entry.</b> ₹100 per player. Solo competition — there is no team registration for FC26. Registration closes 20 October 2026.",
        "<b>Played.</b> 23 October, on campus, on organiser-provided PlayStation consoles.",
        "<b>Match length.</b> Six-minute halves, twelve minutes per game, through the bracket.",
        "<b>Final.</b> Eight-minute halves, single game.",
        "<b>Waiting time.</b> Five minutes from being called. After that, forfeit.",
        "<b>Format.</b> Single elimination. Bracket drawn and published before the first match.",
        "<b>Disputes.</b> Raised with the on-floor admin immediately, before the next match starts on that station."
      ],
      warn:"Draw resolution, permitted team selection and the controller policy are confirmed before registration opens."
    },
    {
      q:"Game jam", track:"gamejam",
      items:[
        "<b>Entry.</b> ₹1,000 per team, paid in one transaction by the Team Lead. Teams of one to five. Each person may register with only one team.",
        "<b>Prize.</b> Winner takes ₹10,000.",
        "<b>Duration.</b> 100 hours, continuous, fully online. Only the jury round happens on campus, 24 October at 14:00.",
        "<b>Genre.</b> Side-scroller action. 2D, 3D or 2.5D — no format is given an advantage. There is no mandatory theme.",
        "<b>Checkpoints.</b> Five submissions at 10, 20, 40, 80 and 100 hours: design document, artbook, alpha, beta, and the finished game.",
        "<b>Build.</b> A playable Windows build that runs without installing a game engine. Test it before you submit it.",
        "<b>Engine.</b> Any. No engine receives preferential treatment.",
        "<b>Existing assets.</b> Legally licensed assets are permitted and must be declared with credits. Undeclared assets are grounds for disqualification.",
        "<b>AI.</b> Permitted, with mandatory disclosure. Every significant use must be declared with the tool, the purpose and what the team changed. Undeclared or falsely described AI use is grounds for disqualification.",
        "<b>Originality.</b> The game must be built during the 100 hours. Previously completed or re-skinned projects are not eligible. Organisers may request development history.",
        "<b>Ownership.</b> Teams keep full ownership of their games. AniFX may use footage and screenshots for promotion.",
        "<b>Scope.</b> A small, finished, polished game scores higher than a large unfinished one."
      ],
      warn:"Exact dates, the registration deadline and eligibility are confirmed before registration opens."
    },
    {
      q:"Film & animation", track:"film",
      items:[
        "<b>Entry.</b> Free for all entrants — students (DY Patil or any other college), animation hobbyists and professionals.",
        "<b>Prize.</b> Prize pool ₹55,000+ across 11 award categories.",
        "<b>Categories.</b> Animation — 2D, 3D, stop motion and VFX — and live action, judged separately.",
        "<b>Jury.</b> Industry panels for each category.",
        "<b>Screening.</b> Screening 1 is 24 October at 10:00, on campus.",
        "<b>Ownership.</b> Filmmakers keep full ownership. AniFX may screen the work at the festival and use stills for promotion."
      ],
      warn:"Submission deadline, runtime limits and delivery format are announced shortly. Do not begin a submission until these are published."
    },
    {
      q:"Character design", track:"character",
      items:[
        "<b>Organised by</b> the School of Creative Studies, DY Patil Deemed to be University, in association with Katha Film Club.",
        "<b>Entry.</b> Free. Solo only — each participant registers and submits individually. One character design per participant.",
        "<b>Eligibility.</b> Open to students from colleges and educational institutes. A valid college/institute ID is required for verification at the venue.",
        "<b>Venue and time.</b> Media Lab, COE Building, DY Patil Deemed to be University, Nerul, Navi Mumbai — 23 October 2026, 10:00.",
        "<b>Format.</b> The theme and competition brief are announced at the start of the competition. The character must be conceived and designed entirely during the competition period — no pre-made work.",
        "<b>Originality.</b> The character must be the participant's own original creation. Copying, tracing or reproducing an existing character, artwork or franchise is strictly prohibited. General inspiration from culture, history, mythology or real-world references is fine — the final character must be an original interpretation.",
        "<b>AI.</b> Not permitted. AI-generated artwork, character generators or generative tools may not be used to create or substantially generate the final design. Reference images may only be used for research and inspiration.",
        "<b>Software and equipment.</b> Participants may use organiser-provided or approved software, or their own approved digital drawing equipment, subject to venue and technical restrictions.",
        "<b>Submission.</b> Final character artwork plus the participant's name, institute/college name and registration details, in the format specified by organisers. Organisers may request the working/source file to verify originality.",
        "<b>Judging.</b> Interpretation of theme 20% · Originality & creativity 25% · Character design & visual development 20% · Concept & personality 15% · Technical execution 10% · Presentation & overall impact 10%. The jury's decision is final.",
        "<b>Disqualification.</b> Plagiarism, use of an existing character or AI-generated artwork, pre-competition work, using someone else's assets without permission, false registration information, or work submitted by someone other than the registered participant.",
        "<b>Ownership.</b> Participants retain ownership of their original artwork. By entering, participants grant AniFX a non-exclusive right to display and use submitted artwork for festival promotion, exhibition, social media, website, publicity and archival purposes.",
        "<b>Prize.</b> Winner receives an XP-Pen tablet and a winner certificate. Additional special jury mentions may be awarded at the jury's discretion.",
        "<b>Prize distribution.</b> 24 October 2026."
      ],
      warn:"The organisers reserve the right to modify the competition format, schedule or rules if required due to unforeseen circumstances."
    },
    {
      q:"Payment, refunds and prize money",
      items:[
        "<b>Payment.</b> Entry is confirmed only when payment is received and verified against our account. Keep your transaction reference.",
        "<b>Verification.</b> Verified teams appear on this site. If you have paid and are not listed within 48 hours, email us with your reference number.",
        "<b>Unverified entries.</b> Entries that cannot be verified 72 hours before the first match are removed from the bracket.",
        "<b>Refunds.</b> No refunds at any cost.",
        "<b>Prize money.</b> Paid to the registered Captain, Team Lead or solo entrant after the festival. Prize distribution for all categories is on 24 October 2026."
      ]
    },
    {
      q:"Conduct and disqualification",
      items:[
        "<b>Conduct.</b> Harassment, hate speech, threats, discriminatory behaviour, impersonation and deliberate disruption are not tolerated, on campus or in official channels.",
        "<b>Communication.</b> Participants must join the official WhatsApp group and Discord. Schedules are communicated there and by email. Missing a match because you did not join is not grounds for a reschedule.",
        "<b>Cheating.</b> Any form of cheating, account sharing, ringers or unauthorised software results in immediate disqualification with no refund.",
        "<b>Decisions.</b> Anything not covered by these rules is decided by the Tournament Director for that competition. That decision is final.",
        "<b>Changes.</b> Any rule change is announced through official channels before it takes effect. No rule is introduced or changed during a match."
      ]
    }
  ]
};

/* ================================================================
   Below here you should not need to edit anything.
   ================================================================ */
(function(){
"use strict";
const $  = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const esc = s => String(s==null?"":s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const PAGE_TRACK = window.PAGE_TRACK || null;

const reduceMotion=matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- smooth-scroll for in-page anchor jumps only.
   scroll-behavior:smooth is intentionally not set on <html> (see shared.css) —
   this delegated handler gives anchor links the same smooth jump without
   the browser also easing every wheel/trackpad tick, which would put the
   scroll-driven effects a frame behind the actual gesture. ---------- */
document.addEventListener("click",e=>{
  const a=e.target.closest('a[href^="#"]');
  if(!a || a.getAttribute("href").length<2 || a.hasAttribute("data-panel-link")) return;
  const target=$(a.getAttribute("href"));
  if(!target) return;
  e.preventDefault();
  target.scrollIntoView({behavior:reduceMotion?"auto":"smooth", block:"start"});
});

function revealNodes(nodes,opts){
  const once = !opts || opts.once!==false;
  if(!nodes.length) return;
  if(reduceMotion){
    nodes.forEach(el=>{ const v=el.querySelector&&el.querySelector(".track-video"); if(v&&v.src) v.play().catch(()=>{}); });
    return;
  }
  const io=new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        en.target.classList.add("in");
        const v=en.target.querySelector(".track-video");
        if(v && v.src) v.play().catch(()=>{});
        if(once) io.unobserve(en.target);
      }else if(!once){
        en.target.classList.remove("in");
      }
    });
  },{threshold:.1, rootMargin:"0px 0px -10% 0px"});
  nodes.forEach((el,i)=>{
    el.classList.add("reveal");
    el.style.transitionDelay=(Math.min(i%6,5)*0.05)+"s";
    io.observe(el);
  });
}

/* ---------- hero title: load-in, then scroll parallax.
   introSpacer (landing page only) offsets where "hero's own scroll" is
   considered to start, so the parallax genuinely starts fresh at 0 the
   moment the real page begins — not already maxed-out from the intro's
   own scroll runway. On event pages introSpacer doesn't exist, so this
   offset is 0 and behavior is completely unchanged. ---------- */
(function(){
  const el=$(".hero-title");
  if(!el) return;
  if(reduceMotion){ el.style.opacity="1"; return; }
  const introSpacer=$("#introSpacer");
  let heroScrollOffset=introSpacer?introSpacer.offsetHeight:0;
  addEventListener("resize",()=>{ heroScrollOffset=introSpacer?introSpacer.offsetHeight:0; });
  el.style.opacity="0";
  el.style.transform="translateY(22px)";
  el.style.transition="opacity .7s cubic-bezier(.16,.8,.3,1) .1s, transform .7s cubic-bezier(.16,.8,.3,1) .1s";
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    el.style.opacity="1"; el.style.transform="translateY(0)";
  }));
  // transitionend is not reliable here (the double-rAF that starts the
  // load-in transition doesn't always land in two separate paints, so
  // the transition can end up never actually running — silently
  // disabling the parallax forever). A fixed timeout past the known
  // .8s transition duration is deterministic instead.
  let handedOff=false;
  let ticking=false;
  function apply(){
    const y=Math.min(Math.max(window.scrollY-heroScrollOffset,0),400);
    el.style.transform="translateY("+(y*-0.12)+"px)";
    ticking=false;
  }
  setTimeout(()=>{ el.style.transition="none"; handedOff=true; apply(); },850);
  addEventListener("scroll",()=>{
    if(!handedOff) return;
    if(!ticking){ requestAnimationFrame(apply); ticking=true; }
  },{passive:true});
})();

/* ---------- Character Design hero: char-sketch boxes drift at their own
   speed on scroll (data-parallax per box, set in the HTML). Same
   rAF-throttled scroll pattern as the hero-title parallax above, clamped
   to the hero's own height so it settles once the hero scrolls past. ---------- */
(function(){
  const boxes=$$(".hcg-box");
  if(!boxes.length || reduceMotion) return;
  const heroSec=$(".hero");
  if(!heroSec) return;
  let ticking5=false;
  function applyGalleryParallax(){
    const h=heroSec.offsetHeight||700;
    const y=Math.min(Math.max(window.scrollY,0),h);
    boxes.forEach(b=>{
      const speed=parseFloat(b.dataset.parallax||"0");
      b.style.transform="translateY("+(y*speed)+"px)";
    });
    ticking5=false;
  }
  addEventListener("scroll",()=>{
    if(!ticking5){ requestAnimationFrame(applyGalleryParallax); ticking5=true; }
  },{passive:true});
  applyGalleryParallax();
})();

/* ---------- landing page only: whole hero fades out as one piece while
   you scroll past it, instead of just the title fading on its own —
   reads as one cinematic exit rather than pieces drifting separately.
   Same introSpacer offset as the parallax above, for the same reason:
   this must start fresh at the real hero's own top, not mid-fade from
   the intro's scroll runway. ---------- */
if($(".hero-inner") && !PAGE_TRACK && !reduceMotion){
  const inner=$(".hero-inner"), heroSec=$(".hero");
  const introSpacer2=$("#introSpacer");
  let heroScrollOffset2=introSpacer2?introSpacer2.offsetHeight:0;
  let ticking4=false;
  function fadeHero(){
    const h=heroSec.offsetHeight||800;
    const y=Math.min(Math.max(window.scrollY-heroScrollOffset2,0),h);
    inner.style.opacity=String(Math.max(1-(y/h)*1.35,0));
    ticking4=false;
  }
  addEventListener("scroll",()=>{
    if(!ticking4){ requestAnimationFrame(fadeHero); ticking4=true; }
  },{passive:true});
  addEventListener("resize",()=>{ heroScrollOffset2=introSpacer2?introSpacer2.offsetHeight:0; fadeHero(); });
  fadeHero();
}

/* ---------- background video slots ---------- */
(function(){
  const hv=$(".hero-video");
  if(!hv) return;
  const track = PAGE_TRACK ? (CONFIG.tracks.find(t=>t.id===PAGE_TRACK)||{}) : {};
  const src = PAGE_TRACK ? track.video : CONFIG.heroVideo;
  if(src){
    hv.src=src; hv.play().catch(()=>{}); hv.closest(".hero").classList.add("has-video");
  }else if(PAGE_TRACK && track.cardImage && !track.cardImageOnly){
    // No video for this track (e.g. VALORANT — FC26 opts out, see cardImageOnly) —
    // reuse the same static image already wired to its index-page card, shown as
    // this <video>'s poster. No .src is ever set, so it never attempts playback;
    // the poster frame just displays indefinitely, same visual slot as a video.
    hv.setAttribute("poster", track.cardImage);
    hv.closest(".hero").classList.add("has-video");
  }else if(!PAGE_TRACK && CONFIG.heroPoster){
    // Landing page, no heroVideo — same poster-only fallback as above. (Previously
    // this only set the poster attribute without the has-video class, so the
    // image never actually became visible — .hero-video is opacity:0 without it.)
    hv.setAttribute("poster", CONFIG.heroPoster);
    hv.closest(".hero").classList.add("has-video");
  }
})();
function wireTrackVideos(){
  $$(".track-video, .event-card-video").forEach(v=>{
    const t=CONFIG.tracks.find(x=>x.id===v.dataset.trackVideo);
    if(t && t.video){ v.src=t.video; v.closest(".track-media, .event-card").classList.add("has-video"); }
  });
}
function wireTrackMedia(){
  $$("[data-track-img]").forEach(img=>{
    const t=CONFIG.tracks.find(x=>x.id===img.dataset.trackImg);
    if(t && t.cardImage && !t.video){
      img.src=t.cardImage; img.alt=t.name+" — event photo";
      img.closest(".track-media, .event-card").classList.add("has-img");
    }
  });
  $$("[data-track-gallery]").forEach(box=>{
    const t=CONFIG.tracks.find(x=>x.id===box.dataset.trackGallery);
    if(t && t.cardGallery && t.cardGallery.length){
      box.innerHTML = t.cardGallery.map(src=>'<img src="'+esc(src)+'" alt="'+esc(t.name)+' — student sketch by Shivam Prasad" title="Shivam Prasad" loading="lazy">').join("");
      box.closest(".track-media, .event-card").classList.add("has-gallery");
    }
  });
}

/* ---------- contact (every page) ---------- */
if($("#mailLink") && CONFIG.contactEmail){
  const a=$("#mailLink"); a.textContent=CONFIG.contactEmail; a.href="mailto:"+CONFIG.contactEmail; a.classList.remove("todo");
}
if($("#phoneLink") && CONFIG.contactPhone){
  const a=$("#phoneLink"); a.textContent=CONFIG.contactPhone; a.href="tel:"+CONFIG.contactPhone.replace(/\s/g,""); a.classList.remove("todo");
}
/* ---------- quick-contact rail (every page): floating email + WhatsApp,
   right edge, vertically centered. Icon-only at rest, expands to show a
   text label on hover; slides in from off-screen shortly after load.
   Same placeholder pattern as the footer contact links — shows a .todo
   dashed marker until CONFIG.contactEmail / whatsappLink are filled in,
   then becomes a real mailto:/link. Pure JS injection, no HTML markup
   needed on any of the 5 pages. ---------- */
(function(){
  const rail=document.createElement("div");
  rail.className="quick-contact";
  rail.setAttribute("aria-label","Quick contact");

  function makeLink(svgPath,label,href,liveAttrs,todoTitle,filled){
    const a=document.createElement("a");
    const svgAttrs=filled
      ? 'fill="currentColor"'
      : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
    a.innerHTML='<svg viewBox="0 0 24 24" '+svgAttrs+'>'+svgPath+'</svg><span>'+label+'</span>';
    if(href){
      a.href=href;
      Object.entries(liveAttrs||{}).forEach(([k,v])=>a.setAttribute(k,v));
    }else{
      a.href="#"; a.classList.add("todo"); a.title=todoTitle;
      a.setAttribute("aria-label",label+" — "+todoTitle);
    }
    return a;
  }

  rail.appendChild(makeLink(
    '<path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/>',
    "Email",
    CONFIG.contactEmail?"mailto:"+CONFIG.contactEmail:"",
    {"aria-label":"Email "+CONFIG.contactEmail},
    "Set contactEmail in CONFIG"
  ));
  rail.appendChild(makeLink(
    '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/>',
    "WhatsApp",
    CONFIG.whatsappLink||"",
    {target:"_blank",rel:"noopener","aria-label":"WhatsApp"},
    "Set whatsappLink in CONFIG",
    true
  ));

  document.body.appendChild(rail);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    rail.classList.add("in");
  }));
})();

/* ---------- nav (every page) ---------- */
if($("#burger")){
  const burger=$("#burger"), navLinks=$("#navLinks");
  burger.addEventListener("click",()=>{
    const open=navLinks.classList.toggle("open");
    burger.setAttribute("aria-expanded",open);
  });
  $$("#navLinks a").forEach(a=>a.addEventListener("click",()=>{
    navLinks.classList.remove("open"); burger.setAttribute("aria-expanded",false);
  }));
}

/* ---------- countdown (every page that has one) ----------
   Was a full innerHTML rebuild every single second — worked, but left
   no room for a per-digit transition and did more DOM work than
   needed. Now builds the 4 boxes once, then each tick only touches
   the number text of units that actually changed (days/hours/minutes
   only change on rollover; seconds change every tick) and replays a
   short tick animation on just those. */
if($("#countdown")){
  const cdEl=$("#countdown"), cdNote=$("#cdNote");
  const LABELS=["DAYS","HOURS","MINUTES","SECONDS"];
  let built=false, live=false, last=[null,null,null,null];
  function build(){
    cdEl.innerHTML=LABELS.map((l,i)=>
      '<div class="cd-unit"><div class="cd-num" data-i="'+i+'">--</div><div class="cd-lab">'+l+'</div></div>'
    ).join("");
    built=true; last=[null,null,null,null];
  }
  function setUnit(i,val){
    const el=cdEl.querySelector('[data-i="'+i+'"]');
    if(!el || last[i]===val) return;
    last[i]=val; el.textContent=val;
    el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick");
  }
  const renderCountdown=function(){
    const target=new Date(CONFIG.festivalStart).getTime();
    const diff=target-Date.now();
    if(isNaN(target)){cdEl.style.display="none";return;}
    if(diff<=0){
      if(!live){
        cdEl.innerHTML='<div class="cd-unit"><div class="cd-num">LIVE</div><div class="cd-lab">HAPPENING NOW</div></div>';
        if(cdNote) cdNote.textContent="";
        live=true; built=false;
      }
      return;
    }
    live=false;
    if(!built) build();
    const d=Math.floor(diff/864e5), h=Math.floor(diff/36e5)%24, m=Math.floor(diff/6e4)%60, s=Math.floor(diff/1e3)%60;
    const pad=n=>String(n).padStart(2,"0");
    [d,pad(h),pad(m),pad(s)].forEach((v,i)=>setUnit(i,v));
    if(cdNote) cdNote.textContent="Until the festival opens on campus.";
  };
  renderCountdown(); setInterval(renderCountdown,1000);
}

/* ---------- event navigator (index only) — the 4 route-out cards ---------- */
if($("#eventNav")){
  $("#eventNav").innerHTML = CONFIG.tracks.map((t,i)=>{
    const facts = t.facts.slice(0,2).map(([k,v])=>'<div><dt>'+esc(k)+'</dt><dd>'+esc(v)+'</dd></div>').join("");
    return '<a class="event-card" href="'+esc(t.page)+'" data-track="'+t.id+'">'
      + '<video class="event-card-video" data-track-video="'+t.id+'" muted loop playsinline aria-hidden="true"></video>'
      + '<img class="event-card-img" data-track-img="'+t.id+'" alt="" aria-hidden="true">'
      + '<div class="event-card-gallery" data-track-gallery="'+t.id+'" aria-hidden="true"></div>'
      + '<div class="event-card-tint" aria-hidden="true"></div>'
      + '<div class="event-card-glow" aria-hidden="true"></div>'
      + '<div class="event-card-body">'
      +   '<div class="event-card-num">'+String(i+1).padStart(2,"0")+' / '+String(CONFIG.tracks.length).padStart(2,"0")+'</div>'
      +   '<h3>'+esc(t.name)+'</h3>'
      +   '<div class="event-card-fmt">'+esc(t.format)+'</div>'
      +   '<p>'+esc(t.blurb)+'</p>'
      +   '<dl class="event-card-facts">'+facts+'</dl>'
      +   '<div class="event-card-cta"><span class="btn btn-primary">Enter '+esc(t.name)+'</span></div>'
      + '</div>'
      + '</a>';
  }).join("");
  wireTrackVideos();
  wireTrackMedia();
  revealNodes($$(".event-card",$("#eventNav")),{once:false});
}

/* ---------- event page: overview facts table (reuses .tracks/.track) ---------- */
if($("#eventOverview") && PAGE_TRACK){
  const t=CONFIG.tracks.find(x=>x.id===PAGE_TRACK);
  if(t){
    const facts=t.facts.map(([k,v])=>'<div class="fact"><dt>'+esc(k)+'</dt><dd>'+esc(v)+'</dd></div>').join("");
    $("#eventOverview").innerHTML =
      '<article class="track" data-track="'+t.id+'">'
      + '<div><p class="track-desc" style="max-width:60ch;font-size:16.5px">'+esc(t.blurb)+'</p>'
      + '<p class="track-desc" style="margin-top:16px"><b style="color:var(--bone)">Eligibility.</b> '+esc(t.eligibility||"")+'</p>'
      + '</div>'
      + '<div class="track-media">'
      +   '<video class="track-video" data-track-video="'+t.id+'" muted loop playsinline aria-hidden="true"></video>'
      +   '<img class="track-img" data-track-img="'+t.id+'" alt="" aria-hidden="true">'
      +   '<div class="track-video-tint" aria-hidden="true"></div>'
      +   '<dl class="track-facts">'+facts+'</dl>'
      + '</div>'
      + '</article>';
    wireTrackVideos();
    wireTrackMedia();
    revealNodes($$(".track",$("#eventOverview")));
  }
}

/* ---------- event page: prizes tab (only tracks with prizeBreakdown) ---------- */
if($("#prizesWrap") && PAGE_TRACK){
  const t=CONFIG.tracks.find(x=>x.id===PAGE_TRACK);
  if(t && t.prizeBreakdown){
    const prizeRows=t.prizeBreakdown.map(([award,cat,prize])=>
      '<tr><td>'+esc(award)+'</td><td>'+esc(cat)+'</td><td>'+esc(prize)+'</td></tr>').join("");
    $("#prizesWrap").innerHTML =
      '<table class="prize-table"><thead><tr><th>Award</th><th>Category</th><th>Prize</th></tr></thead>'
      + '<tbody>'+prizeRows+'</tbody></table>';
  }
}

/* ---------- event page: sponsors tab ---------- */
if($("#eventSponsors") && PAGE_TRACK){
  const sponsors=CONFIG.sponsors||[];
  $("#eventSponsors").innerHTML = sponsors.length
    ? sponsors.map(s=>'<a href="'+esc(s.url||"#")+'" target="_blank" rel="noopener">'+esc(s.name)+'</a>').join("")
    : '<div class="empty-card">No sponsors confirmed yet for this edition. Check back closer to the event.</div>';
}


/* ---------- faq (index general FAQ + every event page's FAQ tab) ---------- */
if($("#faqWrap")){
  $("#faqWrap").innerHTML=(CONFIG.faq||[]).map(f=>
    '<div class="acc" data-acc>'
    + '<button class="acc-btn" aria-expanded="false"><span class="acc-q">'+esc(f.q)+'</span><span class="acc-sign">+</span></button>'
    + '<div class="acc-body"><p class="muted">'+esc(f.a)+'</p></div></div>'
  ).join("");
}

/* ---------- rules ----------
   Index (or any page without PAGE_TRACK) shows every block.
   An event page shows only its own track's block plus the two
   general ones (payment/refunds, conduct) — no `track` field. ---------- */
if($("#rulesWrap")){
  const blocks = PAGE_TRACK
    ? CONFIG.rules.filter(r=>!r.track || r.track===PAGE_TRACK)
    : CONFIG.rules;
  $("#rulesWrap").innerHTML=blocks.map(r=>
    '<div class="acc" data-acc>'
    + '<button class="acc-btn" aria-expanded="false"><span class="acc-q">'+esc(r.q)+'</span><span class="acc-sign">+</span></button>'
    + '<div class="acc-body"><ul>'+r.items.map(x=>'<li>'+x+'</li>').join("")+'</ul>'
    + (r.warn?'<div class="warn">'+esc(r.warn)+'</div>':'')
    + '</div></div>'
  ).join("");
}
$$("[data-acc] .acc-btn").forEach(btn=>btn.addEventListener("click",()=>{
  const acc=btn.closest(".acc"), open=acc.classList.toggle("open");
  btn.setAttribute("aria-expanded",open);
}));

/* ---------- on-campus schedule ----------
   Index shows the full weekend. An event page (PAGE_TRACK set) shows
   only rows whose title mentions that track's name. ---------- */
if($("#sched")){
  const nameMatch = PAGE_TRACK && (CONFIG.tracks.find(t=>t.id===PAGE_TRACK)||{}).name;
  const days = (CONFIG.schedule||[]).map(day=>{
    const items = nameMatch
      ? day.items.filter(it=>it.title.toLowerCase().includes(nameMatch.toLowerCase().split(" ")[0]))
      : day.items;
    return {day:day.day, items};
  }).filter(d=>d.items.length);

  if(nameMatch && !days.length){
    $("#sched").innerHTML='<div class="empty-card">Schedule for this event is not published yet — check the On Campus page once the draw is out.</div>';
  }else{
    $("#sched").innerHTML=days.map(day=>
      '<div class="sched-day"><h3>'+esc(day.day)+'</h3>'
      + day.items.map(it=>
          '<div class="slot-row'+(it.feature?" feature":"")+'">'
          + '<span class="sr-time">'+esc(it.time)+'</span>'
          + '<span><span class="sr-title">'+esc(it.title)+'</span>'
          + (it.where?'<span class="sr-where">'+esc(it.where)+'</span>':'')+'</span>'
          + '</div>').join("")
      + '</div>'
    ).join("");
  }
  if($("#schedNote")) $("#schedNote").textContent=CONFIG.scheduleNote||"";
}

/* ---------- payment success (every page with the modal) ---------- */
if($("#successScreen")){
  const successScreen=$("#successScreen");
  const showSuccess=function(trackId){
    const t=CONFIG.tracks.find(x=>x.id===trackId);
    if(t) $("#successLine").textContent =
      "Your "+t.name+" entry is in. We verify every payment against our account and confirm your "
      + (t.isTeam?"team":"entry") + " by email within 48 hours.";
    const wa=$("#joinWhatsapp"), dc=$("#joinDiscord");
    if(CONFIG.whatsappLink){ wa.href=CONFIG.whatsappLink; wa.style.display="block"; }
    else { wa.style.display="none"; }
    if(CONFIG.discordLink){ dc.href=CONFIG.discordLink; dc.style.display="block"; }
    else { dc.style.display="none"; }
    if(!CONFIG.whatsappLink && !CONFIG.discordLink){
      $("#successLine").textContent += " Group links are sent to you by email.";
    }
    successScreen.classList.add("open");
    document.body.style.overflow="hidden";
  };
  window.__showSuccess = showSuccess;
  (function checkPaid(){
    const p=new URLSearchParams(location.search);
    if(p.get("paid")) showSuccess(p.get("track"));
  })();
  $("#successDismiss").addEventListener("click",e=>{
    e.preventDefault();
    successScreen.classList.remove("open");
    document.body.style.overflow="";
    history.replaceState({},"",location.pathname);
  });
}

/* ---------- registration gate ----------
   No slot-capacity check — every track accepts entries until its
   closesAt date passes or it's explicitly closed (open:false). No
   /exec GET call needed for this, so none is made.                */
function trackState(t){
  if(t.open===false)                      return {open:false, why:"closed",  label:"Opening soon"};
  if(t.closesAt && Date.now() > new Date(t.closesAt).getTime())
                                          return {open:false, why:"passed",  label:"Registration closed"};
  return {open:true, why:"open", label:"Register"};
}

/* ---------- registration modal (every page that includes it) ---------- */
if($("#regModal")){
  const modal=$("#regModal"), form=$("#regForm"), sel=$("#fTrack"), msg=$("#formMsg"), trackLocked=$("#trackLocked");
  const step1=$("#formStep1"), step2=$("#formStep2"), nextBtn=$("#regNext"), backBtn=$("#regBack");

  // Whether this entry needs the payment step at all — only when the
  // track is open (full/closed tracks can't submit at all — see the
  // st.open guard in doSubmit) and has a real fee (free tracks/tiers
  // skip straight to submitting).
  function needsPayStep(t,st){ return st.open && currentFee(t)>0; }

  // Live input filtering (not just on-submit pattern checks) — strips
  // disallowed characters as the person types, rather than letting them
  // type garbage and only complaining at submit.
  const fTeamEl=$("#fTeam"), fCaptainEl=$("#fCaptain"), fPhoneEl=$("#fPhone");
  if(fTeamEl) fTeamEl.addEventListener("input",()=>{ fTeamEl.value=fTeamEl.value.replace(/[^A-Za-z0-9 ]/g,""); });
  if(fCaptainEl) fCaptainEl.addEventListener("input",()=>{ fCaptainEl.value=fCaptainEl.value.replace(/[^A-Za-z .'-]/g,""); });
  if(fPhoneEl) fPhoneEl.addEventListener("input",()=>{ fPhoneEl.value=fPhoneEl.value.replace(/[^0-9]/g,"").slice(0,10); });
  sel.innerHTML=CONFIG.tracks.map(t=>'<option value="'+t.id+'">'+esc(t.name)+'</option>').join("");
  if(PAGE_TRACK) sel.value=PAGE_TRACK;

  // Custom dropdown UI — the <select> above stays as the real form field
  // (hidden), this listbox is what people actually see and click. Picking
  // an option sets sel.value and fires a real "change" so syncTrack (bound
  // to sel below) runs exactly as it did with the native dropdown.
  const cdrop=$("#trackCdrop"), cdropBtn=$("#trackCdropBtn"), cdropList=$("#trackCdropList");
  if(cdrop){
    cdropList.innerHTML=CONFIG.tracks.map(t=>
      '<li class="cdrop-opt" role="option" data-value="'+t.id+'">'+esc(t.name)+'</li>').join("");
    function syncCdropLabel(){
      const t=CONFIG.tracks.find(x=>x.id===sel.value)||CONFIG.tracks[0];
      cdropBtn.textContent=t.name;
      $$(".cdrop-opt",cdropList).forEach(li=>li.classList.toggle("active",li.dataset.value===sel.value));
    }
    function openCdrop(){ cdrop.classList.add("open"); cdropList.hidden=false; cdropBtn.setAttribute("aria-expanded","true"); }
    function closeCdrop(){ cdrop.classList.remove("open"); cdropList.hidden=true; cdropBtn.setAttribute("aria-expanded","false"); }
    cdropBtn.addEventListener("click",e=>{
      e.stopPropagation();
      if(cdropBtn.disabled) return;
      cdrop.classList.contains("open") ? closeCdrop() : openCdrop();
    });
    cdropList.addEventListener("click",e=>{
      const li=e.target.closest(".cdrop-opt");
      if(!li) return;
      sel.value=li.dataset.value;
      sel.dispatchEvent(new Event("change"));
      syncCdropLabel();
      closeCdrop();
    });
    document.addEventListener("click",e=>{ if(!cdrop.contains(e.target)) closeCdrop(); });
    document.addEventListener("keydown",e=>{ if(e.key==="Escape") closeCdrop(); });
    syncCdropLabel();
    window.__syncCdropLabel=syncCdropLabel;
    window.__setCdropLocked=locked=>{ cdropBtn.disabled=locked; cdrop.hidden=locked; };
  }

  function currentTrack(){ return CONFIG.tracks.find(t=>t.id===sel.value)||CONFIG.tracks[0]; }

  // Effective solo/team state — most tracks are just their fixed t.isTeam,
  // but a track with soloTeamChoice (game jam, film festival) lets the
  // person pick via the Solo entry / Team entry cards, defaulting to team.
  function isTeamEntry(t){
    if(!t.soloTeamChoice) return !!t.isTeam;
    const picked=$("input[name='entryType']:checked");
    return !picked || picked.value==="team";
  }

  function updateRosterCount(){
    const t=currentTrack(), out=$("#rosterCount");
    if(!out) return;
    if(!t.rosterLabel){ out.textContent=""; return; }
    const n=$("#fRoster").value.split("\n").map(s=>s.trim()).filter(Boolean).length;
    out.textContent = n===0 ? "" : n+" line"+(n===1?"":"s")+" entered";
  }
  if($("#fRoster")) $("#fRoster").addEventListener("input",updateRosterCount);

  function say(text,kind){ msg.textContent=text; msg.className="form-msg show "+kind; }

  function currentFee(t){
    if(t.feeTiers){
      const picked=$("input[name='feeTier']:checked");
      const tier=t.feeTiers.find(x=>x.key===(picked&&picked.value))||t.feeTiers[0];
      return tier.amount;
    }
    return t.fee;
  }

  function syncTrack(){
    const t=currentTrack(), st=trackState(t);
    const lead=t.leadLabel||"";

    const feeTierField=$("#feeTierField");
    if(feeTierField){
      if(t.feeTiers){
        feeTierField.style.display="block";
        // Only (re)build the radios when the track actually changed — this
        // function also runs as the *response* to picking a radio, and
        // rebuilding every time would reset the selection back to the
        // first option right after the person just changed it.
        if(feeTierField.dataset.builtFor!==t.id){
          feeTierField.dataset.builtFor=t.id;
          feeTierField.innerHTML=t.feeTiers.map((tier,i)=>
            '<label class="checkline"><input type="radio" name="feeTier" value="'+tier.key+'"'+(i===0?" checked":"")+'>'
            + '<span>'+esc(tier.label)+'</span></label>').join("");
          $$("input[name='feeTier']",feeTierField).forEach(r=>r.addEventListener("change",syncTrack));
        }
      }else{
        feeTierField.style.display="none";
        feeTierField.innerHTML="";
        delete feeTierField.dataset.builtFor;
      }
    }
    const fee=currentFee(t);
    $("#feeLabel").textContent = t.feeTiers ? "Entry fee" : (t.feeNote||"Entry fee");
    $("#feeAmount").textContent=fee?("₹"+fee.toLocaleString("en-IN")):"Free";

    // Payment QR — DY Patil / Axis Bank BharatQR poster, shown big on its
    // own step (see needsPayStep()/formStep2 below) so it's actually
    // scannable, not squeezed into a sidebar. Content is the same for
    // every track, so it's only built once, ever.
    const payQrBig=$("#payQrBig");
    if(payQrBig && !payQrBig.dataset.built){
      payQrBig.dataset.built="1";
      payQrBig.innerHTML =
        '<img src="payment-qr.png" alt="DY Patil University payment QR — scan with any UPI app to pay">' +
        "<p>Scan to pay via UPI/BHIM, RuPay, Visa or Mastercard. Merchant: D Y Patil University Scho. Keep your reference — you'll need it below.</p>";
    }

    // Solo entry / team entry cards — only tracks that opt in (game jam,
    // film festival) show this. Built once per track so re-running
    // syncTrack as the radio's own change handler doesn't reset the pick.
    const entryTypeField=$("#entryTypeField");
    if(entryTypeField){
      if(t.soloTeamChoice){
        entryTypeField.style.display="block";
        if(entryTypeField.dataset.builtFor!==t.id){
          entryTypeField.dataset.builtFor=t.id;
          $$("input[name='entryType']",entryTypeField).forEach(r=>{ r.checked = r.value==="team"; });
        }
        $$("input[name='entryType']",entryTypeField).forEach(r=>{ r.onchange=syncTrack; });
        const soloSub=$("#etSoloSub"), teamSub=$("#etTeamSub");
        if(soloSub) soloSub.textContent=t.entrySoloNote||"";
        if(teamSub) teamSub.textContent=t.entryTeamNote||"";
      }else{
        entryTypeField.style.display="none";
        delete entryTypeField.dataset.builtFor;
      }
    }

    // Category (film festival) — a plain dropdown, same built-once-per-track
    // pattern as the other dynamic fields above.
    const categoryField=$("#categoryField"), fCategory=$("#fCategory");
    if(categoryField && fCategory){
      if(t.categories){
        categoryField.style.display="block";
        if(fCategory.dataset.builtFor!==t.id){
          fCategory.dataset.builtFor=t.id;
          fCategory.innerHTML=t.categories.map(c=>'<option value="'+esc(c)+'">'+esc(c)+'</option>').join("");
          fCategory.onchange=syncTrack;
        }
      }else{
        categoryField.style.display="none";
        fCategory.innerHTML="";
        delete fCategory.dataset.builtFor;
      }
    }
    const categoryOtherField=$("#categoryOtherField");
    if(categoryOtherField){
      const showOther = !!(t.categories && fCategory.value==="Others");
      categoryOtherField.style.display = showOther ? "block" : "none";
      $("#fCategoryOther").required = showOther;
      if(!showOther) $("#fCategoryOther").value="";
    }

    // Team vs solo fields
    const isTeam=isTeamEntry(t);
    const fTeamField=$("#fTeam").closest(".field");
    if(fTeamField) fTeamField.style.display = isTeam ? "block" : "none";
    $("#fTeam").required = isTeam;
    $("#fTeamLabel").textContent = "Team name";

    // A soloTeamChoice track's Solo entry has no lead role to name — just
    // "Full name" / "Email ID". A track that's solo-only by nature (no
    // choice, e.g. character design) keeps its original wording.
    const soloCaptainLabel = t.soloTeamChoice ? "Full name" : "Student name — full name";
    const soloEmailLabel   = t.soloTeamChoice ? "Email ID" : "Email";

    // Lead-prefixed labels for a team entry — a soloTeamChoice track always
    // reads "Team lead — …" (matches the register-form mockup); any other
    // team track keeps its own configured lead role (e.g. valorant's
    // "Captain — full name").
    const leadCaptainLabel = t.soloTeamChoice ? "Team lead — Full name" : (lead+" — full name");
    const leadPhoneLabel   = t.soloTeamChoice ? "Team lead — WhatsApp number" : (lead+" WhatsApp number");
    const leadEmailLabel   = t.soloTeamChoice ? "Team lead — Email ID" : (lead+" email");

    $("#fCaptain").required = true;
    document.querySelector("label[for='fCaptain']").textContent = isTeam ? leadCaptainLabel : soloCaptainLabel;
    document.querySelector("label[for='fPhone']").textContent = isTeam ? leadPhoneLabel : "WhatsApp number";
    document.querySelector("label[for='fEmail']").textContent = isTeam ? leadEmailLabel : soloEmailLabel;

    const wantsRoster=!!t.rosterLabel && isTeam;
    $("#rosterField").style.display=wantsRoster?"block":"none";
    $("#fRosterLabel").textContent=t.rosterLabel||"";
    $("#rosterHint").textContent=t.rosterHint||"";
    $("#fRoster").placeholder=t.rosterPlaceholder||"";
    $("#fRoster").required=wantsRoster && !!t.rosterRequired;
    updateRosterCount();

    // Changing the track/tier always resets back to step 1 — a half-paid
    // step 2 for a track you just switched away from makes no sense.
    step2.hidden=true; step1.hidden=false;
    nextBtn.disabled=false; $("#regSubmit").disabled=false;
    msg.className="form-msg";

    if(st.open){
      nextBtn.textContent = fee>0 ? "Proceed to Pay" : "Submit entry";
    }else{
      nextBtn.textContent = "Registration closed";
      nextBtn.disabled=true; $("#regSubmit").disabled=true;
      if(st.why==="passed"){
        say("Registration for "+t.name+" closed on "+t.closes+".","err");
      }else{
        say("Registration for "+t.name+" hasn't opened yet.","err");
      }
    }
  }
  window.__syncTrack = syncTrack;
  sel.addEventListener("change",syncTrack);
  syncTrack();

  function openModal(trackId){
    if(trackId) sel.value=trackId;
    syncTrack();
    if(window.__syncCdropLabel) window.__syncCdropLabel();
    // On an event's own page (PAGE_TRACK set) the competition is already
    // known — show it as a fixed label, not an editable dropdown. Only
    // the landing page (no PAGE_TRACK) lets the visitor pick one.
    const locked = !!PAGE_TRACK;
    if(window.__setCdropLocked) window.__setCdropLocked(locked);
    if(trackLocked){
      trackLocked.hidden = !locked;
      if(locked) trackLocked.textContent = sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].textContent : "";
    }
    modal.classList.add("open");
    document.body.style.overflow="hidden";
    setTimeout(()=>$("#fTeam").focus(),60);
  }
  function closeModal(){
    modal.classList.remove("open");
    document.body.style.overflow="";
  }
  document.addEventListener("click",e=>{
    const t=e.target.closest("[data-open-reg]");
    if(t){ e.preventDefault(); openModal(t.dataset.track||PAGE_TRACK); }
  });
  $("#regClose").addEventListener("click",closeModal);
  modal.addEventListener("click",e=>{ if(e.target===modal) closeModal(); });
  document.addEventListener("keydown",e=>{ if(e.key==="Escape"&&modal.classList.contains("open")) closeModal(); });

  function fieldProblem(){
    const t=currentTrack();
    const isTeam=isTeamEntry(t);
    const leadWord = isTeam ? (t.soloTeamChoice ? "team lead" : (t.leadLabel||"lead").toLowerCase()) : "your";
    if(isTeam && !$("#fTeam").checkValidity()) return {el:$("#fTeam"), msg:"Enter a "+$("#fTeamLabel").textContent.toLowerCase()+"."};
    if(!$("#fCaptain").checkValidity()) return {el:$("#fCaptain"), msg:"Enter "+leadWord+(isTeam?"'s":"")+" full name."};
    if(!$("#fPhone").checkValidity()) return {el:$("#fPhone"), msg:"Enter "+leadWord+(isTeam?"'s":"")+" WhatsApp number."};
    if(!$("#fEmail").checkValidity()) return {el:$("#fEmail"), msg:"Enter a valid email address."};
    if(t.categories && $("#fCategory").value==="Others" && !$("#fCategoryOther").checkValidity()){
      return {el:$("#fCategoryOther"), msg:"Specify the category."};
    }
    if(!$("#fCollege").checkValidity()) return {el:$("#fCollege"), msg:"Enter your college or institution."};
    if(!$("#fAge").checkValidity()){
      const ageEl=$("#fAge"), av=ageEl.validity;
      const ageMsg = av.rangeUnderflow ? "Age must be at least "+ageEl.min+"."
        : av.rangeOverflow ? "Age must be "+ageEl.max+" or under."
        : "Enter your age.";
      return {el:ageEl, msg:ageMsg};
    }
    if(!$("#fClassYear").checkValidity()) return {el:$("#fClassYear"), msg:"Enter your class, year or graduation status."};
    if(!$("#fAddress").checkValidity()) return {el:$("#fAddress"), msg:"Enter your address."};
    if($("#fRoster").required && !$("#fRoster").checkValidity()) return {el:$("#fRoster"), msg:"Add your "+$("#fRosterLabel").textContent.toLowerCase()+"."};
    if(!$("#fAgree").checked) return {el:$("#fAgree"), msg:"Please confirm you have read the rules."};
    return null;
  }

  // Step 2 only applies once payment is actually required (see
  // needsPayStep) — transaction ID and a payment screenshot are both
  // required fields there.
  function payFieldProblem(){
    if(!$("#fTxnId").checkValidity()) return {el:$("#fTxnId"), msg:"Enter your transaction ID / UTR."};
    if(!$("#fPayScreenshot").checkValidity()) return {el:$("#fPayScreenshot"), msg:"Attach a screenshot of your payment."};
    return null;
  }

  // Highlights the offending field (red border on its wrapper), scrolls
  // it into view within the modal, and focuses it so the next keystroke
  // lands right there. Clears itself the moment the field becomes valid.
  function flagField(el){
    if(!el) return;
    $$(".field-invalid").forEach(f=>f.classList.remove("field-invalid"));
    const wrap=el.closest(".field")||el.closest(".checkline")||el;
    wrap.classList.add("field-invalid");
    el.scrollIntoView({block:"center", behavior:"smooth"});
    el.focus({preventScroll:true});
    const clear=()=>{ wrap.classList.remove("field-invalid"); el.removeEventListener("input",clear); el.removeEventListener("change",clear); };
    el.addEventListener("input",clear);
    el.addEventListener("change",clear);
  }

  // "Continue" / "Proceed to Pay" / "Submit entry" — step 1's action.
  // Validates the details, then either moves to the payment step or, for
  // a free entry, submits straight away. (Full/closed tracks never reach
  // this — the button is disabled in syncTrack when st.open is false.)
  nextBtn.addEventListener("click",()=>{
    const t=currentTrack(), st=trackState(t);
    const problem=fieldProblem();
    if(problem){ say(problem.msg,"err"); flagField(problem.el); return; }
    let phone=$("#fPhone").value.replace(/\D/g,"");
    if(phone.length===12 && phone.startsWith("91")) phone=phone.slice(2);
    if(phone.length<10){ say("Enter a valid 10-digit WhatsApp number.","err"); flagField($("#fPhone")); return; }

    if(needsPayStep(t,st)){
      step1.hidden=true; step2.hidden=false;
      msg.className="form-msg";
      setTimeout(()=>$("#fTxnId").focus(),60);
    }else{
      doSubmit(t,st);
    }
  });

  backBtn.addEventListener("click",()=>{
    step2.hidden=true; step1.hidden=false;
    msg.className="form-msg";
  });

  form.addEventListener("submit",e=>{
    // Step 2's Submit button is the only type="submit" control — this
    // only fires once payment proof is required and being submitted.
    e.preventDefault();
    const t=currentTrack(), st=trackState(t);
    const problem=payFieldProblem();
    if(problem){ say(problem.msg,"err"); flagField(problem.el); return; }
    doSubmit(t,st);
  });

  async function doSubmit(t,st){
    const btn = needsPayStep(t,st) ? $("#regSubmit") : nextBtn;
    let phone=$("#fPhone").value.replace(/\D/g,"");
    if(phone.length===12 && phone.startsWith("91")) phone=phone.slice(2);

    if(!CONFIG.sheetEndpoint){
      say("We can't take entries yet. Follow @"+CONFIG.instagram+" — registration opens shortly.","err");
      return;
    }
    if(!st.open){
      say("Registration for "+t.name+" is closed.","err");
      return;
    }

    const paid = needsPayStep(t,st);
    const screenshotFile = paid ? $("#fPayScreenshot").files[0] : null;

    btn.disabled=true; btn.textContent="Saving your entry…";

    // Payment proof — read the screenshot as base64 so the Apps Script
    // endpoint can save the actual image to Drive, not just its filename.
    let screenshotBase64="";
    if(screenshotFile){
      try{
        screenshotBase64 = await new Promise((resolve,reject)=>{
          const reader=new FileReader();
          reader.onload=()=>resolve(reader.result.split(",")[1]||"");
          reader.onerror=reject;
          reader.readAsDataURL(screenshotFile);
        });
      }catch(err){
        say("Couldn't read that screenshot. Try a different file.","err");
        btn.disabled=false; syncTrack();
        return;
      }
    }

    const isTeam=isTeamEntry(t);
    const catVal=t.categories ? $("#fCategory").value : "";
    const payload={
      track:t.name, trackId:t.id, fee:currentFee(t),
      entryType: t.soloTeamChoice ? (isTeam?"team":"solo") : "",
      teamName:isTeam?$("#fTeam").value.trim():"",
      leadRole:isTeam?(t.leadLabel||""):"Solo entrant",
      registrantName:$("#fCaptain").value.trim(),
      registrantPhone:phone,
      registrantEmail:$("#fEmail").value.trim(),
      college:$("#fCollege").value.trim(),
      age:$("#fAge").value.trim(),
      classYear:$("#fClassYear").value.trim(),
      board:$("#fBoard").value.trim(),
      address:$("#fAddress").value.trim(),
      roster:isTeam?$("#fRoster").value.trim():"",
      category: catVal,
      categoryOther: catVal==="Others" ? $("#fCategoryOther").value.trim() : "",
      // Payment proof — only present when this entry actually paid via
      // the QR step. The Apps Script endpoint decodes
      // paymentScreenshotBase64, saves it to a Drive folder, and puts
      // the resulting link in the sheet.
      txnId: paid ? $("#fTxnId").value.trim() : "",
      paymentScreenshotName: screenshotFile ? screenshotFile.name : "",
      paymentScreenshotType: screenshotFile ? screenshotFile.type : "",
      paymentScreenshotBase64: screenshotBase64,
      submittedAt:new Date().toISOString()
    };

    try{
      await fetch(CONFIG.sheetEndpoint,{
        method:"POST", mode:"no-cors",
        headers:{"Content-Type":"text/plain;charset=utf-8"},
        body:JSON.stringify(payload)
      });

      // form.reset() is safe here (just clears field values), but syncTrack()
      // must NOT run yet — it wipes this success message and snaps step2
      // back to step1 instantly, which read as "the form just reloaded".
      // Give the person a moment to actually see the message first.
      form.reset();
      if(paid){
        say("Payment reference received. Your slot is confirmed once we verify it — usually under 48 hours.","ok");
      }else{
        say("Entry saved. Check your email — we've sent your entry ID.","ok");
      }
      setTimeout(()=>{
        closeModal();
        syncTrack();
        if(window.__showSuccess) window.__showSuccess(t.id);
      },1600);
    }catch(err){
      say("We couldn't save that. Check your connection and try again, or email us directly.","err");
      btn.disabled=false; syncTrack();
    }
  }
}

/* ---------- legal pages (Terms, Refund policy, Privacy) ----------
   Real content, not filler — kept in one place so it's consistent
   across all six pages. "Contact us" is deliberately left as a plain
   mailto/CONFIG-driven link elsewhere, not part of this modal — that
   one's on the backend/ops side to wire up, not legal copy. */
const LEGAL = {
  terms:{
    title:"Terms and conditions",
    body:`
      <p>These terms apply to anyone registering for or attending a AniFX 2026 competition, run by the School of Creative Studies, DY Patil Deemed to be University, Navi Mumbai, on 23–24 October 2026.</p>
      <ul>
        <li><b>Eligibility.</b> You must be a currently enrolled college student, 18 years or older, to register for any competition. We may ask for valid college ID at the offline stages.</li>
        <li><b>Registration.</b> A registration is only confirmed once payment (where applicable) is received and verified. Submitting the form alone does not hold your slot.</li>
        <li><b>Accuracy of details.</b> You're responsible for the accuracy of every name, contact number, email and college listed at registration. Incorrect details that prevent us from reaching you or verifying eligibility can result in forfeit, at the Tournament Director's discretion.</li>
        <li><b>Rules.</b> Each competition has its own rules, published on that competition's own page. Registering means you've read and accepted them, alongside these general terms.</li>
        <li><b>Conduct.</b> Harassment, cheating, use of unauthorised software or hardware, or unsporting conduct toward organisers, staff or other participants can result in disqualification without refund, at any stage of the event.</li>
        <li><b>Changes to the event.</b> Dates, venues, formats or schedules may change if circumstances require it. Registered participants will be notified at the contact details they provided.</li>
        <li><b>Media.</b> Photos and video may be taken during the event (including the offline finals) for AniFX's own promotional use — on our social pages, website and future editions. If you'd rather not appear, let an organiser know on the day.</li>
        <li><b>Final say.</b> Anything not explicitly covered here or in a competition's own rules is decided by the Tournament Director. That decision is final.</li>
      </ul>`
  },
  refund:{
    title:"Refund and cancellation",
    body:`<p>No refunds at any cost.</p>`
  },
  privacy:{
    title:"Privacy policy",
    body:`
      <p>This covers what happens to the information you give us when you register for AniFX 2026.</p>
      <ul>
        <li><b>What we collect.</b> The registrant's full name, age, class/year, board, college or institution, address, WhatsApp number and email, and — where a competition needs it — team name and a roster of teammates with their own names and contact details.</li>
        <li><b>What we don't collect.</b> We never see or store your card, UPI or bank details. Payment is handled entirely by our payment processor; we only receive confirmation that a payment succeeded.</li>
        <li><b>Why we collect it.</b> To confirm your registration, verify eligibility, and contact you about match times, schedule changes or results.</li>
        <li><b>Where it's shown.</b> Your details are not published on the site. Names/colleges are used internally to run the tournament (seeding, match scheduling, on-the-day check-in) — nothing registrant-identifying is shown publicly. Phone numbers and emails are never shown publicly.</li>
        <li><b>Who it's shared with.</b> Your details are used internally by the AniFX organising team only, plus our payment processor for the transaction itself. We don't sell or hand this data to any other third party.</li>
        <li><b>How long we keep it.</b> Registration data is kept for the running of the festival and a reasonable period after for records and disputes, then deleted.</li>
        <li><b>Questions or removal requests.</b> Reach out through the contact details listed on this site and we'll sort it out.</li>
      </ul>`
  }
};
if($("#legalModal")){
  const lmodal=$("#legalModal"), ltitle=$("#legalTitle"), lbody=$("#legalBody");
  function openLegal(key){
    const entry=LEGAL[key];
    if(!entry) return;
    ltitle.textContent=entry.title;
    lbody.innerHTML=entry.body;
    lmodal.classList.add("open");
    document.body.style.overflow="hidden";
  }
  function closeLegal(){
    lmodal.classList.remove("open");
    document.body.style.overflow="";
  }
  document.addEventListener("click",e=>{
    const t=e.target.closest("[data-open-legal]");
    if(t){ e.preventDefault(); openLegal(t.dataset.openLegal); }
  });
  $("#legalClose").addEventListener("click",closeLegal);
  lmodal.addEventListener("click",e=>{ if(e.target===lmodal) closeLegal(); });
  document.addEventListener("keydown",e=>{ if(e.key==="Escape"&&lmodal.classList.contains("open")) closeLegal(); });
}

/* ---------- FC26 hero: ball genuinely random each loop ----------
   A CSS @keyframes animation repeats the identical path every cycle —
   client rejected that outright, it reads as an obvious loop. This
   drives the ball with the Web Animations API instead, picking a new
   direction, style (lob / low skidding pass / weaving) and timing each
   time round, so it never retraces the same motion twice in a row. */
if($(".fc-ball") && !reduceMotion){
  const ball = $(".fc-ball");
  const rand = (min,max) => min + Math.random()*(max-min);
  const pick = arr => arr[Math.floor(Math.random()*arr.length)];

  function buildPath(){
    const toRight = Math.random() < 0.5;
    const style = pick(["lob","low","weave"]);
    const startX = toRight ? rand(5,12) : rand(88,95);
    const endX   = toRight ? rand(93,96) : rand(4,7);
    const midX   = startX + (endX-startX)*rand(.4,.6);
    const baseY  = rand(58,68);

    let frames;
    if(style==="lob"){
      frames = [
        {left:startX+"%", top:baseY+"%", transform:"scale(1)", opacity:0, offset:0},
        {opacity:1, offset:.08},
        {left:midX+"%", top:rand(22,32)+"%", transform:"scale(.75)", offset:.5},
        {left:endX+"%", top:"50%", transform:"scale(.4)", opacity:.7, offset:.94},
        {left:endX+"%", top:"50%", transform:"scale(.2)", opacity:0, offset:1}
      ];
    } else if(style==="low"){
      frames = [
        {left:startX+"%", top:baseY+"%", transform:"scale(1)", opacity:0, offset:0},
        {opacity:1, offset:.08},
        {left:midX+"%", top:rand(56,64)+"%", transform:"scale(.85)", offset:.5},
        {left:endX+"%", top:"50%", transform:"scale(.45)", opacity:.75, offset:.93},
        {left:endX+"%", top:"50%", transform:"scale(.2)", opacity:0, offset:1}
      ];
    } else {
      const dip = rand(48,58);
      frames = [
        {left:startX+"%", top:baseY+"%", transform:"scale(1)", opacity:0, offset:0},
        {opacity:1, offset:.06},
        {left:(startX+midX)/2+"%", top:rand(30,38)+"%", transform:"scale(.8)", offset:.32},
        {left:midX+"%", top:dip+"%", transform:"scale(.7)", offset:.55},
        {left:(midX+endX)/2+"%", top:rand(28,36)+"%", transform:"scale(.6)", offset:.78},
        {left:endX+"%", top:"50%", transform:"scale(.4)", opacity:.7, offset:.94},
        {left:endX+"%", top:"50%", transform:"scale(.2)", opacity:0, offset:1}
      ];
    }
    return {frames, duration:rand(4600,7400), startX, endX, baseY};
  }

  // Two "dot" players that pulse at each end of the ball's path, as if
  // they're the ones striking it. Positions come straight from the same
  // randomized path each kick, so they're never in the same spot twice.
  const playersEl = $("#fcPlayers");
  const dots = playersEl ? [0,1].map(()=>{
    const d=document.createElement("span"); d.className="fc-dot"; playersEl.appendChild(d); return d;
  }) : [];

  function playKick(){
    const {frames,duration,startX,endX,baseY} = buildPath();
    const anim = ball.animate(frames, {duration, easing:"cubic-bezier(.4,0,.2,1)", fill:"forwards"});
    if(dots.length===2){
      dots[0].style.left=startX+"%"; dots[0].style.top=baseY+"%";
      dots[1].style.left=endX+"%"; dots[1].style.top="50%";
      dots[0].animate([{transform:"scale(.7)",opacity:.5},{transform:"scale(1.3)",opacity:1,offset:.08},{transform:"scale(1)",opacity:.85}],
        {duration:duration*.18, easing:"cubic-bezier(.4,0,.2,1)"});
      setTimeout(()=>{
        dots[1].animate([{transform:"scale(.7)",opacity:.5},{transform:"scale(1.3)",opacity:1,offset:.3},{transform:"scale(1)",opacity:.85}],
          {duration:duration*.18, easing:"cubic-bezier(.4,0,.2,1)"});
      }, duration*.82);
    }
    anim.onfinish = playKick;
  }
  playKick();
}

/* ---------- generic reveal for whatever's left on the page ---------- */
revealNodes($$(".sec-head, .strip-item, .sched-day, [data-acc], .stream-main, footer, .pill-row"),{once:!!PAGE_TRACK});

/* ---------- landing-page-only: intro title card. A genuinely separate
   phase before the real page — its own dedicated scroll runway
   (#introSpacer), not layered on top of the hero's own scroll position.
   Sequence: text dissolves against solid black first; only once it's
   completely gone does the black itself fade out; only once THAT'S done
   does the real page begin — and shared.js resets the hero's own scroll
   effects (title parallax, hero-inner fade, below) so they start
   completely fresh from that point, exactly as they behaved before this
   intro existed.
   The background fade-out window is deliberately NOT "the last bit of
   dist" by feel — it's computed as exactly (dist-viewportHeight) to
   dist, i.e. it only starts becoming transparent once the real header
   has already started entering the viewport from below. That's what
   guarantees a true, gradual cross-fade with zero risk of ever showing
   blank spacer space (the bug from the very first version of this). ---------- */
if($("#introFx") && $("#introSpacer")){
  if(reduceMotion){
    $("#introFx").remove();
    $("#introSpacer").remove();
  }else{
    const overlay=$("#introFx"), word=$(".intro-word",overlay), hint=$(".intro-hint",overlay), spacer=$("#introSpacer");
    const skipBtn=$("#introSkip",overlay);
    let dist=Math.max(spacer.offsetHeight,1);
    let ticking6=false;
    let introDone=false;
    if(skipBtn){
      // First-ever visit to this device: full intro, no escape hatch.
      // Every load after that (including an immediate refresh) unlocks
      // the skip button, so a returning visitor isn't forced to rewatch
      // it every single time.
      let seenBefore=true;
      try{
        seenBefore = localStorage.getItem("anifxSeenIntro")==="1";
        if(!seenBefore) localStorage.setItem("anifxSeenIntro","1");
      }catch(e){ /* storage unavailable (private mode etc) — default to showing it */ }
      if(seenBefore) skipBtn.hidden=false;
      skipBtn.addEventListener("click",()=>{
        window.scrollTo({top:dist, behavior:"smooth"});
      });
    }
    // Split into individual letters so the dissolve cascades left-to-right
    // instead of the whole word fading as one flat block. The real text
    // stays screen-reader visible via aria-label; the letter spans are
    // aria-hidden decoration.
    word.setAttribute("aria-label", word.textContent);
    const letters=(function(){
      const walker=document.createTreeWalker(word, NodeFilter.SHOW_TEXT);
      const nodes=[]; let n; while(n=walker.nextNode()) nodes.push(n);
      const out=[];
      nodes.forEach(node=>{
        const frag=document.createDocumentFragment();
        [...node.textContent].forEach(ch=>{
          const span=document.createElement("span");
          span.className="intro-letter";
          span.setAttribute("aria-hidden","true");
          span.textContent=ch===" "?" ":ch;
          frag.appendChild(span);
          out.push(span);
        });
        node.parentNode.replaceChild(frag,node);
      });
      return out;
    })();
    function applyIntro(){
      // Once the intro has fully resolved, scrolling back up over its
      // spacer must not replay it — it's a one-shot per page load, not a
      // scroll-linked toggle. Latch it done and stop touching the overlay.
      if(introDone){ ticking6=false; return; }
      const p=Math.min(Math.max(window.scrollY/dist,0),1);
      const textStart=0.06, textEnd=0.42;
      const textP=Math.min(Math.max((p-textStart)/(textEnd-textStart),0),1);
      // Shorter black-clear window than before: starts later (closer to
      // the very end), while still never earlier than the safe point
      // where real content has already begun entering the viewport.
      const revealStart=Math.min(Math.max(1-(window.innerHeight*0.4)/dist, textEnd+0.04),0.92);
      const bgP=Math.min(Math.max((p-revealStart)/(1-revealStart),0),1);
      const spread=0.5;
      letters.forEach((span,i)=>{
        const frac=letters.length>1?i/(letters.length-1):0;
        const localP=Math.min(Math.max((textP-frac*spread)/(1-spread),0),1);
        span.style.opacity=String(1-localP);
        span.style.transform="translateY("+(localP*-16)+"px) scale("+(1+localP*0.35)+")";
        span.style.filter="blur("+(localP*9)+"px)";
        const glow=Math.sin(localP*Math.PI);
        span.style.textShadow=glow>0.02?"0 0 "+(glow*22)+"px rgb(226 57 74 / "+(glow*0.9)+")":"none";
      });
      hint.style.opacity=String(Math.max(1-p/0.1,0));
      overlay.style.opacity=String(1-bgP);
      overlay.style.display=bgP>=1?"none":"flex";
      if(bgP>=1){
        introDone=true;
        // Collapse the spacer's scroll runway too, not just the overlay —
        // otherwise it just sits there as dead blank space you scroll
        // through on the way back up. Compensate scrollY by the same
        // amount so collapsing it doesn't jump the content underneath.
        const collapsedBy=spacer.offsetHeight;
        spacer.style.height="0px";
        spacer.style.margin="0";
        spacer.style.border="0";
        window.scrollTo(window.scrollX, Math.max(window.scrollY-collapsedBy,0));
      }
      // Explicit, not relied-on-inheritance: the skip button sits inside
      // the fading overlay, but its own opacity/interactivity is driven
      // directly here too, so it visibly fades and un-clicks in sync
      // with everything else — reversible both ways, same as the rest
      // of this page's scroll effects.
      if(skipBtn){
        skipBtn.style.opacity=String(1-bgP);
        skipBtn.style.pointerEvents=bgP>=1?"none":"auto";
      }
      ticking6=false;
    }
    addEventListener("scroll",()=>{
      if(!ticking6){ requestAnimationFrame(applyIntro); ticking6=true; }
    },{passive:true});
    addEventListener("resize",()=>{ dist=Math.max(spacer.offsetHeight,1); applyIntro(); });
    applyIntro();
  }
}

/* ---------- landing-page brand break ----------
   The outline-to-fill scroll wipe that used to live here is pulled out for
   now (client wants to redesign this moment separately) — the heading just
   shows in its filled accent color from the start, no scroll-linked effect. */
if($("#brandBreak")){
  $("#brandBreak").classList.add("in");
  const fillSpans=$$(".outline-fill",$("#brandBreak"));

  /* Shrink-to-fit safety net. The CSS clamp() alone was calibrated against
     this sandbox's rendering and still overflowed in the real world (client
     screenshot showed "FESTIVAL." clipped at the edge) — font metrics vary
     enough across browsers/zoom/OS that a fixed clamp() can't be trusted to
     never overflow. This measures the ACTUAL rendered width every time and
     shrinks until it genuinely fits, so it's correct regardless of font
     rendering differences instead of another guessed number. */
  function fitBrandBreak(){
    const text=document.querySelector(".brand-break .outline-text");
    if(!text || !fillSpans.length) return;
    text.style.fontSize="";               // reset to the CSS clamp() value first
    const maxWidth=text.parentElement.clientWidth;
    let guard=40;
    while(guard-- > 0){
      const widest=Math.max(...fillSpans.map(s=>s.scrollWidth));
      if(widest<=maxWidth-4) break;        // 4px safety margin
      const size=parseFloat(getComputedStyle(text).fontSize);
      if(size<=20) break;                  // don't shrink into illegibility
      text.style.fontSize=(size-2)+"px";
    }
  }
  fitBrandBreak();
  addEventListener("resize",fitBrandBreak);
  // The web font (Archivo) often finishes loading AFTER this first run, while
  // a fallback font is still showing — the fallback and the real font don't
  // measure the same width, so the size picked against the fallback can be
  // wrong once the real font swaps in, with nothing re-checking it. This is
  // the actual bug that shipped: this sandbox's network always blocks Google
  // Fonts, so every test here only ever exercised the fallback-font case.
  // document.fonts.ready fires once the browser has actually finished
  // resolving every @font-face — re-run the fit right then.
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(fitBrandBreak);
  // Second, broader safety net: catch ANY future width change (this element
  // or its container), not just the font-swap case above, so this class of
  // bug can't recur for a different reason later.
  if(window.ResizeObserver){
    new ResizeObserver(fitBrandBreak).observe($("#brandBreak"));
  }

  if(fillSpans.length && !reduceMotion){
    const el=$("#brandBreak");
    let ticking5=false;
    function updateFill(){
      const r=el.getBoundingClientRect(), vh=innerHeight;
      const start=vh, end=-r.height;
      let p=(start-r.top)/(start-end);
      p=Math.min(1,Math.max(0,p));
      fillSpans.forEach(s=>s.style.setProperty("--fill-pct",(p*100)+"%"));
      ticking5=false;
    }
    addEventListener("scroll",()=>{ if(!ticking5){ requestAnimationFrame(updateFill); ticking5=true; } },{passive:true});
    addEventListener("resize",updateFill);
    updateFill();
  }
}

/* ---------- content tabs (event pages) ---------- */
if($(".content-tabs")){
  function selectPanel(panelId){
    $$(".ctab").forEach(b=>b.setAttribute("aria-selected", String(b.dataset.panel===panelId)));
    $$(".tab-panel").forEach(p=>p.classList.toggle("active", p.id===panelId));
  }
  $$(".ctab").forEach(btn=>btn.addEventListener("click",()=>selectPanel(btn.dataset.panel)));
  $$("[data-panel-link]").forEach(a=>a.addEventListener("click",e=>{
    e.preventDefault();
    selectPanel(a.dataset.panelLink);
    $("#"+a.dataset.panelLink).scrollIntoView({behavior:reduceMotion?"auto":"smooth", block:"start"});
  }));
}

/* ---------- scroll progress + compact nav ---------- */
if($("#scrollProgress")){
  const bar=$("#scrollProgress"), head=$("header");
  let ticking=false;
  function apply(){
    const h=document.documentElement;
    const max=h.scrollHeight-h.clientHeight;
    bar.style.width=(max>0 ? (h.scrollTop/max*100) : 0)+"%";
    head.classList.toggle("scrolled", h.scrollTop>40);
    ticking=false;
  }
  addEventListener("scroll",()=>{
    if(!ticking){ requestAnimationFrame(apply); ticking=true; }
  },{passive:true});
  apply();
}

/* ---------- stat strip count-up ---------- */
(function(){
  if(reduceMotion) return;
  const nums=$$(".strip-num");
  if(!nums.length) return;
  function countUp(el){
    const text=el.textContent;
    const match=text.match(/[\d,]+/);
    if(!match) return;
    const target=parseInt(match[0].replace(/,/g,""),10);
    if(isNaN(target)) return;
    const prefix=text.slice(0,match.index), suffix=text.slice(match.index+match[0].length);
    const dur=1100, start=performance.now();
    function tick(now){
      const p=Math.min((now-start)/dur,1);
      const eased=1-Math.pow(1-p,3);
      el.textContent=prefix+Math.round(target*eased).toLocaleString("en-IN")+suffix;
      if(p<1) requestAnimationFrame(tick); else el.textContent=text;
    }
    requestAnimationFrame(tick);
  }
  const io2=new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(en.isIntersecting){ countUp(en.target); io2.unobserve(en.target); }
    });
  },{threshold:.5});
  nums.forEach(el=>io2.observe(el));
})();

/* ---------- magnetic hover: Register buttons (nav pill + hero CTAs)
   AND the header's plain nav links (VALORANT, FC26, Game Jam, Film
   Festival, Character Design, On campus) — not the logo, which would
   read as a bug rather than a feature. nudge a few px toward the
   cursor while hovering, spring back on leave. Deliberately small
   (MAX px) — a felt detail, not a jump. Skipped under
   prefers-reduced-motion and on touch/coarse pointers, where hover
   has no meaning and would just leave the element offset. */
if(!reduceMotion && !matchMedia("(pointer: coarse)").matches){
  const MAX = 7;
  $$("[data-open-reg], .nav-links a:not(.nav-cta)").forEach(btn=>{
    btn.style.transition = "transform .25s cubic-bezier(.19,.68,.24,.99)";
    btn.addEventListener("mousemove",e=>{
      const r = btn.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - .5) * 2;
      const y = ((e.clientY - r.top)  / r.height - .5) * 2;
      btn.style.transition = "transform .08s linear";
      btn.style.transform = "translate("+(x*MAX).toFixed(1)+"px,"+(y*MAX).toFixed(1)+"px)";
    });
    btn.addEventListener("mouseleave",()=>{
      btn.style.transition = "transform .25s cubic-bezier(.19,.68,.24,.99)";
      btn.style.transform = "translate(0,0)";
    });
  });

  /* ---------- event-card hover: lift + cursor glow -------------
     Tilt (rotateX/rotateY) was tried and explicitly not wanted on
     cards — removed. Keeping the plain lift plus the cursor-tracking
     glow (.event-card-glow, see shared.css), which tracks the pointer
     via --mx/--my. Reveal-in-progress cards are left alone (no lift
     until reveal.in is set) so this never fights the scroll-in slide.
     .tilt-ready flips the glow's opacity-on-hover rule on (name kept
     for the CSS hook even though tilt itself is gone). */
  $$(".event-card").forEach(card=>{
    card.classList.add("tilt-ready");
    card.style.transition = "transform .5s cubic-bezier(.19,.68,.24,.99), box-shadow .5s cubic-bezier(.16,.8,.3,1)";
    card.addEventListener("mousemove",e=>{
      if(!card.classList.contains("in")) return; // still mid scroll-reveal — don't fight it
      const r = card.getBoundingClientRect();
      const px = e.clientX - r.left, py = e.clientY - r.top;
      card.style.transition = "transform .08s linear";
      card.style.transform = "translateY(-6px)";
      card.style.setProperty("--mx", px+"px");
      card.style.setProperty("--my", py+"px");
      card.style.boxShadow = "0 20px 44px -14px rgb(0 0 0 / .3)";
    });
    card.addEventListener("mouseleave",()=>{
      card.style.transition = "transform .5s cubic-bezier(.19,.68,.24,.99), box-shadow .5s cubic-bezier(.16,.8,.3,1)";
      card.style.transform = "";
      card.style.boxShadow = "";
    });
  });
}

/* ---------- film reel-strip: intersection-gated video playback ----------
   16 simultaneously-autoplaying <video> elements (4 unique clips x 4
   repeats each, for the seamless-scroll duplication) was hitting real
   browser limits on concurrent video decode — some played, some
   silently didn't, inconsistently, depending on the browser/device.
   Removed the blind autoplay attribute (see film-festival.html); only
   play a cell's video once it's actually near the visible strip, and
   pause it again once it scrolls back out — keeps at most a handful
   decoding at once, matching what's actually on screen. */
if($(".fm-strip")){
  const fmVideos = $$(".fm-cell video");
  if(fmVideos.length && window.IntersectionObserver){
    const io3 = new IntersectionObserver(entries=>{
      entries.forEach(en=>{
        if(en.isIntersecting) en.target.play().catch(()=>{});
        else en.target.pause();
      });
    }, { root: $(".fm-strip"), rootMargin: "200px" });
    fmVideos.forEach(v=>io3.observe(v));
  }else{
    // No IntersectionObserver support — fall back to playing all of them,
    // same as before, rather than showing permanently-frozen video.
    fmVideos.forEach(v=>v.play().catch(()=>{}));
  }
}

})();
