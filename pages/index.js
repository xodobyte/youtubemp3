import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

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
        // --- Start of the fix ---
        // Try to parse the error as JSON, but have a fallback.
        let errorMessage = `Request failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || "Something went wrong";
        } catch (e) {
          // The response was not JSON. You can use the status text as a fallback.
          console.error("Could not parse error response as JSON:", e);
          errorMessage = response.statusText || "An unknown error occurred";
        }
        throw new Error(errorMessage);
        // --- End of the fix ---
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
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-300">YouTube to MP3</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste YouTube URL"
        className="w-full max-w-md p-3 rounded-lg text-white bg-gray-800 mb-4"
      />

      <button
        onClick={download}
        disabled={loading}
        className="bg-gray-500 hover:bg-gray-400 text-white px-6 py-2 rounded-xl">
        {loading ? "Downloading..." : "Convert & Download"}
      </button>

      {loading && (
        <div className="w-full max-w-md mt-4">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-400 transition-all duration-300 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {fileName && !error && (
        <p className="mt-4 text-sm text-green-400">Downloaded: {fileName}</p>
      )}

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
