import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "../../../../../service/GlobalApi";
import { Brain, LoaderCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PROMPTS } from "../../../../../service/promts";
import { streamAIResponse } from "../../../../../service/AIModal";



function Summery({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [summary, setSummary] = useState(resumeInfo?.summary || "");
  const [generateLoading, setGenerateLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [aiGeneratedSummeryList, setAiGenerateSummeryList] = useState();

  // New: Grammar state
  const [grammarSuggestions, setGrammarSuggestions] = useState([]);
  const [correctedText, setCorrectedText] = useState("");

  const params = useParams();
  

  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      summary: summary,
    });
  }, [summary]);

  // Generate summaries
  const GenerateSummeryFromAI = async () => {
    try {
      setGenerateLoading(true);

      const PROMPT = PROMPTS.generateSummary.replace(
        "{jobTitle}",
        resumeInfo?.jobTitle || "Software Engineer"
      );

      const result = await streamAIResponse(PROMPT);

      if (result) {
        setAiGenerateSummeryList(result);
      } else {
        console.error("No summaries returned");
      }
    } catch (error) {
      console.error("Error generating summary:", error);
    } finally {
      setGenerateLoading(false);
    }
  };

  // Save
  const onSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);

    try {
      const data = { summary: summary };
      await GlobalApi.UpdateResumeDetail(params?.resumeId, data);

      enabledNext(true);
      toast("Details updated successfully");
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setSaveLoading(false);
    }
  };

  // Debounce grammar check
  useEffect(() => {
    const handler = setTimeout(() => {
      if (summary.trim().length > 20) {
        checkGrammar(summary);
      } else {
        setGrammarSuggestions([]);
        setCorrectedText("");
      }
    }, 1000);

    return () => clearTimeout(handler);
  }, [summary]);

  // Call Gemini for grammar
  const checkGrammar = async (text) => {
    try {
      const PROMPT = PROMPTS.grammarCheck.replace("{text}", text);
      const result = await streamAIResponse(PROMPT);

      setCorrectedText(result?.correctedText || "");
      setGrammarSuggestions(result?.suggestions || []);
    } catch (err) {
      console.error("Grammar check failed:", err);
    }
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Summary</h2>
        <p>Add a summary for your job title</p>

        <form className="mt-7" onSubmit={onSave}>
          <div className="flex justify-between items-end">
            <label className="block font-medium">Summary</label>
            <Button
              variant="outline"
              onClick={GenerateSummeryFromAI}
              type="button"
              size="sm"
              disabled={generateLoading}
              className="border-primary text-primary flex gap-2"
            >
              {generateLoading ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Brain className="h-4 w-4" /> Generate from AI
                </>
              )}
            </Button>
          </div>

          <Textarea
            className="mt-5"
            required
            name="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />

          {/* Corrected version */}
          {correctedText && (
            <div className="mt-4 p-4 border border-green-300 bg-green-50 rounded">
              <h4 className="font-semibold text-green-700 mb-2">
                ✅ Corrected Version:
              </h4>
              <p className="text-green-800">{correctedText}</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSummary(correctedText)}
                className="mt-2"
              >
                Apply Correction
              </Button>
            </div>
          )}

          {/* Suggestions */}
          {grammarSuggestions?.length > 0 && (
            <div className="mt-4 p-4 border border-yellow-300 bg-yellow-50 rounded">
              <h4 className="font-semibold text-yellow-700 mb-2">
                💡 Next Suggestions:
              </h4>
              <ul className="list-disc pl-5">
                {grammarSuggestions.map((s, i) => (
                  <li
                    key={i}
                    className="cursor-pointer hover:underline"
                    onClick={() => setSummary(summary + " " + s)}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-2 flex justify-end">
            <Button type="submit" disabled={saveLoading}>
              {saveLoading ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </div>

      {aiGeneratedSummeryList && (
        <div className="my-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            AI Suggestions
          </h2>

          <div className="space-y-4">
            {aiGeneratedSummeryList.map((item, index) => (
              <div
                key={index}
                onClick={() =>
                  setSummary(
                    Array.isArray(item?.summary)
                      ? item.summary.join(" ")
                      : item.summary
                  )
                }
                className="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 shadow-sm hover:shadow-md transition p-6"
              >
                <h3 className="text-primary font-semibold mb-2 text-sm uppercase tracking-wide">
                  Level: {item?.experience_level}
                </h3>

                <p className="text-gray-700 text-[14px] leading-relaxed">
                  {Array.isArray(item.summary)
                    ? item.summary.join(" ")
                    : item.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Summery;
