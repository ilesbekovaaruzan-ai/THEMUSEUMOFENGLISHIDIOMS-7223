import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  X,
  Landmark,
  Compass,
  BookOpen,
  Ticket,
  Award,
  Check,
  Move,
  Mouse,
  Menu,
  Mountain,
  Flame,
  Sword,
  ScrollText,
} from "lucide-react";
const MuseumScene = lazy(() => import("../components/MuseumScene"));
import Activities, { emptyActivities, type ActivityState } from "../components/Activities";
import FinalGallery from "../components/FinalGallery";
import { exhibits, numerals } from "../lib/exhibits";
import { artUrl } from "../lib/artwork";
type Panel = "collection" | "passport" | "activities" | "final" | number | null;
type Progress = { visited: number[]; responses: Record<number, string>; activities: ActivityState };
const initial: Progress = { visited: [], responses: {}, activities: emptyActivities };
function load(): Progress {
  try {
    const v = JSON.parse(localStorage.getItem("idiom-museum-v1") || "null");
    if (
      v &&
      Array.isArray(v.visited) &&
      v.activities?.scores?.length === 3 &&
      v.activities?.mystery?.length === 3 &&
      v.activities?.matches?.length === 5
    )
      return {
        ...v,
        visited: v.visited.filter((id: number) => id >= 1 && id <= 5),
        responses: v.responses || {},
      };
  } catch {}
  return initial;
}
const icons = [Sword, Mountain, ScrollText, Flame, Landmark];
export default function MuseumPage() {
  const [exploring, setExploring] = useState(false),
    [panel, setPanel] = useState<Panel>(null),
    [progress, setProgress] = useState<Progress>(load),
    [nearest, setNearest] = useState<number | null>(null),
    [inRomanWing, setInRomanWing] = useState(false),
    [menu, setMenu] = useState(false),
    [toast, setToast] = useState("");
  const modal = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (exploring) return;
    const hero = document.querySelector<HTMLElement>(".hero-copy");
    if (!hero) return;
    const observer = new ResizeObserver(() =>
      document.documentElement.style.setProperty(
        "--hero-top",
        `${hero.getBoundingClientRect().top + window.scrollY + hero.offsetHeight}px`,
      ),
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [exploring]);
  useEffect(() => {
    try {
      localStorage.setItem("idiom-museum-v1", JSON.stringify(progress));
    } catch {}
  }, [progress]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(timer);
  }, [toast]);
  const open = (p: Panel) => {
    opener.current = document.activeElement as HTMLElement;
    setPanel(p);
    setMenu(false);
    if (document.pointerLockElement) document.exitPointerLock();
    if (typeof p === "number") {
      setProgress((v) => {
        if (v.visited.includes(p)) return v;
        setToast(`Exhibit ${p} discovered · golden stamp collected`);
        return { ...v, visited: [...v.visited, p] };
      });
    }
  };
  const close = () => {
    setPanel(null);
    opener.current?.focus();
  };
  useEffect(() => {
    if (panel === null) return;
    const el = modal.current!;
    el.scrollTop = 0;
    el.querySelector<HTMLElement>("button")?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPanel(null);
        opener.current?.focus();
      }
      if (e.key === "Tab") {
        let all = Array.from(
          el.querySelectorAll<HTMLElement>('button,a,input,textarea,select,[tabindex="0"]'),
        ).filter((n) => !n.hasAttribute("disabled"));
        let first = all[0],
          last = all[all.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [panel]);
  const enter = () => {
    setNearest(null);
    setInRomanWing(false);
    setExploring(true);
    setPanel(null);
    setMenu(false);
  };
  const visited = progress.visited.length,
    complete = visited === 5;
  const selected = typeof panel === "number" ? exhibits[panel - 1] : null;
  const stamps = (compact = false) => (
    <div className={compact ? "stamps compact" : "stamps"}>
      {exhibits.map((e, i) => {
        const Icon = icons[i];
        const stamped = progress.visited.includes(e.id);
        return (
          <button
            key={e.id}
            className={stamped ? "stamped" : ""}
            title={`${e.short}${stamped ? " — collected" : " — not collected"}`}
            aria-label={`Open exhibit ${e.id}: ${e.short}`}
            onClick={() => open(e.id)}
          >
            <Icon size={compact ? 17 : 27} />
            <span>{numerals[i]}</span>
            {stamped && !compact && <small>DISCOVERED</small>}
          </button>
        );
      })}
    </div>
  );
  return (
    <div className={exploring ? "museum-app exploring" : "museum-app"}>
      <header className="site-header">
        <button
          className="brand"
          onClick={() => {
            setExploring(false);
            setPanel(null);
          }}
          aria-label="Museum home"
        >
          <span className="brand-emblem">
            <Landmark size={25} />
          </span>
          <span>
            THE MUSEUM OF
            <br />
            <strong>ENGLISH IDIOMS</strong>
          </span>
        </button>
        <nav className={menu ? "nav-links show" : "nav-links"}>
          <button
            className={panel === "collection" ? "active" : ""}
            onClick={() => open("collection")}
          >
            The collection
          </button>
          <button
            className={panel === "activities" ? "active" : ""}
            onClick={() => open("activities")}
          >
            Learning studio
          </button>
          <button onClick={() => open("passport")} className="passport-nav">
            <Ticket size={16} /> My passport <span>{visited}/5</span>
          </button>
        </nav>
        <button
          className="mobile-menu icon-button"
          aria-label="Toggle navigation"
          onClick={() => setMenu(!menu)}
        >
          <Menu size={24} />
        </button>
      </header>
      <main>
        {!exploring && (
          <section className="welcome">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="little-line" /> A JOURNEY THROUGH LANGUAGE & TIME
              </div>
              <h1>
                Names that
                <br />
                became
                <br />
                <em>words.</em>
              </h1>
              <p className="hero-subtitle">The hidden history of English idioms.</p>
              <p className="hero-description">
                Behind familiar expressions lie extraordinary stories. Step inside, meet the names,
                and discover the history we speak every day.
              </p>
              <button className="enter-button" onClick={enter}>
                <span>
                  <Compass size={20} /> ENTER THE MUSEUM
                </span>
                <ArrowRight size={21} />
              </button>
              <div className="entry-note">
                <span className="live-dot" /> Free to explore <span>·</span> No ticket required
              </div>
              <div className="hero-metrics">
                <div>
                  <strong>05</strong>
                  <span>TIMELESS EXPRESSIONS</span>
                </div>
                <div>
                  <strong>03</strong>
                  <span>INTERACTIVE CHALLENGES</span>
                </div>
                <div>
                  <strong>∞</strong>
                  <span>WAYS TO SEE THE PAST</span>
                </div>
              </div>
            </div>
            <div className="hero-window">
              <div className="preview-label">
                <span className="live-dot" /> AN IMMERSIVE 3D EXPERIENCE
              </div>
              <div className="architectural-rule" />
              <div className="preview-footer">
                <span>THE GRAND ROTUNDA</span>
                <span>
                  01 — 05 <ArrowUpRight size={17} />
                </span>
              </div>
              <div className="preview-caption">
                <span>
                  History is closer
                  <br />
                  <em>than you think.</em>
                </span>
                <button onClick={enter} aria-label="Explore the grand rotunda">
                  <ArrowUpRight size={26} />
                </button>
              </div>
            </div>
          </section>
        )}
        <div className={exploring ? "scene-container full-scene" : "scene-container hero-scene"}>
          <Suspense
            fallback={
              <div className="scene-fallback">
                <h2>Opening the doors…</h2>
                <p>Preparing your museum.</p>
              </div>
            }
          >
            <MuseumScene
              exploring={exploring}
              paused={panel !== null || menu}
              onOpen={open}
              onNearest={setNearest}
              onRegion={setInRomanWing}
            />
          </Suspense>
        </div>
        {!exploring && (
          <>
            <section className="welcome-strip">
              <span className="eyebrow">THE QUESTION AT THE HEART OF IT ALL</span>
              <h2>
                How do names preserve history and culture
                <br className="desktop-break" /> in everyday language?
              </h2>
              <span className="strip-mark">
                <BookOpen size={27} />
              </span>
            </section>
            <footer className="welcome-footer">
              <div>
                <span className="eyebrow">YOUR MUSEUM GUIDES</span>
                <p>
                  Ilesbekova Aruzhan <span>·</span> Kairlkhanova Aiganym
                  <br />
                  Zhapar Nuray <span>·</span> Kabdilkhamit Ademi
                </p>
              </div>
              <p>
                A university project.
                <br />
                <span>Made for curious minds.</span>
              </p>
              <button onClick={() => open("collection")}>
                Explore the five stories <ArrowRight size={16} />
              </button>
            </footer>
          </>
        )}
        {exploring && (
          <>
            <div className="museum-location">
              <span className="eyebrow">THE MUSEUM OF ENGLISH IDIOMS</span>
              <h2>{inRomanWing ? "The Roman Wing" : "The Grand Rotunda"}</h2>
              <span>Explore at your own pace.</span>
            </div>
            <div className="crosshair" />
            <div className="museum-passport">
              <button onClick={() => open("passport")}>
                <Ticket size={18} /> MUSEUM PASSPORT <span>{visited} / 5</span>
              </button>
              {stamps(true)}
            </div>
            <div className="museum-controls">
              <div className="desktop-controls">
                <span>
                  <Move size={16} /> <kbd>W A S D</kbd> / arrows to move
                </span>
                <span>
                  <Mouse size={15} /> Mouse / drag to look
                </span>
                <span>
                  <kbd>ESC</kbd> Release cursor
                </span>
              </div>
              <span className="mobile-controls">Joystick to move · drag to look</span>
              <button onClick={() => open("collection")}>
                <Menu size={16} /> Exhibit directory
              </button>
              <button onClick={() => open("activities")}>
                <BookOpen size={16} /> Learning studio
              </button>
            </div>
            {nearest && panel === null && (
              <button className="open-prompt" onClick={() => open(nearest)}>
                <span className="key-e">E</span>
                <span>
                  <small>EXHIBIT 0{nearest}</small>
                  {exhibits[nearest - 1].short}
                  <em>Press E / Tap to open</em>
                </span>
                <ArrowRight size={18} />
              </button>
            )}
            {complete && panel === null && (
              <button className="completion-pill" onClick={() => open("final")}>
                <Award size={17} /> All five discovered · Claim your certificate{" "}
                <ArrowRight size={15} />
              </button>
            )}
          </>
        )}
      </main>
      {toast && (
        <output className="stamp-toast">
          <Check size={17} />
          {toast}
        </output>
      )}
      {panel !== null && (
        <div
          className="modal-backdrop"
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <dialog
            open
            className={`museum-modal ${selected ? "exhibit-modal" : ""}`}
            ref={modal}
            aria-modal="true"
            aria-label={selected?.title || `${panel} panel`}
          >
            <div className="modal-toolbar">
              <button className="text-button" onClick={close}>
                <ArrowLeft size={16} /> BACK TO {exploring ? "MUSEUM" : "HOME"}
              </button>
              <span className="eyebrow">
                {selected ? `EXHIBIT 0${selected.id} / 05` : "THE MUSEUM OF ENGLISH IDIOMS"}
              </span>
              <button className="icon-button" aria-label="Close panel" onClick={close}>
                <X size={22} />
              </button>
            </div>
            {selected && (
              <div className="exhibit-content">
                <div className="exhibit-image">
                  <img
                    src={artUrl(selected.id)}
                    alt={
                      [
                        "Ancient wagon, golden knot and sword in a Phrygian landscape",
                        "A figure pushing a huge boulder up a steep Greek hill",
                        "Ancient open book in warm candlelight",
                        "Ancient Roman architecture surrounded by orange flames",
                        "Roman Colosseum and marble blocks in golden light",
                      ][selected.id - 1]
                    }
                  />
                  <span>
                    {selected.era}
                    <br />
                    {selected.place}
                  </span>
                  <button
                    className="image-tour"
                    onClick={() => {
                      setExploring(true);
                      setPanel(null);
                      setTimeout(
                        () =>
                          window.dispatchEvent(
                            new CustomEvent("museum-jump", { detail: selected.id }),
                          ),
                        150,
                      );
                    }}
                  >
                    <Compass size={16} /> Find in the museum <ArrowUpRight size={16} />
                  </button>
                </div>
                <div className="exhibit-text">
                  <span className="eyebrow">
                    {selected.id > 3 ? "THE ROMAN WING" : "THE GRAND ROTUNDA"} · {selected.type}
                  </span>
                  <h2>{selected.title}</h2>
                  <div className="idiom-title">{selected.idiom}.</div>
                  <div className="name-tags">
                    {selected.names.map(([n, t]) => (
                      <div key={n}>
                        <strong>{n}</strong>
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                  <details className="name-definition">
                    <summary>What do these name types mean?</summary>
                    <p>
                      An anthroponym is a person’s name. A toponym is a place name. A biblical
                      anthroponym is a person’s name from the Bible.
                    </p>
                  </details>
                  <div className="exhibit-section">
                    <h3>THE STORY BEHIND THE WORDS</h3>
                    <p>{selected.background}</p>
                  </div>
                  <div className="meaning-box">
                    <span className="eyebrow">WHAT IT MEANS TODAY</span>
                    <p>{selected.meaning}</p>
                    <small>Cultural associations · {selected.associations}</small>
                  </div>
                  <div className="exhibit-section">
                    <h3>IN EVERYDAY ENGLISH</h3>
                    <blockquote>{selected.example}</blockquote>
                  </div>
                  <div className="visitor-challenge">
                    <label className="eyebrow" htmlFor="reflection-answer">
                      YOUR VISITOR CHALLENGE
                    </label>
                    <p>{selected.challenge}</p>
                    <textarea
                      id="reflection-answer"
                      aria-label={selected.challenge}
                      rows={3}
                      placeholder="A moment from your own life…"
                      value={progress.responses[selected.id] || ""}
                      onChange={(e) =>
                        setProgress((v) => ({
                          ...v,
                          responses: { ...v.responses, [selected.id]: e.target.value },
                        }))
                      }
                    />
                    <span className="muted">
                      Your reflection is saved automatically on this device.
                    </span>
                  </div>
                  <details className="history-note">
                    <summary>A note on history & sources</summary>
                    <p>{selected.note}</p>
                    <a href={selected.url} target="_blank" rel="noreferrer">
                      {selected.source} <ArrowUpRight size={13} />
                    </a>
                  </details>
                  <div className="exhibit-next">
                    <span>
                      <Check size={15} /> Golden stamp collected
                    </span>
                    <button
                      className="text-button"
                      onClick={() => open(selected.id === 5 ? "passport" : selected.id + 1)}
                    >
                      {selected.id === 5 ? "View your passport" : "Next exhibit"}{" "}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {panel === "collection" && (
              <div className="collection-content">
                <div className="eyebrow">FIVE EXPRESSIONS. CENTURIES OF STORIES.</div>
                <h2>The collection</h2>
                <p className="muted">
                  Choose a story, or enter the museum and discover it on foot.
                </p>
                <div className="collection-grid">
                  {exhibits.map((e, i) => (
                    <button className="collection-card" key={e.id} onClick={() => open(e.id)}>
                      <div className="collection-art">
                        <img src={artUrl(e.id)} alt={e.title} />
                        <span>{numerals[i]}</span>
                        {progress.visited.includes(e.id) && <Check size={17} />}
                      </div>
                      <span className="eyebrow">
                        {e.id > 3 ? "ROMAN WING" : "GRAND ROTUNDA"} · 0{e.id}
                      </span>
                      <h3>{e.title}</h3>
                      <span className="collection-idiom">
                        {e.idiom} <ArrowUpRight size={17} />
                      </span>
                    </button>
                  ))}
                </div>
                <div className="collection-bottom">
                  <span>Anthroponyms: people’s names. Toponyms: place names.</span>
                  <button className="primary" onClick={enter}>
                    Explore in 3D <Compass size={17} />
                  </button>
                </div>
              </div>
            )}
            {panel === "passport" && (
              <div className="passport-content">
                <div className="eyebrow">YOUR PERSONAL RECORD OF DISCOVERY</div>
                <h2>Museum passport</h2>
                <p className="muted">
                  Five expressions. Five golden stamps. One journey through time.
                </p>
                <div className="passport-ticket">
                  <div className="passport-ticket-top">
                    <Landmark size={28} />
                    <span>ADMIT ONE CURIOUS MIND</span>
                    <span>No. 0001</span>
                  </div>
                  <h3>{complete ? "A complete collection." : "Every story leaves a mark."}</h3>
                  <p>Open an exhibit to collect its stamp.</p>
                  {stamps()}
                  <div className="passport-progress">
                    <span>{visited} OF 5 EXHIBITS DISCOVERED</span>
                    <div>
                      <span style={{ width: `${(visited / 5) * 100}%` }} />
                    </div>
                  </div>
                  {complete && (
                    <p className="correct">
                      All five exhibits discovered. You’ve completed the museum collection!
                    </p>
                  )}
                </div>
                <div className="passport-actions">
                  <button
                    className="primary"
                    onClick={() => open(complete ? "final" : "collection")}
                  >
                    {complete ? "Claim your certificate" : "Continue exploring"}{" "}
                    {complete ? <Award size={17} /> : <ArrowRight size={17} />}
                  </button>
                  <button className="text-button" onClick={() => open("activities")}>
                    Visit the learning studio <ArrowUpRight size={17} />
                  </button>
                </div>
                <p className="save-note">
                  Progress and reflections are saved on this device. No account needed.
                </p>
                {progress.activities.sentence && (
                  <div className="saved-sentence">
                    <span className="eyebrow">YOUR THEN & NOW SENTENCE</span>
                    <p>{progress.activities.sentence}</p>
                  </div>
                )}
                <button className="text-button" onClick={() => open("final")}>
                  View the map of origins <ArrowRight size={16} />
                </button>
              </div>
            )}
            {panel === "activities" && (
              <Activities
                value={progress.activities}
                onChange={(activities) => setProgress((v) => ({ ...v, activities }))}
              />
            )}
            {panel === "final" && (
              <FinalGallery
                complete={complete}
                onCollection={() => open("collection")}
                score={progress.activities.scores.reduce<number>((n, s) => n + (s ?? 0), 0)}
              />
            )}
          </dialog>
        </div>
      )}
    </div>
  );
}
