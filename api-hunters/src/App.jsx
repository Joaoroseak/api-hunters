import axios from "axios";
import { AlertTriangle, Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import "./index.css";

export default function App() {
  const [characters, setCharacters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const characterFixes = {
    "naruto uzumaki": {
      clan: "Uzumaki",
      rank: "7º Hokage / Jinchūriki / Sábio",
      jutsu: "Rasengan / Múltiplos Clones das Sombras",
      sex: "Masculino",
    },
    "sasuke uchiha": {
      clan: "Uchiha",
      rank: "Ninja Renegado / Shinobi das Sombras",
      jutsu: "Chidori / Amaterasu / Susanoo",
      sex: "Masculino",
    },
    "kakashi hatake": {
      clan: "Hatake",
      rank: "6º Hokage / Jōnin / Ex-Anbu",
      jutsu: "Raikiri (Corte Relâmpago) / Sharingan",
      sex: "Masculino",
    },
    "madara uchiha": {
      clan: "Uchiha",
      rank: "Líder Uchiha / Ninja Renegado / Sábio",
      jutsu: "Susanoo / Estilo Fogo: Grande Bola de Fogo",
      sex: "Masculino",
    },
    "itachi uchiha": {
      clan: "Uchiha",
      rank: "Ex-Anbu / Ninja Renegado (Akatsuki)",
      jutsu: "Tsukuyomi / Amaterasu / Susanoo",
      sex: "Masculino",
    },
    gaara: {
      clan: "Kazekage (Vila da Areia)",
      rank: "5º Kazekage / Ex-Jinchūriki",
      jutsu: "Caixão de Areia (Sabaku Kyū)",
      sex: "Masculino",
    },
    "sakura haruno": {
      clan: "Haruno",
      rank: "Jōnin / Ninja Médico / Chefe do Hospital",
      jutsu: "Força Monstruosa / Selo Yin (Byakugou)",
      sex: "Feminino",
    },
    jiraiya: {
      clan: "Sannin Lendário",
      rank: "Sábio (Eremita dos Sapos)",
      jutsu: "Rasengan / Modo Sábio dos Sapos",
      sex: "Masculino",
      image:
        "https://static.wikia.nocookie.net/naruto/images/2/27/Jiraiya_p.png",
    },
    tsunade: {
      clan: "Senju",
      rank: "5ª Hokage / Sannin Lendária / Ninja Médica",
      jutsu: "Selo de Reconstrução Celular (Byakugou)",
      sex: "Feminino",
    },
    orochimaru: {
      clan: "Sannin Lendário",
      rank: "Ninja Renegado / Fundador da Vila do Som",
      jutsu: "Técnica de Reencarnação / Invocação de Cobras",
      sex: "Masculino",
    },
    "hinata hyūga": {
      clan: "Hyūga",
      rank: "Chūnin",
      jutsu: "Byakugan / Punho dos Leões Gêmeos",
      sex: "Feminino",
    },
    "shikamaru nara": {
      clan: "Nara",
      rank: "Jōnin / Conselheiro do Hokage",
      jutsu: "Técnica da Possessão das Sombras",
      sex: "Masculino",
    },
    "neji hyūga": {
      clan: "Hyūga",
      rank: "Jōnin",
      jutsu: "Byakugan / Oito Trigramas Sessenta e Quatro Palmas",
      sex: "Masculino",
    },
    "rock lee": {
      clan: "Lee",
      rank: "Jōnin",
      jutsu: "Lótus Primária / Oito Portões Internos",
      sex: "Masculino",
    },
  };

  const getCharacterImage = (char) => {
    const nameLower = char.name?.toLowerCase().trim();
    if (characterFixes[nameLower]?.image) {
      return characterFixes[nameLower].image;
    }
    if (char.images && char.images.length > 0 && char.images[0]) {
      return char.images[0];
    }
    return "https://placehold.co/300x300/1e293b/f97316?text=Ninja";
  };

  const getClan = (char) => {
    const nameLower = char.name?.toLowerCase().trim();
    if (characterFixes[nameLower]?.clan) return characterFixes[nameLower].clan;

    const rawClan = char.personal?.clan;
    if (Array.isArray(rawClan) && rawClan.length > 0) return rawClan.join(", ");
    if (typeof rawClan === "string" && rawClan.trim() !== "") return rawClan;

    const nameParts = char.name.split(" ");
    if (nameParts.length > 1) {
      const surname = nameParts[nameParts.length - 1];
      if (
        [
          "Uzumaki",
          "Uchiha",
          "Hyūga",
          "Hyuga",
          "Nara",
          "Akimichi",
          "Yamanaka",
          "Inuzuka",
          "Aburame",
          "Senju",
          "Hatake",
          "Sarutobi",
          "Otsutsuki",
          "Ōtsutsuki",
        ].includes(surname)
      ) {
        return surname;
      }
    }
    return "Sem Clã Registrado";
  };

  const getSex = (char) => {
    const nameLower = char.name?.toLowerCase().trim();
    if (characterFixes[nameLower]?.sex) return characterFixes[nameLower].sex;

    const sex = char.personal?.sex;
    if (!sex) return "Desconhecido";
    if (sex.toLowerCase() === "male") return "Masculino";
    if (sex.toLowerCase() === "female") return "Feminino";
    return sex;
  };

  const getClassification = (char) => {
    const nameLower = char.name?.toLowerCase().trim();
    if (characterFixes[nameLower]?.rank) return characterFixes[nameLower].rank;

    const personal = char.personal || {};
    let ranks = [];

    if (personal.ninjaRank) {
      if (typeof personal.ninjaRank === "object") {
        const rankVal =
          personal.ninjaRank["Part II"] ||
          personal.ninjaRank["Part I"] ||
          Object.values(personal.ninjaRank)[0];
        if (rankVal) ranks.push(rankVal);
      } else {
        ranks.push(personal.ninjaRank);
      }
    }

    if (personal.classification) {
      if (Array.isArray(personal.classification)) {
        ranks.push(...personal.classification);
      } else {
        ranks.push(personal.classification);
      }
    }

    if (ranks.length === 0) return "Shinobi";

    return ranks
      .join(", ")
      .replace(/Missing-nin/gi, "Ninja Renegado")
      .replace(/Medical-nin/gi, "Ninja Médico")
      .replace(/Sage/gi, "Sábio")
      .replace(/Sensor Type/gi, "Tipo Sensor")
      .replace(/Jinchūriki/gi, "Jinchūriki (Portador de Bijuu)");
  };

  const getJutsu = (char) => {
    const nameLower = char.name?.toLowerCase().trim();
    if (characterFixes[nameLower]?.jutsu)
      return characterFixes[nameLower].jutsu;

    if (!char.jutsu || char.jutsu.length === 0) return "Técnicas Ninja Gerais";

    let jutsu = char.jutsu[0];
    const dict = {
      "All Directions Shuriken": "Shuriken em Todas as Direções",
      "Area Scanning Technique": "Técnica de Escaneamento de Área",
      "Animal Path": "Caminho Animal (Invocação Pain)",
      Afterglow: "Brilho Residual (Ataque Cego)",
      "Shadow Clone Technique": "Técnica dos Clones das Sombras",
      "Multi Shadow Clone Technique": "Múltiplos Clones das Sombras",
      "Fire Release: Great Fireball Technique":
        "Estilo Fogo: Grande Bola de Fogo",
      Chidori: "Chidori (Mil Pássaros)",
      Rasengan: "Rasengan",
    };

    if (dict[jutsu]) return dict[jutsu];

    return jutsu
      .replace(/Technique/gi, "Técnica")
      .replace(/Clone/gi, "Clone")
      .replace(/Shuriken/gi, "Shuriken")
      .replace(/Mode/gi, "Modo")
      .replace(/Fire Release/gi, "Estilo Fogo")
      .replace(/Water Release/gi, "Estilo Água")
      .replace(/Lightning Release/gi, "Estilo Trovão")
      .replace(/Earth Release/gi, "Estilo Terra")
      .replace(/Wind Release/gi, "Estilo Vento")
      .replace(/Barrier/gi, "Barreira")
      .replace(/Sealing/gi, "Selamento")
      .replace(/Summoning/gi, "Invocação");
  };

  const fetchNarutoCharacters = async (query = "") => {
    setLoading(true);
    setError(null);

    try {
      const url = `https://dattebayo-api.onrender.com/characters${
        query ? `?name=${encodeURIComponent(query)}` : "?limit=20"
      }`;

      const response = await axios.get(url);
      const dataList = response.data.characters || [];

      if (dataList.length === 0) throw new Error("Nenhum ninja encontrado.");

      setCharacters(dataList);
    } catch (err) {
      setCharacters([]);
      setError(
        'Nenhum ninja foi encontrado! Tente pesquisar por "Naruto", "Sasuke", "Kakashi", "Itachi" ou "Gaara".',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNarutoCharacters();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchNarutoCharacters(searchTerm.trim());
  };

  return (
    <>
      <div className="bg-konoha"></div>

      <div className="container">
        <header>
          <h1>API Hunters 🍥 Naruto Edition</h1>
          <p>Explorador Ninja de Personagens e Clãs (React + Axios)</p>

          <form onSubmit={handleSearchSubmit} className="controls-container">
            <input
              type="text"
              className="search-input"
              placeholder="Pesquise um ninja (ex: Naruto, Sasuke, Kakashi)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="btn-search">
              <Search size={18} /> Pesquisar Ninja
            </button>
          </form>
        </header>

        <main>
          {loading && (
            <div className="status-container">
              <Loader2 size={48} className="loading-spinner" />
              <p style={{ marginTop: "1rem", color: "#e2e8f0" }}>
                Buscando dados dos ninjas na API... 🍃
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="status-container">
              <div className="error-card">
                <AlertTriangle
                  size={32}
                  style={{ margin: "0 auto 10px auto" }}
                />
                <h3>Jutsu de Busca Falhou!</h3>
                <p style={{ marginTop: "8px" }}>{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="cards-grid">
              {characters.map((char) => (
                <div key={char.id} className="card">
                  <img
                    src={getCharacterImage(char)}
                    alt={char.name}
                    className="card-img"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/300x300/1e293b/f97316?text=Ninja";
                    }}
                  />
                  <div className="card-body">
                    <h3 className="card-title">{char.name}</h3>

                    <span className="badge">Clã: {getClan(char)}</span>

                    <div className="card-info">
                      <p>
                        <strong>Sexo:</strong> {getSex(char)}
                      </p>
                      <p>
                        <strong>Classificação / Patente:</strong>{" "}
                        {getClassification(char)}
                      </p>
                      <p>
                        <strong>Principal Jutsu:</strong> {getJutsu(char)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
