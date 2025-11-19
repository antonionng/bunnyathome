import { AIBoxSuggestions } from "@/components/admin/ai-box-suggestions";

export const metadata = {
  title: "Generate Box with AI | Admin | Bunny At Home",
};

export default async function GenerateBoxPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">✨ AI Box Generator</h1>
        <p className="text-gray-600 mt-1">
          Let AI create themed box combinations based on seasonality, occasions, and available products
        </p>
      </div>

      <AIBoxSuggestions />
    </div>
  );
}

