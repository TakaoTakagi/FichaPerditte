import { auth, provider } from './firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from "react";
import { salvarFicha, carregarFicha } from './firebaseService';
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

function App() {
  const [user, setUser] = useState(null);
  const [viewingUid, setViewingUid] = useState(null);
  const [characterName, setCharacterName] = useState("Sobrevivente");
  const [personagem, setPersonagem] = useState(personagemPadrao);

  // Estados para login por email e senha
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // modo registro ou login

  useEffect(() => {
    // Escuta mudanças de autenticação
    const unsubscribe = auth.onAuthStateChanged((usr) => {
      setUser(usr);
      if (usr) {
        // Se for mestre, não altera o viewingUid aqui, pois mestre escolhe
        if (usr.uid !== UID_MESTRE) {
          setViewingUid(usr.uid);
        }
      } else {
        setViewingUid(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchFicha() {
      if (user && viewingUid) {
        const fichaSalva = await carregarFicha(viewingUid, user.uid);
        if (fichaSalva) {
          setPersonagem(fichaSalva);
          setCharacterName(fichaSalva.nome || "Sobrevivente");
        } else {
          setPersonagem(personagemPadrao);
          setCharacterName("Sobrevivente");
        }
      }
    }
    fetchFicha();
  }, [user, viewingUid]);

  useEffect(() => {
    if (user && personagem && viewingUid) {
      salvarFicha(viewingUid, personagem);
    }
  }, [personagem, user, viewingUid]);

  // Funções de login:
  const loginGoogle = () => {
    signInWithPopup(auth, provider)
      .catch(err => alert('Erro no login Google: ' + err.message));
  };

  const loginEmailSenha = () => {
    signInWithEmailAndPassword(auth, email, password)
      .catch(err => alert('Erro no login com email/senha: ' + err.message));
  };

  const registrarEmailSenha = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .catch(err => alert('Erro ao registrar: ' + err.message));
  };

  // Se não estiver logado, mostrar tela de login:
  if (!user) {
    return (
      <div className="p-8 max-w-md mx-auto">
        <h1 className="mb-4 text-xl font-bold">Login</h1>

        <button onClick={loginGoogle} className="bg-blue-600 text-white px-4 py-2 rounded mb-4 w-full">
          Entrar com Google
        </button>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border px-3 py-2 mb-2 rounded w-full"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />
        </div>

        {isRegistering ? (
          <>
            <button onClick={registrarEmailSenha} className="bg-green-600 text-white px-4 py-2 rounded w-full mb-2">
              Registrar
            </button>
            <p>
              Já tem conta?{' '}
              <button
                onClick={() => setIsRegistering(false)}
                className="underline text-blue-600"
              >
                Faça login
              </button>
            </p>
          </>
        ) : (
          <>
            <button onClick={loginEmailSenha} className="bg-gray-700 text-white px-4 py-2 rounded w-full mb-2">
              Entrar com Email/Senha
            </button>
            <p>
              Não tem conta?{' '}
              <button
                onClick={() => setIsRegistering(true)}
                className="underline text-blue-600"
              >
                Registre-se
              </button>
            </p>
          </>
        )}
      </div>
    );
  }

  const isMestre = user.uid === UID_MESTRE;

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-row items-center gap-4">
        <p>Logado como: {user.email} ({user.uid})</p>
        <button
          onClick={() => auth.signOut()}
          className="bg-red-500 text-white px-4 py-1 rounded"
        >
          Sair
        </button>
      </div>

      {isMestre && (
        <div>
          <label>
            Visualizar ficha do UID:
            <input
              type="text"
              value={viewingUid || ''}
              onChange={(e) => setViewingUid(e.target.value)}
              placeholder="Digite o UID do jogador"
              className="border px-2 py-1 rounded ml-2"
            />
          </label>
        </div>
      )}

      {/* Se não for mestre e viewingUid estiver vazio (pode acontecer no primeiro render), seta para user.uid */}
      {!isMestre && !viewingUid && (
        <div>
          {/* Usamos useEffect para evitar setState dentro do render */}
          <SetViewingUidToUser setViewingUid={setViewingUid} userUid={user.uid} />
        </div>
      )}

      <label>
        Nome do personagem:
        <input
          type="text"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          className="border px-2 py-1 rounded ml-2"
        />
      </label>

      {/* Proteção para garantir personagem e partes existem */}
      {personagem && personagem.partes ? (
        <CharacterSheet personagem={personagem} />
      ) : (
        <p>Ficha não carregada.</p>
      )}
    </div>
  );
}

// Componente auxiliar para setar viewingUid fora do render principal
function SetViewingUidToUser({ setViewingUid, userUid }) {
  useEffect(() => {
    setViewingUid(userUid);
  }, [setViewingUid, userUid]);
  return null;
}

export default App;
