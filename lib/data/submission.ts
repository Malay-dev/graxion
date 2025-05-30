import { db } from '../firebase';
import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  updateDoc,
  query,
  where,
  arrayUnion
} from 'firebase/firestore';
import { Submission, Question, EvaluationResult } from '@/types';


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
  assessmentId: string,
  studentId: number,
  fileUrl: string,
  questionAnswers: { questionId: string; answer: string }[]
) => {
  const allSubs = await getAllSubmissions();
  const newId = allSubs.length + 1;

  const newSubmission: Submission = {
    id: newId,
    assessmentId: parseInt(assessmentId),
    studentId,
    fileUrl,
    done: false,
  };

  const submissionDoc = doc(collection(db, 'submissions'));
  await setDoc(submissionDoc, newSubmission);

  const assessmentRef = doc(db, 'assessments', assessmentId);
  const assessmentSnap = await getDoc(assessmentRef);

  if (assessmentSnap.exists()) {
    const assessmentData = assessmentSnap.data();
    const updatedQuestions = assessmentData.questions.map((q: Question) => {
      const matched = questionAnswers.find((qa) => qa.questionId === q.id);
      return matched ? { ...q, expected_answer: matched.answer } : q;
    });

    await updateDoc(assessmentRef, { questions: updatedQuestions });
  }
};

export const markAsDone = async (id: number) => {
  const querySnapshot = await getDocs(
    query(collection(db, 'submissions'), where('id', '==', id))
  );
  const docSnap = querySnapshot.docs[0];
  if (!docSnap) throw new Error('Submission not found');

  await updateDoc(docSnap.ref, { done: true });
};

export const evaluateSubmission = async (
  assessmentId: string,
  evaluations: EvaluationResult[]
) => {
  const assessmentRef = doc(db, 'assessments', assessmentId);
  const assessmentSnap = await getDoc(assessmentRef);

  if (!assessmentSnap.exists()) throw new Error('Assessment not found');

  const existingData = assessmentSnap.data();
  const updatedEvaluations = [...(existingData.evaluation_results || []), ...evaluations];

  await updateDoc(assessmentRef, { evaluation_results: updatedEvaluations });
};
