import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  message: string;
}

export function LoadingOverlay({ message }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-lg font-medium">{message}</p>
      </div>
    </div>
  );
} 