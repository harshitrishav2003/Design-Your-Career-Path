import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { LoaderCircle } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "../../../../../service/GlobalApi";
import { toast } from "sonner";

function CertificationOrExtraCurricular() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const { resumeId } = useParams();

  const [certList, setCertList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load ONCE on mount (no more unwanted resets!)
  useEffect(() => {
    if (Array.isArray(resumeInfo?.certificationsOrExtraCurriculars)) {
      setCertList(resumeInfo.certificationsOrExtraCurriculars);
    } else {
      setCertList([]);
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep context synced when certList changes
  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      certificationsOrExtraCurriculars: certList,
    }));
  }, [certList, setResumeInfo]);

  const handleChange = (index, value) => {
    const updated = [...certList];
    updated[index].certificationOrExtraCurricularName = value;
    setCertList(updated);
  };

  const addNew = () => {
    setCertList((prev) => [...prev, { certificationOrExtraCurricularName: "" }]);
  };

  const removeLast = () => {
    if (certList.length > 0) {
      setCertList((prev) => prev.slice(0, -1));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        certificationsOrExtraCurriculars: certList.map(({ id, ...rest }) => rest),
      };
      await GlobalApi.UpdateResumeDetail(resumeId, payload);
      toast("Certifications & Extra-Curriculars updated!");
    } catch (error) {
      console.error(error);
      toast("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 shadow-lg rounded-lg border-t-4 border-t-primary mt-10">
      <h2 className="font-bold text-lg">Certifications / Extra-Curriculars</h2>
      <p className="text-sm text-gray-600 mb-4">
        Add your certifications or extra-curricular activities below.
      </p>

      <div>
        {certList.map((item, index) => (
          <div key={`cert-${index}`} className="border p-4 rounded-lg mb-5">
            <label className="block mb-1 font-medium">
              Certification or Activity
            </label>
            <Input
              value={item.certificationOrExtraCurricularName || ""}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder="e.g. Certified Ethical Hacker, Event Organizer"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:justify-between gap-2 mt-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={addNew}>
            + Add
          </Button>
          <Button
            variant="outline"
            onClick={removeLast}
            disabled={certList.length === 0}
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

export default CertificationOrExtraCurricular;
