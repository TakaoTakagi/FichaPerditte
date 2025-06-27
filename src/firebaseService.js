import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const UID_MESTRE = "qE5LJAbFhMabgBuoYNx9w9pSwv52";

export async function salvarFicha(uid, ficha) {
  const docRef = doc(db, 'fichas', uid);
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
