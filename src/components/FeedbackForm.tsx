
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import FeedbackFormFields from './feedback/FeedbackFormFields';
import SuccessMessage from './feedback/SuccessMessage';
import { useFeedbackForm } from './feedback/useFeedbackForm';

const FeedbackForm: React.FC = () => {
  const {
    form,
    isSubmitting,
    isSuccess,
    imagePreview,
    handleImageChange,
    removeImage,
    onSubmit
  } = useFeedbackForm();

  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardContent className="p-6">
        {isSuccess ? (
          <SuccessMessage />
        ) : (
          <Form {...form}>
            <FeedbackFormFields
              form={form}
              isSubmitting={isSubmitting}
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
              onRemoveImage={removeImage}
              />
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
