import { useState } from "react";
import { ArrowRight, Check, RotateCcw, Search, Clock3, Layers } from "lucide-react";
import { exhibits } from "../lib/exhibits";
export type ActivityState = {
  mystery: string[];
  now: string;
  matches: string[];
  sentence: string;
  scores: (number | null)[];
};
export const emptyActivities: ActivityState = {
  mystery: ["", "", ""],
  now: "",
  matches: ["", "", "", "", ""],
  sentence: "",
  scores: [null, null, null],
};
export default function Activities({
  value,
  onChange,
}: {
  value: ActivityState;
  onChange: (v: ActivityState) => void;
}) {
  const [tab, setTab] = useState(0),
    [message, setMessage] = useState(""),
    [saved, setSaved] = useState(false);
  const total = value.scores.reduce<number>((n, v) => n + (v ?? 0), 0);
  const update = (changes: Partial<ActivityState>) => {
    onChange({ ...value, ...changes });
    setMessage("");
  };
  const check = () => {
    let result = 0;
    if (tab === 0) {
      if (value.mystery.some((v) => !v)) {
        setMessage("Choose an idiom for all three mysteries first.");
        return;
      }
      result = value.mystery.filter((v, i) => v === String([1, 2, 4][i])).length;
    }
    if (tab === 1) {
      if (!value.now) {
        setMessage("Choose the idiom that fits the situation first.");
        return;
      }
      result = value.now === "4" ? 1 : 0;
    }
    if (tab === 2) {
      if (value.matches.some((v) => !v)) {
        setMessage("Match all five meanings before checking.");
        return;
      }
      result = value.matches.filter((v, i) => v === String(i + 1)).length;
    }
    const scores = [...value.scores];
    scores[tab] = result;
    update({ scores });
  };
  const retry = () => {
    const scores = [...value.scores];
    scores[tab] = null;
    update({ scores });
  };
  const options = (
    <>
      <option value="">Choose an idiom…</option>
      {exhibits.map((e) => (
        <option value={e.id} key={e.id}>
          {e.id}. {e.idiom}
        </option>
      ))}
    </>
  );
  return (
    <div className="activities">
      <div className="eyebrow">THE LEARNING STUDIO</div>
      <h2>Put the past into practice.</h2>
      <p className="muted">
        A little curiosity. A little challenge. A new way to see everyday language.
      </p>
      <div className="activity-tabs">
        {["Historical Mystery", "Then & Now", "Meaning Match"].map((t, i) => {
          const Icon = [Search, Clock3, Layers][i];
          return (
            <button
              key={t}
              className={tab === i ? "active" : ""}
              onClick={() => {
                setTab(i);
                setMessage("");
              }}
            >
              <Icon size={17} />
              <span>{t}</span>
              {value.scores[i] !== null && <Check size={14} />}
            </button>
          );
        })}
      </div>
      {tab === 0 && (
        <>
          <div className="activity-intro">
            <h3>Three clues. One expression.</h3>
            <span>3 POINTS</span>
          </div>
          {[
            "Sword, wagon, king in Phrygia",
            "Boulder, hill, endless punishment",
            "City in flames, musical emperor",
          ].map((clue, i) => (
            <div className="question-row" key={clue}>
              <div>
                <span className="question-number">0{i + 1}</span>
                <label htmlFor={`mystery-${i}`}>{clue}</label>
              </div>
              <select
                id={`mystery-${i}`}
                value={value.mystery[i]}
                disabled={value.scores[0] !== null}
                onChange={(e) => {
                  let a = [...value.mystery];
                  a[i] = e.target.value;
                  update({ mystery: a });
                }}
              >
                {options}
              </select>
              {value.scores[0] !== null && (
                <p className={value.mystery[i] === String([1, 2, 4][i]) ? "correct" : "incorrect"}>
                  {value.mystery[i] === String([1, 2, 4][i]) ? "Correct. " : "Not quite. "}
                  {exhibits[[0, 1, 3][i]].idiom}
                </p>
              )}
            </div>
          ))}
        </>
      )}
      {tab === 1 && (
        <>
          <div className="activity-intro">
            <h3>An ancient story. A modern situation.</h3>
            <span>1 POINT</span>
          </div>
          <blockquote>
            “Your friend plays games before an important exam and ignores homework.”
          </blockquote>
          <p>Which expression best describes your friend?</p>
          <div className="choices">
            {exhibits.map((e) => (
              <label className={value.now === String(e.id) ? "selected" : ""} key={e.id}>
                <input
                  type="radio"
                    aria-label={e.idiom}
                  name="now"
                  value={e.id}
                  checked={value.now === String(e.id)}
                  disabled={value.scores[1] !== null}
                  onChange={(ev) => update({ now: ev.target.value })}
                />
                {e.idiom}
              </label>
            ))}
          </div>
          {value.scores[1] !== null && (
            <p className={value.scores[1] === 1 ? "correct" : "incorrect"}>
              {value.scores[1] === 1 ? "Exactly." : "Not quite."} To fiddle while Rome burns means
              ignoring an urgent problem.
            </p>
          )}
          <label className="field-label" htmlFor="own-sentence">
            YOUR TURN · Write a sentence using any exhibit idiom
          </label>
          <textarea
            id="own-sentence"
            aria-label="Your sentence using an exhibit idiom"
            rows={3}
            placeholder="Rome wasn’t built in a day, so I…"
            value={value.sentence}
            onChange={(e) => {
              update({ sentence: e.target.value });
              setSaved(false);
            }}
          />
          <button
            className="text-button"
            onClick={() => {
              if (value.sentence.trim().length < 10) {
                setMessage("Write a complete sentence before saving.");
                return;
              }
              const s = value.sentence.toLowerCase();
              if (
                ![
                  "gordian knot",
                  "sisyphean",
                  "patience of job",
                  "rome burns",
                  "rome burned",
                  "rome was",
                  "rome wasn",
                  "rome is",
                  "fiddling while rome",
                ].some((phrase) => s.includes(phrase))
              ) {
                setMessage("Include one of the five exhibit idioms in your sentence.");
                return;
              }
              setSaved(true);
              setMessage("");
            }}
          >
            Save my sentence <Check size={15} />
          </button>
          {saved && (
            <p className="correct">
              Sentence saved in your passport. This is a reflection, not an automatically graded
              English exercise.
            </p>
          )}
        </>
      )}
      {tab === 2 && (
        <>
          <div className="activity-intro">
            <h3>Match the meaning to the exhibit.</h3>
            <span>5 POINTS</span>
          </div>
          {[
            "Bold solution",
            "Endless task",
            "Great patience",
            "Ignoring an urgent problem",
            "Achievements take time",
          ].map((meaning, i) => (
            <div className="question-row" key={meaning}>
              <div>
                <span className="question-number">0{i + 1}</span>
                <label htmlFor={`match-${i}`}>{meaning}</label>
              </div>
              <select
                id={`match-${i}`}
                value={value.matches[i]}
                disabled={value.scores[2] !== null}
                onChange={(e) => {
                  let a = [...value.matches];
                  a[i] = e.target.value;
                  update({ matches: a });
                }}
              >
                {options}
              </select>
              {value.scores[2] !== null && (
                <p className={value.matches[i] === String(i + 1) ? "correct" : "incorrect"}>
                  {value.matches[i] === String(i + 1) ? "Correct." : "Not quite."} Exhibit {i + 1} —{" "}
                  {exhibits[i].idiom}
                </p>
              )}
            </div>
          ))}
        </>
      )}
      {message && (
        <p role="alert" className="incorrect">
          {message}
        </p>
      )}
      <div className="activity-bottom">
        {value.scores[tab] === null ? (
          <button className="primary" onClick={check}>
            Check answers <ArrowRight size={17} />
          </button>
        ) : (
          <>
            <output className="result">
              Your score: {value.scores[tab]} / {[3, 1, 5][tab]}
            </output>
            <button className="text-button" onClick={retry}>
              <RotateCcw size={15} /> Try again
            </button>
          </>
        )}
        <span className="total-score">
          {value.scores.every((v) => v !== null) ? "FINAL SCORE" : "PASSPORT SCORE"}{" "}
          <strong>{total} / 9</strong>
        </span>
      </div>
      {value.scores.every((v) => v !== null) && (
        <p className="correct">
          All three activities complete.{" "}
          {total === 9
            ? "A perfect collection of answers."
            : "Revisit the exhibits or retry an activity to keep learning."}
        </p>
      )}
    </div>
  );
}
