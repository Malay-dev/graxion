import type { NextApiRequest, NextApiResponse } from 'next';
import { submitAssessment } from '@/lib/data/submission';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { assessmentId, studentId, fileUrl, questionAnswers } = req.body;

  if (!assessmentId || !studentId || !fileUrl || !questionAnswers) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    await submitAssessment(assessmentId, studentId, fileUrl, questionAnswers);
    return res.status(200).json({ message: 'Submission successful' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
}
