import { useState } from "react";
import PokeForm from "../pokeForm";
import PokeCard from "../pokeCard";
import "./index.css";

const API_BASE = "http://localhost:3000";

const PokeCreate = ({ onBack }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [previewPokemon, setPreviewPokemon] = useState(null);

  const handleCreate = (payload) => {
    setSaving(true);
    setError("");
    setSuccess("");
    fetch(`${API_BASE}/pokemons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Creation failed");
        }
        return response.json();
      })
      .then((data) => {
        setSuccess(`Pokemon cree avec l'id ${data.id}`);
        setShowModal(true);
        setSaving(false);
      })
      .catch((err) => {
        setError(`Creation impossible: ${err.message}`);
        setSaving(false);
      });
  };

  return (
    <div className="createPage">
      <h2>Ajouter un Pokemon</h2>
      {error ? <p>{error}</p> : null}
      {success ? <p>{success}</p> : null}
      <div className="createGrid">
        <div className="createPreview">
          <h3>Apercu de la carte</h3>
          {previewPokemon ? (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", justifyContent: "center" }}>
              <PokeCard pokemon={previewPokemon} />
            </ul>
          ) : null}
        </div>
        <div className="createForm">
          <PokeForm
            onSubmit={handleCreate}
            submitLabel={saving ? "Creation..." : "Creer"}
            onCancel={onBack}
            onChange={setPreviewPokemon}
          />
        </div>
      </div>
      {showModal ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ background: "#fff", padding: 20, borderRadius: 8, color: "#000" }}>
            <p>Le Pokemon a bien ete cree.</p>
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                onBack();
              }}
            >
              OK
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PokeCreate;
