import { useState } from "react";
import { Award, Download, ArrowRight } from "lucide-react";
import { reflection } from "../lib/exhibits";
export default function FinalGallery({
  complete,
  onCollection,
  score,
}: {
  complete: boolean;
  onCollection: () => void;
  score: number;
}) {
  const [name, setName] = useState("");
  const download = () => {
    const safe = (name.trim() || "Curious Visitor").replace(/[<>&"']/g, "");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="1000" viewBox="0 0 1400 1000"><rect width="1400" height="1000" fill="#f5f2e9"/><rect x="35" y="35" width="1330" height="930" fill="none" stroke="#b99859" stroke-width="3"/><rect x="50" y="50" width="1300" height="900" fill="none" stroke="#b99859"/><g fill="#101d2e" text-anchor="middle" font-family="Georgia,serif"><text x="700" y="170" font-size="24" letter-spacing="5">THE MUSEUM OF ENGLISH IDIOMS</text><text x="700" y="310" font-size="28" letter-spacing="6">CERTIFICATE OF EXPLORATION</text><text x="700" y="450" font-size="90">MASTER CURATOR</text><text x="700" y="560" font-size="42">${safe}</text><text x="700" y="650" font-size="25">For discovering five stories hidden in everyday language.</text><text x="700" y="760" font-size="24">Gordius · Sisyphus · Job · Nero · Rome</text><text x="700" y="850" font-size="20">${new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}</text></g><path d="M600 590H800" stroke="#b99859" stroke-width="2"/><circle cx="700" cy="235" r="30" fill="none" stroke="#b99859" stroke-width="2"/><text x="700" y="245" text-anchor="middle" font-family="Georgia" font-size="30" fill="#b99859">V</text></svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "Master-Curator-Certificate.svg";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };
  return (
    <div className="final-gallery">
      <div className="eyebrow">THE LAST ROOM · A LASTING IMPRESSION</div>
      <h2>
        Small words.
        <br />
        Extraordinary journeys.
      </h2>
      <p className="reflection">{reflection}</p>
      <div className="origin-map">
        <svg
          viewBox="0 0 700 330"
          aria-label="Map of the eastern Mediterranean: Rome in Italy, Corinth in Greece, Gordium in Turkey, and the approximate Middle Eastern setting of Job"
        >
          <defs>
            <pattern id="mapgrid" width="35" height="35" patternUnits="userSpaceOnUse">
              <path d="M35 0H0V35" fill="none" stroke="#c7baa9" strokeOpacity=".25" />
            </pattern>
          </defs>
          <rect width="700" height="330" fill="#e9e7dc" />
          <rect width="700" height="330" fill="url(#mapgrid)" />
          <g fill="#a9b2a7" stroke="#f4f1e7" strokeWidth="2">
            <path d="M0 0H700V67L634 76 610 100 566 109 548 98 518 112 481 100 445 85 429 112 406 126 382 107 361 126 344 152 357 167 340 184 327 177 330 158 312 147 305 134 303 110 267 92 247 105 236 98 237 73 195 61 169 71 156 98 178 114 195 151 219 174 237 183 226 193 210 189 204 171 180 155 168 128 143 113 126 82 98 69 70 72 36 79 0 66Z" />
            <path d="M395 162L422 143 460 133 493 140 541 131 571 140 600 131 641 140 700 147V330H616L585 295 554 280 537 250 502 224 470 197 434 193 404 184Z" />
            <path d="M0 256L92 246 140 257 190 250 215 264 276 260 338 276 414 268 467 290 485 330H0Z" />
            <path d="M330 206L363 206 370 214 353 220 333 215Z" />
            <path d="M479 208L500 205 511 211 489 217Z" />
          </g>
          <text x="185" y="252" className="sea-label">
            M E D I T E R R A N E A N S E A
          </text>
          <g className="map-marker">
            <circle cx="188" cy="147" r="5" />
            <path d="M188 147L164 115H100" />
            <text x="98" y="105">
              Rome · Italy
            </text>
            <circle cx="338" cy="174" r="5" />
            <path d="M338 174L314 217H262" />
            <text x="259" y="235">
              Corinth · Greece
            </text>
            <circle cx="473" cy="151" r="5" />
            <path d="M473 151L498 109H558" />
            <text x="493" y="97">
              Gordium · Turkey
            </text>
            <circle cx="568" cy="233" r="9" fillOpacity=".25" />
            <circle cx="568" cy="233" r="4" />
            <path d="M568 233L584 259H647" />
            <text x="506" y="282">
              Job · Middle Eastern setting*
            </text>
          </g>
        </svg>
        <p>*Illustrative regional map. Job’s land of Uz has no agreed precise location.</p>
      </div>
      {complete ? (
        <div className="certificate">
          <Award size={39} />
          <div className="eyebrow">FIVE STORIES DISCOVERED</div>
          <h3>Master Curator</h3>
          <p>The Museum of English Idioms</p>
          <label htmlFor="certificate-name" className="field-label">
            PERSONALIZE YOUR CERTIFICATE (OPTIONAL)
          </label>
          <input
            id="certificate-name"
            aria-label="Name for your certificate"
            value={name}
            placeholder="Your name"
            maxLength={60}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="primary" onClick={download}>
            Download golden certificate <Download size={17} />
          </button>
          <span className="muted">Learning studio score: {score} / 9 · SVG certificate</span>
        </div>
      ) : (
        <div className="locked-certificate">
          <Award size={30} />
          <h3>Your certificate is waiting.</h3>
          <p>Open all five exhibits to become a Master Curator.</p>
          <button className="primary" onClick={onCollection}>
            Continue collecting <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
