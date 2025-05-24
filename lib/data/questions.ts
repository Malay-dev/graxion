import { db } from './firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { Question } from './types';

const questionsRef = collection(db, 'questions');

export const createQuestion = async (question: Omit<Question, 'id'>): Promise<string> => {
  const newDocRef = doc(questionsRef); // Auto-generates ID
  await setDoc(newDocRef, question);
  return newDocRef.id;
};

export const getQuestionById = async (id: string): Promise<Question | null> => {
  const docSnap = await getDoc(doc(db, 'questions', id));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Question;
};

export const updateQuestion = async (id: string, question: Omit<Question, 'id'>): Promise<void> => {
  await updateDoc(doc(db, 'questions', id), question);
};

export const deleteQuestion = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'questions', id));
};

export const getQuestionsByAssessmentId = async (assessmentId: string): Promise<Question[]> => {
  const q = query(questionsRef, where('assessmentId', '==', assessmentId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
};

export const getAllQuestions = async (): Promise<Question[]> => {
  const snapshot = await getDocs(questionsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
};
