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
import {
  productService,
  priceService,
  priceDetailService,
} from "@/services/api_service";
import {
  ProductFormData,
  PriceFormData,
  PriceDetailFormData,
} from "@/type/type";
import { Separator } from "@/components/ui/separator";
import { X, PlusCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CreateProductPage() {
  const router = useRouter();
  const [productFormData, setProductFormData] = useState<ProductFormData>({
    name: "",
    product_category: "Rokok",
    description: "",
  });

  // State for price and price details
  const [priceFormData, setPriceFormData] = useState<{
    unit: string;
    priceDetails: Array<{
      tier: "Non Member" | "Basic" | "Premium";
      price: string;
    }>;
  }>({
    unit: "",
    priceDetails: [{ tier: "Non Member", price: "" }],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleProductChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProductFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setProductFormData((prev) => ({
      ...prev,
      product_category: value as "Rokok" | "Obat" | "Lainnya",
    }));
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceFormData((prev) => ({
      ...prev,
      unit: e.target.value,
    }));
  };

  const handlePriceDetailChange = (
    index: number,
    field: "tier" | "price",
    value: string
  ) => {
    setPriceFormData((prev) => {
      const updatedPriceDetails = [...prev.priceDetails];
      updatedPriceDetails[index] = {
        ...updatedPriceDetails[index],
        [field]: value,
      };
      return {
        ...prev,
        priceDetails: updatedPriceDetails,
      };
    });
  };

  const addPriceDetail = () => {
    // Check if we already have all three tiers
    const existingTiers = priceFormData.priceDetails.map(
      (detail) => detail.tier
    );
    const availableTiers = ["Non Member", "Basic", "Premium"].filter(
      (tier) =>
        !existingTiers.includes(tier as "Non Member" | "Basic" | "Premium")
    );

    if (availableTiers.length === 0) {
      setError("All price tiers have already been added.");
      return;
    }

    setPriceFormData((prev) => ({
      ...prev,
      priceDetails: [
        ...prev.priceDetails,
        {
          tier: availableTiers[0] as "Non Member" | "Basic" | "Premium",
          price: "",
        },
      ],
    }));
    setError("");
  };

  const removePriceDetail = (index: number) => {
    if (priceFormData.priceDetails.length === 1) {
      setError("At least one price detail is required.");
      return;
    }

    setPriceFormData((prev) => ({
      ...prev,
      priceDetails: prev.priceDetails.filter((_, i) => i !== index),
    }));
    setError("");
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

    // Validate price details
    if (priceFormData.unit.trim() === "") {
      setError("Price unit is required");
      setIsLoading(false);
      return;
    }

    for (const detail of priceFormData.priceDetails) {
      if (
        !detail.price ||
        isNaN(Number(detail.price)) ||
        Number(detail.price) <= 0
      ) {
        setError("All price values must be valid numbers greater than 0");
        setIsLoading(false);
        return;
      }
    }

    try {
      // 1. Create the product first
      const createdProduct = await productService.createProduct(
        productFormData
      );

      // 2. Create the price with the returned product ID
      const priceData: PriceFormData = {
        product_id: createdProduct.id,
        unit: priceFormData.unit,
      };

      const createdPrice = await priceService.createPrice(priceData);

      // 3. Create each price detail
      const createPriceDetailPromises = priceFormData.priceDetails.map(
        (detail) => {
          const priceDetailData: PriceDetailFormData = {
            price_id: createdPrice.id,
            tier: detail.tier,
            price: parseInt(detail.price),
          };
          return priceDetailService.createPriceDetail(priceDetailData);
        }
      );

      await Promise.all(createPriceDetailPromises);

      // Navigate to products page after successful creation
      router.push("/products");
    } catch (error) {
      console.error("Error creating product with prices:", error);
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
              Add a new product with pricing information
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Product Information Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Product Information
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={productFormData.name}
                      onChange={handleProductChange}
                      placeholder="Enter product name"
                      required
                      maxLength={150}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product_category">Category</Label>
                    <Select
                      value={productFormData.product_category}
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
                      value={productFormData.description}
                      onChange={handleProductChange}
                      placeholder="Enter product description"
                      required
                      maxLength={255}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Price Information Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">Price Information</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      name="unit"
                      value={priceFormData.unit}
                      onChange={handleUnitChange}
                      placeholder="e.g., box, pack, bottle"
                      required
                      maxLength={100}
                    />
                    <p className="text-sm text-muted-foreground">
                      Specify the unit of measure for this price
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Price Tiers</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addPriceDetail}
                        className="flex items-center gap-1"
                      >
                        <PlusCircle className="h-4 w-4" />
                        Add Tier
                      </Button>
                    </div>

                    {priceFormData.priceDetails.map((detail, index) => (
                      <div
                        key={index}
                        className="flex items-end gap-3 p-3 border rounded-md"
                      >
                        <div className="flex-1 space-y-2">
                          <Label htmlFor={`tier-${index}`}>Tier</Label>
                          <Select
                            value={detail.tier}
                            onValueChange={(value) =>
                              handlePriceDetailChange(index, "tier", value)
                            }
                            required
                          >
                            <SelectTrigger id={`tier-${index}`}>
                              <SelectValue placeholder="Select tier" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Non Member">
                                Non Member
                              </SelectItem>
                              <SelectItem value="Basic">Basic</SelectItem>
                              <SelectItem value="Premium">Premium</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex-1 space-y-2">
                          <Label htmlFor={`price-${index}`}>Price (IDR)</Label>
                          <Input
                            id={`price-${index}`}
                            type="number"
                            value={detail.price}
                            onChange={(e) =>
                              handlePriceDetailChange(
                                index,
                                "price",
                                e.target.value
                              )
                            }
                            placeholder="Enter price"
                            min="1"
                            required
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePriceDetail(index)}
                          className="text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
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
                {isLoading ? "Creating..." : "Create Product with Pricing"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
