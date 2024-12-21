import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface FormWrapperProps {
  onSubmit: (data: any) => Promise<void>;
  children: React.ReactNode;
}

export function FormWrapper({ onSubmit, children }: FormWrapperProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(formData);
      await onSubmit(data);
      toast.success('Operation completed successfully');
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {children}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Submit'}
      </button>
    </form>
  );
} 