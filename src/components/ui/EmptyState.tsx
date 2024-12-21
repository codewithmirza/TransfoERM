import { PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: () => void;
  actionLabel?: string;
}

export function EmptyState({ title, description, action, actionLabel }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 mb-4 text-gray-400">
        <PlusCircle className="w-full h-full" />
      </div>
      <h3 className="mb-2 text-lg font-medium">{title}</h3>
      <p className="mb-4 text-sm text-gray-500">{description}</p>
      {action && (
        <button
          onClick={action}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {actionLabel || 'Add New'}
        </button>
      )}
    </div>
  );
} 