"use client";

import React, { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import GlobalApi from "../../../../service/GlobalApi";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

function Theme() {
  const [templates, setTemplates] = useState([]);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const { resumeId } = useParams();

  // Load templates on mount
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const resp = await GlobalApi.GetAllTemplates();
        if (resp?.data) {
          setTemplates(resp.data);
        } else {
          console.error("No template data received!");
        }
      } catch (error) {
        console.error("Failed to fetch templates:", error);
      }
    };

    fetchTemplates();
  }, []);

  const onTemplateSelect = async (templateId) => {
    try {
      setResumeInfo((prev) => ({
        ...prev,
        templateId: templateId,
      }));

      const payload = { templateId };
      await GlobalApi.UpdateResumeDetail(resumeId, payload);

      toast(`Template selected & saved!`);
    } catch (error) {
      console.error("Failed to update template:", error);
      toast.error("Failed to update template. Please try again.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 rounded-full px-4 py-2 border border-gray-300 hover:bg-gray-100"
        >
          <LayoutGrid className="w-4 h-4" /> Customize Template
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-4xl rounded-xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-2">
            Choose Your Resume Template
          </DialogTitle>
          <p className="text-gray-500 text-sm mb-4">
            Pick your preferred template layout.
          </p>
        </DialogHeader>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {templates.length === 0 ? (
            <p className="text-gray-500">No templates found.</p>
          ) : (
            templates.map((template) => (
              <div
                key={template._id}
                onClick={() => onTemplateSelect(template._id)}
                className={`overflow-hidden shadow hover:shadow-lg transition cursor-pointer ${
                  resumeInfo?.templateId === template._id
                    ? "ring-2 ring-primary"
                    : ""
                }`}
              >
                <img
                  src={`/templates/${template.folderName}.png`}
                  alt={`Template ${template.name}`}
                  className="w-full aspect-[3/4]"
                />
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Theme;
