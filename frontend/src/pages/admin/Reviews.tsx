import { useEffect, useState } from "react";
import { reviewsApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Star } from "lucide-react";

export default function Reviews() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        try {
            const reviewsData = await reviewsApi.getAll();
            setReviews(reviewsData || []);
            setLoading(false);
        } catch (error) {
            console.error("Error loading reviews:", error);
            setLoading(false);
        }
    };

    const deleteReview = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;
        try {
            await reviewsApi.delete(id);
            toast({ title: "Success", description: "Review deleted!", variant: "success" });
            await loadReviews();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    if (loading) {
        return <div>Loading reviews...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Reviews</h1>
                <p className="text-slate-600 mt-2">Moderate product reviews</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Product Reviews ({reviews.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3 p-4">
                        {reviews.map((review) => (
                            <Card key={review.id} className="overflow-hidden">
                                <CardContent className="p-4 space-y-3">
                                    {/* Product and Rating */}
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-slate-500">Product</p>
                                            <p className="font-semibold text-base text-blue-700 truncate">{review.product_name || review.products?.name || "N/A"}</p>
                                        </div>
                                        <div className="flex items-center gap-1 ml-2">
                                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                            <span className="font-bold text-lg">{review.rating}</span>
                                            <span className="text-slate-500 text-sm">/5</span>
                                        </div>
                                    </div>

                                    {/* Customer and Date */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs text-slate-500">Customer</p>
                                            <p className="text-sm font-medium">{review.full_name || review.profiles?.full_name || "Anonymous"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Date</p>
                                            <p className="text-sm">{new Date(review.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {/* Comment */}
                                    <div>
                                        <p className="text-xs text-slate-500">Comment</p>
                                        <p className="text-sm text-slate-700 mt-1 leading-relaxed">{review.comment || "No comment"}</p>
                                    </div>

                                    {/* Delete Button */}
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => deleteReview(review.id)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete Review
                                    </Button>
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
                                        <TableHead>Product</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Rating</TableHead>
                                        <TableHead>Comment</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reviews.map((review) => (
                                        <TableRow key={review.id}>
                                            <TableCell className="font-medium text-blue-700">{review.product_name || review.products?.name || "N/A"}</TableCell>
                                            <TableCell>{review.full_name || review.profiles?.full_name || "Anonymous"}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    <span className="font-semibold">{review.rating}/5</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate">{review.comment || "No comment"}</TableCell>
                                            <TableCell>{new Date(review.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => deleteReview(review.id)}
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
        </div>
    );
}
