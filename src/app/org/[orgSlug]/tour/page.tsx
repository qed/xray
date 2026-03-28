import TourWalkthrough from '@/components/TourWalkthrough';

export default function TourPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">X-Ray Tour</h1>
        <p className="text-slate-500 mt-1">A guided walkthrough of everything X-Ray can do</p>
      </div>
      <TourWalkthrough />
    </div>
  );
}
