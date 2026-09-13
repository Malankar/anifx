// Ported from the old frontend/shared.js CONFIG.schedule — same on-campus
// weekend timetable shown on the home page.

export const SCHEDULE = [
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
];

export const SCHEDULE_NOTE = "Times are fixed.";

// Short FAQ — general policy only. Full per-event rules live on that
// event's own page (RegistrationForm shows the agree-to-rules checkbox).
export const FAQ = [
  {
    q: "Payment, refunds and prize money",
    items: [
      "Entry is confirmed only when payment is received and verified against our account. Keep your transaction reference.",
      "Verified teams appear on this site. If you have paid and are not listed within 48 hours, email us with your reference number.",
      "No refunds at any cost.",
      "Prize money is paid to the registered Captain, Team Lead or solo entrant after the festival. Prize distribution for all categories is on 24 October 2026.",
    ],
  },
  {
    q: "Conduct and disqualification",
    items: [
      "Harassment, hate speech, threats, discriminatory behaviour, impersonation and deliberate disruption are not tolerated, on campus or in official channels.",
      "Participants must join the official WhatsApp group and Discord — schedules are communicated there and by email.",
      "Any form of cheating, account sharing, ringers or unauthorised software results in immediate disqualification with no refund.",
      "Anything not covered by these rules is decided by the Tournament Director for that competition. That decision is final.",
    ],
  },
];
