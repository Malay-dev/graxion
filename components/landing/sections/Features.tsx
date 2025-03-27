import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Brain,
  CheckCircle,
  Video,
  BarChart,
  Timer,
  MessageSquare,
} from "lucide-react";
import { JSX } from "react";

interface FeaturesProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: <Brain className="w-8 h-8 text-primary" />,
    title: "AI-Powered Grading",
    description:
      "Automated evaluation for subjective and objective questions with high accuracy.",
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-primary" />,
    title: "Instant Feedback",
    description:
      "Get AI-generated explanations and video tutorials instantly after submission.",
  },
  {
    icon: <Video className="w-8 h-8 text-primary" />,
    title: "Step-by-Step Solutions",
    description:
      "Review mistakes with AI-powered video solutions for enhanced learning.",
  },
  {
    icon: <BarChart className="w-8 h-8 text-primary" />,
    title: "Performance Analytics",
    description:
      "Track progress with detailed reports on strengths and improvement areas.",
  },
  {
    icon: <Timer className="w-8 h-8 text-primary" />,
    title: "Time-Efficient Evaluation",
    description:
      "Reduce grading time by 80% and focus on personalized teaching strategies.",
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-primary" />,
    title: "Multi-Subject Support",
    description:
      "Covers Physics, Mathematics, Chemistry, and Biology for all academic levels.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Features
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Why Choose Graxion?
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        Graxion leverages AI to simplify grading, provide real-time feedback,
        and empower students with step-by-step explanations for better learning.
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featureList.map(({ icon, title, description }) => (
          <div key={title}>
            <Card className="h-full bg-background border-0 shadow-none">
              <CardHeader className="flex flex-col justify-center items-center text-center">
                <div className="bg-primary/20 p-2 rounded-full ring-8 ring-primary/10 mb-4">
                  {icon}
                </div>
                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground text-center">
                {description}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};
