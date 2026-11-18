export default function SchoolLoading({ label = 'Loading school information…' }: { label?: string }) {
  return <div className="grid min-h-dvh place-items-center bg-[#FDFBF7] p-8" role="status" aria-live="polite"><div className="relative grid h-28 w-28 place-items-center"><div className="absolute inset-0 rounded-full border-2 border-[#A5D1DC] border-t-[#308599] motion-safe:animate-spin" /><img src="/logo.png" alt="Sainthia Shishu Tirtha" className="h-16 w-16 rounded-full object-contain" /></div><span className="sr-only">{label}</span></div>;
}
