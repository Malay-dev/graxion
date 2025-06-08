import { db } from "../firebase";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

// Define the SWOT analysis type
export interface SwotAnalysis {
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
  analysis?: string;
}

const swotCollectionRef = collection(db, "swotanalysis");

export async function saveSwotAnalysis(
  assessmentId: string,
  swot: SwotAnalysis
) {
  if (!assessmentId) {
    console.error("saveSwotAnalysis: assessmentId is undefined");
    throw new Error("Assessment ID is required");
  }
  try {
    // Use assessmentId as the document ID
    const docRef = doc(swotCollectionRef, assessmentId);
    await setDoc(docRef, {
      swot,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error saving SWOT analysis:", err);
    throw err;
  }
}

export async function getSwotAnalysis(assessmentId: string) {
  if (!assessmentId) {
    console.error("getSwotAnalysis: assessmentId is undefined");
    throw new Error("Assessment ID is required");
  }
  try {
    const swotDoc = await getDoc(doc(db, "swot", assessmentId));
    if (swotDoc.exists()) {
      return { id: swotDoc.id, ...swotDoc.data() };
    }
    return null;
  } catch (err) {
    console.error("Error fetching SWOT analysis:", err);
    throw err;
  }
}
