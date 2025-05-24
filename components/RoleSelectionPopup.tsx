"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";

declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
  }
}

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function RoleSelectionPopup() {
  const { status } = useSession();
  const [open, setOpen] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Open the popup if the user is not logged in
  useEffect(() => {
    if (status === "authenticated") {
      setOpen(false); // Close the popup if the user is logged in
    } else if (status === "unauthenticated") {
      setOpen(true); // Open the popup if the user is not logged in
    }
  }, [status]);

  const handleRoleSelect = (value: string) => {
    setSelectedRole(value);
  };

  const handleConfirm = async () => {
    if (!selectedRole) return;

    setIsUpdating(true);

    try {
      // Define credentials based on the selected role
      const credentials =
        selectedRole === "teacher"
          ? { email: "teacher@example.com", password: "teacher123" }
          : { email: "student@example.com", password: "student123" };

      // Sign in with the selected role's credentials
      const result = await signIn("credentials", {
        ...credentials,
        redirect: false,
      });

      if (result?.error) {
        console.error("Sign-in failed:", result.error);
        toast.error("Sign-in failed", {
          description: "Invalid credentials. Please try again.",
        });
      } else {
        console.log("Sign-in successful");
        toast.success("Sign-in successful", {
          description: `Welcome, ${
            selectedRole === "teacher" ? "Teacher" : "Student"
          }!`,
        });
        sessionStorage.setItem("selectedRole", selectedRole); // Store the role in session storage
        setOpen(false); // Close the popup on successful sign-in
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      toast.error("Error", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        // Only allow closing if a role is selected or the user is logged in
        if (!newOpen && status !== "authenticated") {
          return;
        }
        setOpen(newOpen);
      }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Your Role</DialogTitle>
          <DialogDescription>
            Please select your role to continue to the dashboard. This is an
            experimental feature.
          </DialogDescription>
        </DialogHeader>

        <Alert variant="default" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Experimental Feature</AlertTitle>
          <AlertDescription>
            This authentication process is in an experimental phase and will be
            fully implemented in production.
          </AlertDescription>
        </Alert>

        <div className="grid gap-4 py-4">
          <Select
            onValueChange={handleRoleSelect}
            defaultValue={selectedRole || undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="student">Student</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            onClick={handleConfirm}
            disabled={!selectedRole || isUpdating}>
            {isUpdating ? "Updating..." : "Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
