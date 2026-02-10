import { useEffect, useState } from "react";
import PokeForm from "../pokeForm";
import PokeCard from "../pokeCard";
import "./index.css";

const API_BASE = "http://localhost:3000";

const PokeDetails = ({ pokemonId, onBack, onDeleted }) => {
  const [pokemon, setPokemon] = useState(null);
  const [previewPokemon, setPreviewPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (!pokemonId) return;
    setLoading(true);
    setError("");
    fetch(`${API_BASE}/pokemons/${pokemonId}`)
      .then((response) => {
        if (!response.ok) throw new Error("Not found");
        return response.json();
      })
      .then((data) => {
        setPokemon(data);
        setPreviewPokemon(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger le Pokemon");
        setLoading(false);
      });
  }, [pokemonId]);

  const handleUpdate = (payload) => {
    setSaving(true);
    fetch(`${API_BASE}/pokemons/${pokemonId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Update failed");
        return response.json();
      })
      .then((data) => {
        setPokemon(data);
        setSaving(false);
      })
      .catch(() => {
        setError("Mise a jour impossible");
        setSaving(false);
      });
  };

  const handleDelete = () => {
    fetch(`${API_BASE}/pokemons/${pokemonId}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) throw new Error("Delete failed");
        onDeleted();
      })
      .catch(() => {
        setError("Suppression impossible");
      });
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="detailsPage">
      <div className="detailsHeader">
        <div>
          <h2>Details du Pokemon</h2>
          <p className="detailsSubtitle">Modifier les informations et sauvegarder.</p>
        </div>
        <button type="button" className="dangerBtn" onClick={() => setShowDelete(true)}>
          Supprimer
        </button>
      </div>

      {error ? <p className="detailsError">{error}</p> : null}

      <div className="detailsGrid">
        <div className="detailsPreview">
          <h3>Apercu de la carte</h3>
          {previewPokemon ? (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", justifyContent: "center" }}>
              <PokeCard pokemon={previewPokemon} />
            </ul>
          ) : null}
          <div className="detailsMetaCard">
            <h4>{pokemon?.name?.english || "Sans nom"}</h4>
            <p>Types: {pokemon?.type?.join(", ") || "-"}</p>
            <p>PV: {pokemon?.base?.HP ?? "-"}</p>
            <p>Attaque: {pokemon?.base?.Attack ?? "-"}</p>
            <p>Attaque Sp.: {pokemon?.base?.SpecialAttack ?? "-"}</p>
            <p>Defense: {pokemon?.base?.Defense ?? "-"}</p>
            <p>Defense Sp.: {pokemon?.base?.SpecialDefense ?? "-"}</p>
            <p>Vitesse: {pokemon?.base?.Speed ?? "-"}</p>
          </div>
        </div>

        <div className="detailsForm">
          <PokeForm
            initial={pokemon}
            onSubmit={handleUpdate}
            submitLabel={saving ? "Sauvegarde..." : "Sauvegarder"}
            onCancel={onBack}
            disableId
            onChange={setPreviewPokemon}
          />
        </div>
      </div>

      {showDelete ? (
        <div className="detailsModal">
          <div className="detailsModalContent">
            <p>Voulez-vous vraiment supprimer ce Pokemon ?</p>
            <div className="detailsModalActions">
              <button type="button" className="dangerBtn" onClick={handleDelete}>
                Oui, supprimer
              </button>
              <button type="button" onClick={() => setShowDelete(false)}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PokeDetails;
