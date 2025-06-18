import { exec } from "youtube-dl-exec";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { PassThrough } from "stream";

ffmpeg.setFfmpegPath(ffmpegPath);

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "Invalid YouTube URL" });

  console.log("Processing download for:", url);

  try {
    // Get direct audio stream URL using youtube-dl-exec
    const process = exec(url, {
      format: "bestaudio",
      output: "-",
      audioFormat: "mp3",
    });

    res.setHeader("Content-Disposition", 'attachment; filename="output.mp3"');
    res.setHeader("Content-Type", "audio/mpeg");

    const passthrough = new PassThrough();

    console.log("Streaming audio to client...");
    ffmpeg(process.stdout).audioBitrate(128).format("mp3").pipe(passthrough);

    passthrough.pipe(res);
  } catch (err) {
    console.error("Download failed:", err);
    res.status(500).json({ error: "Failed to process audio" });
  }
}
