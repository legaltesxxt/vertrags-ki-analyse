
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  isAnalyzing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected, isAnalyzing }) => {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      
      // Simuliere Fortschritt (in einer realen Anwendung würde dies durch einen tatsächlichen Upload-Fortschritt ersetzt)
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          onFileSelected(selectedFile);
        }
      }, 100);
    } else {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie eine gültige PDF-Datei aus.",
        variant: "destructive",
      });
    }
  }, [onFileSelected, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    disabled: isAnalyzing,
    maxFiles: 1
  });

  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors
          ${isDragActive ? 'border-legal-secondary bg-legal-light/50' : 'border-gray-300 hover:border-legal-secondary hover:bg-legal-light/20'}
          ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {file ? (
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-legal-secondary mb-2" />
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p className="font-medium">
              {isDragActive ? "Dateien hier ablegen..." : "PDF-Datei hochladen"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Ziehen Sie eine Datei hierher oder klicken Sie, um eine Datei auszuwählen
            </p>
          </div>
        )}

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full mt-4">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-gray-500 mt-1 text-center">{uploadProgress}% hochgeladen</p>
          </div>
        )}
      </div>

      {file && !isAnalyzing && uploadProgress === 100 && (
        <div className="mt-4 flex justify-end">
          <Button 
            onClick={() => {
              setFile(null);
              setUploadProgress(0);
            }}
            variant="outline" 
            className="mr-2"
          >
            Datei entfernen
          </Button>
          <Button 
            onClick={() => onFileSelected(file)}
            className="bg-legal-primary hover:bg-legal-secondary"
          >
            Analyse starten
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
