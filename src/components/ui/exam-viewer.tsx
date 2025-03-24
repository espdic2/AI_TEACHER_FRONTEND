import { ExamFormat } from "@/types/exam";
import { PDFViewer } from "./pdf-viewer";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/lib/supabase";

interface ExamViewerProps {
  fileUrl: string;
  format: ExamFormat;
}

export function ExamViewer({ fileUrl, format }: ExamViewerProps) {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const fetchContent = async () => {
      if (format !== 'PDF') {
        try {
          // Extract the file path from the URL
          const filePath = fileUrl.split("/sgbd-store/")[1];
          
          if (!filePath) {
            throw new Error('Invalid file URL format');
          }
          
          // Download the file directly from Supabase storage
          const { data, error } = await supabase.storage
            .from('sgbd-store')
            .download(filePath);
            
          if (error) {
            throw error;
          }
          
          // Convert the blob to text
          const text = await data.text();
          setContent(text);
        } catch (error) {
          console.error('Error fetching file content:', error);
        }
      }
    };

    if (fileUrl) {
      fetchContent();
    }
  }, [fileUrl, format]);

  if (!fileUrl) {
    return (
      <div className="flex items-center justify-center h-[500px] border rounded-lg bg-muted/10">
        <p className="text-muted-foreground">Aucun fichier disponible</p>
      </div>
    );
  }

  switch (format) {
    case 'PDF':
      return <PDFViewer fileUrl={fileUrl} />;
    
    case 'MD':
      return (
        <div className="prose dark:prose-invert max-w-none p-4 border rounded-lg bg-card overflow-auto h-[calc(100vh-200px)]">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      );
    
    case 'TEX':
      return (
        <div className="font-mono p-4 border rounded-lg bg-card overflow-auto h-[calc(100vh-200px)]">
          <pre className="whitespace-pre-wrap">{content}</pre>
        </div>
      );
    
    case 'TXT':
      return (
        <div className="font-mono p-4 border rounded-lg bg-card overflow-auto h-[calc(100vh-200px)]">
          <pre className="whitespace-pre-wrap">{content}</pre>
        </div>
      );
    
    default:
      return (
        <div className="flex items-center justify-center h-[500px] border rounded-lg bg-muted/10">
          <p className="text-muted-foreground">Format non supporté</p>
        </div>
      );
  }
} 