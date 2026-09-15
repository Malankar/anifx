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
  sheetEndpoint: "https://script.google.com/macros/s/AKfycbxJWqLlMC4CJW8W5Q929BrirW4Y0LOgEl4xOdvFYrc6E0V72NBjpmZCTlpeuocur8vgeA/exec",

  /* --- your details ---------------------------------------------- */
  contactEmail: "anifx.fest@gmail.com",
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
        {time:"10:00", title:"VALORANT Grand Finale",                where:"Game Lab", feature:true},
        {time:"11:00", title:"FC26",                                 where:"204, 205"}
      ]
    },
    {
      day:"Saturday 24 October",
      items:[
        {time:"10:00", title:"Screening of film and animation",      where:"Auditorium"},
        {time:"14:00", title:"Game jam screening",                   where:"Auditorium", feature:true},
        {time:"16:00", title:"Prize distribution - all categories",  where:"Auditorium", feature:true}
      ]
    }
  ],
  scheduleNote:"Schedule is subject to change by the organisers.",

  /* --- game jam timeline -------------------------------------------
     Online-only, so it's kept separate from `schedule` above (that one
     is specifically the in-person, on-campus weekend and also feeds
     the homepage's On Campus section). Rendered only on the Game Jam
     page's own Schedule tab, via #gjTimeline. */
  gamejamTimeline:[
    {time:"14 Oct, 23:59", title:"Game jam registration closes", where:"Online"},
    {time:"15 Oct, 10:00", title:"Game jam Discord invite and brief", where:"Online"},
    {time:"16 Oct, 12:00", title:"Game jam begins - 100-hour clock starts", where:"Online", feature:true},
    {time:"16 Oct, 22:00", title:"Game jam milestone: GDD due (10h)", where:"Online"},
    {time:"17 Oct, 08:00", title:"Game jam milestone: Artbook due (20h)", where:"Online"},
    {time:"18 Oct, 04:00", title:"Game jam milestone: Alpha due (40h)", where:"Online"},
    {time:"19 Oct, 20:00", title:"Game jam milestone: Beta due (80h)", where:"Online"},
    {time:"20 Oct, 16:00", title:"Game jam ends - final submission due (100h)", where:"Online", feature:true}
  ],

  /* --- valorant online timeline -------------------------------------
     Same reasoning as gamejamTimeline above: online-only, kept out of
     `schedule` so it doesn't show on the homepage's On Campus section.
     Rendered only on the VALORANT page's own Schedule tab, via
     #vTimeline. */
  valorantTimeline:[
    {time:"10-16 Oct, 17:00", title:"Group stage matches (evenings)", where:"Online"},
    {time:"18 Oct, 12:00", title:"Semi-finals", where:"Online", feature:true}
  ],
  valorantTimelineNote:"Exact timing and dates for online matches will be communicated through the Discord server.",

  /* --- valorant on-campus schedule -----------------------------------
     Formatted specifically for this page: heading is the event itself
     (not a bare weekday/date), date+time sits in the time column,
     venue in the title slot. Replaces the generic #sched on this page
     so VALORANT's own Grand Finale/Prize distribution read cleanly
     instead of sharing the plain day-by-day format every other page
     uses. */
  valorantCampus:[
    { day:"Grand Finale", items:[
        {time:"23 October, 10:00", title:"Game Lab", feature:true}
    ]},
    { day:"Prize distribution", items:[
        {time:"24 October, 16:00", title:"Auditorium"}
    ]}
  ],

  /* --- competitions ---------------------------------------------- */
  tracks: [
    {
      id:"valorant",
      name:"VALORANT",
      page:"/valorant",
      format:"Group stage & semis online · Grand final offline on campus",
      blurb:"Group stage runs online through October, evenings, best of three. It starts 10 October, with Discord access and match fixtures going out on 9 October. Semi-finals are online, best of five. The grand final is played offline on campus.",
      isTeam:true,
      leadLabel:"Leader",
      facts:[
        ["Entry fee","₹1,000 per team"],
        ["Registration closes","9 October 2026"],
        ["Team size","5 players"],
        ["Prize","Prize pool ₹17,500"],
        ["Group stage","October, evenings, online"],
        ["Grand final","23 October, 10:00, on campus"]
      ],
      eligibility:"Open to all currently enrolled college students carrying a valid college ID. One roster per player - you may not appear on two VALORANT teams. There is no cap on the number of teams that may register.",
      fee:1000,
      feeNote:"₹1,000 per team",
      slots:0,
      closes:"9 October 2026",
      closesAt:"2026-10-09T23:59:59+05:30",
      open:true,
      payUrl:"",                 // paste Razorpay payment link
      video:"",                  // card/hero background loop — see CONFIG.heroVideo note
      cardImage:"valorant.jpg",  // fan art, made by a friend of the client's — free of
                                 // copyright per the client; used for both the index
                                 // card and (via the hero-wiring image fallback) this
                                 // track's own page hero, since there's no video yet.
      rosterLabel:"Squad - one player per line",
      rosterHint:"Name, Riot ID with tagline, phone, email. All 5 players. Riot IDs are how we invite you to the lobby - a wrong ID means a forfeit.",
      rosterPlaceholder:"Name, Riot ID#TAG, phone, email",
      rosterRequired:true
    },
    {
      id:"fc26",
      name:"FC26",
      page:"/fc26",
      format:"Solo knockout · One day · On campus",
      blurb:"A single-elimination solo knockout, played offline on campus on PlayStation.",
      isTeam:false,
      leadLabel:"",
      facts:[
        ["Entry fee","₹100 per player"],
        ["Registration closes","20 October 2026"],
        ["Format","Solo"],
        ["Prize pool","₹8,000"],
        ["Played","23 October, on campus"],
        ["Match length","6-minute halves"]
      ],
      eligibility:"Open to all currently enrolled college students. Solo entry only - there is no team registration for FC26. There's no cap on the number of entrants.",
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
      format:"100 hours · Online · Solo/Team · Side-scroller action",
      blurb:"Design, build and ship an original Side-Scroller Action game in 100 hours - 2D, 3D or a mix of both, with no mandatory theme. Teams of one to five move through five milestones, from concept to a finished, playable game.",
      isTeam:true,
      soloTeamChoice:true,
      entrySoloNote:"All rounder",
      entryTeamNote:"Up to 5 members, one lead.",
      leadLabel:"Team Lead",
      facts:[
        ["Entry fee","₹1,000 per team"],
        ["Registration closes","14 October 2026"],
        ["Team size","1 to 5"],
        ["Prize","Winner - ₹10,000"],
        ["Genre","Side-scroller action"],
        ["Duration","100 hours, online"],
        ["Screening","24 October, 14:00, on campus"]
      ],
      eligibility:"Open to all currently enrolled college students. Teams of 1 to 5 - each person may register with only one team. Solo entries are welcome. This year's theme is Side-Scroller Action. Discord access and further details are sent once you register.",
      fee:1000,
      feeNote:"₹1,000 per team",
      slots:0,
      closes:"14 October 2026",
      closesAt:"2026-10-14T23:59:59+05:30",
      open:true,
      payUrl:"",
      video:"gamejam-clip.mp4",   // gameplay capture — blended full-bleed via has-video (same treatment index card + own page both use)
      rosterLabel:"Team - one member per line",
      rosterHint:"Name, role, email. Up to 5 members. Solo entries are welcome.",
      rosterPlaceholder:"Name, role, email",
      rosterRequired:true
    },
    {
      id:"film",
      name:"Film & animation",
      page:"/film-festival",
      format:"Submission based · Solo/Team · 2D, 3D, stop motion, VFX, live action",
      blurb:"Step Into the Viewing Room of absolute visual defiance, moving straight from the editing bay to our public viewing room. It is an open invitation for true cinephiles to watch new wave directors rewrite the rules of visual language.",
      isTeam:true,
      soloTeamChoice:true,
      entrySoloNote:"All rounder",
      entryTeamNote:"Team name, lead and crew.",
      leadLabel:"Team Lead",
      categories:["2D Animation","3D Animation","Stop Motion","Live Action","Others"],
      facts:[
        ["Entry fee","Free for all"],
        ["Registration closes","19 October 2026"],
        ["Prize","Prize pool ₹55,000+"],
        ["Formats","2D, 3D, stop motion, VFX"],
        ["Screening","24 October, 10:00, on campus"],
        ["Jury","Industry panel"]
      ],
      eligibility:"Open to all - students, hobbyists and professionals alike - whether you're entering individually or as a team. Register any time before the deadline, then come back and submit your finished film separately once it's ready.",
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
      closes:"19 October 2026",
      closesAt:"2026-10-19T23:59:59+05:30",
      open:true,
      payUrl:"",
      video:"film-vfx-clip.mp4",  // restored — client wants it actually playing, not
                                  // the static image. Paritosh Khairwal | RRS's reel,
                                  // same credit caption as before.
      rosterLabel:"Team - one member per line",
      rosterHint:"Name, role, email. Solo submissions are welcome.",
      rosterPlaceholder:"Name, role, email",
      rosterRequired:false
    },
    {
      id:"character",
      name:"Character design",
      page:"/character-design",
      format:"Free entry · Solo · On campus",
      blurb:"Design an original character live at the venue, on a theme announced at the start of the competition.",
      isTeam:false,
      leadLabel:"",
      facts:[
        ["Entry fee","Free"],
        ["Registration closes","22 October 2026"],
        ["Format","Solo"],
        ["Prize","XP-Pen tablet + winner certificate"],
        ["Venue","Media Lab, COE Building, Nerul"],
        ["Competition","23 October 2026, 10:00"],
        ["Prize distribution","24 October 2026"]
      ],
      eligibility:"Open to students from colleges and educational institutes. Each participant must register and submit individually - one character design per participant. A valid college/institute ID is required at the venue.",
      fee:0,
      feeNote:"Free entry",
      slots:0,
      closes:"22 October 2026",
      closesAt:"2026-10-22T23:59:59+05:30",
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
    { name:"XP-Pen - Character Design", logoUrl:"", url:"" }
  ],

  /* --- faq (general — shown on the landing page and on every event
     page's FAQ tab) ---------------------------------------------- */
  faq:[
    { q:"Can I register for more than one competition?",
      a:"Yes, you can enter as many of the five competitions as you like." },
    { q:"What happens if a registered team drops out before the event?",
      a:"That slot is not reassigned." },
    { q:"Is there an age requirement?",
      a:"Yes, all participants must be 18 or older, except for VALORANT, where players under 18 may compete with a signed guardian consent form submitted before the group stage." },
    { q:"What's the refund policy?", tracks:["valorant","fc26","gamejam"],
      a:"No refunds at any cost." },
    { q:"What do I need to bring for the offline final?", tracks:["valorant","fc26"],
      a:"For VALORANT: your own keyboard, mouse, mousepad, and headphones/earphones. Not applicable for FC26." },
    { q:"How do I know my registration went through?",
      a:"You'll get a confirmation email after payment." },

    { q:"Can I add a substitute to my VALORANT roster?", track:"valorant",
      a:"No. Rosters are locked at five players at registration - there are no substitutes and no additions after the deadline." },
    { q:"Do I need to join the AniFX Discord?", track:"valorant",
      a:"Yes. All online matches are run through the official AniFX Discord - the invite goes to the Captain after payment is verified, and every rostered player must be in the server for their match." },
    { q:"Is there a limit on how many VALORANT teams can register?", track:"valorant",
      a:"No, there's no cap on the number of teams." },
    { q:"What happens if my team only has four players for a match?", track:"valorant",
      a:"You may start a map with four players at your own risk. You cannot start with three." },

    { q:"Is FC26 solo or team?", track:"fc26",
      a:"Solo only - there's no team registration for FC26." },
    { q:"What happens if I'm late for my FC26 match?", track:"fc26",
      a:"Five minutes from being called. After that, it's a forfeit." },

    { q:"Is the game jam fully online?", track:"gamejam",
      a:"Yes, apart from the final showing on campus - that's a public screening, not where judging happens." },
    { q:"Can I use existing assets or AI tools in the game jam?", track:"gamejam",
      a:"Legally licensed assets are fine if declared and credited. AI is permitted with mandatory disclosure. Undeclared use of either is grounds for disqualification." },
    { q:"Do I need a specific game engine?", track:"gamejam",
      a:"No - any engine is fine, none is given preferential treatment. You just need to submit a playable Windows build that runs without installing one." },
    { q:"Can I enter the game jam solo?", track:"gamejam",
      a:"Yes - teams of one to five, solo developers are welcome." },

    { q:"Can I submit a film as a team?", track:"film",
      a:"Yes - individual or team submissions are both welcome, with no cap on team size." },
    { q:"Are animation and live action judged separately?", track:"film",
      a:"Yes, by industry panels for each category." },
    { q:"When do registration and submission close?", track:"film",
      a:"Both close 19 October 2026, but they're separate steps - register any time before then, and submit your finished film separately, whenever it's ready, using the Submit your film form on this page." },
    { q:"How do I submit my film?", track:"film",
      a:"Register first if you haven't already. Then put your final film, trailer/teaser and both posters in one Google Drive folder, set sharing to \"Anyone with the link can view,\" and use the Submit your film form on this page - not the registration form - to send us that link." },

    { q:"Can I use AI tools for character design?", track:"character",
      a:"No. AI-generated artwork or generative tools aren't permitted - reference images may only be used for research and inspiration." },
    { q:"Do I need to bring anything to character design?", track:"character",
      a:"A valid college or institute ID, for verification at the venue." },
    { q:"Can I enter character design as a team?", track:"character",
      a:"No, solo only - one character design per participant." }
  ],

  /* --- rules ------------------------------------------------------
     `track` ties a rules block to one event's dedicated page (that
     page shows this block plus the two general ones below). Blocks
     with no `track` are general and show on every event page.      */
  rules:[
    {
      q:"General Rules", track:"valorant",
      items:[
        "<b>Communication:</b> All online matches are hosted and coordinated through the official AniFX Discord. The invite link goes to the Captain after payment is verified. Every rostered player must be in the server. A team with players missing from Discord at match time is treated as not reporting.",
        "<b>Entry:</b> ₹1,000 per team, paid in one transaction by the Captain. Registration closes 9 October 2026. There is no cap on the number of teams.",
        "<b>Roster:</b> Five players, locked at registration. No substitutes and no additions after the deadline. Every player's Riot ID with tagline is required, and that is the account the player uses in match.",
        "<b>Eligibility:</b> All players must be enrolled students carrying a valid college ID, checked at the offline final. Players under 18 must submit a guardian consent form before the group stage. One player, one team.",
        "<b>Format:</b> Group stage best of three, online. Knockout rounds best of three, online. Semi-finals best of five, online, 18 October 2026. Grand final best of five, played offline on campus, 23 October 2026.",
        "<b>Bracket:</b> Group allocation, seeding method, map veto order and the overtime rule are published in full with the bracket, on Discord, before the first match is played. Group tiebreakers are head-to-head, then round difference, then rounds won.",
        "<b>Lobbies:</b> Every match lobby is created by an admin on the Mumbai server, in Standard mode with tournament settings. An admin observes each match.",
        "<b>Waiting time:</b> Ten minutes from the scheduled start. After that the map is forfeit. Twenty minutes forfeits the series.",
        "<b>Timeouts:</b> Two per team per map, two minutes each. Technical pauses only during a buy phase, only for a genuine fault, with the reason stated in the match channel.",
        "<b>Ghost mode is not permitted.</b>",
        "<b>Roster shortfall:</b> A team may start a map with four players at its own risk. It may not start with three.",
        "<b>Connection:</b> Teams are responsible for their own internet. Disconnections caused by a player's own connection are not grounds for a rematch or rehost. One rehost is allowed if a player drops in round one before first blood.",
        "<b>Proof:</b> Both teams post the end-game scoreboard in the match channel immediately after each map.",
        "<b>Exploits:</b> Out-of-bounds positions, unintended boosts and abuse of map or agent bugs are banned. Vanguard must be running throughout.",
        "<b>Streaming:</b> Teams may stream their own POV on a minimum two-minute delay. Broadcast and VOD rights for admin-observed matches rest with AniFX.",
        "<b>Peripherals, offline final:</b> Finalists bring their own keyboard, mouse, mousepad and headphones. These are not provided. PC, monitor, desk and chair are provided, and system specifications are published in advance.",
        "<b>Wired peripherals only:</b> Wireless keyboards, mice and headsets are not permitted.",
        "<b>Setup:</b> Players arrive 45 minutes before match time for setup, peripheral inspection and warm-up. Crosshair and sensitivity setup is the player's own responsibility within that window.",
        "<b>Macros:</b> Any device found running macros, scripts or bound automation results in immediate disqualification and forfeit of the match.",
        "<b>Equipment failure:</b> Players whose own equipment fails may continue on organiser-provided backup equipment or forfeit. No rematch is granted.",
        "<b>Stage rule:</b> Phones stay off the play desk once the map begins.",
        "<b>Disputes:</b> Raised within 15 minutes of a match ending, in the official Discord, with evidence. Later disputes are not considered."
      ]
    },
    {
      q:"FC26", track:"fc26",
      items:[
        "<b>Entry:</b> ₹100 per player. Solo knockout - there is no team registration for FC26. Registration closes 20 October 2026.",
        "<b>Played:</b> 23 October, on campus, on organiser-provided PlayStation consoles.",
        "<b>Match length:</b> Six-minute halves, twelve minutes per game, through the bracket.",
        "<b>Final:</b> Eight-minute halves, single game.",
        "<b>Waiting time:</b> Five minutes from being called. After that, forfeit.",
        "<b>Format:</b> Single elimination. Bracket drawn and published before the first match.",
        "<b>Disputes:</b> Raised with the on-floor admin immediately, before the next match starts on that station."
      ]
    },
    {
      q:"Game jam", track:"gamejam",
      items:[
        "<b>Entry:</b> ₹1,000 per team, paid in one transaction by the Team Lead. Teams of one to five, solo developers welcome. Each person may register with only one team.",
        "<b>Prize:</b> Winner takes ₹10,000.",
        "<b>Theme:</b> None. Teams choose their own story, setting, characters and mechanics - only the side-scroller action genre requirement applies.",
        "<b>Genre:</b> Side-scrolling, action-oriented gameplay - platformers, beat-'em-ups, side-scrolling shooters, action RPGs, Metroidvania and similar are all eligible. 2D, 3D or 2.5D, with no advantage given to any format.",
        "<b>Duration:</b> 100 hours, continuous, fully online. The clock starts at the announced time and ends exactly 100 hours later.",
        "<b>Milestones:</b> Five submissions: a Game Design Document at 10 hours, an Artbook at 20 hours, a playable Alpha at 40 hours, a Beta with production assets at 80 hours, and the finished game at 100 hours.",
        "<b>Pre-jam prep:</b> Installing engines, tools and setting up a pipeline in advance is fine. The game itself must be built entirely within the 100 hours - no pre-built or partially-built submissions.",
        "<b>Engine:</b> Any. No engine receives preferential treatment.",
        "<b>Existing assets:</b> Legally licensed assets - marketplace, stock, fonts, music, open-source - are permitted if declared with credit. Undeclared assets are grounds for disqualification.",
        "<b>AI:</b> Permitted, with mandatory disclosure - the tool, the purpose, what was generated and what a human changed afterward. AI use is not automatically penalised; misrepresenting it is grounds for disqualification.",
        "<b>Originality:</b> The submitted game must be a fresh project built during the 100 hours. Previously completed, re-skinned or another team's work is not eligible. Organisers may request development history.",
        "<b>Ownership:</b> Teams keep full ownership of their game. AniFX may use footage and screenshots for promotion. Teams are responsible for the rights to every asset, plugin and library in their submission.",
        "<b>Build:</b> A playable Windows build that runs without installing a game engine. Test it before you submit it.",
        "<b>Scope:</b> A small, finished, polished game scores higher than a large unfinished one.",
        "<b>Confidentiality:</b> Submitted source files are for judging only and won't be publicly distributed without permission. Remove any passwords, API keys or private credentials before submitting.",
        "<b>Conduct:</b> Judging manipulation and unauthorised access to another team's project are grounds for removal from the competition, on top of the general conduct rules below.",
        "<b>Tie-breaker:</b> Ties are resolved by the Final Game score, then Gameplay &amp; Game Feel, then Animation Quality, then Art Direction, then Originality.",
        "<b>Screening:</b> The finished games are shown on campus, 24 October at 14:00 - this is a public screening, not where judging happens."
      ]
    },
    {
      q:"Film & animation", track:"film",
      items:[
        "<b>Entry:</b> Free for all entrants - students (DY Patil or any other college), animation hobbyists and professionals.",
        "<b>Prize:</b> Prize pool ₹55,000+ across 11 award categories.",
        "<b>Submission:</b> Registration and submission are two separate steps. Register any time before the deadline, then use the Submit your film form on this page to send your finished film - both close 19 October 2026.",
        "<b>Deliverables:</b> Along with the film: an official trailer or teaser, and two posters - vertical (4:5) and horizontal (16:9). All shared as one Google Drive folder link, set to \"Anyone with the link can view.\"",
        "<b>Runtime:</b> Short films 5 to 20 minutes, animation films under 5 minutes, both inclusive of credits.",
        "<b>Format:</b> MP4 or H.264, minimum resolution 1920 × 1080. Non-English films must be dubbed or subtitled in English.",
        "<b>Multiple entries:</b> You may submit more than one film - each as its own separate, complete entry.",
        "<b>Categories:</b> Animation - 2D, 3D, stop motion and VFX - and live action, judged separately.",
        "<b>Jury:</b> Industry panels for each category.",
        "<b>Content standards:</b> No explicit content, vulgar language, plagiarism, or content targeting caste, religion, gender or individual identity. Any of these results in immediate disqualification.",
        "<b>AI:</b> Up to 50% of the final film may be AI-assisted. The majority must be human-made - submissions over that threshold are not accepted.",
        "<b>Clearances:</b> Filmmakers are responsible for securing location permissions and music or soundtrack licenses before submitting.",
        "<b>Screening:</b> 24 October at 10:00, on campus.",
        "<b>Certificates and awards:</b> Every participating team receives an e-certificate. To claim an award, at least two team members must be present at the screening and award ceremony.",
        "<b>Ownership:</b> Filmmakers keep full ownership. AniFX may screen the work at the festival and use stills, posters and excerpts for promotion.",
        "<b>Selection:</b> The screening schedule and selection decisions are made by the organising committee and are final."
      ]
    },
    {
      q:"Character design", track:"character",
      items:[
        "<b>Organised by</b> the School of Creative Studies, DY Patil Deemed to be University.",
        "<b>Entry:</b> Free. Solo only - each participant registers and submits individually. One character design per participant.",
        "<b>Eligibility:</b> Open to students from colleges and educational institutes. A valid college/institute ID is required for verification at the venue.",
        "<b>Venue and time:</b> Media Lab, COE Building, DY Patil Deemed to be University, Nerul, Navi Mumbai - 23 October 2026, 10:00.",
        "<b>Format:</b> The theme and competition brief are announced at the start of the competition. The character must be conceived and designed entirely during the competition period - no pre-made work.",
        "<b>Originality:</b> The character must be the participant's own original creation. Copying, tracing or reproducing an existing character, artwork or franchise is strictly prohibited. General inspiration from culture, history, mythology or real-world references is fine - the final character must be an original interpretation.",
        "<b>AI:</b> Not permitted. AI-generated artwork, character generators or generative tools may not be used to create or substantially generate the final design. Reference images may only be used for research and inspiration.",
        "<b>Software and equipment:</b> Participants may use organiser-provided or approved software, or their own approved digital drawing equipment, subject to venue and technical restrictions.",
        "<b>Submission:</b> Final character artwork plus the participant's name, institute/college name and registration details, in the format specified by organisers. Organisers may request the working/source file to verify originality.",
        "<b>Judging:</b> Interpretation of theme 20% · Originality & creativity 25% · Character design & visual development 20% · Concept & personality 15% · Technical execution 10% · Presentation & overall impact 10%. The jury's decision is final.",
        "<b>Disqualification:</b> Plagiarism, use of an existing character or AI-generated artwork, pre-competition work, using someone else's assets without permission, false registration information, or work submitted by someone other than the registered participant.",
        "<b>Ownership:</b> Participants retain ownership of their original artwork. By entering, participants grant AniFX a non-exclusive right to display and use submitted artwork for festival promotion, exhibition, social media, website, publicity and archival purposes.",
        "<b>Prize:</b> Winner receives an XP-Pen tablet and a winner certificate. Additional special jury mentions may be awarded at the jury's discretion.",
        "<b>Prize distribution:</b> 24 October 2026."
      ],
      warn:"The organisers reserve the right to modify the competition format, schedule or rules if required due to unforeseen circumstances."
    },
    {
      q:"Payment, refunds and prize money",
      items:[
        "<b>Payment:</b> Entry is confirmed only when payment is received and verified against our account. Keep your transaction reference.",
        "<b>Verification:</b> Verified teams appear on this site. If you have paid and are not listed within 48 hours, email us with your reference number.",
        "<b>Unverified entries:</b> Entries that cannot be verified 72 hours before the first match are removed from the bracket.",
        "<b>Refunds:</b> No refunds at any cost. Once payment is made it is final, whether or not the team plays, withdraws, is disqualified or is removed from the bracket.",
        "<b>Prize money:</b> Paid to the registered Captain, Team Lead or solo entrant after the festival. Prize distribution for all categories is on 24 October 2026. Winners submit PAN and bank details, and applicable tax deductions apply. Disbursal is within 45 days."
      ]
    },
    {
      q:"Conduct and disqualification",
      items:[
        "<b>Conduct:</b> Harassment, hate speech, threats, discriminatory behaviour, impersonation, stream sniping and deliberate disruption are not tolerated, on campus or in official channels. Penalties run warning, then map forfeit, then disqualification.",
        "<b>Communication:</b> Participants must join the official WhatsApp group and Discord. Schedules are communicated there and by email. Missing a match because you did not join is not grounds for a reschedule.",
        "<b>Cheating:</b> Any form of cheating, account sharing, smurfing, ringers, third-party software or unauthorised automation results in immediate disqualification with no refund.",
        "<b>Decisions:</b> Anything not covered by these rules is decided by the Tournament Director for that competition. That decision is final.",
        "<b>Changes:</b> Any rule change is announced through official channels before it takes effect. No rule is introduced or changed during a match."
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
      img.src=t.cardImage; img.alt=t.name+" - event photo";
      img.closest(".track-media, .event-card").classList.add("has-img");
    }
  });
  $$("[data-track-gallery]").forEach(box=>{
    const t=CONFIG.tracks.find(x=>x.id===box.dataset.trackGallery);
    if(t && t.cardGallery && t.cardGallery.length){
      box.innerHTML = t.cardGallery.map(src=>'<img src="'+esc(src)+'" alt="'+esc(t.name)+' - student sketch by Shivam Prasad" title="Shivam Prasad" loading="lazy">').join("");
      box.closest(".track-media, .event-card").classList.add("has-gallery");
    }
  });
}

