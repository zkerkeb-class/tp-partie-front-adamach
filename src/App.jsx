import "./App.css";
import { useEffect, useState } from "react";
import PokeList from "./components/pokelist";
import PokeDetails from "./components/pokeDetails";
import PokeCreate from "./components/pokeCreate";
import PokeBooster from "./components/pokeBooster";
import PokeBinder from "./components/pokeBinder";

const API_BASE = "http://localhost:3000";

function App() {
  const [view, setView] = useState("list");
  const [selectedId, setSelectedId] = useState(null);
  const [binderSlots, setBinderSlots] = useState([]);

  useEffect(() => {
    let alive = true;
    fetch(`${API_BASE}/pokemons?page=1&limit=1`)
      .then((response) => response.json())
      .then((json) => {
        if (!alive) return;
        const total = Number(json.total || 0);
        if (!total) return;
        setBinderSlots((prev) =>
          Array.from({ length: total }, (_, i) => prev[i] ?? null)
        );
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const handleSelect = (id) => {
    setSelectedId(id);
    setView("detail");
  };

  const handleBack = () => {
    setSelectedId(null);
    setView("list");
  };

  const handleCreate = () => setView("create");
  const handleOpenBooster = () => setView("booster");
  const handleOpenBinder = () => setView("binder");

  const handleAddToBinder = (cards) => {
    let added = 0;
    setBinderSlots((prev) => {
      const next = [...prev];
      const existingKeys = new Set(
        next.map((slot) => (slot ? slot.id ?? slot._id : null)).filter(Boolean)
      );
      for (const card of cards) {
        const key = card?.id ?? card?._id;
        if (!key || existingKeys.has(key)) continue;
        const idx = next.findIndex((slot) => slot == null);
        if (idx === -1) break;
        next[idx] = card;
        existingKeys.add(key);
        added += 1;
      }
      return next.length ? next : prev;
    });
    return added;
  };

  const handleClearBinder = () => {
    setBinderSlots((prev) => prev.map(() => null));
  };

  return (
    <div>
      {view === "list" ? (
        <PokeList
          onSelect={handleSelect}
          onCreate={handleCreate}
          onOpenBooster={handleOpenBooster}
          onOpenBinder={handleOpenBinder}
        />
      ) : null}
      {view === "detail" ? (
        <PokeDetails pokemonId={selectedId} onBack={handleBack} onDeleted={handleBack} />
      ) : null}
      {view === "create" ? <PokeCreate onBack={handleBack} /> : null}
      {view === "booster" ? (
        <PokeBooster
          binderSlots={binderSlots}
          onBack={handleBack}
          onAddToBinder={handleAddToBinder}
          onOpenBinder={handleOpenBinder}
        />
      ) : null}
      {view === "binder" ? (
        <PokeBinder
          slots={binderSlots}
          onBack={handleBack}
          onClear={handleClearBinder}
          onOpenBooster={handleOpenBooster}
        />
      ) : null}
    </div>
  );
}

export default App;
