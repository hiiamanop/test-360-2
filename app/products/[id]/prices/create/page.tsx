"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { priceService, productService } from "@/services/api_service";
import { PriceFormData, Product } from "@/type/type";

interface AddPricePageProps {
  params: {
    productId: string;
  };
}

export default function AddPricePage({ params }: AddPricePageProps) {
  const router = useRouter();
  const productId = parseInt(params.productId);

  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<PriceFormData>({
    product_id: productId,
    unit: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");

  interface ApiError {
    message: string;
    response?: {
      data?: {
        message?: string;
      };
    };
  }

  useEffect(() => {
    const fetchProduct = async () => {
      setIsFetching(true);
      try {
        const data = await productService.getProductById(productId);
        setProduct(data);
      } catch (error) {
        console.error("Error creating product:", error);
        const apiError = error as ApiError;
        setError(
          apiError.response?.data?.message ||
            apiError.message ||
            "An error occurred while creating the price"
        );
      } finally {
        setIsFetching(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await priceService.createPrice(formData);
      router.push(`/products/${productId}`);
    } catch (error) {
      console.error("Error creating product:", error);
      const apiError = error as ApiError;
      setError(
        apiError.response?.data?.message ||
          apiError.message ||
          "An error occurred while creating the price"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="container mx-auto py-6 text-center">
        <p>Loading product data...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The requested product could not be found.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/products")}>
              Back to Products
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add Price for {product.name}</CardTitle>
            <CardDescription>
              Define a new price unit for this product
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  placeholder="e.g. box, pack, bottle, etc."
                  required
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground">
                  Specify the unit of measure for this price (e.g., box, pack,
                  bottle)
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/products/${productId}`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Price"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
