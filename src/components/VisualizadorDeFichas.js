import CharacterSheet from "./CharacterSheet";

const VisualizadorDeFichas = ({ fichas, setFichasMestre, salvarFicha, user }) => {
  return (
    <div className="flex flex-wrap gap-8 justify-start">
      {Object.entries(fichas).map(([uid, ficha], index) => (
        <div key={uid} className="flex flex-col items-center border rounded p-4 shadow bg-white w-[360px]">
          <p className="text-sm text-gray-500 mb-1">UID: {uid}</p>

          <label className="text-sm font-semibold block w-full">Nome do personagem:</label>
          <input
            type="text"
            value={ficha.nome || "Sobrevivente"}
            onChange={(e) => {
              const novoNome = e.target.value;
              setFichasMestre(prev => ({
                ...prev,
                [uid]: { ...prev[uid], nome: novoNome }
              }));
            }}
            className="border px-2 py-1 rounded w-full mb-4"
          />

          {/* Nome do personagem acima do boneco */}
          <div className="w-full text-center text-lg font-bold mb-2">
            {ficha.nome || "Sobrevivente"}
          </div>

          <CharacterSheet
            personagem={ficha}
            setPersonagem={(novaFicha) =>
              setFichasMestre(prev => ({
                ...prev,
                [uid]: { ...novaFicha }
              }))
            }
          />

          <button
            onClick={() =>
              salvarFicha(uid, ficha, user.uid).then(() => alert("Ficha salva!")).catch(err => alert(err.message))
            }
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            Salvar Ficha
          </button>
        </div>
      ))}
    </div>
  );
};

export default VisualizadorDeFichas;
