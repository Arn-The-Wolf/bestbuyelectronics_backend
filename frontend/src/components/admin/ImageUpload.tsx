import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
    onUpload: (imageUrl: string) => void;
    currentImage?: string;
    uploadType: "product" | "category";
    label?: string;
}

export default function ImageUpload({ onUpload, currentImage, uploadType, label = "Image" }: ImageUploadProps) {
    const [preview, setPreview] = useState<string>(currentImage || "");
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

    // Sync preview with currentImage prop changes (for form reset)
    useEffect(() => {
        setPreview(currentImage || "");
    }, [currentImage]);

    const handleFile = async (file: File) => {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            toast({
                title: "Invalid file type",
                description: "Please upload a JPEG, PNG, WebP, or GIF image.",
                variant: "destructive"
            });
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "File too large",
                description: "Please upload an image smaller than 5MB.",
                variant: "destructive"
            });
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to server
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_BASE_URL}/upload/${uploadType}`, {
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
            const fullImageUrl = `http://localhost:3001${data.imageUrl}`;

            onUpload(fullImageUrl);
            toast({
                title: "Success",
                description: "Image uploaded successfully!"
            });
        } catch (error: any) {
            console.error('Upload error:', error);
            toast({
                title: "Upload failed",
                description: error.message || "Failed to upload image",
                variant: "destructive"
            });
            setPreview(currentImage || "");
        } finally {
            setUploading(false);
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

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleRemove = () => {
        setPreview("");
        onUpload("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-2">
            <Label>{label}</Label>

            {preview ? (
                <div className="relative">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border"
                    />
                    <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={handleRemove}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${dragActive ? "border-primary bg-primary/5" : "border-slate-300 hover:border-primary"
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
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        onChange={handleChange}
                        disabled={uploading}
                    />

                    <div className="flex flex-col items-center gap-2">
                        {uploading ? (
                            <>
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                <p className="text-sm text-slate-600">Uploading...</p>
                            </>
                        ) : (
                            <>
                                <ImageIcon className="h-12 w-12 text-slate-400" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-slate-700">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        JPEG, PNG, WebP, or GIF (max 5MB)
                                    </p>
                                </div>
                                <Button type="button" variant="outline" size="sm" className="mt-2">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Choose File
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
