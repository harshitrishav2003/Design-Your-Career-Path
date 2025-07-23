import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import GlobalApi from "../../../../../service/GlobalApi";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

function Interest() {
  const [interestList, setInterestList] = useState([]);
  const { resumeId } = useParams();
  const [loading, setLoading] = useState(false);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  useEffect(() => {
    if (Array.isArray(resumeInfo?.interests) && resumeInfo.interests.length > 0) {
      setInterestList(resumeInfo.interests);
    }
  }, []); // Load only once

  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      interests: interestList,
    }));
  }, [interestList, setResumeInfo]);

  const handleChange = (index, value) => {
    const newEntries = [...interestList];
    newEntries[index].interestName = value;
    setInterestList(newEntries);
  };

  const addNewInterest = () => {
    setInterestList((prev) => [...prev, { interestName: "" }]);
  };

  const removeInterest = () => {
    if (interestList.length > 0) {
      setInterestList((prev) => prev.slice(0, -1));
    }
  };

  const onSave = async () => {
    setLoading(true);
    const data = {
      interests: interestList.map(({ id, ...rest }) => rest), // will be [] if empty — OK!
    };

    try {
      await GlobalApi.UpdateResumeDetail(resumeId, data);
      toast("Interests updated!");
    } catch (error) {
      console.error(error);
      toast("Server Error. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Interests</h2>
      <p className="mb-4">Add your interests below</p>

      <div className="space-y-4">
        {interestList.length > 0 ? (
          interestList.map((item, index) => (
            <div
              className="flex items-center gap-3 mb-2 border rounded-lg p-3"
              key={index}
            >
              <div className="flex-1">
                <label className="block mb-1 font-medium">Interest</label>
                <Input
                  value={item.interestName}
                  onChange={(e) => handleChange(index, e.target.value)}
                  placeholder="e.g. Reading, Traveling"
                />
              </div>
            </div>
          ))
        ) : (
          <div className="italic text-gray-500">
            No interests added yet. Click <strong>+ Add Interest</strong> to get started.
          </div>
        )}
      </div>

      <div className="flex justify-between mt-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={addNewInterest} className="text-primary">
            + Add Interest
          </Button>
          <Button
            variant="outline"
            onClick={removeInterest}
            className="text-primary"
            disabled={interestList.length === 0}
          >
            - Remove
          </Button>
        </div>
        <Button disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default Interest;
