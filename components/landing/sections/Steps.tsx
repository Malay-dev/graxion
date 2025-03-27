import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StepsProps {
  stepNumber: number;
  title: string;
  description: string;
}

const stepsList: StepsProps[] = [
  {
    stepNumber: 1,
    title: "Sign Up & Create an Account",
    description: "Register with your email and set up your profile in seconds.",
  },
  {
    stepNumber: 2,
    title: "Schedule an Assessment",
    description:
      "Teachers can create and schedule assessments with customizable options.",
  },
  {
    stepNumber: 3,
    title: "Students Take the Test",
    description:
      "Students log in, attempt the assessment, and submit responses.",
  },
  {
    stepNumber: 4,
    title: "AI-Powered Grading",
    description:
      "Graxion automatically evaluates answers and generates insights.",
  },
  {
    stepNumber: 5,
    title: "Instant Feedback & Reports",
    description:
      "Students receive AI-generated explanations, and teachers get performance reports.",
  },
];

export const StepSection = () => {
  return (
    <section id="steps" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        How It Works
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Get Started in Just a Few Steps
      </h2>
      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        Whether you&apos;re a teacher or a student, Graxion makes assessments
        easy and efficient.
      </h3>

      {/* Responsive Grid Layout for 5 Steps */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full lg:w-[80%] mx-auto">
        {stepsList.map(
          ({ stepNumber, title, description }) =>
            stepNumber !== 5 && (
              <Card
                key={title}
                className="bg-muted/60 dark:bg-card h-full relative p-6">
                <CardHeader>
                  <div className="absolute -top-4 -left-4 bg-secondary text-white w-10 h-10 flex items-center justify-center text-lg font-bold rounded-full shadow-md">
                    {stepNumber}
                  </div>
                  <CardTitle className="mt-4">{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
              </Card>
            )
        )}
      </div>
      <div className="mt-6 lg:w-[50%] mx-auto">
        {stepsList.map(
          ({ stepNumber, title, description }) =>
            stepNumber === 5 && (
              <Card
                key={title}
                className="bg-muted/60 dark:bg-card h-full relative p-6">
                <CardHeader>
                  <div className="absolute -top-4 -left-4 bg-secondary text-white w-10 h-10 flex items-center justify-center text-lg font-bold rounded-full shadow-md">
                    {stepNumber}
                  </div>
                  <CardTitle className="mt-4">{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
              </Card>
            )
        )}
      </div>
    </section>
  );
};
