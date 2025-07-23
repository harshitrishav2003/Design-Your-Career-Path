"use client";

import React, { useContext, useState, useEffect } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Check, Loader2 } from "lucide-react";
import GlobalApi from "../../../../../service/GlobalApi";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export default function ResumePreview() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [isOpen, setIsOpen] = useState(false);
  const [titleInput, setTitleInput] = useState(resumeInfo?.resumeTitle || "");
  const { resumeId } = useParams();
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasPreviewLoaded, setHasPreviewLoaded] = useState(false);

  useEffect(() => {
    if (resumeInfo && !hasPreviewLoaded) {
      updatePreview();
      setHasPreviewLoaded(true);
    }
  }, [resumeInfo]);
  
  if (!resumeInfo) {
    return (
      <div className="p-8 border">
        <p>Loading resume data...</p>
      </div>
    );
  }

  const handleSave = async () => {
    setResumeInfo({ ...resumeInfo, resumeTitle: titleInput });
    setIsOpen(false);

    try {
      await GlobalApi.UpdateResumeDetail(resumeId, { resumeTitle: titleInput });
      toast("Resume title updated!");
    } catch (err) {
      console.error(err);
      toast("Server error. Please try again.");
    }
  };

  const updatePreview = async () => {
    setLoading(true);
    try {
      const previewUrl = await GlobalApi.generateResumePreview(resumeInfo);
      setPreviewUrl(previewUrl);
    } catch (err) {
      console.error(err);
      alert("Failed to generate preview.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-10">
        <h3
          className="text-xl font-bold text-gray-800 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          {resumeInfo.resumeTitle || "Untitled Resume"}
        </h3>
        <Button onClick={updatePreview} disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </span>
          ) : (
            "Latest Preview"
          )}
        </Button>
      </div>

      <div className="relative w-full">
        {/* === Iframe or empty preview === */}
        {previewUrl ? (
          <iframe
            id="pdfPreview"
            src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            style={{
              width: "100%",
              height: "600px",
              overflow: "hidden",
            }}
            scrolling="no"
            className={`border rounded transition-all ${
              loading ? "blur-sm pointer-events-none" : ""
            }`}
          />
        ) : (
          <div
            className={`flex justify-center items-center w-full h-[475px] bg-gray-50 rounded-xl border border-dashed border-gray-300 transition-all ${
              loading ? "blur-sm pointer-events-none" : ""
            }`}
          >
            <div className="max-w-md text-center p-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                No Preview Available
              </h2>
              <p className="text-gray-500 mb-5">
                Please fill out your form or click{" "}
                <strong>Latest Preview</strong> to generate a live preview.
              </p>
            </div>
          </div>
        )}

        {/* === Loading Overlay === */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded">
            <Loader2 className="w-8 h-8 text-gray-700 animate-spin mb-2" />
            <p className="text-sm text-gray-600">Generating latest preview...</p>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Resume Title</DialogTitle>
          </DialogHeader>

          <Input
            className="w-full"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            placeholder="Enter resume title"
          />

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Check className="w-4 h-4 mr-1" /> Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
