import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AddResume from "./components/AddResume";
import { AuthContext } from "../context/AuthContext";
import GlobalApi from "./../../service/GlobalApi";
import ResumeCardItem from "./components/ResumeCardItem";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [resumeList, setResumeList] = useState([]);
  const [templateList, setTemplateList] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [resumeTitle, setResumeTitle] = useState("");

  useEffect(() => {
    if (user?._id) {
      GetResumesList();
    }
    GetTemplateList();
  }, [user]);

  const GetResumesList = () => {
    GlobalApi.GetUserResumes(user._id)
      .then((resp) => {
        setResumeList(resp.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch resumes:", err);
      });
  };

  const GetTemplateList = () => {
    GlobalApi.GetAllTemplates()
      .then((resp) => {
        setTemplateList(resp.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch templates:", err);
      });
  };

  const handleChooseTemplate = (templateId) => {
    setSelectedTemplateId(templateId);
    setOpenDialog(true);
  };

  const handleCreateResume = async () => {
    if (!resumeTitle.trim()) {
      toast.error("Please enter a title");
      return;
    }

    try {
      const resp = await GlobalApi.CreateNewResume({
        resumeTitle: resumeTitle.trim(),
        templateId: selectedTemplateId,
        email: user.email,
      });

      if (resp?.data?._id) {
        toast.success("Resume created successfully!");
        navigate(`/dashboard/resume/${resp.data._id}/edit`);
      } else {
        toast.error("Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create resume");
    } finally {
      setOpenDialog(false);
      setResumeTitle("");
    }
  };

  return (
    <div className="px-6 py-12 md:px-20 lg:px-32">
      {/* My Resumes */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-left">
        My Resumes
      </h2>
      <div className="w-10 h-0.5 bg-blue-600 mb-6 rounded-full"></div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16">
        <AddResume refreshData={GetResumesList} />

        {resumeList.length > 0 ? (
          resumeList.map((resume) => {
            const template = templateList.find(
              (tpl) => tpl._id === resume.templateId
            );
            const previewImage = template
              ? `/templates/${template.folderName || template.name}.png`
              : "/templates/placeholder.png";

              console.log("resumeList", resumeList)
            return (
              <ResumeCardItem
                key={resume._id || resume.id}
                resume={resume}
                previewImage={previewImage}
                refreshData={GetResumesList}
              />
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center text-center border border-dashed border-gray-300 rounded-lg p-6 h-[330px]">
            <h3 className="text-base font-semibold text-gray-700 mb-1">
              No resumes found
            </h3>
            <p className="text-xs text-gray-500">
              Click <span className="text-blue-600 font-medium">+</span> to
              create your first one or choose a template.
            </p>
          </div>
        )}
      </div>

      {/* Choose a Template */}
      <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 text-center">
        Choose a Template
      </h3>
      <div className="w-16 h-1 bg-blue-600 mx-auto mb-4 rounded-full"></div>
      <p className="text-gray-600 mb-12 text-center max-w-xl mx-auto">
        Pick a design that matches your personality and career goals. All
        templates are crafted to help you stand out.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {templateList.length > 0 ? (
          templateList.map((template) => (
            <div
              key={template._id}
              onClick={() => handleChooseTemplate(template._id)}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-blue-500 bg-white flex flex-col"
            >
              <div className="overflow-hidden">
                <img
                  src={`/templates/${template.folderName || template.name}.png`}
                  alt={template.name}
                  className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h4 className="text-lg font-semibold text-gray-800">
                  {template.name}
                </h4>
                <p className="text-sm text-gray-500 mt-1 flex-grow">
                  {template.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            Loading templates...
          </p>
        )}
      </div>

      {/* Title Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Resume Title</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="e.g. Frontend Developer Resume"
            value={resumeTitle}
            onChange={(e) => setResumeTitle(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={handleCreateResume}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Dashboard;
