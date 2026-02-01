import { FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from '@tanstack/react-router';

export function EmptyState() {
  return (
    <div className="flex flex-col py-16 px-4">
      {/* Icon */}
      <div className="w-16 h-16 mb-4 text-gray-500">
        <FolderOpen className="w-full h-full" />
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-semibold text-white mb-2">
        No interviews completed yet
      </h2>

      {/* Description */}
      <p className="text-base text-gray-400 mb-6">
        Start your first interview to see your performance feedback here
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/home">
          <Button variant="primary" className="min-h-[44px]">
            Start Interview
          </Button>
        </Link>
      </div>
    </div>
  );
}
