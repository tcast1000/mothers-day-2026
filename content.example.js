// ─────────────────────────────────────────────────────────────────────
// THIS IS A TEMPLATE — every personal field below is a placeholder.
//
// To customize:
//   1. Copy this file:   cp content.example.js content.js
//   2. Edit content.js   (it's gitignored — your real letter stays private)
//   3. Replace the four fields marked  ← REPLACE
//   4. Drop your photos into photos/ matching the filenames below
// ─────────────────────────────────────────────────────────────────────
window.MOTHERSDAY_CONTENT = {
  // Soft passphrase gate. Empty string = no gate. When set, visitors must
  // type this phrase before the card unlocks. Compared case-insensitively
  // and with whitespace trimmed. (Client-side only — anyone who views page
  // source can find it. It's a casual filter, not real access control.)
  passphrase: "",

  heading: "Happy Mother's Day",

  letter: {
    greeting: "Hello, Dearest Mother:",                             // ← REPLACE (or keep)
    body:
      "REPLACE THIS PARAGRAPH with your own message. Inside jokes, " +    // ← REPLACE
      "shared memories, the running gag she'll recognize. Specificity " +
      "is what makes a card feel like a real letter — write what only " +
      "you would write to her.",
    signoff: "Love,",
    signature: "Your Name Here",                                     // ← REPLACE
  },

  // Drop four photos into the photos/ folder. Default filenames below;
  // change them to match whatever you save.
  photos: [
    { src: "photos/photo1.jpg", alt: "", caption: "" },
    { src: "photos/photo2.jpg", alt: "", caption: "" },
    { src: "photos/photo3.jpg", alt: "", caption: "" },
    { src: "photos/photo4.jpg", alt: "", caption: "" },
  ],
};
