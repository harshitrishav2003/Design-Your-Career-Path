import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContext, useEffect, useState } from "react";
import RichTextEditor from "../RichTextEditor";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useParams } from "react-router-dom";
import GlobalApi from "../../../../../service/GlobalApi";
import { toast } from "sonner";
import { LoaderCircle, Plus, Trash, Save } from "lucide-react";

const formField = {
  title: "",
  companyName: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  workSummary: "",
};

function Experience() {
  const [experinceList, setExperinceList] = useState([]);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    resumeInfo?.experience?.length > 0 &&
      setExperinceList(resumeInfo?.experience);
  }, []);

  const handleChange = (index, event) => {
    const newEntries = experinceList.slice();
    const { name, value } = event.target;
    newEntries[index][name] = value;
    setExperinceList(newEntries);
  };

  const AddNewExperience = () => {
    setExperinceList([
      ...experinceList,
      { ...formField },
    ]);
  };

  const RemoveExperience = () => {
    setExperinceList((prev) => prev.slice(0, -1));
  };

  const handleRichTextEditor = (e, name, index) => {
    const newEntries = experinceList.slice();
    newEntries[index][name] = e.target.value;
    setExperinceList(newEntries);
  };

  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      experience: experinceList,
    });
  }, [experinceList]);

   console.log("workSummary", experinceList)
  const onSave = () => {
    setLoading(true);
    const data = {
      experience: experinceList.map(({ id, ...rest }) => rest),
    };

    GlobalApi.UpdateResumeDetail(params?.resumeId, data).then(
      (res) => {
        setLoading(false);
        toast("Details updated !");
      },
      (error) => {
        setLoading(false);
        console.log(error);
      }
    );
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Professional Experience</h2>
        <p>Add Your previous Job experience</p>

        <div>
          {experinceList.length === 0 ? (
            <p className="text-sm text-gray-500 mt-4">
              No experiences added yet. Click &quot;Add Experience&quot; to get started.
            </p>
          ) : (
            experinceList.map((item, index) => (
              <div key={index}>
                <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
                  <div>
                    <label className="block mb-1 font-medium">Position Title</label>
                    <Input
                      name="title"
                      onChange={(event) => handleChange(index, event)}
                      defaultValue={item?.title}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Company Name</label>
                    <Input
                      name="companyName"
                      onChange={(event) => handleChange(index, event)}
                      defaultValue={item?.companyName}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">City</label>
                    <Input
                      name="city"
                      onChange={(event) => handleChange(index, event)}
                      defaultValue={item?.city}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">State</label>
                    <Input
                      name="state"
                      onChange={(event) => handleChange(index, event)}
                      defaultValue={item?.state}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Start Date</label>
                    <Input
                      type="date"
                      name="startDate"
                      onChange={(event) => handleChange(index, event)}
                      defaultValue={item?.startDate}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">End Date</label>
                    <Input
                      type="date"
                      name="endDate"
                      onChange={(event) => handleChange(index, event)}
                      defaultValue={item?.endDate}
                    />
                  </div>
                  <div className="col-span-2">
                    {/* Work Summery */}
                    <RichTextEditor
                      index={index}
                      defaultValue={item?.workSummary}
                      onRichTextEditorChange={(event) =>
                        handleRichTextEditor(event, "workSummary", index)
                      }
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={AddNewExperience}
              size="sm"
              className="flex items-center gap-2 border-primary text-primary"
            >
              <Plus className="h-4 w-4" /> Add More
            </Button>

            <Button
              variant="outline"
              onClick={RemoveExperience}
              size="sm"
              disabled={experinceList.length === 0}
              className="border-destructive text-destructive p-2"
            >
              <Trash className="h-4 w-4" /> Remove
            </Button>
          </div>

          <Button
            disabled={loading}
            onClick={onSave}
            className="flex items-center gap-2 ml-2"
            size="sm"
          >
            {loading ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Save className="h-4 w-4" /> Save
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Experience;
