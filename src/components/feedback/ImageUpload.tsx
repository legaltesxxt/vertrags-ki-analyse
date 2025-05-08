
import React from 'react';
import { ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form';

interface ImageUploadProps {
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  imagePreview, 
  onImageChange, 
  onRemoveImage 
}) => {
  return (
    <div className="space-y-2">
      <FormLabel className="block">Bild anhängen (optional)</FormLabel>
      {imagePreview ? (
        <div className="relative mt-2 rounded-md overflow-hidden border border-slate-200">
          <img 
            src={imagePreview} 
            alt="Vorschau"
            className="w-full max-h-48 object-contain" 
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={onRemoveImage}
          >
            Entfernen
          </Button>
        </div>
      ) : (
        <div className="mt-1">
          <label 
            htmlFor="image-upload" 
            className="flex justify-center px-4 py-6 border-2 border-dashed border-slate-200 rounded-md cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <div className="space-y-1 text-center">
              <ImageIcon className="mx-auto h-8 w-8 text-slate-400" />
              <div className="text-sm text-slate-600">
                <span className="text-legal-primary font-medium">Klicken Sie zum Hochladen</span> oder ziehen Sie eine Datei hierher
              </div>
              <p className="text-xs text-slate-500">PNG, JPG, GIF bis zu 10MB</p>
            </div>
            <input 
              id="image-upload" 
              name="image" 
              type="file" 
              accept="image/*" 
              className="sr-only" 
              onChange={onImageChange}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
