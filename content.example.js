// Public template content. Copy this file to `content.js` and customize.
// `content.js` is gitignored so your personal letter stays out of the repo.
window.MOTHERSDAY_CONTENT = {
  // Soft passphrase gate. Empty string = no gate. When set, visitors must
  // type this phrase before the card unlocks. Compared case-insensitively
  // and with whitespace trimmed. (Note: this is client-side only — anyone
  // who views page source can find it. It's a casual filter, not security.)
  passphrase: "",

  heading: "Happy Mother's Day",

  letter: {
    greeting: "Hello, Dearest Mother:",
    body:
      "Write your message here. Inside jokes, memories, the running gag " +
      "she'll recognize. The handwritten feel comes through in the words " +
      "you choose.",
    signoff: "Love,",
    signature: "Your Name",
  },

  photos: [
    { src: "photos/photo1.jpg", alt: "Photo 1", caption: "" },
    { src: "photos/photo2.jpg", alt: "Photo 2", caption: "" },
    { src: "photos/photo3.jpg", alt: "Photo 3", caption: "" },
    { src: "photos/photo4.jpg", alt: "Photo 4", caption: "" },
  ],
};
