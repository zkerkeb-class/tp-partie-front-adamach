import { useEffect, useMemo, useRef, useState } from "react";
import PokeCard from "../pokeCard";
import "./index.css";

const API_BASE = "http://localhost:3000";
const BOOSTER_SIZE = 5;
const PAGE_LIMIT = 200;
const CARD_BACK = "http://localhost:3000/assets/PokemonCardBack.png";

const fetchPage = async (page) => {
  const response = await fetch(`${API_BASE}/pokemons?page=${page}&limit=${PAGE_LIMIT}`);
  if (!response.ok) throw new Error("Load failed");
  return response.json();
};

const sampleUnique = (list, count) => {
  const pool = [...list];
  const picks = [];
  const total = Math.min(count, pool.length);
  for (let i = 0; i < total; i += 1) {
    const idx = Math.floor(Math.random() * pool.length);
    picks.push(pool.splice(idx, 1)[0]);
  }
  return picks;
};

const PokeBooster = ({ binderSlots, onAddToBinder, onBack, onOpenBinder }) => {
  const [allPokemons, setAllPokemons] = useState([]);
  const [drawn, setDrawn] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawing, setDrawing] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [revealed, setRevealed] = useState(false);
  const timerRef = useRef(null);

  const emptySlots = useMemo(
    () => binderSlots.filter((slot) => slot == null).length,
    [binderSlots]
  );

  useEffect(() => {
    let alive = true;
    const loadAll = async () => {
      setLoading(true);
      setError("");
      try {
        const first = await fetchPage(1);
        let combined = first.data ?? [];
        const pages = Array.from({ length: Math.max(0, first.totalPages - 1) }, (_, i) => i + 2);
        if (pages.length) {
          const results = await Promise.all(pages.map((page) => fetchPage(page)));
          results.forEach((result) => {
            combined = combined.concat(result.data ?? []);
          });
        }
        if (alive) {
          setAllPokemons(combined);
          setLoading(false);
        }
      } catch (err) {
        if (alive) {
          setError("Impossible de charger les Pokemons");
          setLoading(false);
        }
      }
    };
    loadAll();
    return () => {
      alive = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleDraw = () => {
    if (!allPokemons.length) return;
    setDrawing(true);
    setInfo("");
    const picks = sampleUnique(allPokemons, BOOSTER_SIZE);
    setDrawn(picks);
    setRevealed(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const added = onAddToBinder(picks);
      if (added < picks.length) {
        setInfo("Classeur plein ou doublons: certaines cartes n'ont pas pu etre ajoutees.");
      } else {
        setInfo("Cartes ajoutees au classeur.");
      }
      setRevealed(true);
      setDrawing(false);
    }, 900);
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="boosterPage">
      <div className="boosterHeader">
        <div>
          <h2>Booster</h2>
          <p className="boosterSubtitle">
            Tirez {BOOSTER_SIZE} cartes au hasard et rangez-les dans votre classeur.
          </p>
        </div>
        <div className="boosterActions">
          <button type="button" className="btn btnGhost" onClick={onBack}>
            Retour
          </button>
          <button type="button" className="btn btnPrimary" onClick={onOpenBinder}>
            Voir le classeur
          </button>
          <button
            type="button"
            className="btn btnAccent"
            onClick={handleDraw}
            disabled={drawing || !allPokemons.length}
          >
            Ouvrir un booster
          </button>
        </div>
      </div>

      {error ? <p className="boosterError">{error}</p> : null}
      {info ? <p className="boosterInfo">{info}</p> : null}

      <div className="boosterMeta">
        <span>Slots vides: {emptySlots}</span>
        <span>Total Pokemons: {allPokemons.length}</span>
      </div>

      {drawn.length ? (
        <ul className={`boosterGrid ${revealed ? "revealed" : "dealing"}`}>
          {drawn.map((pokemon, index) => (
            <li
              key={pokemon._id ?? index}
              className="boosterSlot"
              style={{
                "--dealDelay": `${index * 0.18}s`,
                "--dealOffset": `${(index - (drawn.length - 1) / 2) * 36}px`,
              }}
            >
              <div className="boosterFlip">
                <div className="boosterFace boosterFaceBack">
                  <img className="boosterBack" src={CARD_BACK} alt="Dos de carte" />
                </div>
                <div className="boosterFace boosterFaceFront">
                  <PokeCard pokemon={pokemon} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="boosterEmpty">Aucune carte tiree pour le moment.</div>
      )}
    </div>
  );
};

export default PokeBooster;
