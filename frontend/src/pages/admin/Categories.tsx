import { useEffect, useState } from "react";
import { categoriesApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUpload from "@/components/admin/ImageUpload";

export default function Categories() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [newCategory, setNewCategory] = useState({ name: "", description: "", image_url: "" });
    const { toast } = useToast();

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const categoriesData = await categoriesApi.getAll();
            setCategories(categoriesData || []);
            setLoading(false);
        } catch (error) {
            console.error("Error loading categories:", error);
            setLoading(false);
        }
    };

    const addCategory = async () => {
        try {
            await categoriesApi.create(newCategory);
            toast({ title: "Success", description: "Category added successfully!", variant: "success" });
            // Reset form including image
            setNewCategory({ name: "", description: "", image_url: "" });
            await loadCategories();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const updateCategory = async () => {
        if (!editingCategory) return;
        try {
            await categoriesApi.update(editingCategory.id, editingCategory);
            toast({ title: "Success", description: "Category updated successfully!", variant: "success" });
            setEditingCategory(null);
            setCategoryDialogOpen(false);
            await loadCategories();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const deleteCategory = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        try {
            await categoriesApi.delete(id);
            toast({ title: "Success", description: "Category deleted!", variant: "success" });
            await loadCategories();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    if (loading) {
        return <div>Loading categories...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
                <p className="text-slate-600 mt-2">Manage product categories</p>
            </div>

            <Tabs defaultValue="list" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="list">Category List</TabsTrigger>
                    <TabsTrigger value="add">Add New Category</TabsTrigger>
                </TabsList>

                <TabsContent value="list">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Categories ({categories.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 sm:p-6">
                            {/* Mobile Card View */}
                            <div className="md:hidden space-y-3 p-4">
                                {categories.map((category) => (
                                    <Card key={category.id} className="overflow-hidden">
                                        <CardContent className="p-4">
                                            <div className="flex gap-4">
                                                {category.image_url && (
                                                    <img
                                                        src={category.image_url}
                                                        alt={category.name}
                                                        className="w-20 h-20 object-cover rounded flex-shrink-0"
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-base text-blue-700 truncate">{category.name}</h3>
                                                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{category.description || "N/A"}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-3 pt-3 border-t">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1"
                                                    onClick={() => {
                                                        setEditingCategory(category);
                                                        setCategoryDialogOpen(true);
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4 mr-1" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="flex-1"
                                                    onClick={() => deleteCategory(category.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden md:block">
                                <ScrollArea className="w-full">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Image</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Description</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {categories.map((category) => (
                                                <TableRow key={category.id}>
                                                    <TableCell>
                                                        {category.image_url && (
                                                            <img src={category.image_url} alt={category.name} className="w-12 h-12 object-cover rounded" />
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="font-medium text-blue-700">{category.name}</TableCell>
                                                    <TableCell>{category.description || "N/A"}</TableCell>
                                                    <TableCell className="space-x-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                setEditingCategory(category);
                                                                setCategoryDialogOpen(true);
                                                            }}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => deleteCategory(category.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </ScrollArea>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="add">
                    <Card className="max-w-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="h-5 w-5" />
                                Add New Category
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Category Name</Label>
                                <Input value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} placeholder="Enter category name" />
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Textarea value={newCategory.description} onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })} placeholder="Enter category description" rows={4} />
                            </div>
                            <ImageUpload
                                uploadType="category"
                                currentImage={newCategory.image_url}
                                onUpload={(imageUrl) => setNewCategory({ ...newCategory, image_url: imageUrl })}
                                label="Category Image"
                            />
                            <Button onClick={addCategory} className="w-full" size="lg">Add Category</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                    </DialogHeader>
                    {editingCategory && (
                        <div className="space-y-4 mt-4">
                            <div>
                                <Label>Category Name</Label>
                                <Input
                                    value={editingCategory.name}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Textarea
                                    value={editingCategory.description || ""}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                                    rows={4}
                                />
                            </div>
                            <ImageUpload
                                uploadType="category"
                                currentImage={editingCategory.image_url}
                                onUpload={(imageUrl) => setEditingCategory({ ...editingCategory, image_url: imageUrl })}
                                label="Category Image"
                            />
                            <Button onClick={updateCategory} className="w-full" size="lg">Update Category</Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
