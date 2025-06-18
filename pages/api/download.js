import { exec } from "youtube-dl-exec";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { PassThrough } from "stream";

ffmpeg.setFfmpegPath(ffmpegPath);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { url } = req.body;
  if (!url || typeof url !== "string") {
    res.status(400).json({ error: "Invalid YouTube URL" });
    return;
  }

  console.log("Processing download for:", url);

  try {
    const passthrough = new PassThrough();

    const ytdlProcess = exec(url, {
      format: "bestaudio",
      stdout: "pipe",
      output: "-",
    });

    res.setHeader("Content-Disposition", 'attachment; filename="audio.mp3"');
    res.setHeader("Content-Type", "audio/mpeg");

    ffmpeg(ytdlProcess.stdout)
      .audioBitrate(128)
      .format("mp3")
      .on("error", (ffmpegErr) => {
        console.error("FFmpeg error:", ffmpegErr);
        res.status(500).json({ error: "Failed to convert audio" });
      })
      .pipe(passthrough);

    passthrough.pipe(res);

  } catch (err) {
    console.error("Download failed:", err);
    if (!res.headersSent)
      res.status(500).json({ error: "Failed to process audio" });
  }
}
