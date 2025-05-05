
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name muss mindestens 2 Zeichen lang sein.' }),
  email: z.string().email({ message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' }),
  message: z.string().min(10, { message: 'Ihre Nachricht sollte mindestens 10 Zeichen enthalten.' })
});

type FormValues = z.infer<typeof formSchema>;

const FeedbackForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState<string>('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: ''
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Prepare form data including optional image
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('message', data.message);
      
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      // Here we would send the data to a webhook URL if it was provided
      // For now, we're just simulating a successful submission
      console.log('Form data to be sent:', {
        ...data,
        imageIncluded: selectedImage ? true : false
      });
      
      // Simulating API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here's where we would send the actual request when a webhook URL is configured
      // if (webhookUrl) {
      //   const response = await fetch(webhookUrl, {
      //     method: 'POST',
      //     body: formData,
      //   });
      //   
      //   if (!response.ok) {
      //     throw new Error('Failed to submit feedback');
      //   }
      // }
      
      setIsSuccess(true);
      form.reset();
      removeImage();
      
      toast({
        title: "Vielen Dank!",
        description: "Ihr Feedback wurde erfolgreich übermittelt.",
      });
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Fehler",
        description: "Beim Senden des Feedbacks ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardContent className="p-6">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="bg-green-100 rounded-full p-3 mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Feedback übermittelt!</h3>
            <p className="text-gray-600">Vielen Dank für Ihre Nachricht. Wir werden uns so schnell wie möglich bei Ihnen melden.</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Ihr Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-Mail</FormLabel>
                    <FormControl>
                      <Input placeholder="ihre@email.ch" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ihre Nachricht</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Beschreiben Sie Ihr Anliegen hier..." 
                        className="min-h-32 resize-y"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                      onClick={removeImage}
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
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-legal-primary hover:bg-legal-secondary" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wird gesendet...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Absenden
                  </>
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
