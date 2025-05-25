import { db } from './firebase';
import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  updateDoc,
  query,
  where
} from 'firebase/firestore';
import { Submission } from './types';

export const getAllSubmissions = async (): Promise<Submission[]> => {
  const querySnapshot = await getDocs(collection(db, 'submissions'));
  return querySnapshot.docs.map((doc) => doc.data() as Submission);
};

export const getSubmissionById = async (id: number): Promise<Submission | null> => {
  const querySnapshot = await getDocs(
    query(collection(db, 'submissions'), where('id', '==', id))
  );
  const docSnap = querySnapshot.docs[0];
  return docSnap ? (docSnap.data() as Submission) : null;
};

export const submitAssessment = async (
  assessmentId: number,
  studentId: number,
  fileUrl: string
) => {
  const allSubs = await getAllSubmissions();
  const newId = allSubs.length + 1;

  const newSubmission: Submission = {
    id: newId,
    assessmentId,
    studentId,
    fileUrl,
    done: false,
  };

  const docRef = doc(collection(db, 'submissions'));
  await setDoc(docRef, newSubmission);
};

export const markAsDone = async (id: number) => {
  const querySnapshot = await getDocs(
    query(collection(db, 'submissions'), where('id', '==', id))
  );
  const docSnap = querySnapshot.docs[0];
  if (!docSnap) throw new Error('Submission not found');

  await updateDoc(docSnap.ref, { done: true });
};
