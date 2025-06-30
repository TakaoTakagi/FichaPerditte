import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDatabase, ref, get, child } from "firebase/database";

export const carregarTodasFichas = async () => {
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, `fichas`));
  if (snapshot.exists()) {
    return snapshot.val(); // Isso retorna um objeto onde cada chave é um UID
  } else {
    return {};
  }
};

const UID_MESTRE = "qE5LJAbFhMabgBuoYNx9w9pSwv52";

// Agora salvarFicha recebe uidAtual para checar permissão
export async function salvarFicha(uidParaSalvar, ficha, uidAtual) {
  if (uidAtual !== uidParaSalvar && uidAtual !== UID_MESTRE) {
    console.error("Permissão negada para salvar ficha.");
    return; // Sai sem salvar
  }

  const docRef = doc(db, 'fichas', uidParaSalvar);
  try {
    await setDoc(docRef, ficha);
  } catch (error) {
    console.error("Erro ao salvar ficha:", error);
  }
}

export async function carregarFicha(uidSolicitado, uidAtual) {
  // Permitir que o mestre veja qualquer ficha
  if (uidAtual !== uidSolicitado && uidAtual !== UID_MESTRE) {
    console.error("Permissão negada para acessar a ficha.");
    return null;
  }

  const docRef = doc(db, 'fichas', uidSolicitado);
  try {
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Erro ao carregar ficha:", error);
    return null;
  }
}
