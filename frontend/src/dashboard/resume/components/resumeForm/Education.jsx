import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { LoaderCircle, Trash } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "../../../../../service/GlobalApi";
import { toast } from "sonner";

function Education() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const { resumeId } = useParams();

  const [educationalList, setEducationalList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load existing education if available
  useEffect(() => {
    if (resumeInfo?.education?.length) {
      setEducationalList(resumeInfo.education);
    }
  }, [resumeInfo]);

  // Keep context synced
  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      education: educationalList,
    }));
  }, [educationalList]);

  // Handle input change
  const handleChange = (event, index) => {
    const { name, value } = event.target;
    setEducationalList((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      )
    );
  };

  // Add new empty education record
  const addNewEducation = () => {
    setEducationalList((prev) => [
      ...prev,
      {
        universityName: "",
        degree: "",
        major: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  // Remove last education record — allows empty list
  const removeEducation = () => {
    setEducationalList((prev) => prev.slice(0, -1));
  };

  // Save handler
  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        education: educationalList.map(({ id, ...rest }) => rest),
      };
      await GlobalApi.UpdateResumeDetail(resumeId, payload);
      toast("Education details updated!");
    } catch (error) {
      console.error(error);
      toast("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-4 border-t-primary mt-10">
      <h2 className="font-bold text-lg">Education</h2>
      <p className="text-sm text-gray-600 mb-4">
        Add your education details below.
      </p>

      <div>
        {educationalList.length ? (
          educationalList.map((item, index) => (
            <div key={index} className="border p-4 rounded-lg mb-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="block mb-1 font-medium">
                    University Name
                  </label>
                  <Input
                    name="universityName"
                    value={item.universityName}
                    onChange={(e) => handleChange(e, index)}
                    placeholder="e.g. University of XYZ"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Degree</label>
                  <Input
                    name="degree"
                    value={item.degree}
                    onChange={(e) => handleChange(e, index)}
                    placeholder="e.g. B.Tech"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Major</label>
                  <Input
                    name="major"
                    value={item.major}
                    onChange={(e) => handleChange(e, index)}
                    placeholder="e.g. Computer Science"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Start Date</label>
                  <Input
                    type="date"
                    name="startDate"
                    value={item.startDate}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">End Date</label>
                  <Input
                    type="date"
                    name="endDate"
                    value={item.endDate}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block mb-1 font-medium">
                    Description
                  </label>
                  <Textarea
                    name="description"
                    value={item.description}
                    onChange={(e) => handleChange(e, index)}
                    placeholder="Brief description of coursework or achievements..."
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 italic">
            No education added yet. Click <strong>+ Add Education</strong> to get started.
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:justify-between gap-2 mt-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={addNewEducation}>
            + Add More
          </Button>
          <Button
            variant="outline"
            onClick={removeEducation}
            disabled={!educationalList.length}
            className="border-destructive text-destructive p-2"
            >
              <Trash className="h-4 w-4" /> Remove
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

export default Education;
