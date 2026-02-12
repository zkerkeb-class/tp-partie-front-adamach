import { useState, useEffect } from "react";
import PokeCard from "../pokeCard";
import "./index.css";

const LIMIT = 20;
const API_BASE = "http://localhost:3000";

const PokeList = ({ onSelect, onCreate, onOpenBinder }) => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (searchResult) return;
    setLoading(true);

    fetch(`${API_BASE}/pokemons?page=${page}&limit=${LIMIT}`)
      .then((response) => response.json())
      .then((json) => {
        setPokemons(json.data);
        setTotalPages(json.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur:", error);
        setLoading(false);
      });
  }, [page, searchResult]);

  const handleSearch = (event) => {
    event.preventDefault();
    const term = searchTerm.trim();
    if (!term) return;
    setLoading(true);
    setSearchError("");
    fetch(`${API_BASE}/pokemons/search?name=${encodeURIComponent(term)}`)
      .then((response) => {
        if (!response.ok) throw new Error("Not found");
        return response.json();
      })
      .then((data) => {
        setSearchResult(data);
        setLoading(false);
      })
      .catch(() => {
        setSearchError("Aucun Pokemon trouvé");
        setSearchResult(null);
        setLoading(false);
      });
  };

  const clearSearch = () => {
    setSearchResult(null);
    setSearchError("");
    setSearchTerm("");
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h2 className="pokedexTitle">Pokedex</h2>

      <form className="searchBar" onSubmit={handleSearch}>
        <input
          className="searchInput"
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Rechercher par nom"
        />
        <button className="btn btnPrimary" type="submit">
          Rechercher
        </button>
        {searchResult || searchError ? (
          <button className="btn btnGhost" type="button" onClick={clearSearch}>
            Tout afficher
          </button>
        ) : null}
        <button className="btn btnAccent" type="button" onClick={onCreate}>
          Ajouter un Pokemon
        </button>
        <button className="btn btnGhost btnIconBtn" type="button" onClick={onOpenBinder}>
          <span className="btnIcon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="img">
              <path
                d="M5 4h10a3 3 0 0 1 3 3v12a1 1 0 0 1-1 1H7a3 3 0 0 1-3-3V4Z"
                fill="currentColor"
              />
              <path
                d="M7 6h10a1 1 0 0 1 1 1v10H7a2 2 0 0 1-2-2V6a0 0 0 0 1 2 0Z"
                fill="rgba(0,0,0,0.25)"
              />
            </svg>
          </span>
          Mon classeur
        </button>
      </form>

      {searchError ? <p>{searchError}</p> : null}

      {searchResult ? (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <PokeCard pokemon={searchResult} onSelect={onSelect} />
        </ul>
      ) : (
        <>
          <ul
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              padding: 0,
              justifyContent: "center",
              listStyle: "none",
            }}
          >
            {pokemons.map((p) => (
              <PokeCard key={p._id} pokemon={p} onSelect={onSelect} />
            ))}
          </ul>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              Precedent
            </button>

            <span>
              Page {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PokeList;
