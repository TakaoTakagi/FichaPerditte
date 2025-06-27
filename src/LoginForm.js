import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const fazerLogin = async () => {
    setErro("");
    try {
      const credenciais = await signInWithEmailAndPassword(auth, email, senha);
      onLogin(credenciais.user);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        try {
          const novoUsuario = await createUserWithEmailAndPassword(auth, email, senha);
          onLogin(novoUsuario.user);
        } catch (err) {
          setErro("Erro ao cadastrar: " + err.message);
        }
      } else {
        setErro("Erro ao logar: " + error.message);
      }
    }
  };

  return (
    <div className="p-8 max-w-sm mx-auto flex flex-col gap-4">
      <h2 className="text-xl font-bold">Login</h2>
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-2 py-1 rounded"
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        className="border px-2 py-1 rounded"
      />
      <button
        onClick={fazerLogin}
        className="bg-blue-500 text-white px-4 py-1 rounded"
      >
        Entrar / Cadastrar
      </button>
      {erro && <p className="text-red-500">{erro}</p>}
    </div>
  );
}

export default LoginForm;
