"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { productService } from "@/services/api_service";
import { ProductFormData } from "@/type/type";

export default function CreateProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    product_category: "Rokok",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      product_category: value as "Rokok" | "Obat" | "Lainnya",
    }));
  };

  interface ApiError {
    message: string;
    response?: {
      data?: {
        message?: string;
      };
    };
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await productService.createProduct(formData);
      router.push("/products");
    } catch (error) {
      console.error("Error creating product:", error);
      const apiError = error as ApiError;
      setError(
        apiError.response?.data?.message ||
          apiError.message ||
          "An error occurred while creating the product"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create New Product</CardTitle>
            <CardDescription>
              Add a new product to your inventory
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
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                  maxLength={150}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="product_category">Category</Label>
                <Select
                  value={formData.product_category}
                  onValueChange={handleCategoryChange}
                  required
                >
                  <SelectTrigger id="product_category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rokok">Rokok</SelectItem>
                    <SelectItem value="Obat">Obat</SelectItem>
                    <SelectItem value="Lainnya">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  required
                  maxLength={255}
                  rows={4}
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/products")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Product"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
