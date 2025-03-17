import { CalendarIcon, CheckCircle2Icon, XCircleIcon } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PlusCircle, Atom, Flask, MathOperations, Microscope } from "@phosphor-icons/react/dist/ssr";

interface AssessmentCardProps {
    id: string
    title: string
    description: string
    start_date: string
    end_date: string
    max_score: number
    no_st_attempted: number
    no_st_passed: number
    passing_score: number
    subject: string
}

export default function AssessmentCard({
    id = "ASM-1234",
    title = "Final Examination",
    description = "Comprehensive assessment covering all course materials from weeks 1-12",
    start_date = "2023-09-01",
    end_date = "2023-09-15",
    max_score = 100,
    no_st_attempted = 45,
    no_st_passed = 38,
    passing_score = 70,
    subject = "Maths"
}: AssessmentCardProps) {
    // Format dates for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    // Calculate pass percentage
    const passPercentage = Math.round((no_st_passed / no_st_attempted) * 100) || 0

    const renderIcon = () => {
        switch (subject) {
            case 'Physics':
                return <Atom size={16} />;
            case 'Chemistry':
                return <Flask size={16} />;
            case 'Maths':
                return <MathOperations size={16} />;
            case 'Biology':
                return <Microscope size={16} />;
            default:
                return null;
        }
    };

    return (
        <Card className="overflow-hidden border shadow-lg cursor-pointer hover:border-white">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-4 space-y-0">
                <div className="flex gap-2 justify-between items-start">
                    <div>
                        <CardTitle className="text-xl font-bold">{title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">ID: {id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={new Date(end_date) > new Date() ? "default" : "secondary"}>
                            {new Date(end_date) > new Date() ? "Active" : "Completed"}
                        </Badge>
                        {renderIcon()}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-2">
                <p className="text-sm text-muted-foreground mb-6">{description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">DURATION</p>
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                                {formatDate(start_date)} - {formatDate(end_date)}
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">PASSING CRITERIA</p>
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
                        <p className="text-xs font-medium text-muted-foreground">STUDENT STATISTICS</p>
                        <span className="text-sm font-medium">{passPercentage}% Pass Rate</span>
                    </div>
                    <Progress value={passPercentage} className="h-2" />
                    <div className="grid grid-cols-2 gap-2 pt-2">
                        <div className="flex items-center gap-2">
                            <CheckCircle2Icon className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{no_st_passed} Passed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <XCircleIcon className="h-4 w-4 text-red-500" />
                            <span className="text-sm">{no_st_attempted - no_st_passed} Failed</span>
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
            </CardFooter>
        </Card>
    )
}

