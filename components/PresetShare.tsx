import { Copy } from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Share2 } from "lucide-react";

export function PresetShare({ id }: { id: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="w-full" variant="outline">
          <Share2 className="mr-2 h-4 w-4" />
          Share Assessment
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[520px]">
        <div className="flex flex-col space-y-2 text-center sm:text-left">
          <h3 className="text-lg font-semibold">Share Assessment</h3>
          <p className="text-sm text-muted-foreground">
            Anyone who has this link can view this assessment
          </p>
        </div>
        <div className="flex items-center space-x-2 pt-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue={`http://localhost:3000/assessment/${id}`}
              readOnly
              className="h-9"
            />
          </div>
          <Button type="submit" size="sm" className="px-3">
            <span className="sr-only">Copy</span>
            <Copy />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
