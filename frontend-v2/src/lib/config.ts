/* ================================================================
   ANIFX 2026 — SHARED CONFIG
   Ported 1:1 from the old public/shared.js CONFIG object. Edit this
   and it updates every page (same intent as the original comment).
   ================================================================ */

export type Track = {
  id: string
  name: string
  page: string
  format: string
  blurb: string
  isTeam: boolean
  leadLabel: string
  facts: [string, string][]
  eligibility: string
  fee: number
  feeNote: string
  feeTiers?: { key: string; label: string; amount: number }[]
  slots: number
  closes: string
  closesAt: string
  open: boolean
  payUrl: string
  video: string
  cardImage?: string
  cardImageOnly?: boolean
  cardGallery?: string[]
  rosterLabel: string
  rosterHint: string
  rosterPlaceholder?: string
  rosterRequired: boolean
}

export type ScheduleItem = { time: string; title: string; where: string; feature?: boolean }
export type ScheduleDay = { day: string; items: ScheduleItem[] }
export type FaqItem = { q: string; a: string }
export type RuleBlock = { q: string; track?: string; items: string[]; warn?: string }
export type Sponsor = { name: string; logoUrl: string; url: string }

export const CONFIG = {
  /* --- where form submissions go ---------------------------------
     Deploy the Apps Script (sent separately) from YOUR Google
     account, then paste the Web App URL here. Data lands in your
     own Google Sheet. Leave empty and the form will tell people
     registration is not open yet instead of failing silently.     */
  sheetEndpoint:
    "https://script.google.com/macros/s/AKfycbw42pOK2h_x0Xg8rULZjzk8Xj-llacpRfNhV161tCD9xjbLr0olF3snAfOwvljJBRw2/exec",

  /* --- your details ---------------------------------------------- */
  contactEmail: "", // e.g. "anifx@dypatil.edu"
  contactPhone: "", // e.g. "+91 70451 95922"
  instagram: "dypu.socs",

  /* --- background video --------------------------------------------
     Hero loop (both the landing hero and each event-page hero use
     this same slot pattern) + one per track card. WebM/MP4, muted/
     loop, 10-15s, <4MB. Leave empty — the poster/tint placeholder
     holds the layout until real footage exists, nothing breaks.    */
  heroVideo: "", // festival/landing hero background loop
  heroPoster: "anifx-banner.jpg", // four-panel banner (Film/FC26/VALORANT/Game Jam)

  /* --- headline numbers ------------------------------------------ */
  festivalStart: "2026-10-23T09:00:00+05:30",

  /* --- community links -------------------------------------------
     Use a REDIRECT link (Bitly or a page you control), never the
     raw WhatsApp invite — so you can swap the group without
     re-contacting everyone.                                        */
  whatsappLink: "",
  discordLink: "",

  /* --- on-campus schedule ------------------------------------------
     The offline weekend, hour by hour. Shown in full on the landing
     page; each event page shows only the rows that mention it.
     FC26's own on-campus timing was confirmed: 11:00, rooms 204/205. */
  schedule: [
    {
      day: "Friday 23 October",
      items: [
        { time: "10:00", title: "Character design", where: "Media Lab" },
        { time: "10:00", title: "VALORANT grand final", where: "Game Lab", feature: true },
        { time: "11:00", title: "FC26", where: "204, 205" },
      ],
    },
    {
      day: "Saturday 24 October",
      items: [
        { time: "10:00", title: "Screening 1 — film and animation", where: "Auditorium" },
        { time: "14:00", title: "Game jam screening", where: "Auditorium", feature: true },
        { time: "16:00", title: "Prize distribution — all categories", where: "Auditorium", feature: true },
      ],
    },
  ] as ScheduleDay[],
  scheduleNote: "Times are fixed.",

  /* --- competitions ---------------------------------------------- */
  tracks: [
    {
      id: "valorant",
      name: "VALORANT",
      page: "/valorant",
      format: "32 teams · Best of 3 · Online groups, offline final",
      blurb:
        "Open bracket to 32 teams. Group stage runs online through October, semi-finals online, and the grand final is played offline on campus in front of a crowd.",
      isTeam: true,
      leadLabel: "Captain",
      facts: [
        ["Entry fee", "₹1,000 per team"],
        ["Team size", "5 players + up to 2 named subs"],
        ["Prize", "Prize pool ₹17,500"],
        ["Registration closes", "9 October 2026"],
        ["Group stage", "October, evenings, online"],
        ["Grand final", "23 October, 10:00, on campus"],
      ],
      eligibility:
        "Open to all currently enrolled college students, 18 or older. One roster per player — you may not appear on two VALORANT teams.",
      fee: 1000,
      feeNote: "₹1,000 per team",
      slots: 32,
      closes: "9 October 2026",
      closesAt: "2026-10-09T23:59:59+05:30",
      open: true,
      payUrl: "", // paste Razorpay payment link
      video: "", // card/hero background loop — see CONFIG.heroVideo note
      cardImage: "valorant.jpg", // fan art, made by a friend of the client's — free of
      // copyright per the client; used for both the index
      // card and (via the hero-wiring image fallback) this
      // track's own page hero, since there's no video yet.
      rosterLabel: "Squad — one player per line",
      rosterHint:
        "Name, Riot ID with tagline, phone, email. All 5 players plus any subs. Riot IDs are how we invite you to the lobby — a wrong ID means a forfeit.",
      rosterPlaceholder: "Name, Riot ID#TAG, phone, email",
      rosterRequired: true,
    },
    {
      id: "fc26",
      name: "FC26",
      page: "/fc26",
      format: "Solo knockout · One day · On campus",
      blurb: "Single-elimination solo knockout played on PlayStation on campus, one player at a time — no teams.",
      isTeam: false,
      leadLabel: "",
      facts: [
        ["Entry fee", "₹100 per player"],
        ["Format", "Solo, single elimination"],
        ["Prize", "1st — ₹5,000 · 2nd — ₹3,000"],
        ["Registration closes", "20 October 2026"],
        ["Played", "23 October, on campus"],
        ["Match length", "6-minute halves"],
      ],
      eligibility:
        "Open to all currently enrolled college students, 18 or older. Solo entry only — there is no team registration for FC26.",
      fee: 100,
      feeNote: "₹100 per player",
      slots: 0,
      closes: "20 October 2026",
      closesAt: "2026-10-20T23:59:59+05:30",
      open: true,
      payUrl: "",
      video: "",
      cardImage: "fc26.jpg", // official EA Sports FC26 key art — same category of
      // asset as the Riot VALORANT key art declined earlier
      // per hard rule #3, but the client was told directly
      // and explicitly said to use it anyway (their own
      // promotional rights/risk to manage for their own
      // event page). Client's explicit call, not an
      // oversight — see CHANGELOG-v3.20.md.
      cardImageOnly: true, // index card ONLY — FC26's own page hero keeps its
      // custom pitch/floodlight/ball decoration instead.
      // That decoration is the intended hero and always
      // was — it is NOT a placeholder, do not hide it
      // again just because a cardImage exists.
      rosterLabel: "",
      rosterHint: "",
      rosterRequired: false,
    },
    {
      id: "gamejam",
      name: "Game jam",
      page: "/game-jam",
      format: "100 hours · Online · Side-scroller action",
      blurb:
        "Design, build and ship an original side-scrolling action game in 100 hours. 2D, 3D or anything between. Judged live on campus at the end.",
      isTeam: true,
      leadLabel: "Team Lead",
      facts: [
        ["Entry fee", "₹1,000 per team"],
        ["Team size", "1 to 5"],
        ["Prize", "Winner — ₹10,000"],
        ["Genre", "Side-scroller action"],
        ["Duration", "100 hours, online"],
        ["Jury round", "24 October, 14:00, on campus"],
      ],
      eligibility:
        "Open to all currently enrolled college students, 18 or older. Teams of 1-5 — each person may register with only one team.",
      fee: 1000,
      feeNote: "₹1,000 per team",
      slots: 0,
      closes: "To be announced",
      closesAt: "",
      open: true,
      payUrl: "",
      video: "gamejam-clip.mp4", // gameplay capture — blended full-bleed via has-video (same treatment index card + own page both use)
      rosterLabel: "Team — one member per line",
      rosterHint: "Name, role, email. Up to 5 members. Solo entries are welcome.",
      rosterPlaceholder: "Name, role, email",
      rosterRequired: true,
    },
    {
      id: "film",
      name: "Film & animation",
      page: "/film-festival",
      format: "Submission based · 2D, 3D, stop motion, VFX, live action",
      blurb:
        "A showcase for student films and animation. Animated work and live action are judged separately by industry juries, screened on campus during the festival.",
      isTeam: true,
      leadLabel: "Team Lead",
      facts: [
        ["Entry fee", "Free — students & animation entrants · ₹499 — professionals"],
        ["Categories", "Animation · Live action"],
        ["Prize", "Winner — ₹20,000"],
        ["Formats", "2D, 3D, stop motion, VFX"],
        ["Screening", "24 October, 10:00, on campus"],
        ["Jury", "Industry panel"],
      ],
      eligibility:
        "Free for students (DY Patil or any other college) and animation hobbyists. Entrants who work in film/animation professionally pay the professional entry fee. Individual or team submissions welcome.",
      fee: 0,
      feeNote: "Free for students & animation entrants",
      feeTiers: [
        { key: "student", label: "Student / animation entrant — Free", amount: 0 },
        { key: "pro", label: "Professional — ₹499", amount: 499 },
      ],
      slots: 0,
      closes: "To be announced",
      closesAt: "",
      open: true,
      payUrl: "",
      video: "film-vfx-clip.mp4", // restored — client wants it actually playing, not
      // the static image. Paritosh Khairwal | RRS's reel,
      // same credit caption as before.
      rosterLabel: "Team — one member per line",
      rosterHint: "Name, role, email. Solo submissions are welcome.",
      rosterPlaceholder: "Name, role, email",
      rosterRequired: false,
    },
    {
      id: "character",
      name: "Character design",
      page: "/character-design",
      format: "Free entry · Solo · Held 23 October, on campus",
      blurb:
        "Design an original character live at the venue, on a theme announced at the start of the competition. In association with Katha Film Club.",
      isTeam: false,
      leadLabel: "",
      facts: [
        ["Entry fee", "Free"],
        ["Format", "Solo — one character per participant"],
        ["Prize", "XP-Pen tablet + winner certificate"],
        ["Venue", "Media Lab, COE Building, Nerul"],
        ["Competition", "23 October 2026, 10:00"],
        ["Prize distribution", "24 October 2026"],
      ],
      eligibility:
        "Open to students from colleges and educational institutes. Each participant must register and submit individually — one character design per participant. A valid college/institute ID is required at the venue.",
      fee: 0,
      feeNote: "Free entry",
      slots: 0,
      closes: "To be announced",
      closesAt: "",
      open: true,
      payUrl: "",
      video: "",
      cardGallery: ["char-rat.png", "char-alien.png", "char-monkey.png", "char-centaur.png"], // student sketches, right-aligned grid
      rosterLabel: "",
      rosterHint: "",
      rosterRequired: false,
    },
  ] as Track[],

  /* --- sponsors ---------------------------------------------------- */
  sponsors: [{ name: "XP-Pen — Character Design", logoUrl: "", url: "" }] as Sponsor[],

  /* --- faq (general — shown on the landing page and on every event
     page's FAQ tab) ---------------------------------------------- */
  faq: [
    {
      q: "Can I register for more than one competition?",
      a: "Yes, you can enter as many of the five competitions as you like.",
    },
    {
      q: "What happens if a registered team drops out before the event?",
      a: "That slot is not reassigned.",
    },
    { q: "Is there an age requirement?", a: "Yes, all participants must be 18 or older." },
    { q: "What's the refund policy?", a: "No refunds at any cost." },
    {
      q: "What do I need to bring for the offline final?",
      a: "For VALORANT: your own keyboard, mouse, mousepad, and headphones/earphones. Not applicable for FC26.",
    },
    { q: "Is the game jam fully online?", a: "Yes, apart from the final, which happens on campus." },
    {
      q: "How do I know my registration went through?",
      a: "You'll get a confirmation email after payment.",
    },
  ] as FaqItem[],

  /* --- rules ------------------------------------------------------
     `track` ties a rules block to one event's dedicated page (that
     page shows this block plus the two general ones below). Blocks
     with no `track` are general and show on every event page.      */
  rules: [
    {
      q: "VALORANT",
      track: "valorant",
      items: [
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
        "<b>Disputes.</b> Raised within 15 minutes of a match ending, in the official Discord, with evidence. Later disputes are not considered.",
      ],
      warn: "Map veto order, overtime rule and the seeding method are published in full with the bracket, before the first match is played.",
    },
    {
      q: "FC26",
      track: "fc26",
      items: [
        "<b>Entry.</b> ₹100 per player. Solo competition — there is no team registration for FC26. Registration closes 20 October 2026.",
        "<b>Played.</b> 23 October, on campus, on organiser-provided PlayStation consoles.",
        "<b>Match length.</b> Six-minute halves, twelve minutes per game, through the bracket.",
        "<b>Final.</b> Eight-minute halves, single game.",
        "<b>Waiting time.</b> Five minutes from being called. After that, forfeit.",
        "<b>Format.</b> Single elimination. Bracket drawn and published before the first match.",
        "<b>Disputes.</b> Raised with the on-floor admin immediately, before the next match starts on that station.",
      ],
      warn: "Draw resolution, permitted team selection and the controller policy are confirmed before registration opens.",
    },
    {
      q: "Game jam",
      track: "gamejam",
      items: [
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
        "<b>Scope.</b> A small, finished, polished game scores higher than a large unfinished one.",
      ],
      warn: "Exact dates, the registration deadline and eligibility are confirmed before registration opens.",
    },
    {
      q: "Film & animation",
      track: "film",
      items: [
        "<b>Entry.</b> Free for students (DY Patil or any other college) and animation hobbyists. ₹499 for entrants who work in film or animation professionally, paid in one transaction by the Team Lead or solo entrant.",
        "<b>Prize.</b> Winner takes ₹20,000.",
        "<b>Categories.</b> Animation — 2D, 3D, stop motion and VFX — and live action, judged separately.",
        "<b>Jury.</b> Industry panels for each category.",
        "<b>Screening.</b> Screening 1 is 24 October at 10:00, on campus.",
        "<b>Ownership.</b> Filmmakers keep full ownership. AniFX may screen the work at the festival and use stills for promotion.",
      ],
      warn: "Submission deadline, runtime limits and delivery format are announced shortly. Do not begin a submission until these are published.",
    },
    {
      q: "Character design",
      track: "character",
      items: [
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
        "<b>Prize distribution.</b> 24 October 2026.",
      ],
      warn: "The organisers reserve the right to modify the competition format, schedule or rules if required due to unforeseen circumstances.",
    },
    {
      q: "Payment, refunds and prize money",
      items: [
        "<b>Payment.</b> Entry is confirmed only when payment is received and verified against our account. Keep your transaction reference.",
        "<b>Verification.</b> Verified teams appear on this site. If you have paid and are not listed within 48 hours, email us with your reference number.",
        "<b>Unverified entries.</b> Entries that cannot be verified 72 hours before the first match are removed from the bracket.",
        "<b>Refunds.</b> No refunds at any cost.",
        "<b>Prize money.</b> Paid to the registered Captain, Team Lead or solo entrant after the festival. Prize distribution for all categories is on 24 October 2026.",
      ],
    },
    {
      q: "Conduct and disqualification",
      items: [
        "<b>Conduct.</b> Harassment, hate speech, threats, discriminatory behaviour, impersonation and deliberate disruption are not tolerated, on campus or in official channels.",
        "<b>Communication.</b> Participants must join the official WhatsApp group and Discord. Schedules are communicated there and by email. Missing a match because you did not join is not grounds for a reschedule.",
        "<b>Cheating.</b> Any form of cheating, account sharing, ringers or unauthorised software results in immediate disqualification with no refund.",
        "<b>Decisions.</b> Anything not covered by these rules is decided by the Tournament Director for that competition. That decision is final.",
        "<b>Changes.</b> Any rule change is announced through official channels before it takes effect. No rule is introduced or changed during a match.",
      ],
    },
  ] as RuleBlock[],
}

