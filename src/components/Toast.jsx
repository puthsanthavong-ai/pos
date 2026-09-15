function Toast({ text }) {
  if (!text) return null;
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#1C1F26] px-4 py-2 text-[13px] font-medium text-white shadow-lg">
      {text}
    </div>
  );
}

export default Toast;
