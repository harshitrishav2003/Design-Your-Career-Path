import { useEffect, useState } from "react";
import GlobalApi from "../../../service/GlobalApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, FileText, Folder, Clock } from "lucide-react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AdminDashboard() {
  const [folderName, setFolderName] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [templateList, setTemplateList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getTemplates();
  }, []);

  const getTemplates = () => {
    GlobalApi.GetAllTemplates()
      .then((res) => {
        setTemplateList(res.data || []);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch templates");
      });
  };

  const handleAddTemplate = async () => {
    if (!folderName || !name || !description) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      await GlobalApi.CreateTemplate({ folderName, name, description });
      toast.success("Template added");
      setFolderName("");
      setName("");
      setDescription("");
      setOpen(false);
      getTemplates();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add template");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Template
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Template</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <Input
                placeholder="Folder Name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
              />
              <Input
                placeholder="Template Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <DialogFooter className="mt-4">
              <Button disabled={loading} onClick={handleAddTemplate}>
                Add Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {templateList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {templateList.map((tpl) => (
            <div
              key={tpl._id}
              className="bg-white rounded-lg border shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col"
            >
              {/* === Image or fallback text === */}
              <img
                src={`/templates/${tpl.folderName}.png`}
                alt={tpl.name}
                className="w-full h-40 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = document.createElement("div");
                  fallback.innerText = tpl.name || "No Image";
                  fallback.className =
                    "w-full h-40 flex items-center justify-center bg-gray-100 text-gray-600 text-sm";
                  e.currentTarget.parentNode.insertBefore(
                    fallback,
                    e.currentTarget
                  );
                }}
              />

              <div className="p-4 flex flex-col gap-2">
                <div className="flex items-center text-lg font-semibold text-gray-800 gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  {tpl.name}
                </div>

                <p className="text-sm text-gray-600 line-clamp-3 mb-2">
                  {tpl.description}
                </p>

                <div className="flex items-center text-xs text-gray-500 gap-2">
                  <Folder className="w-4 h-4" />
                  {tpl.folderName}
                </div>

                {/* <div className="flex items-center text-xs text-gray-400 gap-2">
                  <Clock className="w-4 h-4" />
                  Created:{" "}
                  {tpl.createdAt
                    ? new Date(tpl.createdAt).toLocaleDateString()
                    : "N/A"}
                </div> */}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No templates found.</p>
      )}
    </div>
  );
}
