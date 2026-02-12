import PokeCard from "../pokeCard";
import "./index.css";

const PokeBinder = ({ slots, onBack, onClear, onOpenBooster }) => {
  return (
    <div className="binderPage">
      <div className="binderHeader">
        <div>
          <h2>Mon classeur</h2>
          <p className="binderSubtitle">Rangez vos cartes tirees au hasard.</p>
        </div>
        <div className="binderActions">
          <button type="button" className="btn btnGhost" onClick={onBack}>
            Retour
          </button>
          <button type="button" className="btn btnPrimary" onClick={onOpenBooster}>
            Ouvrir un booster
          </button>
          <button type="button" className="btn btnAccent" onClick={onClear}>
            Vider le classeur
          </button>
        </div>
      </div>

      <div className="binderGrid">
        {slots.map((pokemon, index) => (
          <div key={index} className="binderSlot">
            {pokemon ? (
              <PokeCard pokemon={pokemon} />
            ) : (
              <div className="binderSlotEmpty">
                <span className="binderSlotLabel">Slot {index + 1}</span>
                <span className="binderSlotMask" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokeBinder;
