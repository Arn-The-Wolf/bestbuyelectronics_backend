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
            toast({ title: "Success", description: "Review deleted!" });
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
                    <ScrollArea className="w-full">
                        <div className="min-w-[800px]">
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
                                            <TableCell className="font-medium">{review.product_name || review.products?.name || "N/A"}</TableCell>
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
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
