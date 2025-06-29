import React from 'react';
import CharacterSheet from './CharacterSheet';

const VisualizadorDeFichas = ({ fichas, setFichasMestre, salvarFicha, user }) => {
  const uidList = Object.keys(fichas);

  return (
    <div className="flex flex-wrap gap-6">
      {uidList.map((uid, index) => {
        const ficha = fichas[uid];

        return (
          <div
            key={uid}
            className="border rounded p-4 shadow bg-white flex flex-col items-center"
            style={{ width: '360px' }}
          >
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

            <div className="text-xl font-bold mb-2 text-center w-full">
              {ficha.nome || "Sem Nome"}
            </div>

            <CharacterSheet
              personagem={ficha}
              setPersonagem={(novaFicha) =>
                setFichasMestre(prev => ({
                  ...prev,
                  [uid]: { ...novaFicha }
                }))
              }
              offsetX={0}
              offsetY={0}
            />

            <button
              onClick={() =>
                salvarFicha(uid, ficha, user.uid)
                  .then(() => alert("Ficha salva!"))
                  .catch(err => alert(err.message))
              }
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded w-full"
            >
              Salvar Ficha
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default VisualizadorDeFichas;
