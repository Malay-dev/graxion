import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';

const questionsCollectionRef = collection(db, 'questions');

export interface Question {
  id?: string;
  text: string;
  type: 'multiple-choice' | 'short-answer' | 'long-answer';
  options?: string[]; // for multiple-choice
  answer?: string; // for short-answer or long-answer
}

/**
 * Adds a new question to the 'questions' collection.
 * @param question The question object to add.
 * @returns The ID of the added document.
 */
export const addQuestion = async (question: Omit<Question, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(questionsCollectionRef, question);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

/**
 * Gets all questions from the 'questions' collection.
 * @returns A promise that resolves to an array of Question objects.
 */
export const getQuestions = async (): Promise<Question[]> => {
  try {
    const querySnapshot = await getDocs(questionsCollectionRef);
    const questions: Question[] = [];
    querySnapshot.forEach((doc) => {
      questions.push({ id: doc.id, ...doc.data() } as Question);
    });
    return questions;
  } catch (e) {
    console.error("Error getting documents: ", e);
    throw e;
  }
};

/**
 * Gets a single question by its ID.
 * @param id The ID of the question.
 * @returns A promise that resolves to the Question object or undefined if not found.
 */
export const getQuestionById = async (id: string): Promise<Question | undefined> => {
  try {
    const docRef = doc(db, 'questions', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Question;
    } else {
      return undefined;
    }
  } catch (e) {
    console.error("Error getting document by ID: ", e);
    throw e;
  }
};

/**
 * Updates an existing question in the 'questions' collection.
 * @param id The ID of the question to update.
 * @param updatedQuestion The updated question object (excluding the ID).
 * @returns A promise that resolves when the document is updated.
 */
export const updateQuestion = async (id: string, updatedQuestion: Omit<Question, 'id'>): Promise<void> => {
  try {
    const questionDoc = doc(db, 'questions', id);
    await updateDoc(questionDoc, updatedQuestion as any); // Firestore updateDoc takes any type for data
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};

/**
 * Deletes a question from the 'questions' collection.
 * @param id The ID of the question to delete.
 * @returns A promise that resolves when the document is deleted.
 */
export const deleteQuestion = async (id: string): Promise<void> => {
  try {
    const questionDoc = doc(db, 'questions', id);
    await deleteDoc(questionDoc);
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};