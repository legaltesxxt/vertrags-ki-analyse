
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, X, FileCheck } from 'lucide-react';
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
        className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer transition-all
          ${isDragActive 
            ? 'border-legal-secondary bg-legal-tertiary/50' 
            : 'border-slate-200 hover:border-legal-secondary hover:bg-legal-tertiary/20'
          }
          ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {file ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-legal-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
              <FileCheck className="h-8 w-8 text-legal-primary" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">{file.name}</h3>
            <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">
              {isDragActive ? "PDF hier ablegen..." : "PDF-Datei hochladen"}
            </h3>
            <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
              Ziehen Sie eine PDF-Datei hierher oder klicken Sie, um einen Vertrag zur Analyse auszuwählen
            </p>
          </div>
        )}

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full max-w-md mt-6">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-gray-500 mt-1 text-center">{uploadProgress}% hochgeladen</p>
          </div>
        )}
      </div>

      {file && !isAnalyzing && uploadProgress === 100 && (
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Button 
            onClick={() => {
              setFile(null);
              setUploadProgress(0);
            }}
            variant="outline" 
            className="flex items-center gap-2"
          >
            <X size={16} />
            Datei entfernen
          </Button>
          <Button 
            onClick={() => onFileSelected(file)}
            className="bg-legal-primary hover:bg-legal-secondary flex items-center gap-2"
          >
            <FileText size={16} />
            Analyse starten
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
