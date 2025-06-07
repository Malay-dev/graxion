import { CalendarIcon, CheckCircle2Icon, XCircleIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Atom,
  Flask,
  MathOperations,
  Microscope,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Assessment } from "@/types";

export default function AssessmentCard({
  id,
  title,
  description,
  start_date,
  end_date,
  max_score,
  no_st_attempted,
  no_st_passed,
  passing_score,
  subject,
}: Assessment) {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/assessments/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Network response was not ok");

      setOpenDialog(false);
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const passPercentage =
    Math.round((no_st_passed / no_st_attempted) * 100) || 0;

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
    <Link href={`/assessment/${id}`}>
      <Card className="overflow-hidden border shadow-lg cursor-pointer hover:border-white min-h-[500px]">
        <CardHeader className="...">
          <div className="flex gap-2 justify-between items-start">
            <div className="min-h-20">
              <CardTitle className="...">{title}</CardTitle>
              <p className="...">ID: {id}</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge
                variant={
                  new Date(end_date) > new Date() ? "default" : "secondary"
                }>
                {new Date(end_date) > new Date() ? "Active" : "Completed"}
              </Badge>
              {renderIcon()}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-sm text-muted-foreground min-h-10 mb-6 line-clamp-3">
            {description}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                DURATION
              </p>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {formatDate(start_date)} - {formatDate(end_date)}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                PASSING CRITERIA
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {passing_score}/{max_score}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({Math.round((passing_score / max_score) * 100)}% to pass)
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-xs font-medium text-muted-foreground">
                STUDENT STATISTICS
              </p>
              <span className="text-sm font-medium">
                {passPercentage}% Pass Rate
              </span>
            </div>
            <Progress value={passPercentage} className="h-2" />
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2Icon className="h-4 w-4 text-green-500" />
                <span className="text-sm">{no_st_passed} Passed</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircleIcon className="h-4 w-4 text-red-500" />
                <span className="text-sm">
                  {no_st_attempted - no_st_passed} Failed
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 dark:bg-slate-900 flex justify-between py-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Total Attempts: </span>
            <span className="font-medium">{no_st_attempted}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Max Score: </span>
            <span className="font-medium">{max_score}</span>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              setOpenDialog(true);
            }}
            className="hover:text-red-600 transition-colors"
            title="Delete Assessment">
            <Trash2Icon className="h-4 w-4 text-muted-foreground" />
          </button>
        </CardFooter>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this assessment? This action cannot
            be undone.
          </p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Link>
  );
}
