"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  PlusCircle,
  Atom,
  Flask,
  MathOperations,
  Microscope,
  Robot,
} from "@phosphor-icons/react/dist/ssr";
import AssessmentFormPopup from "./AssessmentForm";
import { useRouter } from "next/navigation";

const CreateAssessmentCard = ({ subject }: { subject: string }) => {
  const router = useRouter();

  const handleOnClick = (subject: string) => {
    console.log(subject);
  };

  const renderIcon = () => {
    switch (subject) {
      case "Physics":
        return <Atom size={16} />;
      case "Chemistry":
        return <Flask size={16} />;
      case "Maths":
        return <MathOperations size={16} />;
      case "Biology":
        return <Microscope size={16} />;
      default:
        return null;
    }
  };

  return (
    <AssessmentFormPopup>
      <Card className="hover:border-white cursor-pointer min-h-[500px]">
        <CardHeader className="flex justify-end space-y-0 py-4">
          <CardTitle>{renderIcon()}</CardTitle>
        </CardHeader>

        <CardContent className="flex h-full items-center">
          <div className="w-full flex items-center justify-center">
            <PlusCircle size={72} />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 border-t">
          <Button
            className="w-full cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleOnClick(subject);
            }}>
            New Assessment
          </Button>

          <Button
            variant="outline"
            className="w-full cursor-pointer flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              router.push("/ai-assessment");
            }}>
            <Robot size={16} />
            Generate with AI
          </Button>
        </CardFooter>
      </Card>
    </AssessmentFormPopup>
  );
};

export default CreateAssessmentCard;
