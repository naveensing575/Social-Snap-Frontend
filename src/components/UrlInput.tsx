import { useState } from "react";
import axios from "axios";
import { Download, RotateCcw } from "lucide-react";
import { ClipLoader } from "react-spinners";
import FormatSelect, { FormatOption } from "./FormatSelect";
import toast, { Toaster } from "react-hot-toast";

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
      setFormats(res.data.formats);
      setSelectedFormat(null);
    } catch {
      toast.error("Failed to fetch formats. Check the URL.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUrl("");
    setFormats([]);
    setTitle("");
    setThumbnail("");
    setSelectedFormat(null);
    toast("Reset successful!", {
      icon: "🔄",
      style: { background: "#1f2937", color: "#fff" },
    });
  };

  const getDownloadLink = () => {
    if (!selectedFormat) return "#";
    return `http://localhost:5000/api/stream?videoUrl=${encodeURIComponent(
      selectedFormat.url
    )}&title=${encodeURIComponent(title)}`;
  };

  const handleDownload = () => {
    toast("Download started!", {
      icon: "⬇️",
      style: { background: "#3b82f6", color: "#fff" },
    });

    setTimeout(() => {
      toast.success("Download completed!", {
        icon: "✅",
        style: { background: "#10b981", color: "#fff" },
      });
    }, 3000);
  };

  return (
    <div className="w-full max-w-xl p-6 bg-white shadow rounded-lg mx-auto mt-6 relative">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            borderRadius: "8px",
            padding: "12px 16px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          },
        }}
      />

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
          disabled={isLoading || !url}
        >
          {isLoading ? <ClipLoader size={20} color="#fff" /> : "Fetch Formats"}
        </button>

        {title && (
          <div className="text-center mt-6">
            <h2 className="text-lg font-semibold mb-2 text-black">{title}</h2>
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
          <FormatSelect
            formats={formats}
            selectedFormat={selectedFormat}
            onSelect={setSelectedFormat}
          />
        )}

        {selectedFormat && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <a
              href={getDownloadLink()}
              download
              onClick={handleDownload}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl w-full text-center"
            >
              <Download size={18} />
              Download Video
            </a>
            <button
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-black font-semibold rounded-xl w-full text-center transition-all duration-200"
            >
              <RotateCcw size={18} />
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlInput;
