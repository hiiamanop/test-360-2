"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Product } from "@/type/type";
import { productService } from "@/services/api_service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const params: {
        name?: string;
        product_category?: string;
        tier?: string;
      } = {};

      if (searchTerm) params.name = searchTerm;
      // Perbaikan disini - gunakan categoryFilter hanya jika bukan "all"
      if (categoryFilter && categoryFilter !== "all")
        params.product_category = categoryFilter;
      if (tierFilter && tierFilter !== "all") params.tier = tierFilter;

      const data = await productService.searchProducts(params);
      setProducts(data);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      setIsLoading(true);
      try {
        await productService.deleteProduct(productToDelete);
        await fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      } finally {
        setIsLoading(false);
        setDeleteDialogOpen(false);
        setProductToDelete(null);
      }
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setTierFilter("all");
    fetchProducts();
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Products Management</h1>

      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full md:w-64">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Category Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Rokok">Rokok</SelectItem>
              <SelectItem value="Obat">Obat</SelectItem>
              <SelectItem value="Lainnya">Lainnya</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-64">
          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tier Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="Non Member">Non Member</SelectItem>
              <SelectItem value="Basic">Basic</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </Button>

        <Button variant="outline" onClick={resetFilters}>
          Reset
        </Button>
      </div>

      <div className="flex justify-end mb-4">
        <Link href="/products/create">
          <Button>Create Product</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <p>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-muted p-4 rounded-md text-center">
          <p>
            No products found. Try adjusting your search or create a new
            product.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Prices</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.product_category}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {product.description}
                  </TableCell>
                  <TableCell>
                    {product.prices && product.prices.length > 0 ? (
                      <div className="space-y-2">
                        {product.prices.map((price) => (
                          <div key={price.id} className="text-sm">
                            <div className="font-medium">
                              Unit: {price.unit}
                            </div>
                            <div className="pl-2">
                              {price.price_details &&
                              price.price_details.length > 0 ? (
                                <ul className="list-disc list-inside">
                                  {price.price_details.map((detail) => (
                                    <li key={detail.id}>
                                      {detail.tier}:{" "}
                                      {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        minimumFractionDigits: 0,
                                      }).format(detail.price)}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-muted-foreground">
                                  No price details
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No prices</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Link
                            href={`/products/${product.id}`}
                            className="w-full"
                          >
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link
                            href={`/products/edit/${product.id}`}
                            className="w-full"
                          >
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(product.id)}
                          className="text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link
                            href={`/products/${product.id}/prices/create`}
                            className="w-full"
                          >
                            Add Price
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this product?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product and all associated prices and price details.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
