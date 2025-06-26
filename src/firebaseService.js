import { db } from './firebase';
import { doc, setDoc, getDoc } from "firebase/firestore";

export const salvarFicha = async (uid, ficha) => {
  try {
    await setDoc(doc(db, 'fichas', uid), ficha);
  } catch (error) {
    console.error('Erro ao salvar ficha:', error);
  }
};

export const carregarFicha = async (uid) => {
  try {
    const docSnap = await getDoc(doc(db, 'fichas', uid));
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Erro ao carregar ficha:', error);
    return null;
  }
};
