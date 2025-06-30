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

  const fileCategories = [
    'HR Documents',
    'Tax Forms',
    'Security Scan Report',
    'Performance Reviews',
    'Training Certificates',
    'Medical Records',
    'Other'
  ];

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

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  }, []);

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDownload = (file: UploadedFile) => {
    if (!token) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to download files',
        variant: 'destructive',
      });
      return;
    }

    const fileUrl = `http://localhost:3000/api/files/${file.id}/download?token=${token}`;
    
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = file.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast({
      title: 'Download Started',
      description: `${file.filename} is being downloaded`,
    });
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
        formData.append('files', file);
      });
      formData.append('category', category);
      formData.append('description', description);

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

  const handleDelete = async (fileId: number) => {
    if (!token) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to delete files',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:3000/api/files/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
        toast({ title: 'Success', description: response.data.message });
      } else {
        throw new Error(response.data.message || 'Failed to delete file');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Failed to delete file';

      toast({
        title: 'Delete Failed',
        description: errorMessage,
        variant: 'destructive',
      });
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
              <div className="space-y-3 max-h-96 overflow-y-auto px-1">
                {[...uploadedFiles].reverse().map((file, index) => (
                  <div
                    key={file.id || index}
                    className="flex items-start justify-between border rounded-lg px-3 py-2 bg-white hover:shadow-sm transition"
                  >
                    {/* File Info */}
                    <div 
                      className="flex-1 space-y-0.5 overflow-hidden cursor-pointer"
                      onClick={() => handleDownload(file)}
                    >
                      <p className="text-sm font-medium text-gray-900 truncate hover:text-blue-600 hover:underline">
                        {file.filename}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {file.category} • {formatFileSize(file.size)}
                      </p>
                      {file.description && (
                        <p className="text-xs text-gray-600 truncate">{file.description}</p>
                      )}
                    </div>

                    {/* Badge and Delete */}
                    <div className="flex flex-col items-end justify-between ml-4 space-y-1">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                        Uploaded
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => handleDelete(file.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
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