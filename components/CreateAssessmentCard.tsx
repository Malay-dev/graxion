"use client";
import { Card, CardContent } from "./ui/card";
import { Plus, Sparkles } from "lucide-react";
import {
  Atom,
  Flask,
  MathOperations,
  Microscope,
} from "@phosphor-icons/react/dist/ssr";
import AssessmentFormPopup from "./AssessmentForm";
import { AIAssessmentGeneratorDialog } from "./AIAssessmentGeneratorForm";

const CreateAssessmentCard = ({ subject }: { subject: string }) => {
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
    <div className="grid grid-rows-2 gap-3 max-h-[500px] h-[500px]">
      {/* Manual Assessment Creation Card */}
      <AssessmentFormPopup>
        <Card className="group relative overflow-hidden bg-gray-900/50 border-gray-800 hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 cursor-pointer h-full">
          <CardContent className="flex flex-col items-center justify-center text-center p-6 h-full relative z-10">
            <div className="mb-3 p-3 rounded-full bg-gray-800/50 group-hover:bg-gray-700/50 transition-colors duration-300 border border-gray-700/50">
              <Plus
                size={24}
                className="text-gray-400 group-hover:text-white transition-colors duration-300"
              />
            </div>
            <h3 className="font-semibold text-base mb-2 text-white">
              Create New Assessment
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              Build a custom assessment from scratch
            </p>
            {subject && (
              <div className="flex items-center gap-2 px-2 py-1 bg-gray-800/60 rounded-full border border-gray-700/50">
                {renderIcon()}
                <span className="text-xs font-medium text-gray-300">
                  {subject}
                </span>
              </div>
            )}
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 to-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>
      </AssessmentFormPopup>

      {/* AI Assessment Generation Card */}
      <AIAssessmentGeneratorDialog>
        <Card className="group relative overflow-hidden bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-800/50 hover:border-purple-600/70 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/20 cursor-pointer h-full">
          <CardContent className="flex flex-col items-center justify-center text-center p-6 h-full relative z-10">
            <div className="mb-3 p-3 rounded-full bg-purple-800/30 group-hover:bg-purple-700/40 transition-colors duration-300 border border-purple-700/50 relative">
              <Sparkles size={24} className="text-purple-400" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            </div>
            <h3 className="font-semibold text-base mb-2 text-white">
              AI Generator
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-2">
              Let AI create personalized assessments
            </p>
            {subject && (
              <div className="flex items-center gap-2 px-2 py-1 bg-purple-800/30 rounded-full border border-purple-700/50 mb-2">
                {renderIcon()}
                <span className="text-xs font-medium text-purple-300">
                  {subject}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-purple-400 font-medium">
              <Sparkles size={10} />
              <span>AI Powered</span>
            </div>
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-800/20 to-blue-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>
      </AIAssessmentGeneratorDialog>
    </div>
  );
};

export default CreateAssessmentCard;
