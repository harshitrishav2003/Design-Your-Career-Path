import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { LoaderCircle } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "../../../../../service/GlobalApi";
import { toast } from "sonner";

function Project() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const { resumeId } = useParams();

  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load existing projects if available
  useEffect(() => {
    if (resumeInfo?.projects?.length) {
      setProjectsList(resumeInfo.projects);
    }
  }, [resumeInfo]);

  // Keep global context in sync with local changes
  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      projects: projectsList,
    }));
  }, [projectsList]);

  // Handle input change
  const handleChange = (event, index) => {
    const { name, value } = event.target;
    setProjectsList((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      )
    );
  };

  // Add a new empty project
  const addNewProject = () => {
    setProjectsList((prev) => [
      ...prev,
      { projectName: "", projectLink: "", description: "" },
    ]);
  };

  // Remove the last project — now allows empty list!
  const removeProject = () => {
    setProjectsList((prev) => prev.slice(0, -1));
  };

  // Save to backend
  const handleSave = async () => {
    setLoading(true);

    try {
      const payload = {
        projects: projectsList.map(({ id, ...rest }) => rest),
      };
      await GlobalApi.UpdateResumeDetail(resumeId, payload);
      toast("Projects updated successfully!");
    } catch (error) {
      console.error(error);
      toast("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 shadow-lg rounded-lg border-t-4 border-t-primary mt-10">
      <h2 className="font-bold text-lg">Projects</h2>
      <p className="text-sm text-gray-600 mb-4">
        Add details of your projects below.
      </p>

      <div>
        {projectsList?.length ? (
          projectsList.map((project, index) => (
            <div key={index} className="border p-4 rounded-lg mb-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="block mb-1 font-medium">
                    Project Name
                  </label>
                  <Input
                    name="projectName"
                    value={project.projectName}
                    onChange={(e) => handleChange(e, index)}
                    placeholder="e.g. Portfolio Website"
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block mb-1 font-medium">
                    Project Link
                  </label>
                  <Input
                    name="projectLink"
                    value={project.projectLink}
                    onChange={(e) => handleChange(e, index)}
                    placeholder="e.g. https://github.com/..."
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block mb-1 font-medium">
                    Description
                  </label>
                  <Textarea
                    name="description"
                    value={project.description}
                    onChange={(e) => handleChange(e, index)}
                    placeholder="Short description of your project..."
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 italic">
            No projects added yet. Click <strong>+ Add Project</strong> to get started.
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:justify-between gap-2 mt-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={addNewProject}>
            + Add Project
          </Button>
          <Button
            variant="outline"
            onClick={removeProject}
            disabled={!projectsList.length}
          >
            - Remove Last
          </Button>
        </div>
        <Button disabled={loading} onClick={handleSave}>
          {loading ? (
            <LoaderCircle className="animate-spin w-4 h-4 mr-2" />
          ) : null}
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default Project;
