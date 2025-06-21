import { useState, useEffect } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());

  const download = async () => {
    setLoading(true);
    setProgress(0);
    setError("");
    setFileName("");

    try {
      const response = await fetch("https://api-cdix.onrender.com/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || "Something went wrong";
        } catch (e) {
          errorMessage = response.statusText || "An unknown error occurred";
        }
        throw new Error(errorMessage);
      }

      const disposition = response.headers.get("Content-Disposition");
      const nameMatch = disposition?.match(/filename="(.+?)"/);
      const name = nameMatch ? nameMatch[1] : "download.mp3";
      setFileName(name);

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col justify-between">
      <main className="flex flex-col items-center justify-center flex-grow p-6">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-purple-400 drop-shadow-lg">
          🎵 YouTube to MP3 Converter
        </h1>
        <p className="text-gray-400 mb-8 text-center max-w-md">
          Paste a YouTube URL and download high-quality MP3 audio instantly.
        </p>

        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube video URL"
          className="w-full max-w-lg p-3 mb-4 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
        />

        <button
          onClick={download}
          disabled={loading || !url}
          className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-full font-medium transition-all"
        >
          {loading ? "Converting..." : "Convert & Download"}
        </button>

        {loading && (
          <div className="w-full max-w-lg mt-6">
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {fileName && !error && (
          <p className="mt-4 text-green-400 text-sm">✅ Downloaded: {fileName}</p>
        )}

        {error && (
          <p className="mt-4 text-red-400 text-sm">❌ Error: {error}</p>
        )}

        <a
          href="https://paypal.me/realxryan"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-block bg-gray-800 hover:bg-gray-700 text-white px-5 py-3 rounded-lg transition-all"
        >
          💖 Donate via PayPal
        </a>
      </main>

      <footer className="text-center py-6 text-sm text-gray-500 border-t border-gray-800">
        © {year} RealRyan | Built with ❤️
      </footer>
    </div>
  );
}
