import { auth, provider } from './firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from "react";
import { salvarFicha, carregarFicha, carregarTodasFichas } from './firebaseService';
import CharacterSheet from "./components/CharacterSheet";

const UID_MESTRE = "qE5LJAbFhMabgBuoYNx9w9pSwv52";

const personagemPadrao = {
  nome: "Sobrevivente",
  partes: {
    head: { current: 4, max: 4 },
    torso: { current: 8, max: 8 },
    leftArm: { current: 5, max: 5 },
    rightArm: { current: 5, max: 5 },
    leftLeg: { current: 6, max: 6 },
    rightLeg: { current: 6, max: 6 }
  }
};

const uidPositions = {
  "9alpBBqtSLVIlfgr6IYRmKuC97D3": { offsetX: 0, offsetY: 0 },          // Amon
  "PUoxancHbcTjUOADvbsAn396imt2": { offsetX: 420, offsetY: 0 },        // Silver
  "TxPgxqzRKjbilpDnjQnbGNQ2hpU2": { offsetX: 0, offsetY: 1000 },       // Rosa
  "ohmZCQQ7mMQDuLToK2tU0S2mpp02": { offsetX: 420, offsetY: 1000 },     // Dr. Gene
  // Adicione mais UIDs aqui conforme necessário
};

const getOffsetForUID = (uid) => {
  return uidPositions[uid] || { offsetX: 0, offsetY: 0 }; // Posição padrão
};

function App() {
  const [user, setUser] = useState(null);
  const [viewingUid, setViewingUid] = useState(null);
  const [personagem, setPersonagem] = useState(personagemPadrao);
  const [characterName, setCharacterName] = useState("Sobrevivente");
  const [salvando, setSalvando] = useState(false);

  const [fichasMestre, setFichasMestre] = useState({});

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (usr) => {
      setUser(usr);
      if (usr) {
        setViewingUid(usr.uid);

        if (usr.uid === UID_MESTRE) {
          const todasAsFichas = await carregarTodasFichas();
          setFichasMestre(todasAsFichas);
        }
      } else {
        setViewingUid(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchFicha = async (uidAlvo) => {
    if (user && uidAlvo) {
      const fichaSalva = await carregarFicha(uidAlvo, user.uid);
      if (fichaSalva) {
        if (uidAlvo === user.uid || !isMestre) {
          setPersonagem(fichaSalva);
          setCharacterName(fichaSalva.nome || "Sobrevivente");
        } else {
          setFichasMestre(prev => ({ ...prev, [uidAlvo]: fichaSalva }));
        }
      }
    }
  };

  useEffect(() => {
    if (user && viewingUid && !isMestre) {
      fetchFicha(viewingUid);
    }
  }, [user, viewingUid]);

  const handleSalvar = async () => {
    if (!user || !personagem || !viewingUid) return;
    if (user.uid !== viewingUid && user.uid !== UID_MESTRE) {
      alert("Você não tem permissão para salvar essa ficha.");
      return;
    }

    setSalvando(true);
    try {
      await salvarFicha(viewingUid, personagem, user.uid);
      alert("Ficha salva com sucesso!");
    } catch (e) {
      alert("Erro ao salvar ficha: " + e.message);
    } finally {
      setSalvando(false);
    }
  };

  const loginGoogle = () => signInWithPopup(auth, provider).catch(err => alert(err.message));
  const loginEmailSenha = () => signInWithEmailAndPassword(auth, email, password).catch(err => alert(err.message));
  const registrarEmailSenha = () => createUserWithEmailAndPassword(auth, email, password).catch(err => alert(err.message));

  if (!user) {
    return (
      <div className="p-8 max-w-md mx-auto">
        <h1 className="mb-4 text-xl font-bold">Login</h1>
        <button onClick={loginGoogle} className="bg-blue-600 text-white px-4 py-2 rounded mb-4 w-full">Entrar com Google</button>
        <div className="mb-4">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border px-3 py-2 mb-2 rounded w-full" />
          <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} className="border px-3 py-2 rounded w-full" />
        </div>
        {isRegistering ? (
          <>
            <button onClick={registrarEmailSenha} className="bg-green-600 text-white px-4 py-2 rounded w-full mb-2">Registrar</button>
            <p>Já tem conta? <button onClick={() => setIsRegistering(false)} className="underline text-blue-600">Faça login</button></p>
          </>
        ) : (
          <>
            <button onClick={loginEmailSenha} className="bg-gray-700 text-white px-4 py-2 rounded w-full mb-2">Entrar com Email/Senha</button>
            <p>Não tem conta? <button onClick={() => setIsRegistering(true)} className="underline text-blue-600">Registre-se</button></p>
          </>
        )}
      </div>
    );
  }

  const isMestre = user.uid === UID_MESTRE;

  return (
    <div className="p-8">
      <div className="flex items-center gap-4">
        <p>Logado como: {user.email}</p>
        <button onClick={() => auth.signOut()} className="bg-red-500 text-white px-4 py-1 rounded">Sair</button>
      </div>

      {!isMestre && (
        <>
          <label>
            Nome do personagem:
            <input
              type="text"
              value={characterName}
              onChange={(e) => {
                setCharacterName(e.target.value);
                setPersonagem(prev => ({ ...prev, nome: e.target.value }));
              }}
              className="border px-2 py-1 rounded ml-2"
            />
          </label>
          <button onClick={handleSalvar} disabled={salvando} className={`px-4 py-2 rounded text-white ${salvando ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'}`}>
            {salvando ? "Salvando..." : "Salvar Ficha"}
          </button>
          {personagem && personagem.partes ? (
            <CharacterSheet personagem={personagem} setPersonagem={setPersonagem} />
          ) : (
            <p>Ficha não carregada.</p>
          )}
        </>
      )}

      {isMestre && (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "3200px",
            overflow: "auto"
          }}
        >
          {Object.entries(fichasMestre).map(([uid, ficha]) => {
            const { offsetX, offsetY } = getOffsetForUID(uid);

            return (
              <div
                key={uid}
                className="absolute border rounded p-4 shadow bg-white"
                style={{ top: `${offsetY}px`, left: `${offsetX}px`, width: '360px' }}
              >
                <p className="text-sm text-gray-500 mb-1">UID: {uid}</p>

                <label className="text-sm font-semibold block">Nome do personagem:</label>
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

                <div className="w-full text-center text-xl font-bold mb-6">
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
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;
