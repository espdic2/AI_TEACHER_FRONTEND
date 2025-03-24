import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { API_URL } from '@/config/constants';

interface PDFViewerProps {
  fileUrl: string;
}

export function PDFViewer({ fileUrl }: PDFViewerProps) {
  // Convert relative URL to absolute URL if needed
  const fullUrl = fileUrl.startsWith('http') 
    ? fileUrl 
    : `${API_URL}${fileUrl}`;

  return (
    <div className="w-full h-[calc(100vh-200px)] border rounded-lg overflow-hidden">
      <iframe
        src={fullUrl}
        className="w-full h-full"
        title="PDF Viewer"
      />
    </div>
  );
} 