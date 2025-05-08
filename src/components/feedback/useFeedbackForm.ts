
import { useState, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { FormValues, formSchema } from './FeedbackFormFields';

export const useFeedbackForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Fest definierter Webhook URL für das Feedback-Formular
  const webhookUrl = 'https://vertrags.app.n8n.cloud/webhook-test/feedback-form';

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: ''
    }
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
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
    console.log('Form submission started with data:', data);
    setIsSubmitting(true);
    
    try {
      // Prepare form data including optional image
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('message', data.message);
      
      if (selectedImage) {
        formData.append('image', selectedImage);
        console.log('Image attached to form data:', selectedImage.name);
      }

      console.log('Sende Formular-Daten an Webhook:', webhookUrl);
      
      // Senden der Daten an den Webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });
      
      console.log('Webhook response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Fehler beim Senden: ${response.status} ${response.statusText}`);
      }
      
      console.log('Form submitted successfully');
      setIsSuccess(true);
      form.reset();
      removeImage();
      
      toast({
        title: "Vielen Dank!",
        description: "Ihr Feedback wurde erfolgreich übermittelt. Wir melden uns bald bei Ihnen.",
      });
      
      // Reset success state after 5 seconds to allow users to read the message
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
      
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

  return {
    form,
    isSubmitting,
    isSuccess,
    imagePreview,
    handleImageChange,
    removeImage,
    onSubmit
  };
};
