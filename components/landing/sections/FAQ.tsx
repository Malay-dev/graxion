import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "What is Graxion?",
    answer:
      "Graxion is an AI-powered assessment platform that automates grading and provides instant feedback with AI-generated explanations.",
    value: "item-1",
  },
  {
    question: "How does Graxion grade assessments?",
    answer:
      "Graxion uses AI models to evaluate answers. MCQs are graded instantly, while subjective answers are assessed based on similarity to expected responses.",
    value: "item-2",
  },
  {
    question: "Can students see explanations for incorrect answers?",
    answer:
      "Yes! When a student answers incorrectly, they can press the 'Review' button to generate AI-powered step-by-step explanations.",
    value: "item-3",
  },
  {
    question: "What subjects does Graxion support?",
    answer:
      "Currently, Graxion supports Physics, Mathematics, Chemistry, and Biology. More subjects will be added soon!",
    value: "item-4",
  },
  {
    question: "Is Graxion free to use?",
    answer:
      "Graxion offers a free plan with basic features. Advanced analytics and additional tools are available in the premium plan.",
    value: "item-5",
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="container md:w-[700px] py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          FAQS
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold">
          Got Questions? We’ve Got Answers.
        </h2>
      </div>

      <Accordion type="single" collapsible className="AccordionRoot">
        {FAQList.map(({ question, answer, value }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left text-lg font-medium">
              {question}
            </AccordionTrigger>

            <AccordionContent className="text-muted-foreground">
              {answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
