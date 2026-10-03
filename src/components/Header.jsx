import React from 'react';

export default function Header({ remainingCount = 0 }) {
  // Format current date: e.g., "Saturday, Oct 3"
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#27272A] gap-4">
      {/* Left: Branding */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FAFAFA]">
          FocusList
        </h1>
        <p className="text-sm text-[#A1A1AA] mt-0.5">
          Get things done.
        </p>
      </div>

      {/* Right: Date & Counter Badge */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between text-xs sm:text-sm">
        <span className="text-[#A1A1AA] font-medium">{formattedDate}</span>
        <span className="font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20 sm:mt-1.5">
          {remainingCount} {remainingCount === 1 ? 'task' : 'tasks'} remaining
        </span>
      </div>
    </header>
  );
}