/* --- per-track PAGE metadata (hero copy/decor/tabs) --------------
   Split out from CONFIG.tracks above: these are page-authoring
   fields (exact hero wording, pill-row text, which tabs a page
   shows), not data reused elsewhere — same split the old per-track
   HTML files effectively encoded by hand. */
export type TrackPageMeta = {
  id: string
  eyebrow: string
  title: string
  heroSub: string
  registerCta: string
  pills: [string, string][]
  decor: "valorant" | "fc26" | "gamejam" | "film" | "character"
  mediaCredit?: string
  hasSponsorsTab?: boolean
}

export const TRACK_PAGE_META: Record<string, TrackPageMeta> = {
  valorant: {
    id: "valorant",
    eyebrow: "VALORANT",
    title: "VALORANT",
    heroSub: "32 teams · Best of 3 · Online groups, offline grand final on campus",
    registerCta: "Register your team",
    pills: [
      ["Entry fee", "₹1,000 / team"],
      ["Prize", "Prize pool ₹17,500"],
      ["Registration closes", "9 October 2026"],
      ["Grand final", "23 October, 10:00, on campus"],
    ],
    decor: "valorant",
  },
  fc26: {
    id: "fc26",
    eyebrow: "FC26",
    title: "FC26",
    heroSub: "Solo 1v1 knockout · One day · Played on campus",
    registerCta: "Register now",
    pills: [
      ["Entry fee", "₹100 / player"],
      ["Format", "Solo, 1v1"],
      ["Registration closes", "20 October 2026"],
      ["Prize", "1st ₹5,000 · 2nd ₹3,000"],
    ],
    decor: "fc26",
  },
  gamejam: {
    id: "gamejam",
    eyebrow: "GAME JAM",
    title: "GAME JAM",
    heroSub: "100 hours · Online · Side-scroller action",
    registerCta: "Register your team",
    pills: [
      ["Entry fee", "₹1,000 / team"],
      ["Team size", "1 to 5"],
      ["Prize", "Winner — ₹10,000"],
      ["Jury round", "24 October, 14:00, on campus"],
    ],
    decor: "gamejam",
    mediaCredit: "Credits — Atharva Patil",
  },
  film: {
    id: "film",
    eyebrow: "FILM & ANIMATION",
    title: "FILM & ANIMATION",
    heroSub: "Free for students & animation entrants · ₹499 professional · 2D, 3D, stop motion, VFX, live action",
    registerCta: "Register",
    pills: [
      ["Entry fee", "Free / ₹499 professional"],
      ["Categories", "Animation · Live action"],
      ["Prize", "Winner — ₹20,000"],
      ["Screening 1", "24 October, 10:00, on campus"],
    ],
    decor: "film",
    mediaCredit: "Credits — Paritosh Khairwal | RRS",
  },
  character: {
    id: "character",
    eyebrow: "CHARACTER DESIGN",
    title: "CHARACTER DESIGN",
    heroSub: "Free entry · Solo · 23 October, 10:00 · In association with Katha Film Club",
    registerCta: "Register — it's free",
    pills: [
      ["Entry fee", "Free"],
      ["Format", "Solo"],
      ["Prize", "XP-Pen tablet"],
      ["Competition", "23 October 2026, 10:00"],
    ],
    decor: "character",
    mediaCredit: "Credits — Shivam Prasad",
    hasSponsorsTab: true,
  },
}

/* Film festival reel strip — one run of 8 cells, duplicated once for the
   seamless CSS-driven scroll loop (see .fm-strip .run in shared.css). */
export const FILM_REEL_CELLS = [
  { src: "akhiri-dor.mp4", award: "Winner — Best Animated Film 2025", caption: "Akhiri Dor — Parul University" },
  { src: "liveaction-cell.mp4" },
  { src: "showreel-2d.mp4" },
  { src: "pari-3d-reel.mp4" },
]
