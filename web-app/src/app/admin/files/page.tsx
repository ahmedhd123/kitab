'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  DocumentArrowUpIcon,
  FolderIcon,
  DocumentIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: number;
  uploadDate: string;
  bookTitle?: string;
  fileType?: 'epub' | 'mobi' | 'pdf' | 'audiobook' | 'cover';
  mimeType?: string;
  path: string;
}

interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

const AdminFilesPage = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState('/');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, [currentPath]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      
      // Simulate API call - في الإنتاج سيكون هذا API حقيقي
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockFiles: FileItem[] = [
        {
          id: '1',
          name: 'كتب الأدب العربي',
          type: 'folder',
          uploadDate: '2025-08-10T10:00:00Z',
          path: '/arabic-literature'
        },
        {
          id: '2',
          name: 'الكتب المترجمة',
          type: 'folder',
          uploadDate: '2025-08-10T09:30:00Z',
          path: '/translated-books'
        },
        {
          id: '3',
          name: 'دعاء الكروان.epub',
          type: 'file',
          size: 2456789,
          uploadDate: '2025-08-10T14:30:00Z',
          bookTitle: 'دعاء الكروان',
          fileType: 'epub',
          mimeType: 'application/epub+zip',
          path: '/arabic-literature/dua-al-karawan.epub'
        },
        {
          id: '4',
          name: 'مدن الملح.pdf',
          type: 'file',
          size: 15678912,
          uploadDate: '2025-08-10T13:15:00Z',
          bookTitle: 'مدن الملح',
          fileType: 'pdf',
          mimeType: 'application/pdf',
          path: '/arabic-literature/cities-of-salt.pdf'
        },
        {
          id: '5',
          name: 'الأسود يليق بك - غلاف.jpg',
          type: 'file',
          size: 892456,
          uploadDate: '2025-08-10T12:45:00Z',
          bookTitle: 'الأسود يليق بك',
          fileType: 'cover',
          mimeType: 'image/jpeg',
          path: '/covers/black-suits-you-cover.jpg'
        },
        {
          id: '6',
          name: 'مئة عام من العزلة.mp3',
          type: 'file',
          size: 125678912,
          uploadDate: '2025-08-10T11:20:00Z',
          bookTitle: 'مئة عام من العزلة',
          fileType: 'audiobook',
          mimeType: 'audio/mpeg',
          path: '/audiobooks/one-hundred-years.mp3'
        }
      ];

      setFiles(mockFiles);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileUpload(droppedFiles);
  };

  const handleFileUpload = async (filesToUpload: File[]) => {
    const newUploads: UploadProgress[] = filesToUpload.map(file => ({
      file,
      progress: 0,
      status: 'uploading'
    }));

    setUploadProgress(prev => [...prev, ...newUploads]);

    // Simulate upload progress for each file
    for (let i = 0; i < newUploads.length; i++) {
      const upload = newUploads[i];
      
      try {
        // Simulate upload with progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          
          setUploadProgress(prev => 
            prev.map(up => 
              up.file === upload.file 
                ? { ...up, progress }
                : up
            )
          );
        }

        // Mark as success
        setUploadProgress(prev => 
          prev.map(up => 
            up.file === upload.file 
              ? { ...up, status: 'success' }
              : up
          )
        );

        // Add to files list
        const newFile: FileItem = {
          id: Date.now() + Math.random().toString(),
          name: upload.file.name,
          type: 'file',
          size: upload.file.size,
          uploadDate: new Date().toISOString(),
          mimeType: upload.file.type,
          path: `${currentPath}${upload.file.name}`
        };

        setFiles(prev => [...prev, newFile]);

      } catch (error) {
        setUploadProgress(prev => 
          prev.map(up => 
            up.file === upload.file 
              ? { ...up, status: 'error', error: 'فشل في الرفع' }
              : up
          )
        );
      }
    }

    // Clear completed uploads after 3 seconds
    setTimeout(() => {
      setUploadProgress(prev => 
        prev.filter(up => up.status === 'uploading')
      );
    }, 3000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFileUpload(selectedFiles);
  };

  const deleteFile = async (fileId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الملف؟')) {
      try {
        // API call to delete file
        setFiles(prev => prev.filter(file => file.id !== fileId));
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };

  const deleteSelected = async () => {
    if (selectedFiles.length === 0) return;
    
    if (confirm(`هل أنت متأكد من حذف ${selectedFiles.length} ملف؟`)) {
      try {
        setFiles(prev => prev.filter(file => !selectedFiles.includes(file.id)));
        setSelectedFiles([]);
      } catch (error) {
        console.error('Error deleting files:', error);
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return <FolderIcon className="w-8 h-8 text-blue-500" />;
    }

    switch (file.fileType) {
      case 'cover':
        return <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center text-green-600 text-xs font-bold">IMG</div>;
      case 'epub':
        return <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center text-purple-600 text-xs font-bold">EPUB</div>;
      case 'pdf':
        return <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center text-red-600 text-xs font-bold">PDF</div>;
      case 'audiobook':
        return <div className="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center text-yellow-600 text-xs font-bold">MP3</div>;
      default:
        return <DocumentIcon className="w-8 h-8 text-gray-500" />;
    }
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.bookTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center rtl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="rtl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">إدارة الملفات</h1>
              <p className="text-gray-600 mt-2">رفع وإدارة ملفات الكتب والصور</p>
            </div>
            <div className="flex space-x-4 space-x-reverse">
              {selectedFiles.length > 0 && (
                <button
                  onClick={deleteSelected}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
                >
                  <TrashIcon className="w-5 h-5 ml-2" />
                  حذف المحدد ({selectedFiles.length})
                </button>
              )}
              <label className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer flex items-center">
                <CloudArrowUpIcon className="w-5 h-5 ml-2" />
                رفع ملفات
                <input
                  type="file"
                  multiple
                  className="sr-only"
                  onChange={handleFileSelect}
                  accept=".epub,.mobi,.pdf,.mp3,.m4a,.wav,.jpg,.jpeg,.png,.gif"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Upload Progress */}
        {uploadProgress.length > 0 && (
          <div className="mb-6 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">رفع الملفات</h3>
            <div className="space-y-4">
              {uploadProgress.map((upload, index) => (
                <div key={index} className="flex items-center space-x-4 space-x-reverse">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">{upload.file.name}</span>
                      <span className="text-sm text-gray-500">
                        {upload.status === 'uploading' && `${upload.progress}%`}
                        {upload.status === 'success' && '✅ مكتمل'}
                        {upload.status === 'error' && '❌ خطأ'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-200 ${
                          upload.status === 'success' ? 'bg-green-600' :
                          upload.status === 'error' ? 'bg-red-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${upload.progress}%` }}
                      ></div>
                    </div>
                    {upload.error && (
                      <p className="text-sm text-red-600 mt-1">{upload.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-6 bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في الملفات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="text-sm text-gray-600">
              إجمالي الملفات: {filteredFiles.length}
            </div>
          </div>
        </div>

        {/* File Upload Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`mb-6 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
          }`}
        >
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            اسحب الملفات هنا لرفعها، أو 
            <label className="text-blue-600 hover:text-blue-800 cursor-pointer">
              {' '}اختر الملفات
              <input
                type="file"
                multiple
                className="sr-only"
                onChange={handleFileSelect}
                accept=".epub,.mobi,.pdf,.mp3,.m4a,.wav,.jpg,.jpeg,.png,.gif"
              />
            </label>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            الملفات المدعومة: EPUB, MOBI, PDF, MP3, M4A, WAV, JPG, PNG
          </p>
        </div>

        {/* Files List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">قائمة الملفات</h3>
              <div className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="checkbox"
                  checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFiles(filteredFiles.map(f => f.id));
                    } else {
                      setSelectedFiles([]);
                    }
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">تحديد الكل</span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredFiles.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد ملفات</h3>
                <p className="mt-1 text-sm text-gray-500">ابدأ برفع ملفات جديدة</p>
              </div>
            ) : (
              filteredFiles.map((file) => (
                <div key={file.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFiles(prev => [...prev, file.id]);
                        } else {
                          setSelectedFiles(prev => prev.filter(id => id !== file.id));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    
                    <div className="flex-shrink-0">
                      {getFileIcon(file)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          {file.bookTitle && (
                            <p className="text-sm text-gray-500">
                              كتاب: {file.bookTitle}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 space-x-reverse text-xs text-gray-500">
                            {file.size && (
                              <span>{formatFileSize(file.size)}</span>
                            )}
                            <span>{formatDate(file.uploadDate)}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 space-x-reverse">
                          <button
                            onClick={() => {/* View file */}}
                            className="text-blue-600 hover:text-blue-800"
                            title="عرض"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {/* Download file */}}
                            className="text-green-600 hover:text-green-800"
                            title="تحميل"
                          >
                            <ArrowDownTrayIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteFile(file.id)}
                            className="text-red-600 hover:text-red-800"
                            title="حذف"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Storage Info */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">معلومات التخزين</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">2.4 GB</div>
              <div className="text-sm text-gray-600">المساحة المستخدمة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">7.6 GB</div>
              <div className="text-sm text-gray-600">المساحة المتاحة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">156</div>
              <div className="text-sm text-gray-600">إجمالي الملفات</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">24%</div>
              <div className="text-sm text-gray-600">نسبة الاستخدام</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-blue-600 h-3 rounded-full" style={{ width: '24%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminFilesPage;
