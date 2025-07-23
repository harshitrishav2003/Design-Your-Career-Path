import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormSection from "../../components/FormSection";
import ResumePreview from "../../components/resumePreview/ResumePreview";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
// import dummy from '@/data/dummy';
import GlobalApi from "./../../../../../service/GlobalApi";

function EditResume() {
  const { resumeId } = useParams();
  const [resumeInfo, setResumeInfo] = useState(null);

  useEffect(() => {
    GetResumeInfo();
  }, []);

  const GetResumeInfo = () => {
    GlobalApi.GetResumeById(resumeId).then((resp) => {
      setResumeInfo(resp.data);
    });
  };

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className="grid grid-cols-1 md:grid-cols-2 p-8 gap-8">
        {/* Form Section  */}
        <FormSection />

        {/* Preview Section  */}
        
        <ResumePreview />
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default EditResume;
