import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CreateAssesmentCard from '@/components/CreateAssesmentCard';

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
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Dashboard;
