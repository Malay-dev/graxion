import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { RotateCcw } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <Tabs defaultValue="complete" className="flex-1 px-6">
      <div className="container h-full py-6">
        <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
          <div className="hidden flex-col space-y-4 sm:flex md:order-2">
            <div className="grid gap-2"></div>
          </div>
          <div className="md:order-1">
            <TabsContent value="complete" className="mt-0 border-0 p-0">
              <div className="flex h-full flex-col space-y-4 relative">
                {/* Fixed height container with overflow handling */}
                <div className="min-h-[400px] max-h-[400px] flex-1 bg-accent p-4 md:min-h-[500px] md:max-h-[500px] lg:min-h-[525px] lg:max-h-[525px] overflow-y-auto">
                  {/* Even if this is h-screen, it will be contained within the parent */}
                  <div className="h-screen">Inner Div with h-screen</div>
                  {/* Or any other large content */}
                </div>
              </div>
              <div className="flex items-center space-x-2 absolute bottom-0 right-0 p-4 mr-56">
                <Button>Submit</Button>
                <Button variant="secondary">
                  <span className="sr-only">Reload</span>
                  <RotateCcw />
                </Button>
              </div>
            </TabsContent>
          </div>
        </div>
      </div>
    </Tabs>
  );
};

export default page;
