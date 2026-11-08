 # Build progress
 - Approved: web museum, brief's style, Three.js, local-only progress.
 - Research: Gordian legend confirmed by Penn Museum/Britannica; Nero story distinguished from history; Job setting should be approximate, not a claimed known location.
 - Build: procedural lightweight scene + content + passport + scored learning activities + certificate.
 - Completed: all five full exhibits, Roman Wing, touch and keyboard navigation, local passport/reflections, three scored quizzes with retries, origin map, personalized downloadable golden certificate.
 - Verified: production build and lint pass. Browser tests pass on 1440px desktop and 390px touch viewport: five stamps, persistence, all activities (9/9), wrong-answer retry, certificate download, E and tap interactions. No page errors.
 - Movement tested by holding W through the corridor; collision keeps the camera inside the end wall. Location label now tracks the physical wing rather than nearby paintings.
 - Performance: 30 FPS maximum, DPR capped at 1.5, no shadows/postprocessing, procedural artwork/textures, separate lazy-loaded Three.js chunk, static rendering on landing and behind overlays.
 - Deliver: running web service on port 4200.