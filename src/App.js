function App() {
HEAD
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

HEAD
return (
  <div>
    Teste com AppTeste
  </div>
);
}

export default App;
