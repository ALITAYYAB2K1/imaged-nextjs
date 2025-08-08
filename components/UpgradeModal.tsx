import React, { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Crown, Terminal, Zap } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PricingTable } from "@clerk/nextjs";
import { Button } from "./ui/button";
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
      projects: "More then 5 Projects",
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
          <div className="space-y-6">
            {restrictedTool && (
              <Alert className="bg-amber-500/10 border-amber-500/20">
                <Zap className="h-5 w-5 text-amber-400" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription className="text-amber-300/80">
                  <div className="font-semibold text-amber-400 mb-1">
                    {getToolName(restrictedTool)} - Pro feature.
                  </div>
                  {reason ||
                    `${getToolName(restrictedTool)} is a premium feature. Upgrade to Imaged Pro to access it.`}
                </AlertDescription>
              </Alert>
            )}
            <PricingTable
              checkoutProps={{
                appearance: {
                  elements: {
                    drawerRoot: {
                      zIndex: 20000,
                    },
                  },
                },
              }}
            />
          </div>
          <DialogFooter className="justify-center">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-white/70 hover:text-white cursor-pointer"
            >
              Maybe Later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpgradeModal;
