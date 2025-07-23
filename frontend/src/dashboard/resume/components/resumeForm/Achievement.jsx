import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { LoaderCircle } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "../../../../../service/GlobalApi";
import { toast } from "sonner";

function Achievement() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const { resumeId } = useParams();

  const [achievementList, setAchievementList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Only run once on mount
  useEffect(() => {
    if (Array.isArray(resumeInfo?.achievements)) {
      setAchievementList(resumeInfo.achievements);
    } else {
      setAchievementList([]);
    }
  }, []); 

  // Keep context in sync with local state
  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      achievements: achievementList,
    }));
  }, [achievementList, setResumeInfo]);

  const handleChange = (event, index) => {
    const { name, value } = event.target;
    setAchievementList((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      )
    );
  };

  const addNewAchievement = () => {
    setAchievementList((prev) => [...prev, { achievement: "" }]);
  };

  const removeAchievement = () => {
    setAchievementList((prev) => prev.slice(0, -1));
  };

  const handleSave = async () => {
    if (achievementList.length === 0) {
      toast("Add at least one achievement before saving.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        achievements: achievementList.map(({ id, ...rest }) => rest),
      };
      await GlobalApi.UpdateResumeDetail(resumeId, payload);
      toast("Achievements updated successfully!");
    } catch (error) {
      console.error(error);
      toast("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 shadow-lg rounded-lg border-t-4 border-t-primary mt-10">
      <h2 className="font-bold text-lg">Achievements</h2>
      <p className="text-sm text-gray-600 mb-4">
        Add your notable achievements below.
      </p>

      <div>
        {achievementList.length > 0 ? (
          achievementList.map((item, index) => (
            <div key={index} className="border p-4 rounded-lg mb-5">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block mb-1 font-medium">
                    Achievement
                  </label>
                  <Input
                    name="achievement"
                    value={item.achievement || ""}
                    onChange={(e) => handleChange(e, index)}
                    placeholder="e.g. Won Best Project Award"
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 italic">
            No achievements added yet. Click{" "}
            <strong>+ Add Achievement</strong> to get started.
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:justify-between gap-2 mt-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={addNewAchievement}>
            + Add Achievement
          </Button>
          <Button
            variant="outline"
            onClick={removeAchievement}
            disabled={achievementList.length === 0}
          >
            - Remove Last
          </Button>
        </div>
        <Button disabled={loading} onClick={handleSave}>
          {loading && <LoaderCircle className="animate-spin w-4 h-4 mr-2" />}
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default Achievement;
