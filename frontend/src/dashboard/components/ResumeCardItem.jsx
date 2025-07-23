import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, MoreVertical, FileText, Clock, Calendar } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

import GlobalApi from "../../../service/GlobalApi";

function ResumeCardItem({ resume, refreshData, previewImage }) {
  const navigate = useNavigate();
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!resume?._id) {
      toast.error("Invalid resume ID. Please refresh the page.");
      return;
    }

    setLoading(true);

    try {
      const response = await GlobalApi.deleteResumeById(resume._id);

      if (response?.success || response?.status === 200) {
        toast.success("Resume deleted successfully.");
        if (typeof refreshData === "function") {
          refreshData();
        } else {
          window.location.reload();
        }
      } else {
        toast.error("Failed to delete resume. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setOpenAlert(false);
    }
  };


  return (
    <div className="border rounded-lg shadow-lg overflow-hidden flex flex-col transition hover:shadow-xl">
      {/* Preview */}
      <Link to={`/dashboard/resume/${resume._id}/edit`}>
        <img
          src={previewImage}
          alt="Resume Preview"
          className="w-full h-48 object-cover"
        />
      </Link>

      {/* Card content */}
      <div className="relative p-4 flex flex-col gap-2 bg-white">
        <h2 className="text-base font-semibold text-gray-800 truncate">
          {resume?.resumeTitle?.trim() || "Untitled Resume"}
        </h2>

        <div className="flex items-center text-xs text-gray-500">
          <FileText className="w-4 h-4 mr-1" />
          PDF Document
        </div>

        <div className="flex items-center text-xs text-gray-400">
          <Calendar className="w-4 h-4 mr-1" />
          Created:{" "}
          {resume?.createdAt
            ? new Date(resume.createdAt).toLocaleDateString()
            : "N/A"}
        </div>

        <div className="flex items-center text-xs text-gray-400">
          <Clock className="w-4 h-4 mr-1" />
          Last updated:{" "}
          {resume?.updatedAt
            ? new Date(resume.updatedAt).toLocaleDateString()
            : "N/A"}
        </div>

        {/* More menu */}
        <div className="absolute top-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => navigate(`/dashboard/resume/${resume._id}/edit`)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate(`/my-resume/${resume._id}/view`)}
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate(`/my-resume/${resume._id}/download`)}
              >
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpenAlert(true)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove this resume.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={loading}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction disabled={loading} onClick={handleDelete}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

export default ResumeCardItem;
