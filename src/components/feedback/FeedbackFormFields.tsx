
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Upload } from 'lucide-react';

export const formSchema = z.object({
  name: z.string().min(2, { message: 'Name muss mindestens 2 Zeichen lang sein.' }),
  email: z.string().email({ message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' }),
  message: z.string().min(10, { message: 'Ihre Nachricht sollte mindestens 10 Zeichen enthalten.' })
});

export type FormValues = z.infer<typeof formSchema>;

interface FeedbackFormFieldsProps {
  form: UseFormReturn<FormValues>;
  isSubmitting: boolean;
  onSubmit: (data: FormValues) => Promise<void>;
}

const FeedbackFormFields: React.FC<FeedbackFormFieldsProps> = ({ 
  form, 
  isSubmitting, 
  onSubmit
}) => {
  return (
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
  );
};

export default FeedbackFormFields;
