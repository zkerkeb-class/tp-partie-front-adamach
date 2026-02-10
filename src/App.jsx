import "./App.css";
import { useState } from "react";
import PokeList from "./components/pokelist";
import PokeDetails from "./components/pokeDetails";
import PokeCreate from "./components/pokeCreate";

function App() {
  const [view, setView] = useState("list");
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (id) => {
    setSelectedId(id);
    setView("detail");
  };

  const handleBack = () => {
    setSelectedId(null);
    setView("list");
  };

  const handleCreate = () => setView("create");

  return (
    <div>
      {view === "list" ? <PokeList onSelect={handleSelect} onCreate={handleCreate} /> : null}
      {view === "detail" ? (
        <PokeDetails pokemonId={selectedId} onBack={handleBack} onDeleted={handleBack} />
      ) : null}
      {view === "create" ? <PokeCreate onBack={handleBack} /> : null}
    </div>
  );
}

export default App;
