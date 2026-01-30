import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon, Video, FileVideo } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MultiFileUploadProps {
    onUpload: (files: Array<{ url: string; type: 'image' | 'video' }>) => void;
    currentFiles?: Array<{ url: string; type: 'image' | 'video' }>;
    label?: string;
}

export default function MultiFileUpload({ onUpload, currentFiles = [], label = "Media Gallery (Images & Videos)" }: MultiFileUploadProps) {
    const [files, setFiles] = useState<Array<{ url: string; type: 'image' | 'video' }>>(currentFiles);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

    useEffect(() => {
        setFiles(currentFiles || []);
    }, [currentFiles]);

    const handleFiles = async (fileList: FileList) => {
        const validFiles: File[] = [];
        const allowedTypes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
            'video/mp4', 'video/webm', 'video/quicktime'
        ];

        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            if (!allowedTypes.includes(file.type)) {
                toast({
                    title: "Invalid file type",
                    description: `${file.name} is not a valid image or video.`,
                    variant: "destructive"
                });
                continue;
            }
            if (file.size > 50 * 1024 * 1024) {
                toast({
                    title: "File too large",
                    description: `${file.name} exceeds 50MB limit.`,
                    variant: "destructive"
                });
                continue;
            }
            validFiles.push(file);
        }

        if (validFiles.length === 0) return;

        setUploading(true);
        try {
            const formData = new FormData();
            validFiles.forEach(file => {
                formData.append('files', file);
            });

            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_BASE_URL}/upload/product/multiple`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Upload failed');
            }

            const data = await response.json();

            const newFiles = data.files.map((f: any) => ({
                url: `http://localhost:3001${f.url}`,
                type: f.type
            }));

            const updatedFiles = [...files, ...newFiles];
            setFiles(updatedFiles);
            onUpload(updatedFiles);

            toast({
                title: "Success",
                description: `${newFiles.length} files uploaded successfully!`
            });
        } catch (error: any) {
            console.error('Upload error:', error);
            toast({
                title: "Upload failed",
                description: error.message || "Failed to upload files",
                variant: "destructive"
            });
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    };

    const removeFile = (index: number) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
        onUpload(newFiles);
    };

    return (
        <div className="space-y-3">
            <Label>{label}</Label>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {files.map((file, index) => (
                    <div key={index} className="relative group aspect-square bg-slate-100 rounded-lg overflow-hidden border">
                        {file.type === 'video' ? (
                            <div className="w-full h-full flex items-center justify-center bg-slate-900">
                                <FileVideo className="h-8 w-8 text-white/50" />
                                <video src={file.url} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                            </div>
                        ) : (
                            <img src={file.url} alt="" className="w-full h-full object-cover" />
                        )}
                        <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ))}

                <div
                    className={`aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${dragActive ? "border-primary bg-primary/5" : "border-slate-300 hover:border-primary hover:bg-slate-50"
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleChange}
                        disabled={uploading}
                    />
                    {uploading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    ) : (
                        <>
                            <PlusIcon className="h-6 w-6 text-slate-400 mb-1" />
                            <span className="text-xs text-slate-500 font-medium">Add Media</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function PlusIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    )
}
