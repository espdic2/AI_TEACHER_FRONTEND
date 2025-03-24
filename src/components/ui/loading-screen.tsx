import React from "react";

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingScreen({ 
  message = "Chargement...", 
  fullScreen = true 
}: LoadingScreenProps) {
  return (
    <div className={`flex items-center justify-center w-full h-[calc(100vh-6rem)]`}>
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
} 