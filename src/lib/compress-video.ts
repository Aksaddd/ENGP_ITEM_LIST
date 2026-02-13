/**
 * Client-side video compression using Canvas + MediaRecorder.
 * Re-encodes video at lower resolution & bitrate.
 * Audio is stripped since the hero video is muted.
 */

const MAX_WIDTH = 1280;
const MAX_HEIGHT = 720;
const VIDEO_BITRATE = 2_500_000; // 2.5 Mbps

interface CompressOptions {
  onProgress?: (pct: number) => void;
}

export async function compressVideo(
  file: File,
  opts?: CompressOptions
): Promise<File> {
  // Skip compression for small files (under 4MB)
  if (file.size < 4 * 1024 * 1024) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    const url = URL.createObjectURL(file);
    video.src = url;

    video.onloadedmetadata = () => {
      // Calculate target dimensions (scale down if needed)
      let { videoWidth: w, videoHeight: h } = video;
      if (w > MAX_WIDTH || h > MAX_HEIGHT) {
        const scale = Math.min(MAX_WIDTH / w, MAX_HEIGHT / h);
        w = Math.round(w * scale);
        h = Math.round(h * scale);
      }
      // Ensure even dimensions (required by some codecs)
      w = w % 2 === 0 ? w : w - 1;
      h = h % 2 === 0 ? h : h - 1;

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;

      const stream = canvas.captureStream(30); // 30 fps
      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm;codecs=vp8";

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: VIDEO_BITRATE,
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        URL.revokeObjectURL(url);
        const blob = new Blob(chunks, { type: "video/webm" });
        const compressed = new File(
          [blob],
          file.name.replace(/\.[^.]+$/, ".webm"),
          { type: "video/webm" }
        );
        resolve(compressed);
      };

      recorder.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Video compression failed"));
      };

      // Speed up playback to compress faster
      video.playbackRate = 4;
      recorder.start(100); // collect data every 100ms

      const drawFrame = () => {
        if (video.ended || video.paused) return;
        ctx.drawImage(video, 0, 0, w, h);

        if (opts?.onProgress && video.duration) {
          const pct = Math.min(
            99,
            Math.round((video.currentTime / video.duration) * 100)
          );
          opts.onProgress(pct);
        }

        requestAnimationFrame(drawFrame);
      };

      video.onplay = () => drawFrame();

      video.onended = () => {
        recorder.stop();
        opts?.onProgress?.(100);
      };

      video.play().catch((err) => {
        URL.revokeObjectURL(url);
        reject(err);
      });
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load video"));
    };
  });
}
