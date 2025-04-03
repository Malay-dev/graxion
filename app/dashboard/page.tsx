"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CreateAssesmentCard from "@/components/CreateAssessmentCard";
import AssessmentCard from "@/components/AssessmentCard";
import { RoleSelectionPopup } from "@/components/RoleSelctionPopup";
const subjects = ["Physics", "Chemistry", "Maths", "Biology"];

type Assessment = {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  max_score: number;
  no_st_attempted: number;
  no_st_passed: number;
  passing_score: number;
  subject: string;
};

const Dashboard = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/assessments/get`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      setAssessments(result);
    };
    fetchData();
  }, []);

  return (
    <div>
      <Tabs defaultValue="Physics" className="space-y-4">
        <TabsList>
          {subjects.map((subject) => (
            <TabsTrigger key={subject} value={subject}>
              {subject}
            </TabsTrigger>
          ))}
        </TabsList>

        {subjects.map((subject) => (
          <TabsContent key={subject} value={subject} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <CreateAssesmentCard subject={subject} />
              {assessments
                .filter((assessment) => assessment.subject === subject)
                .map((assessment) => (
                  <AssessmentCard
                    key={assessment.id}
                    id={assessment.id}
                    title={assessment.title}
                    description={assessment.description}
                    start_date={assessment.start_date}
                    end_date={assessment.end_date}
                    max_score={assessment.max_score}
                    no_st_attempted={assessment.no_st_attempted}
                    no_st_passed={assessment.no_st_passed}
                    passing_score={assessment.passing_score}
                    subject={assessment.subject}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <RoleSelectionPopup />
    </div>
  );
};

export default Dashboard;
