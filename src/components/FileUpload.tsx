import React, { useState, useCallback, useEffect } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Upload, File as FileIcon, X } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore.ts';
import axios from 'axios';

interface UploadedFile {
  id: number;
  filename: string;
  filepath: string;
  mimetype: string;
  size: number;
  user_id: number;
  category: string;
  description: string | null;
  created_at?: string;
}

const FileUpload = () => {
  const { token } = useAuthStore();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const { toast } = useToast();

  useEffect(() => {
  const fetchFiles = async () => {
    if (!token) return;

    try {
      const res = await axios.get('http://localhost:3000/api/files/mine', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUploadedFiles(res.data.files || []);
    } catch (err) {
      console.error('Failed to fetch uploaded files:', err);
      toast({
        title: 'Error',
        description: 'Failed to load recent uploads',
        variant: 'destructive',
      });
    }
  };

  fetchFiles();
}, [token]);


  const fileCategories = [
    'HR Documents',
    'Tax Forms',
    'Security Scan Report',
    'Performance Reviews',
    'Training Certificates',
    'Medical Records',
    'Other'
  ];

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  }, []);

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !category) {
      toast({
        title: 'Upload Error',
        description: 'Please select files and category before uploading',
        variant: 'destructive',
      });
      return;
    }

    if (!token) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to upload files',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file)
      });
      formData.append('category', category);
      formData.append('description', description);

      console.log([...formData.entries()])

      const response = await axios.post('http://localhost:3000/api/files/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const uploaded = response.data.files;
      setUploadedFiles(prev => [...prev, ...uploaded]);
      setSelectedFiles([]);
      setCategory('');
      setDescription('');

      toast({
        title: 'Upload Successful',
        description: `${uploaded.length} file(s) uploaded successfully`,
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        description: error.response?.data?.message || 'An error occurred during the upload',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">File Upload</h1>
        <p className="text-gray-600 mt-2">Upload your documents and files for processing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload New Files</CardTitle>
            <CardDescription>Select files and provide details for upload</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* File Input */}
            <div className="space-y-2">
              <Label htmlFor="file-input">Select Files</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  id="file-input"
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.xls,.xlsx"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500 mt-1">PDF, DOC, JPG, PNG up to 10MB</p>
                </label>
              </div>
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div key={`${index}-${file.name}`} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <FileIcon className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select file category" />
                </SelectTrigger>
                <SelectContent>
                  {fileCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add a description for these files..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              onClick={handleUpload}
              disabled={isUploading || selectedFiles.length === 0 || !category}
              className="w-full"
            >
              {isUploading ? 'Uploading...' : 'Upload Files'}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Uploads */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Uploads</CardTitle>
            <CardDescription>Files you've uploaded recently</CardDescription>
          </CardHeader>
          <CardContent>
            {uploadedFiles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileIcon className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                <p>No files uploaded yet</p>
                <p className="text-sm">Your uploaded files will appear here</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {[...uploadedFiles].reverse().map((file, index) => (
                  <div key={file.id || index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileIcon className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate">{file.filename}</p>
                          <p className="text-xs text-gray-500">{file.category} • {formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Uploaded</span>
                    </div>
                    {file.description && (
                      <p className="text-xs text-gray-600 mt-2">{file.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FileUpload;
