import { useState, useCallback } from 'react';
import { validateFile } from '../validations/id-upload.validation';
import { readFileAsDataURL } from '../utils/file.utils';

export interface UploadedFile {
  file: File;
  preview: string;
}

export interface UseFileUploadReturn {
  file: UploadedFile | null;
  error: string | null;
  isLoading: boolean;
  handleFileSelect: (file: File) => Promise<void>;
  removeFile: () => void;
  clearError: () => void;
}

/**
 * Custom hook for handling file upload logic
 * Encapsulates validation, preview generation, and state management
 */
export const useFileUpload = (): UseFileUploadReturn => {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    setIsLoading(true);
    setError(null);

    // Validate file
    const validation = validateFile(selectedFile);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      setIsLoading(false);
      return;
    }

    try {
      // Generate preview
      const preview = await readFileAsDataURL(selectedFile);
      setFile({
        file: selectedFile,
        preview,
      });
    } catch (err) {
      setError('Failed to load file preview');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeFile = useCallback(() => {
    setFile(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    file,
    error,
    isLoading,
    handleFileSelect,
    removeFile,
    clearError,
  };
};
