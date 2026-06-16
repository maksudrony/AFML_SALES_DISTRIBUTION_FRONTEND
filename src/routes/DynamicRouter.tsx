import { useLocation } from 'react-router-dom';
import { routeMap } from './routeMap';
import { HomeDashboard } from '../pages/HomePage'; // সরাসরি HomePage থেকে কন্টেন্ট ইমপোর্ট

export default function DynamicRouter() {
  const location = useLocation();
  const currentNormalizedPath = location.pathname ? location.pathname.toLowerCase() : '';

  // যদি ইউআরএল /home হয়, তবে সরাসরি HomePage-এর ভেতরের ড্যাশবোর্ড রেন্ডার হবে
  if (currentNormalizedPath === '/home') {
    return <HomeDashboard />;
  }

  // বাকি অন্য যেকোনো পাথের জন্য রেজিস্ট্রি খাতা চেক করবে
  const TargetComponent = routeMap[currentNormalizedPath];

  if (!TargetComponent) {
    return (
      <div className="bg-white p-6 rounded-xl border border-red-200 text-center font-sans m-4">
        <h3 className="text-red-500 font-bold text-sm">⚠️ Component Mapping Missing</h3>
        <p className="text-xs text-slate-400 mt-1">
          The path <code className="bg-slate-100 px-1 rounded text-blue-600 font-mono">{location.pathname || '/'}</code> exists in Database, but has not been mapped inside routeMap yet.
        </p>
      </div>
    );
  }

  return <TargetComponent />;
}