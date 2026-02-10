import React, { useState, useEffect, useRef } from 'react';

interface WheelPickerProps {
  options: { value: any; label: string }[];
  value: any;
  onChange: (value: any) => void;
  height?: number;
}

const WheelPicker: React.FC<WheelPickerProps> = ({
  options,
  value,
  onChange,
  height = 200,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(
    options.findIndex((opt) => opt.value === value) || 0
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const itemHeight = 40;

  useEffect(() => {
    const index = options.findIndex((opt) => opt.value === value);
    if (index !== -1) {
      setSelectedIndex(index);
    }
  }, [value, options]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    const clampedIndex = Math.max(0, Math.min(index, options.length - 1));

    setSelectedIndex(clampedIndex);
    onChange(options[clampedIndex].value);

    // Snap to position
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = clampedIndex * itemHeight;
      }
    }, 100);
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = selectedIndex * itemHeight;
    }
  }, []);

  return (
    <div className="relative">
      <div
        className="overflow-y-scroll scrollbar-hide"
        style={{ height: `${height}px` }}
        onScroll={handleScroll}
        ref={containerRef}
      >
        <div style={{ height: `${height / 2 - itemHeight / 2}px` }} />
        {options.map((option, index) => (
          <div
            key={index}
            className={`flex items-center justify-center transition-all duration-200 ${
              index === selectedIndex
                ? 'text-gray-900 font-semibold text-lg'
                : 'text-gray-400 text-sm'
            }`}
            style={{ height: `${itemHeight}px` }}
          >
            {option.label}
          </div>
        ))}
        <div style={{ height: `${height / 2 - itemHeight / 2}px` }} />
      </div>

      {/* Selection indicator */}
      <div
        className="absolute left-0 right-0 border-t-2 border-b-2 border-blue-500 pointer-events-none"
        style={{
          top: `${height / 2 - itemHeight / 2}px`,
          height: `${itemHeight}px`,
        }}
      />
    </div>
  );
};

export default WheelPicker;
