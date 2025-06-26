import React, { useState } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';

const Auth = ({ user, setUser }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [modo, setModo] = useState('login'); // 'login' ou 'registro'

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      setUser(userCredential.user);
    } catch (err) {
      alert('Erro ao entrar: ' + err.message);
    }
  };

  const handleRegistro = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      setUser(userCredential.user);
    } catch (err) {
      alert('Erro ao registrar: ' + err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div className="flex flex-col gap-2 items-center border p-4 max-w-xs mx-auto">
      {user ? (
        <>
          <p>Logado como: {user.email}</p>
          <button onClick={handleLogout} className="text-red-500">Sair</button>
        </>
      ) : (
        <>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-1"
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="border p-1"
          />
          {modo === 'login' ? (
            <>
              <button onClick={handleLogin} className="text-blue-500">Entrar</button>
              <button onClick={() => setModo('registro')} className="text-gray-500">Criar Conta</button>
            </>
          ) : (
            <>
              <button onClick={handleRegistro} className="text-green-500">Registrar</button>
              <button onClick={() => setModo('login')} className="text-gray-500">Voltar ao Login</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Auth;
