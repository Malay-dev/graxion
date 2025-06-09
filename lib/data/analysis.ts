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
  if (!assessmentId) throw new Error("Assessment ID is required");
  try {
    const docRef = doc(db, "swotanalysis", assessmentId);
    console.log(swot);
    await setDoc(docRef, {
      ...swot,
      assessmentId, // Optional, helps for reference
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error saving SWOT analysis:", err);
    throw err;
  }
}


export async function getSwotAnalysis(assessmentId: string) {
  if (!assessmentId) throw new Error("Assessment ID is required");
  try {
    const docRef = doc(db, "swotanalysis", assessmentId);
    const swotDoc = await getDoc(docRef);
    if (swotDoc.exists()) {
      return { id: swotDoc.id, ...swotDoc.data() };
    }
    return null;
  } catch (err) {
    console.error("Error fetching SWOT analysis:", err);
    throw err;
  }
}

