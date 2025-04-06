import { useState } from "react";
import axios from "axios";
import { Loader2, Download } from "lucide-react";

const UrlInput = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [video, setVideo] = useState<{
    title: string;
    thumbnail: string;
    downloadUrl: string;
  } | null>(null);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    setVideo(null);

    try {
      const response = await axios.post("http://localhost:5000/api/download", {
        url,
      });
      setVideo(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg p-6 rounded-2xl shadow-xl bg-white dark:bg-zinc-800">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Paste URL to Download
      </h2>
      <input
        type="text"
        placeholder="Enter YouTube or Social Media URL..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-xl mb-4 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSubmit}
        disabled={loading || !url.trim()}
        className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <Download size={20} />
        )}
        {loading ? "Fetching..." : "Get Download Link"}
      </button>

      {error && (
        <div className="mt-4 text-red-500 text-sm text-center">{error}</div>
      )}

      {video && (
        <div className="mt-6 text-center">
          <h3 className="font-medium text-lg mb-2">{video.title}</h3>
          <img
            src={video.thumbnail}
            alt="thumbnail"
            className="w-full max-w-xs mx-auto rounded-xl shadow"
          />
          <a
            href={`http://localhost:5000${video.downloadUrl}`}
            download
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl"
          >
            <Download size={18} /> Download Video
          </a>
        </div>
      )}
    </div>
  );
};

export default UrlInput;