/* ---------- contact (every page) ---------- */
if($("#mailLink") && CONFIG.contactEmail){
  const a=$("#mailLink"); a.textContent=CONFIG.contactEmail; a.href="mailto:"+CONFIG.contactEmail; a.classList.remove("todo");
}
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
      + '<p class="track-desc" style="margin-top:16px"><b style="color:var(--bone)">Eligibility:</b> '+esc(t.eligibility||"")+'</p>'
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


/* ---------- faq (index shows every entry; each event page's FAQ tab
   shows only its own track's entries plus the generic ones — no
   `track`/`tracks` field — same filtering pattern as rules, below.
   `track` ties an entry to one track; `tracks` (an array) ties it to
   a subset of several — used for entries relevant to some but not
   all tracks, e.g. only the paid ones. ---------- */
if($("#faqWrap")){
  const faqItems = PAGE_TRACK
    ? (CONFIG.faq||[]).filter(f=>{
        if(f.tracks) return f.tracks.includes(PAGE_TRACK);
        return !f.track || f.track===PAGE_TRACK;
      })
    : (CONFIG.faq||[]);
  $("#faqWrap").innerHTML=faqItems.map(f=>
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
    $("#sched").innerHTML='<div class="empty-card">Schedule for this event is not published yet - check the On Campus page once the draw is out.</div>';
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

/* ---------- game jam online timeline (game jam page only) ----------
   Separate from #sched above on purpose — that one is the in-person
   weekend and also feeds the homepage's On Campus section; this is
   online-only and has no business showing up there. */
if($("#gjTimeline")){
  const items=CONFIG.gamejamTimeline||[];
  $("#gjTimeline").innerHTML = items.length
    ? '<div class="sched-day"><h3>14-20 October, online</h3>'
      + items.map(it=>
          '<div class="slot-row'+(it.feature?" feature":"")+'">'
          + '<span class="sr-time">'+esc(it.time)+'</span>'
          + '<span><span class="sr-title">'+esc(it.title)+'</span>'
          + (it.where?'<span class="sr-where">'+esc(it.where)+'</span>':'')+'</span>'
          + '</div>').join("")
      + '</div>'
    : "";
}

/* ---------- valorant online timeline (valorant page only) ----------
   Same reasoning as #gjTimeline above. */
if($("#vTimeline")){
  const items=CONFIG.valorantTimeline||[];
  $("#vTimeline").innerHTML = items.length
    ? '<div class="sched-day"><h3>Group stage & semi-finals, online</h3>'
      + items.map(it=>
          '<div class="slot-row'+(it.feature?" feature":"")+'">'
          + '<span class="sr-time">'+esc(it.time)+'</span>'
          + '<span><span class="sr-title">'+esc(it.title)+'</span>'
          + (it.where?'<span class="sr-where">'+esc(it.where)+'</span>':'')+'</span>'
          + '</div>').join("")
      + '</div>'
    : "";
  if($("#vTimelineNote")) $("#vTimelineNote").textContent=CONFIG.valorantTimelineNote||"";
}

/* ---------- valorant on-campus schedule (valorant page only) ----------
   Replaces the generic #sched on this page — see CONFIG.valorantCampus
   for why. */
if($("#vCampus")){
  const days=CONFIG.valorantCampus||[];
  $("#vCampus").innerHTML=days.map(day=>
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

/* ---------- payment success (every page with the modal) ---------- */
if($("#successScreen")){
  const successScreen=$("#successScreen");
  const showSuccess=function(trackId, paid, isTeam){
    const t=CONFIG.tracks.find(x=>x.id===trackId);
    // isTeam reflects what the person actually picked this submission
    // (only meaningful for soloTeamChoice tracks); falls back to the
    // track's own fixed shape when not passed, e.g. the URL-triggered
    // ?paid= path below, which has no form state to read from.
    const teamish = isTeam===undefined ? (t&&t.isTeam) : isTeam;
    $("#successTitle").textContent = paid===false ? "Registration received" : "Payment received";
    if(t) $("#successLine").textContent = paid===false
      ? "Your "+t.name+" entry is in and confirmed - no payment needed for this one."
      : "Your "+t.name+" entry is in. We verify every payment against our account and confirm your "
        + (teamish?"team":"entry") + " by email within 48 hours.";
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
        '<img src="payment-qr.png" alt="DY Patil University payment QR - scan with any UPI app to pay">' +
        "<p>Scan to pay via UPI/BHIM, RuPay, Visa or Mastercard. Merchant: D Y Patil University Scho. Keep your reference - you'll need it below.</p>";
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
    const soloCaptainLabel = t.soloTeamChoice ? "Full name" : "Full Name";
    const soloEmailLabel   = t.soloTeamChoice ? "Email ID" : "Email";

    // Lead-prefixed labels for a team entry — a soloTeamChoice track always
    // reads "Team lead …" (matches the register-form mockup); any other
    // team track keeps its own configured lead role (e.g. valorant's
    // "Leader Full Name").
    const leadCaptainLabel = t.soloTeamChoice ? "Team lead - Full name" : (lead+" Full Name");
    const leadPhoneLabel   = t.soloTeamChoice ? "Team lead - WhatsApp number" : (lead+" Whatsapp Number");
    const leadEmailLabel   = t.soloTeamChoice ? "Team lead - Email ID" : (lead+" Email");

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
      say("We can't take entries yet. Follow @"+CONFIG.instagram+" - registration opens shortly.","err");
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
      track:t.name, fee:currentFee(t),
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
        say("Payment reference received. Your slot is confirmed once we verify it - usually under 48 hours.","ok");
      }else{
        say("Entry saved. Check your email - we've sent your entry ID.","ok");
      }
      setTimeout(()=>{
        closeModal();
        syncTrack();
        if(window.__showSuccess) window.__showSuccess(t.id, paid, isTeam);
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
        <li><b>Eligibility:</b> You must be a currently enrolled college student, 18 years or older, to register for any competition. We may ask for valid college ID at the offline stages.</li>
        <li><b>Registration:</b> A registration is only confirmed once payment (where applicable) is received and verified. Submitting the form alone does not hold your slot.</li>
        <li><b>Accuracy of details:</b> You're responsible for the accuracy of every name, contact number, email and college listed at registration. Incorrect details that prevent us from reaching you or verifying eligibility can result in forfeit, at the Tournament Director's discretion.</li>
        <li><b>Rules:</b> Each competition has its own rules, published on that competition's own page. Registering means you've read and accepted them, alongside these general terms.</li>
        <li><b>Conduct:</b> Harassment, cheating, use of unauthorised software or hardware, or unsporting conduct toward organisers, staff or other participants can result in disqualification without refund, at any stage of the event.</li>
        <li><b>Changes to the event:</b> Dates, venues, formats or schedules may change if circumstances require it. Registered participants will be notified at the contact details they provided.</li>
        <li><b>Media:</b> Photos and video may be taken during the event (including the offline finals) for AniFX's own promotional use - on our social pages, website and future editions. If you'd rather not appear, let an organiser know on the day.</li>
        <li><b>Final say:</b> Anything not explicitly covered here or in a competition's own rules is decided by the Tournament Director. That decision is final.</li>
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
        <li><b>What we collect:</b> The registrant's full name, age, class/year, board, college or institution, address, WhatsApp number and email, and, where a competition needs it, team name and a roster of teammates with their own names and contact details.</li>
        <li><b>What we don't collect:</b> We never see or store your card, UPI or bank details. Payment is handled entirely by our payment processor; we only receive confirmation that a payment succeeded.</li>
        <li><b>Why we collect it:</b> To confirm your registration, verify eligibility, and contact you about match times, schedule changes or results.</li>
        <li><b>Where it's shown:</b> Your details are not published on the site. Names/colleges are used internally to run the tournament (seeding, match scheduling, on-the-day check-in) - nothing registrant-identifying is shown publicly. Phone numbers and emails are never shown publicly.</li>
        <li><b>Who it's shared with:</b> Your details are used internally by the AniFX organising team only, plus our payment processor for the transaction itself. We don't sell or hand this data to any other third party.</li>
        <li><b>How long we keep it:</b> Registration data is kept for the running of the festival and a reasonable period after for records and disputes, then deleted.</li>
        <li><b>Questions or removal requests:</b> Reach out through the contact details listed on this site and we'll sort it out.</li>
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

/* ---------- film submission (film page only) ----------
   Registration and submission are two deliberately separate steps for
   Film & Animation — someone registers well before their film exists,
   then comes back closer to the deadline to send the finished thing.
   This is its own small modal with its own POST, not folded into the
   registration modal's state machine (no track switching, no payment
   step, none of that applies here). See apps-script/README.md, "Film
   submissions," for how the backend keeps this on its own sheet and
   matches it back to a registration by name + email. */
if($("#filmSubmitModal")){
  const fsModal=$("#filmSubmitModal"), fsForm=$("#filmSubmitForm"), fsMsg=$("#filmSubmitMsg"), fsBtn=$("#filmSubmitBtn");
  const filmTrack=CONFIG.tracks.find(t=>t.id==="film");
  const fsClosesAt=filmTrack&&filmTrack.closesAt ? new Date(filmTrack.closesAt).getTime() : NaN;

  function fsSay(text,kind){ fsMsg.textContent=text; fsMsg.className="form-msg show "+kind; }
  function fsClosed(){ return !isNaN(fsClosesAt) && Date.now()>fsClosesAt; }

  function flagFsField(el){
    if(!el) return;
    $$(".field-invalid",fsForm).forEach(f=>f.classList.remove("field-invalid"));
    const wrap=el.closest(".field")||el.closest(".checkline")||el;
    wrap.classList.add("field-invalid");
    el.scrollIntoView({block:"center", behavior:"smooth"});
    el.focus({preventScroll:true});
    const clear=()=>{ wrap.classList.remove("field-invalid"); el.removeEventListener("input",clear); el.removeEventListener("change",clear); };
    el.addEventListener("input",clear);
    el.addEventListener("change",clear);
  }

  function openFsModal(){
    const closed=fsClosed();
    fsForm.hidden=closed;
    $("#filmSubmitClosedNote").hidden=!closed;
    if(closed && filmTrack) $("#filmSubmitClosedNote").textContent="Submissions closed on "+(filmTrack.closes||"the deadline")+".";
    fsModal.classList.add("open");
    document.body.style.overflow="hidden";
    if(!closed) setTimeout(()=>$("#fsName").focus(),60);
  }
  function closeFsModal(){
    fsModal.classList.remove("open");
    document.body.style.overflow="";
  }
  document.addEventListener("click",e=>{
    const t=e.target.closest("[data-open-film-submit]");
    if(t){ e.preventDefault(); openFsModal(); }
  });
  $("#filmSubmitClose").addEventListener("click",closeFsModal);
  fsModal.addEventListener("click",e=>{ if(e.target===fsModal) closeFsModal(); });
  document.addEventListener("keydown",e=>{ if(e.key==="Escape"&&fsModal.classList.contains("open")) closeFsModal(); });

  function fsFieldProblem(){
    if(!$("#fsName").checkValidity()) return {el:$("#fsName"), msg:"Enter the team or entrant name you registered with."};
    if(!$("#fsEmail").checkValidity()) return {el:$("#fsEmail"), msg:"Enter the email address you registered with."};
    if(!$("#fsFilmTitle").checkValidity()) return {el:$("#fsFilmTitle"), msg:"Enter your film's title."};
    if(!$("#fsDriveLink").checkValidity()) return {el:$("#fsDriveLink"), msg:"Add your Google Drive folder link."};
    if(!$("#fsAgree").checked) return {el:$("#fsAgree"), msg:"Please confirm this submission follows the festival's rules."};
    return null;
  }

  // Is this email actually registered for Film & Animation? A GET (not
  // the no-cors POST the actual submission uses below) so the page can
  // read the real answer, not just fire-and-forget. Returns:
  //   {checked:true,  found:true/false, name}  — got a real answer
  //   {checked:false}                          — couldn't ask (network/
  //     CORS/etc.) — treated as "don't block", see caller.
  async function checkRegistered(email){
    const url=CONFIG.sheetEndpoint
      + (CONFIG.sheetEndpoint.includes("?") ? "&" : "?")
      + "action=checkRegistration&email="+encodeURIComponent(email)
      + "&track="+encodeURIComponent(filmTrack.name);
    try{
      const res=await fetch(url);
      if(!res.ok) return {checked:false};
      const data=await res.json();
      return {checked:true, found:!!data.found, name:data.name||""};
    }catch(err){
      return {checked:false};
    }
  }

  fsForm.addEventListener("submit", async e=>{
    e.preventDefault();
    if(fsClosed()){ fsSay("Submissions are closed.","err"); return; }
    const problem=fsFieldProblem();
    if(problem){ fsSay(problem.msg,"err"); flagFsField(problem.el); return; }
    if(!CONFIG.sheetEndpoint){ fsSay("We can't take submissions yet - email us directly instead.","err"); return; }

    const email=$("#fsEmail").value.trim();
    fsBtn.disabled=true; fsBtn.textContent="Checking your registration…";
    const check=await checkRegistered(email);
    if(check.checked && !check.found){
      fsSay("We couldn't find a Film & Animation registration under that email. Double-check it matches exactly what you used to register - or register first.","err");
      flagFsField($("#fsEmail"));
      fsBtn.disabled=false; fsBtn.textContent="Submit film";
      return;
    }
    if(!check.checked){
      // Couldn't verify — genuine network/CORS issue, not "not registered".
      // Don't block a real participant over an infra hiccup; the backend
      // re-checks on save anyway and flags the row either way (see
      // apps-script/Code.gs, handleFilmSubmission).
      fsSay("Couldn't verify your registration automatically, but we'll still record your submission - please double check the email above is correct.","err");
    }

    fsBtn.textContent="Sending…";
    const payload={
      kind:"filmSubmission",
      entrantName:$("#fsName").value.trim(),
      registrantEmail:email,
      filmTitle:$("#fsFilmTitle").value.trim(),
      driveLink:$("#fsDriveLink").value.trim(),
      submittedAt:new Date().toISOString()
    };
    try{
      await fetch(CONFIG.sheetEndpoint,{
        method:"POST", mode:"no-cors",
        headers:{"Content-Type":"text/plain;charset=utf-8"},
        body:JSON.stringify(payload)
      });
      fsForm.reset();
      fsSay(check.found ? "Submission received for \""+(check.name||"your entry")+"\". Check your email for confirmation - thanks!" : "Submission received. Check your email for confirmation - thanks!","ok");
      setTimeout(closeFsModal,1800);
    }catch(err){
      fsSay("We couldn't send that. Check your connection and try again, or email us directly.","err");
    }
    fsBtn.disabled=false; fsBtn.textContent="Submit film";
  });
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
