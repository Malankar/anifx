// Event/track config — ported from the old frontend's shared.js CONFIG.tracks.
// Single source of truth used by the home page, each event page, and forms.

export type FeeTier = { key: string; label: string; amount: number };

export type Track = {
  id: string;
  name: string;
  slug: string; // route slug under /events/:slug
  format: string;
  blurb: string;
  isTeam: boolean;
  leadLabel: string;
  facts: [string, string][];
  eligibility: string;
  fee: number;
  feeNote: string;
  feeTiers?: FeeTier[];
  closes: string;
  cardImage?: string;
  rosterLabel?: string;
  rosterHint?: string;
  rosterPlaceholder?: string;
  rosterRequired: boolean;
  freeEntry: boolean; // true = never show payment/QR section, regardless of tier
  accent: string; // per-track accent hex, ported from shared.css [data-track]
  rules: string[]; // rule list HTML strings, ported from shared.js FAQ.items for this track
  warn?: string;
};

export const TRACKS: Track[] = [
  {
    id: "valorant",
    name: "VALORANT",
    slug: "valorant",
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
    closes: "9 October 2026",
    cardImage: "valorant.jpg",
    rosterLabel: "Squad — one player per line",
    rosterHint:
      "Name, Riot ID with tagline, phone, email. All 5 players plus any subs. Riot IDs are how we invite you to the lobby — a wrong ID means a forfeit.",
    rosterPlaceholder: "Name, Riot ID#TAG, phone, email",
    rosterRequired: true,
    freeEntry: false,
    accent: "#E2394A",
    rules: [
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
    id: "fc26",
    name: "FC26",
    slug: "fc26",
    format: "Solo knockout · One day · On campus",
    blurb:
      "Single-elimination solo knockout played on PlayStation on campus, one player at a time — no teams.",
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
    closes: "20 October 2026",
    cardImage: "fc26.jpg",
    rosterRequired: false,
    freeEntry: false,
    accent: "#3ED97A",
    rules: [
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
    id: "gamejam",
    name: "Game jam",
    slug: "game-jam",
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
    closes: "To be announced",
    rosterLabel: "Team — one member per line",
    rosterHint: "Name, role, email. Up to 5 members. Solo entries are welcome.",
    rosterPlaceholder: "Name, role, email",
    rosterRequired: true,
    freeEntry: false,
    accent: "#2FC4E0",
    rules: [
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
    id: "film",
    name: "Film & animation",
    slug: "film-festival",
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
    closes: "To be announced",
    rosterLabel: "Team — one member per line",
    rosterHint: "Name, role, email. Solo submissions are welcome.",
    rosterPlaceholder: "Name, role, email",
    rosterRequired: false,
    // freeEntry stays false at the track level — whether payment/QR shows
    // depends on which fee tier is picked (student = free, pro = paid).
    freeEntry: false,
    accent: "#D9A441",
    cardImage: "film.jpg",
    rules: [
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
    id: "character",
    name: "Character design",
    slug: "character-design",
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
    closes: "To be announced",
    rosterRequired: false,
    freeEntry: true, // always free — never show payment/QR
    accent: "#F3EDDD",
    rules: [
      "<b>Organised by</b> the School of Creative Studies, DY Patil Deemed to be University, in association with Katha Film Club.",
      "<b>Entry.</b> Free. Solo only — each participant registers and submits individually. One character design per participant.",
      "<b>Eligibility.</b> Open to students from colleges and educational institutes. A valid college/institute ID is required for verification at the venue.",
      "<b>Venue and time.</b> Media Lab, COE Building, DY Patil Deemed to be University, Nerul, Navi Mumbai — 23 October 2026, 10:00.",
      "<b>Format.</b> The theme and competition brief are announced at the start of the competition. The character must be conceived and designed entirely during the competition period — no pre-made work.",
      "<b>Originality.</b> The character must be the participant's own original creation. Copying, tracing or reproducing an existing character, artwork or franchise is strictly prohibited.",
      "<b>AI.</b> Not permitted. AI-generated artwork, character generators or generative tools may not be used to create or substantially generate the final design.",
      "<b>Judging.</b> Interpretation of theme 20% · Originality & creativity 25% · Character design & visual development 20% · Concept & personality 15% · Technical execution 10% · Presentation & overall impact 10%. The jury's decision is final.",
      "<b>Prize.</b> Winner receives an XP-Pen tablet and a winner certificate. Additional special jury mentions may be awarded at the jury's discretion.",
      "<b>Prize distribution.</b> 24 October 2026.",
    ],
    warn: "The organisers reserve the right to modify the competition format, schedule or rules if required due to unforeseen circumstances.",
  },
];

export function getTrackBySlug(slug: string): Track | undefined {
  return TRACKS.find((t) => t.slug === slug);
}

// Resolves the fee that actually applies for a registration, given the
// optional fee-tier key the user picked (only film has tiers today).
export function resolveFee(track: Track, tierKey?: string): { amount: number; label: string } {
  if (track.feeTiers) {
    const tier = track.feeTiers.find((t) => t.key === tierKey) ?? track.feeTiers[0];
    return { amount: tier.amount, label: tier.label };
  }
  return { amount: track.fee, label: track.feeNote };
}

// Whether the payment/QR section should show for this registration.
export function needsPayment(track: Track, tierKey?: string): boolean {
  if (track.freeEntry) return false;
  return resolveFee(track, tierKey).amount > 0;
}
