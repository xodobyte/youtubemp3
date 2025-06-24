import { useState, useEffect } from "react";

const isYouTubeUrl = u => /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/.test(u);

export default function Home() {
  const [url, setUrl] = useState("");
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [year] = useState(new Date().getFullYear());

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("yt_recent") || "[]");
    setRecent(saved);
  }, []);

  const addRecent = u => {
    const updated = [u, ...recent.filter(r => r !== u)].slice(0, 5);
    setRecent(updated);
    localStorage.setItem("yt_recent", JSON.stringify(updated));
  };

  const download = async () => {
    if (!isYouTubeUrl(url)) {
      setError("Please enter a valid YouTube video URL.");
      return;
    }
    setLoading(true);
    setProgress(20);
    setError("");
    setFileName("");
    addRecent(url);

    try {
      const response = await fetch("https://api-cdix.onrender.com/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        let msg = `Error ${response.status}`;
        try {
          const data = await response.json();
          msg = data?.error || msg;
        } catch {}
        throw new Error(msg);
      }

      setProgress(60);
      const blob = await response.blob();
      const dispo = response.headers.get("Content-Disposition");
      const match = dispo?.match(/filename="(.+?)"/);
      const name = match?.[1] || `download_${Date.now()}.mp3`;

      setFileName(name);
      setProgress(90);

      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      setError(err.message || "Download failed");
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-between">
      <main className="flex flex-col items-center justify-center flex-grow p-6">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-purple-300 drop-shadow-lg">
          🎵 YouTube to MP3 Converter
        </h1>
        <p className="text-gray-400 mb-8 text-center max-w-md">
          Paste a YouTube URL and download MP3 audio instantly.
        </p>

        <input
          type="text"
          list="recent-urls"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube video URL"
          className="w-full max-w-lg p-3 mb-4 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        />
        <datalist id="recent-urls">
          {recent.map((u, i) => (
            <option key={i} value={u} />
          ))}
        </datalist>

        <button
          onClick={download}
          disabled={loading || !url.trim()}
          className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-full font-medium transition-all"
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

        {error && <p className="mt-4 text-red-400 text-sm">❌ Error: {error}</p>}

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
        © {year} Ryan | Built with ❤️
      </footer>
    </div>
  );
}
