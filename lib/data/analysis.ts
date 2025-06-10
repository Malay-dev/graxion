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
): Promise<void> {
  if (!assessmentId) throw new Error("Assessment ID is required");

  const docRef = doc(swotCollectionRef, assessmentId);
  try {
    await setDoc(docRef, {
      ...swot,
      assessmentId,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error saving SWOT analysis:", err);
    throw err;
  }
}

export interface SwotAnalysisWithId extends SwotAnalysis {
  id: string;
}

export async function getSwotAnalysis(
  assessmentId: string
): Promise<SwotAnalysisWithId | null> {
  if (!assessmentId) throw new Error("Assessment ID is required");

  const docRef = doc(swotCollectionRef, assessmentId);
  try {
    const swotDoc = await getDoc(docRef);
    if (swotDoc.exists()) {
      return { id: swotDoc.id, ...(swotDoc.data() as SwotAnalysis) };
    }
    return null;
  } catch (err) {
    console.error("Error fetching SWOT analysis:", err);
    throw err;
  }
}
