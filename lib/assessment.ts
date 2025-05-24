import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
} from 'firebase/firestore';

export interface Assessment {
  id?: string;
  title: string;
  description: string;
  date?: string;
}

const assessmentsCollectionRef = collection(db, 'assessments');

export const addAssessment = async (assessment: Omit<Assessment, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(assessmentsCollectionRef, assessment);
    return docRef.id;
  } catch (error) {
    console.error('Error adding assessment:', error);
    throw error;
  }
};

export const getAssessments = async (): Promise<Assessment[]> => {
  try {
    const snapshot = await getDocs(assessmentsCollectionRef);
    const assessments: Assessment[] = [];
    snapshot.forEach((doc) => {
      assessments.push({ id: doc.id, ...doc.data() } as Assessment);
    });
    return assessments;
  } catch (error) {
    console.error('Error getting assessments:', error);
    throw error;
  }
};

export const getAssessmentById = async (id: string): Promise<Assessment | undefined> => {
  try {
    const docRef = doc(db, 'assessments', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Assessment;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error('Error fetching assessment by ID:', error);
    throw error;
  }
};
