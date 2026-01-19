import { useEffect, useState } from "react";
import { productsApi, categoriesApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUpload from "@/components/admin/ImageUpload";

export default function Products() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [newProduct, setNewProduct] = useState({
        name: "", description: "", price: "", discount_price: null, stock: "",
        image_url: "", brand: "", category_id: null, is_featured: false
    });
    const { toast } = useToast();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [productsData, categoriesData] = await Promise.all([
                productsApi.getAll(),
                categoriesApi.getAll(),
            ]);
            setProducts(productsData || []);
            setCategories(categoriesData || []);
            setLoading(false);
        } catch (error) {
            console.error("Error loading data:", error);
            setLoading(false);
        }
    };

    const addProduct = async () => {
        try {
            await productsApi.create({
                ...newProduct,
                price: Number(newProduct.price) || 0,
                stock: Number(newProduct.stock) || 0
            });
            toast({ title: "Success", description: "Product added successfully!" });
            setNewProduct({
                name: "", description: "", price: "", discount_price: null, stock: "",
                image_url: "", brand: "", category_id: null, is_featured: false
            });
            await loadData();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const updateProduct = async () => {
        if (!editingProduct) return;
        try {
            await productsApi.update(editingProduct.id, editingProduct);
            toast({ title: "Success", description: "Product updated successfully!" });
            setEditingProduct(null);
            setEditDialogOpen(false);
            await loadData();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const deleteProduct = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await productsApi.delete(id);
            toast({ title: "Success", description: "Product deleted!" });
            await loadData();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    if (loading) {
        return <div>Loading products...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Products</h1>
                <p className="text-slate-600 mt-2">Manage your product catalog</p>
            </div>

            <Tabs defaultValue="list" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="list">Product List</TabsTrigger>
                    <TabsTrigger value="add">Add New Product</TabsTrigger>
                </TabsList>

                <TabsContent value="list">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Products ({products.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 sm:p-6">
                            <ScrollArea className="w-full">
                                <div className="min-w-[700px]">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Image</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Brand</TableHead>
                                                <TableHead>Price</TableHead>
                                                <TableHead>Stock</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {products.map((product) => (
                                                <TableRow key={product.id}>
                                                    <TableCell>
                                                        <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded" />
                                                    </TableCell>
                                                    <TableCell className="font-medium">{product.name}</TableCell>
                                                    <TableCell>{product.brand || "N/A"}</TableCell>
                                                    <TableCell className="font-semibold whitespace-nowrap">
                                                        TSh {Number(product.price).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell>{product.stock}</TableCell>
                                                    <TableCell className="space-x-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                setEditingProduct(product);
                                                                setEditDialogOpen(true);
                                                            }}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => deleteProduct(product.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="add">
                    <Card className="max-w-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="h-5 w-5" />
                                Add New Product
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Product Name</Label>
                                <Input value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Enter product name" />
                            </div>
                            <div>
                                <Label>Brand</Label>
                                <Input value={newProduct.brand} onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })} placeholder="Enter brand name" />
                            </div>
                            <div>
                                <Label>Category</Label>
                                <Select value={newProduct.category_id || ""} onValueChange={(value) => setNewProduct({ ...newProduct, category_id: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Textarea value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Enter product description" rows={4} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label>Price (TSh)</Label>
                                    <Input type="number" min="0" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} placeholder="Enter price" />
                                </div>
                                <div>
                                    <Label>Discount Price (TSh) - Optional</Label>
                                    <Input type="number" min="0" value={newProduct.discount_price || ""} onChange={(e) => setNewProduct({ ...newProduct, discount_price: e.target.value ? Number(e.target.value) : null })} placeholder="Optional" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label>Stock</Label>
                                    <Input type="number" min="0" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} placeholder="Enter stock quantity" />
                                </div>
                                <div className="flex items-center space-x-2 pt-8">
                                    <input
                                        type="checkbox"
                                        id="featured"
                                        checked={newProduct.is_featured}
                                        onChange={(e) => setNewProduct({ ...newProduct, is_featured: e.target.checked })}
                                        className="rounded"
                                    />
                                    <Label htmlFor="featured">Featured Product</Label>
                                </div>
                            </div>
                            <ImageUpload
                                uploadType="product"
                                currentImage={newProduct.image_url}
                                onUpload={(imageUrl) => setNewProduct({ ...newProduct, image_url: imageUrl })}
                                label="Product Image"
                            />
                            <Button onClick={addProduct} className="w-full" size="lg">Add Product</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                    </DialogHeader>
                    {editingProduct && (
                        <div className="space-y-4 mt-4">
                            <div>
                                <Label>Product Name</Label>
                                <Input
                                    value={editingProduct.name}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Brand</Label>
                                <Input
                                    value={editingProduct.brand || ""}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Textarea
                                    value={editingProduct.description || ""}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                    rows={4}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label>Price (TSh)</Label>
                                    <Input
                                        type="number"
                                        value={editingProduct.price}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <Label>Discount Price (TSh)</Label>
                                    <Input
                                        type="number"
                                        value={editingProduct.discount_price || ""}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, discount_price: e.target.value ? Number(e.target.value) : null })}
                                        placeholder="Optional"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Stock</Label>
                                <Input
                                    type="number"
                                    value={editingProduct.stock}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                                />
                            </div>
                            <ImageUpload
                                uploadType="product"
                                currentImage={editingProduct.image_url}
                                onUpload={(imageUrl) => setEditingProduct({ ...editingProduct, image_url: imageUrl })}
                                label="Product Image"
                            />
                            <Button onClick={updateProduct} className="w-full" size="lg">Update Product</Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
