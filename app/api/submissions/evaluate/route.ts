import type { NextApiRequest, NextApiResponse } from 'next';
import { evaluateSubmission } from '@/lib/data/submission';
import { EvaluationResult } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { assessmentId, evaluations } = req.body;

  if (!assessmentId || !Array.isArray(evaluations)) {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  try {
    await evaluateSubmission(assessmentId, evaluations as EvaluationResult[]);
    return res.status(200).json({ message: 'Evaluation successful' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
}
