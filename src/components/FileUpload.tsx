
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, X, FileCheck, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes

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
    
    // Überprüfe Dateigröße
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast({
        title: "Datei zu groß",
        description: `Die PDF-Datei darf maximal 10 MB groß sein. Ihre Datei hat ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB.`,
        variant: "destructive",
        icon: <AlertTriangle className="h-5 w-5" />
      });
      return;
    }

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

  // ... Rest des bestehenden Codes bleibt unverändert
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
        
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">
            {isDragActive ? "PDF hier ablegen..." : "PDF-Vertrag hochladen"}
          </h3>
          <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
            Ziehen Sie eine PDF-Datei hierher oder klicken Sie, um einen Vertrag zur Analyse auszuwählen
            <br />
            <span className="text-xs text-gray-400">(max. 10 MB)</span>
          </p>
        </div>
      </div>

      {/* Restlicher Code bleibt unverändert */}
    </div>
  );
};

export default FileUpload;
