import { db } from "../firebase";
import { collection, doc, setDoc, getDocs, getDoc } from "firebase/firestore";

import { Assessment } from "@/types";

const assessmentsCollectionRef = collection(db, "assessments");

export const addAssessment = async (
  assessment: Omit<Assessment, "id">
): Promise<string> => {
  try {
    const newDocRef = doc(assessmentsCollectionRef);
    const newAssessment = {
      ...assessment,
      id: newDocRef.id,
    };
    await setDoc(newDocRef, newAssessment);
    return newDocRef.id;
  } catch (error) {
    console.error("Error adding assessment:", error);
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
    console.error("Error getting assessments:", error);
    throw error;
  }
};

export const getAssessmentById = async (
  id: string
): Promise<Assessment | undefined> => {
  try {
    const docRef = doc(db, "assessments", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Assessment;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching assessment by ID:", error);
    throw error;
  }
};

export const updateAssessment = async (
  id: string,
  data: Partial<Omit<Assessment, "id">>
): Promise<void> => {
  try {
    if (!id || typeof id !== "string") {
      throw new Error("Invalid assessment id provided to updateAssessment");
    }
    const docRef = doc(db, "assessments", id);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error("Error updating assessment:", error);
    throw error;
  }
};
