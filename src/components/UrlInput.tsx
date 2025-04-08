import { useState } from "react";
import axios from "axios";
import { Download } from "lucide-react";
import { ClipLoader } from "react-spinners";

interface FormatOption {
  format_id: string;
  ext: string;
  resolution: string;
  isAudio: boolean;
  isVideo: boolean;
  url: string;
}

const UrlInput = () => {
  const [url, setUrl] = useState("");
  const [formats, setFormats] = useState<FormatOption[]>([]);
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<FormatOption | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchFormats = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/formats", {
        url,
      });
      setTitle(res.data.title);
      setThumbnail(res.data.thumbnail);
      setFormats(
        res.data.formats.filter(
          (f: FormatOption) => f.isVideo && f.ext === "mp4"
        )
      );
      setSelectedFormat(null);
    } catch {
      alert("Failed to fetch formats. Check the URL.");
    } finally {
      setIsLoading(false);
    }
  };

  const getDownloadLink = () => {
    if (!selectedFormat) return "#";
    return `http://localhost:5000/api/stream?videoUrl=${encodeURIComponent(
      selectedFormat.url
    )}&title=${encodeURIComponent(title)}`;
  };

  return (
    <div className="w-full max-w-xl p-6 bg-white shadow rounded-lg mx-auto mt-6">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Paste YouTube URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleFetchFormats}
          className="w-full flex justify-center items-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded disabled:opacity-50"
          disabled={isLoading ?? !url}
        >
          {isLoading ? <ClipLoader size={20} color="#fff" /> : "Fetch Formats"}
        </button>

        {title && (
          <div className="text-center mt-6">
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            {thumbnail && (
              <img
                src={thumbnail}
                alt="thumbnail"
                className="w-full max-w-md mx-auto rounded"
              />
            )}
          </div>
        )}

        {formats.length > 0 && (
          <div className="mt-4">
            <label className="block mb-1 text-sm font-medium">
              Choose Format:
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const id = e.target.value;
                const selected =
                  formats.find((f) => f.format_id === id) ?? null;
                setSelectedFormat(selected);
              }}
              value={selectedFormat?.format_id ?? ""}
            >
              <option value="" disabled>
                Select quality
              </option>
              {formats.map((f) => (
                <option key={f.format_id} value={f.format_id}>
                  {f.resolution} ({f.ext})
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedFormat && (
          <a
            href={getDownloadLink()}
            download
            className="inline-flex items-center justify-center gap-2 mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl w-full text-center"
          >
            <Download size={18} />
            Download Video
          </a>
        )}
      </div>
    </div>
  );
};

export default UrlInput;
