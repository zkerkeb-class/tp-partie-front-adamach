import { useEffect, useState } from "react";

const emptyForm = {
  nameEnglish: "",
  nameFrench: "",
  nameJapanese: "",
  nameChinese: "",
  image: "",
  type: "",
  baseHP: "128",
  baseAttack: "128",
  baseDefense: "128",
  baseSpecialAttack: "128",
  baseSpecialDefense: "128",
  baseSpeed: "128",
};

const DEFAULT_IMAGE = "http://localhost:3000/assets/missingno/missingno.jpg";

const buildDraftPokemon = (formState) => {
  const english = formState.nameEnglish.trim();
  const french = formState.nameFrench.trim() || english;
  const japanese = formState.nameJapanese.trim() || english;
  const chinese = formState.nameChinese.trim() || english;
  const imageValue = formState.image.trim() || DEFAULT_IMAGE;
  return {
    name: {
      english,
      french,
      japanese,
      chinese,
    },
    image: imageValue,
    type: formState.type
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    base: {
      HP: Number(formState.baseHP),
      Attack: Number(formState.baseAttack),
      Defense: Number(formState.baseDefense),
      SpecialAttack: Number(formState.baseSpecialAttack),
      SpecialDefense: Number(formState.baseSpecialDefense),
      Speed: Number(formState.baseSpeed),
    },
  };
};

const PokeForm = ({ initial, onSubmit, submitLabel, onCancel, onChange }) => {
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!initial) {
      setForm(emptyForm);
      return;
    }
    const nextForm = {
      nameEnglish: initial.name?.english ?? "",
      nameFrench: initial.name?.french ?? "",
      nameJapanese: initial.name?.japanese ?? "",
      nameChinese: initial.name?.chinese ?? "",
      image: initial.image ?? "",
      type: Array.isArray(initial.type) ? initial.type.join(", ") : initial.type ?? "",
      baseHP: initial.base?.HP ?? "",
      baseAttack: initial.base?.Attack ?? "",
      baseDefense: initial.base?.Defense ?? "",
      baseSpecialAttack: initial.base?.SpecialAttack ?? "",
      baseSpecialDefense: initial.base?.SpecialDefense ?? "",
      baseSpeed: initial.base?.Speed ?? "",
    };
    setForm(nextForm);
    setPreview(initial.image ?? DEFAULT_IMAGE);
    if (onChange) onChange(buildDraftPokemon(nextForm));
  }, [initial]);

  const updateField = (key) => (event) => {
    const value = event.target.value;
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (onChange) onChange(buildDraftPokemon(next));
      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = buildDraftPokemon(form);
    setPreview(payload.image);
    onSubmit(payload);
  };

  const handleImageFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      setForm((prev) => {
        const next = { ...prev, image: result };
        if (onChange) onChange(buildDraftPokemon(next));
        return next;
      });
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10, maxWidth: 640, margin: "0 auto" }}>
      <label>
        Nom (English)
        <input type="text" value={form.nameEnglish} onChange={updateField("nameEnglish")} />
      </label>
      <label>
        Nom (Francais)
        <input type="text" value={form.nameFrench} onChange={updateField("nameFrench")} />
      </label>
      <label>
        Nom (Japanese)
        <input type="text" value={form.nameJapanese} onChange={updateField("nameJapanese")} />
      </label>
      <label>
        Nom (Chinese)
        <input type="text" value={form.nameChinese} onChange={updateField("nameChinese")} />
      </label>
      <label>
        Image du Pokemon (importer depuis l'ordinateur)
        <input type="file" accept="image/*" onChange={handleImageFile} />
      </label>
      {preview ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src={preview} alt="Apercu" style={{ width: 180, height: 180, objectFit: "contain" }} />
        </div>
      ) : null}
      <label>
        Types (separes par virgule)
        <input type="text" value={form.type} onChange={updateField("type")} />
      </label>
      <label>
        HP
        <input
          type="range"
          min="1"
          max="255"
          value={form.baseHP}
          onChange={updateField("baseHP")}
        />
        <span>{form.baseHP}</span>
      </label>
      <label>
        Attack
        <input
          type="range"
          min="1"
          max="255"
          value={form.baseAttack}
          onChange={updateField("baseAttack")}
        />
        <span>{form.baseAttack}</span>
      </label>
      <label>
        Defense
        <input
          type="range"
          min="1"
          max="255"
          value={form.baseDefense}
          onChange={updateField("baseDefense")}
        />
        <span>{form.baseDefense}</span>
      </label>
      <label>
        Special Attack
        <input
          type="range"
          min="1"
          max="255"
          value={form.baseSpecialAttack}
          onChange={updateField("baseSpecialAttack")}
        />
        <span>{form.baseSpecialAttack}</span>
      </label>
      <label>
        Special Defense
        <input
          type="range"
          min="1"
          max="255"
          value={form.baseSpecialDefense}
          onChange={updateField("baseSpecialDefense")}
        />
        <span>{form.baseSpecialDefense}</span>
      </label>
      <label>
        Speed
        <input
          type="range"
          min="1"
          max="255"
          value={form.baseSpeed}
          onChange={updateField("baseSpeed")}
        />
        <span>{form.baseSpeed}</span>
      </label>
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <button type="submit">{submitLabel}</button>
        {onCancel ? (
          <button type="button" onClick={onCancel}>
            Retour
          </button>
        ) : null}
      </div>
    </form>
  );
};

export default PokeForm;
