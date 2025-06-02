import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Question, EvaluationResult } from "@/types";
/**
 * Updates answers for each question in the assessment document.
 * @param assessmentId The Firestore doc id for the assessment
 * @param answers Record of questionId -> { text, image }
 */
export async function submitAssessmentAnswers(
  assessmentId: string,
  answers: Record<string, { text?: string; image?: string }>
) {
  console.log(assessmentId, answers);
  const assessmentRef = doc(db, "assessments", assessmentId);
  const assessmentSnap = await getDoc(assessmentRef);

  if (!assessmentSnap.exists()) throw new Error("Assessment not found");

  const data = assessmentSnap.data();
  if (!data.questions) throw new Error("No questions found in assessment");

  // Update each question's answer field if answer is provided
  const updatedQuestions = data.questions.map((q: Question) => {
    const answerObj = answers[q.id] || {};
    const updated: Question = {
      ...q,
      answer: answerObj.text ?? q.answer ?? "",
    };
    if (answerObj.image !== undefined) {
      updated.image_url = answerObj.image;
    } else if (q.image_url !== undefined) {
      updated.image_url = q.image_url;
    }
    // Do not set image_url at all if both are undefined
    return updated;
  });

  await updateDoc(assessmentRef, {
    questions: updatedQuestions,
    submitted: true,
  });

  return true;
}

export async function updateEvaluationResults(
  assessmentId: string,
  results: EvaluationResult[]
) {
  const assessmentRef = doc(db, "assessments", assessmentId);
  const assessmentSnap = await getDoc(assessmentRef);

  if (!assessmentSnap.exists()) throw new Error("Assessment not found");

  const data = assessmentSnap.data();
  if (!data.questions) throw new Error("No questions found in assessment");
  console.log(results);
  // Update evaluation results
  await updateDoc(assessmentRef, {
    evaluation_results: results,
    evaluated: true,
  });

  // Fetch and return the updated assessment data
  const updatedSnap = await getDoc(assessmentRef);
  return updatedSnap.data();
}
