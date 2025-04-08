// components/FormatSelect.tsx
import React from "react";

export interface FormatOption {
  format_id: string;
  ext: string;
  resolution: string;
  isAudio: boolean;
  isVideo: boolean;
  url: string;
}

interface FormatSelectProps {
  formats: FormatOption[];
  selectedFormat: FormatOption | null;
  onSelect: (format: FormatOption | null) => void;
}

const FormatSelect: React.FC<FormatSelectProps> = ({
  formats,
  selectedFormat,
  onSelect,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const found = formats.find((f) => f.format_id === selectedId) ?? null;
    onSelect(found);
  };

  const audioOptions = formats.filter((f) => f.isAudio);
  const videoOptions = formats.filter((f) => f.isVideo);

  return (
    <div className="mt-4">
      <label className="block mb-1 text-sm font-medium">Choose Format:</label>
      <select
        className="w-full p-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleChange}
        value={selectedFormat?.format_id ?? ""}
      >
        <option value="" disabled>
          Select quality
        </option>
        {videoOptions.length > 0 && (
          <optgroup label="Video Formats">
            {videoOptions.map((f) => (
              <option key={f.format_id} value={f.format_id}>
                🎥 {f.resolution} ({f.ext})
              </option>
            ))}
          </optgroup>
        )}
        {audioOptions.length > 0 && (
          <optgroup label="Audio Formats">
            {audioOptions.map((f) => (
              <option key={f.format_id} value={f.format_id}>
                🎵 Audio ({f.ext})
              </option>
            ))}
          </optgroup>
        )}
      </select>
    </div>
  );
};

export default FormatSelect;
