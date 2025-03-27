import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, BarChart, Clock, Lightbulb } from "lucide-react";
import { JSX } from "react";

interface BenefitsProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const benefitList: BenefitsProps[] = [
  {
    icon: <CheckCircle className="w-8 h-8 text-primary" />,
    title: "Accurate AI Grading",
    description:
      "Reduce manual effort with AI-powered assessment, ensuring fair and precise evaluation.",
  },
  {
    icon: <BarChart className="w-8 h-8 text-primary" />,
    title: "Data-Driven Insights",
    description:
      "Gain real-time performance analytics to identify strengths and areas for improvement.",
  },
  {
    icon: <Clock className="w-8 h-8 text-primary" />,
    title: "Faster Evaluations",
    description:
      "Save hours with automated grading and instant feedback, improving efficiency.",
  },
  {
    icon: <Lightbulb className="w-8 h-8 text-primary" />,
    title: "Personalized Learning",
    description:
      "AI-generated explanations and video solutions help students understand concepts better.",
  },
];

export const BenefitsSection = () => {
  return (
    <section id="benefits" className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-2 place-items-center lg:gap-24">
        <div>
          <h2 className="text-lg text-primary mb-2 tracking-wider">Benefits</h2>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How Graxion Transforms Learning
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Graxion streamlines assessments, enhances feedback, and personalizes
            learning, making education more efficient and engaging.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 w-full">
          {benefitList.map(({ icon, title, description }, index) => (
            <Card
              key={title}
              className="bg-muted/50 dark:bg-card hover:bg-background transition-all delay-75 group/number">
              <CardHeader>
                <div className="flex justify-between">
                  <div className="bg-primary/20 p-2 rounded-full ring-8 ring-primary/10">
                    {icon}
                  </div>
                  <span className="text-5xl text-muted-foreground/15 font-medium transition-all delay-75 group-hover/number:text-muted-foreground/30">
                    0{index + 1}
                  </span>
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
