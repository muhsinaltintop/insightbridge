import Dashboard from "./components/Dasboard";
import UploadCsv from "./components/UploadCsv";


export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <header className="border-b pb-4">
          <h1 className="text-2xl font-bold tracking-tight">
            InsightBridge – Analytics Demo
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Upload → Dashboard → AI Insights
          </p>
        </header>

        <UploadCsv />
        <Dashboard />
      </div>
    </div>
  );
}
