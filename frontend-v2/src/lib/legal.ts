/* ---------- legal pages (Terms, Refund policy, Privacy) ----------
   Ported verbatim from public/shared.js's LEGAL object. Real content,
   not filler — kept in one place so it's consistent across every page. */
export const LEGAL: Record<string, { title: string; body: string }> = {
  terms: {
    title: "Terms and conditions",
    body: `
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
      </ul>`,
  },
  refund: {
    title: "Refund and cancellation",
    body: `<p>No refunds at any cost.</p>`,
  },
  privacy: {
    title: "Privacy policy",
    body: `
      <p>This covers what happens to the information you give us when you register for AniFX 2026.</p>
      <ul>
        <li><b>What we collect.</b> The registrant's full name, age, class/year, board, college or institution, address, WhatsApp number and email, and — where a competition needs it — team name and a roster of teammates with their own names and contact details.</li>
        <li><b>What we don't collect.</b> We never see or store your card, UPI or bank details. Payment is handled entirely by our payment processor; we only receive confirmation that a payment succeeded.</li>
        <li><b>Why we collect it.</b> To confirm your registration, verify eligibility, and contact you about match times, schedule changes or results.</li>
        <li><b>Where it's shown.</b> Your details are not published on the site. Names/colleges are used internally to run the tournament (seeding, match scheduling, on-the-day check-in) — nothing registrant-identifying is shown publicly. Phone numbers and emails are never shown publicly.</li>
        <li><b>Who it's shared with.</b> Your details are used internally by the AniFX organising team only, plus our payment processor for the transaction itself. We don't sell or hand this data to any other third party.</li>
        <li><b>How long we keep it.</b> Registration data is kept for the running of the festival and a reasonable period after for records and disputes, then deleted.</li>
        <li><b>Questions or removal requests.</b> Reach out through the contact details listed on this site and we'll sort it out.</li>
      </ul>`,
  },
}
