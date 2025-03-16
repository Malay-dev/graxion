import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CreateAssesmentCard from '@/components/CreateAssessmentCard';
import AssessmentCard from '@/components/AssessmentCard';

const subjects = ['Physics', 'Chemistry', 'Maths', 'Biology'];

const Dashboard = () => {
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
              <AssessmentCard id="ASM-2023-001"
                title="Advanced Mathematics Final"
                description="Comprehensive assessment covering calculus, linear algebra, and differential equations from the entire semester."
                start_date="2023-11-15"
                end_date="2023-12-01"
                max_score={100}
                no_st_attempted={120}
                no_st_passed={98}
                passing_score={65}
                subject={subject}></AssessmentCard>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Dashboard;
