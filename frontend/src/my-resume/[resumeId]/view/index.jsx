import Header from "@/components/custom/Header";
import { Button } from "@/components/ui/button";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import ResumePreview from "@/dashboard/resume/components/resumePreview/ResumePreview";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "./../../../../service/GlobalApi";
import { Download, Loader2 } from "lucide-react";

function ViewResume() {
  const [resumeInfo, setResumeInfo] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { resumeId } = useParams();

  useEffect(() => {
    GetResumeInfo();
  }, []);

  const GetResumeInfo = () => {
    GlobalApi.GetResumeById(resumeId).then((resp) => {
      console.log(resp.data);
      setResumeInfo(resp.data);
    });
  };

  const updatePreview = async () => {
    setIsLoading(true);
    try {
      const previewUrl = await GlobalApi.generateResumePreview(resumeInfo);
      console.log("Preview URL:", previewUrl);
      return previewUrl;
    } catch (err) {
      console.error(err);
      alert("Failed to generate preview.");
    } finally {
      setIsLoading(false);
    }
  };

  const HandleDownload = async () => {
    const previewUrl = await updatePreview();
    if (previewUrl) {
      const link = document.createElement("a");
      link.href = previewUrl;
      link.download = "resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div id="no-print">
        <Header />

        <div className="my-10 mx-10 md:mx-20 lg:mx-36">
          <h2 className="text-center text-2xl font-medium">
            Congrats! Your ultimate AI-generated resume is ready!
          </h2>
          <p className="text-center text-gray-400">
            You can download your resume directly.
          </p>

          <div className="flex justify-center my-10">
            <Button
              size="lg"
              className="group"
              onClick={HandleDownload}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Download Resume
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-start min-h-screen w-full px-4 md:px-12 lg:px-24 py-10 ">
        <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden p-8">
          <ResumePreview />
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default ViewResume;
