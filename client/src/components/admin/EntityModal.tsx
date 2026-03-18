import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EntityModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function EntityModal({ open, onClose, title, children }: EntityModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="text-white max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{
          background: "rgba(17,17,17,0.95)",
          backdropFilter: "blur(40px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 24,
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-white font-serif tracking-widest uppercase text-sm">
            {title}
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
