import { ProductForm } from "@/components/admin/product-form";

export const metadata = {
  title: "New Product | Admin | Bunny At Home",
};

export default function NewProductPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
        <p className="text-gray-600 mt-1">
          Add a new product to your catalog with AI-powered content generation
        </p>
      </div>

      <ProductForm />
    </div>
  );
}

