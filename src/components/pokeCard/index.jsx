import { useMemo, useRef } from "react";
import "./index.css";

const couleursParType = {
  fire: ["#ff8a5b", "#ff2d7d"],
  water: ["#4cc9ff", "#7c4dff"],
  grass: ["#3dffb5", "#00c853"],
  electric: ["#ffe066", "#ff8f00"],
  psychic: ["#ff61d2", "#7a5cff"],
  ice: ["#9be7ff", "#5dd6ff"],
  dragon: ["#8a5bff", "#00e5ff"],
  dark: ["#6b7280", "#111827"],
  fairy: ["#ff9ad5", "#ff5bbd"],
  fighting: ["#ff6b6b", "#ffb86b"],
  poison: ["#b794f4", "#7c3aed"],
  ground: ["#e2b07a", "#c08457"],
  rock: ["#d6d3d1", "#a8a29e"],
  bug: ["#a3e635", "#22c55e"],
  ghost: ["#a78bfa", "#6366f1"],
  steel: ["#cbd5e1", "#94a3b8"],
  normal: ["#d4d4d8", "#a1a1aa"],
};

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const PokeCard = ({ pokemon, onSelect }) => {
  const ref = useRef(null);

  const image = useMemo(() => pokemon.image || "", [pokemon.image]);
  const typePrincipal = (pokemon.type?.[0] || "normal").toLowerCase();
  const [c1, c2] = couleursParType[typePrincipal] || ["rgb(0,231,255)", "rgb(255,0,231)"];

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const px = Math.abs(Math.floor((100 / rect.width) * x) - 100);
    const py = Math.abs(Math.floor((100 / rect.height) * y) - 100);
    const pa = 50 - px + (50 - py);

    const lp = 50 + (px - 50) / 1.5;
    const tp = 50 + (py - 50) / 1.5;

    const pxSpark = 50 + (px - 50) / 7;
    const pySpark = 50 + (py - 50) / 7;

    const sparkOpacity = (20 + Math.abs(pa) * 1.5) / 100;

    const rotX = ((tp - 50) / 2) * -1;
    const rotY = ((lp - 50) / 1.5) * 0.5;

    el.classList.add("active");
    el.style.setProperty("--gradPos", `${lp}% ${tp}%`);
    el.style.setProperty("--sparkPos", `${pxSpark}% ${pySpark}%`);
    el.style.setProperty("--sparkOpacity", String(clamp(sparkOpacity, 0.15, 1)));
    el.style.setProperty("--rx", `${rotX}deg`);
    el.style.setProperty("--ry", `${rotY}deg`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;

    el.classList.remove("active");
    el.style.removeProperty("--gradPos");
    el.style.removeProperty("--sparkPos");
    el.style.removeProperty("--sparkOpacity");
    el.style.removeProperty("--rx");
    el.style.removeProperty("--ry");

    el.classList.remove("animated");
    requestAnimationFrame(() => el.classList.add("animated"));
  };

  const name = pokemon.name?.english || "Sans nom";
  const hp = pokemon.base?.HP ?? "-";
  const atk = pokemon.base?.Attack ?? "-";
  const spAtk = pokemon.base?.SpecialAttack ?? "-";
  const def = pokemon.base?.Defense ?? "-";
  const spDef = pokemon.base?.SpecialDefense ?? "-";
  const spd = pokemon.base?.Speed ?? "-";

  return (
    <li
      className="threeDWrapper pokeFontScope"
      onClick={onSelect ? () => onSelect(pokemon.id) : undefined}
      role={onSelect ? "button" : undefined}
    >
      <div
        ref={ref}
        className="holoCard animated"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onTouchMove={onMove}
        onTouchEnd={onLeave}
        style={{
          "--color1": c1,
          "--color2": c2,
        }}
      >
        <div className="hpBadge pokeFontNumbers">PV {hp}</div>
        <div className="typeBadge">{typePrincipal}</div>

        <div className="pokePop">
          {image ? <img className="pokeImgPop" src={image} alt={name} /> : null}
        </div>

        <div className="cardContent">
          <h3 className="name pokeFontName">{name}</h3>
          <div className="stats">
            <div>
              <span>Attaque</span>
              <strong className="pokeFontNumbers">{atk}</strong>
            </div>
            <div>
              <span>Att. Sp.</span>
              <strong className="pokeFontNumbers">{spAtk}</strong>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default PokeCard;
