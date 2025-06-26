import { salvarFicha, carregarFicha } from './firebaseService';
import { useState, useEffect } from "react";
import { auth } from './firebase';
import CharacterSheet from "./components/CharacterSheet";

function App() {
  const [user, setUser] = useState(null);
  const [characterName, setCharacterName] = useState("Sobrevivente");
  const [personagem, setPersonagem] = useState({
    nome: characterName,
    partes: {
      head: { current: 4, max: 4 },
      torso: { current: 8, max: 8 },
      leftArm: { current: 5, max: 5 },
      rightArm: { current: 5, max: 5 },
      leftLeg: { current: 6, max: 6 },
      rightLeg: { current: 6, max: 6 }
    }
  });

  // Atualiza personagem.nome quando characterName mudar
  useEffect(() => {
    setPersonagem(prev => ({
      ...prev,
      nome: characterName
    }));
  }, [characterName]);

  // Carrega ficha quando usuário mudar
  useEffect(() => {
    const fetchFicha = async () => {
      if (user) {
        const fichaSalva = await carregarFicha(user.uid);
        if (fichaSalva) {
          setPersonagem(fichaSalva);
          setCharacterName(fichaSalva.nome || "Sobrevivente");
        }
      }
    };
    fetchFicha();
  }, [user]);

  // Salva ficha quando personagem ou usuário mudar
  useEffect(() => {
    if (user && personagem) {
      salvarFicha(user.uid, personagem);
    }
  }, [personagem, user]);
// if (!user) return <auth user={user} setUser={setUser} />;  // ❌ REMOVER

return (
  <div className="flex flex-row items-start gap-8 p-8">
    ...
  </div>
);

  return (
    <div className="flex flex-row items-start gap-8 p-8">
      {/* Lateral esquerda - informações do usuário */}
      <div className="flex flex-col gap-4 text-sm">
        <p className="text-gray-600 italic">Logado como: {user.email}</p>

        <label className="flex flex-col gap-1">
          Nome do personagem:
          <input
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </label>

        <button
          onClick={() => setUser(null)}
          className="bg-red-500 text-white px-4 py-1 rounded w-fit"
        >
          Sair
        </button>
      </div>

      {/* Área do personagem */}
      <CharacterSheet personagem={personagem} />
    </div>
  );
}

export default App;
