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
} from "@phosphor-icons/react/dist/ssr";
import AssessmentFormPopup from "./AssessmentForm";

const CreateAssesmentCard = ({ subject }: { subject: string }) => {
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
      <Card
        className="hover:border-white cursor-pointer"
        onClick={() => {
          handleOnClick(subject);
        }}>
        <CardHeader className="flex justify-end space-y-0 py-4">
          <CardTitle>{renderIcon()}</CardTitle>
        </CardHeader>
        <CardContent className="flex h-full items-center">
          <div className="w-full flex items-center justify-center">
            <PlusCircle size={72} />
          </div>
        </CardContent>
        <CardFooter className="border-t bottom-0">
          <Button
            className="w-full cursor-pointer"
            onClick={() => {
              handleOnClick(subject);
            }}>
            New Assessment
          </Button>
        </CardFooter>
      </Card>
    </AssessmentFormPopup>
  );
};

export default CreateAssesmentCard;
