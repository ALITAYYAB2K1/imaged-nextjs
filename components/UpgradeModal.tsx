import React, { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Crown } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  restrictedTool: string;
  reason: string;
}

const UpgradeModal: FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  restrictedTool,
  reason,
}) => {
  const getToolName = (toolId: string): string => {
    const toolNames: Record<string, string> = {
      background: "AI Background Remover",
      ai_extender: "AI Image Extender",
      ai_edit: "AI Image Editor",
    };
    return toolNames[toolId] || "Premium Features";
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl bg-slate-800 border-white/10 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-yellow-500" />
              <DialogTitle className="text-2xl font-bold text-white">
                Upgrade to Imaged Pro
              </DialogTitle>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpgradeModal;
