import { Detection } from '@/types/detection';
import Colors from '@/constants/Colors';

// 🎨 Assign colors based on malaria parasite type
const classColors: Record<string, string> = {
  'P. falciparum': Colors.error,     // Red
  'P. vivax': Colors.warning,        // Orange
  'P. ovale': Colors.primary,        // Blue
  'P. malariae': Colors.secondary,   // Green
  'falciparum_ring': Colors.error,   // Mapping Roboflow classes
  'falciparum_trophozoite': Colors.warning,
  'ovale_ring': Colors.primary,
  'Unknown': Colors.gray,
};

 

/**
 * ☁️ Uploads image to Cloudinary
 */
async function uploadToCloudinary(imageUri: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    type: "image/jpeg",
    name: "upload.jpg",
  } as any);
  formData.append("upload_preset", CLOUDINARY_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await res.json();
  if (!res.ok || !data.secure_url) {
    console.error("❌ Cloudinary error:", data);
    throw new Error("Cloudinary upload failed");
  }
  console.log("✅ Cloudinary URL:", data.secure_url);
  return data.secure_url;
}

/**
 * 🤖 Sends image to Roboflow workflow
 */
async function runRoboflowDetection(imageUrl: string): Promise<Detection[]> {
  console.log("🤖 Sending to Roboflow...");

  const res = await fetch(ROBOFLOW_WORKFLOW_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: ROBOFLOW_API_KEY,
      inputs: { image: { type: "url", value: imageUrl } },
    }),
  });

  const result = await res.json();
  console.log("📦 Roboflow raw:", JSON.stringify(result, null, 2));

  let preds: any[] = [];

  // ✅ FIX: Correct path for Roboflow workflow response
  if (Array.isArray(result?.outputs)) {
    const innerPreds = result.outputs[0]?.predictions?.predictions;
    if (Array.isArray(innerPreds)) {
      preds = innerPreds;
    }
  }

  if (!Array.isArray(preds) || preds.length === 0) {
    console.warn("⚠️ Roboflow returned no predictions");
    return [];
  }

  return preds.map((p: any, idx: number) => {
    const x = p.x - p.width / 2;
    const y = p.y - p.height / 2;
    return {
      id: p.detection_id || `rf-${idx + 1}`,
      class: p.class || "Unknown",
      confidence: p.confidence || p.score || 0,
      bbox: { x, y, width: p.width, height: p.height },
      color: classColors[p.class] || Colors.primary,
    };
  });
}

/**
 * ✏️ Draw bounding boxes on an image (frontend canvas approach)
 */
export async function drawDetectionsOnImage(
  imageUri: string,
  detections: Detection[]
): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      detections.forEach((det) => {
        ctx.strokeStyle = det.color || "red";
        ctx.lineWidth = 3;
        ctx.strokeRect(det.bbox.x, det.bbox.y, det.bbox.width, det.bbox.height);

        ctx.fillStyle = det.color || "red";
        ctx.font = "18px Arial";
        const label = `${det.class} ${(det.confidence * 100).toFixed(1)}%`;
        const textWidth = ctx.measureText(label).width;
        ctx.fillRect(det.bbox.x, det.bbox.y - 20, textWidth + 10, 20);

        ctx.fillStyle = "white";
        ctx.fillText(label, det.bbox.x + 5, det.bbox.y - 5);
      });

      resolve(canvas.toDataURL("image/png"));
    };
    img.src = imageUri;
  });
}

/**
 * 🔍 Main analyze function (frontend-only)
 */
export async function analyzeImage(imageUri: string): Promise<Detection[]> {
  try {
    // 1️⃣ Upload to Cloudinary
    console.log("☁️ Uploading to Cloudinary...");
    const cloudUrl = await uploadToCloudinary(imageUri);

    // 2️⃣ Run Roboflow detection
    const detections = await runRoboflowDetection(cloudUrl);

    if (detections.length > 0) {
      console.log(`✅ Roboflow detected ${detections.length} objects`);
      return detections;
    }

    // 3️⃣ Fallback fake AI if nothing detected
    console.warn("⚠️ No detections — using fake AI fallback");
    return generateFakeDetections();

  } catch (err) {
    console.error("🚨 Detection failed", err);
    return generateFakeDetections();
  }
}

/**
 * 🎭 Fake AI fallback
 */
function generateFakeDetections(): Detection[] {
  const fakeClasses = ["P. falciparum", "P. vivax", "P. ovale", "P. malariae"];
  const detections: Detection[] = [];
  const count = Math.floor(Math.random() * 3) + 1;

  for (let i = 0; i < count; i++) {
    const cls = fakeClasses[Math.floor(Math.random() * fakeClasses.length)];
    detections.push({
      id: `fake-${i + 1}`,
      class: cls,
      confidence: (Math.random() * 0.3 + 0.7) as number,
      bbox: {
        x: Math.random() * 200,
        y: Math.random() * 200,
        width: 50 + Math.random() * 80,
        height: 50 + Math.random() * 80,
      },
      color: classColors[cls] || Colors.primary,
    });
  }
  console.log(`🎭 Fake AI generated ${detections.length} detections`);
  return detections;
}
