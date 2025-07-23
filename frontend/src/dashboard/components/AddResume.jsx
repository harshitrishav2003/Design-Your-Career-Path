import { Loader2, PlusSquare } from "lucide-react";
import { useState, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GlobalApi from "./../../../service/GlobalApi";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // Add toast for user feedback

function AddResume() {
  const [openDialog, setOpenDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("");
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Guard for auth
  const isLoggedIn = !!user?.email;

  const onCreate = async () => {
    if (!resumeTitle.trim()) {
      toast.error("Please enter a valid resume title.");
      return;
    }

    if (!isLoggedIn) {
      toast.error("You must be logged in to create a resume.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        resumeTitle: resumeTitle.trim(),
        email: user.email,
      };

      const resp = await GlobalApi.CreateNewResume(payload);

      if (resp?.data?._id) {
        toast.success("Resume created successfully!");
        navigate(`/dashboard/resume/${resp.data._id}/edit`);
        setOpenDialog(false);
        setResumeTitle("");
      } else {
        toast.error("Failed to create resume. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* The clickable Add box */}
      <div
        className="p-14 py-24 border 
        items-center flex 
        justify-center bg-secondary
        rounded-lg h-[330px]
        hover:scale-105 transition-all hover:shadow-md
        cursor-pointer border-dashed"
        onClick={() => setOpenDialog(true)}
      >
        <PlusSquare />
      </div>

      {/* Dialog for creating resume */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
              <p>Add a title for your new resume</p>
              <Input
                className="my-2"
                placeholder="e.g. Full Stack Resume"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                maxLength={100}
              />
            </DialogDescription>
            <div className="flex justify-end gap-5 mt-4">
              <Button
                variant="ghost"
                disabled={loading}
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={!resumeTitle.trim() || loading}
                onClick={onCreate}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Create"}
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddResume;
