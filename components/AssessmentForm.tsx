"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AssessmentDetailsForm } from "./AssessmentDetailsForm"
import { QuestionsForm } from "./QuestionsForm"
import { AssessmentPreview } from "./AssessmentPreview"
import { ChevronLeft, ChevronRight, Save } from "lucide-react"

// Define the assessment data structure
export type AssessmentData = {
  title: string
  description: string
  startDate: string
  endDate: string
  maxScore: number
  studentsAttempted: number
  studentsPassed: number
  passingScore: number
  subject: string
  class: string
  questions: Question[]
}

export type Question = {
  id: string
  type: "Short Answer" | "Long Answer" | "MCQ"
  text: string
  answerType: "Text" | "Image"
  choices?: string[]
  imageUrl?: string
}

export default function AssessmentFormPopup({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  const [open, setOpen] = useState(false)
  const [currentStage, setCurrentStage] = useState(1)
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    maxScore: 100,
    studentsAttempted: 0,
    studentsPassed: 0,
    passingScore: 60,
    subject: "",
    class: "",
    questions: [],
  })

  const handleStage1Submit = (data: Partial<AssessmentData>) => {
    const updatedData = { ...assessmentData, ...data }
    setAssessmentData(updatedData)
    console.log("Stage 1 Data:", updatedData)
    setCurrentStage(2)
  }

  const handleStage2Submit = (questions: Question[]) => {
    const updatedData = { ...assessmentData, questions }
    setAssessmentData(updatedData)
    console.log("Stage 2 Data:", updatedData)
    setCurrentStage(3)
  }

  const handleFinalSubmit = () => {
    console.log("Final Assessment Data:", assessmentData)
    setOpen(false)
    setCurrentStage(1)
    // Reset form data if needed
    setAssessmentData({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      maxScore: 100,
      studentsAttempted: 0,
      studentsPassed: 0,
      passingScore: 60,
      subject: "",
      class: "",
      questions: [],
    })
  }

  const goBack = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1)
    }
  }

  const saveProgress = () => {
    console.log("Saving progress...", assessmentData)
    // In a real application, this would save to localStorage, a database, etc.
    alert("Progress saved successfully!")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="!max-w-[95vw] h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {currentStage === 1 && "Create Assessment - Details"}
            {currentStage === 2 && "Create Assessment - Add Questions"}
            {currentStage === 3 && "Create Assessment - Preview & Submit"}
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-center justify-between mt-2 mb-6">
              <div className="flex items-center space-x-2">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStage >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  1
                </div>
                <div className={`h-1 w-12 ${currentStage >= 2 ? "bg-primary" : "bg-muted"}`}></div>
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStage >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  2
                </div>
                <div className={`h-1 w-12 ${currentStage >= 3 ? "bg-primary" : "bg-muted"}`}></div>
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStage >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  3
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {currentStage === 1 && "Step 1: Enter assessment details"}
                {currentStage === 2 && "Step 2: Add questions to your assessment"}
                {currentStage === 3 && "Step 3: Review and submit your assessment"}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1 py-2">
          {currentStage === 1 && <AssessmentDetailsForm initialData={assessmentData} onSubmit={handleStage1Submit} />}
          {currentStage === 2 && (
            <QuestionsForm
              initialQuestions={assessmentData.questions}
              onSubmit={handleStage2Submit}
              onSaveProgress={saveProgress}
            />
          )}
          {currentStage === 3 && (
            <AssessmentPreview
              assessmentData={assessmentData}
              onSubmit={handleFinalSubmit}
              onClose={() => setOpen(false)}
              onBack={goBack}
              onSaveProgress={saveProgress}
            />
          )}
        </div>

        {currentStage !== 3 && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={goBack}
              disabled={currentStage === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>

            {currentStage === 2 && (
              <Button variant="outline" onClick={saveProgress} className="flex items-center gap-2">
                <Save className="h-4 w-4" /> Save Progress
              </Button>
            )}

            <Button
              type="submit"
              form={currentStage === 1 ? "assessment-details-form" : "questions-form"}
              className="flex items-center gap-2"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}