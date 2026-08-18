export interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: "image/webp" | "image/jpeg";
}

const DEFAULT_OPTIONS: Required<CompressImageOptions> = {
  maxWidth: 1600,
  maxHeight: 1600,
  quality: 0.8,
  mimeType: "image/webp",
};

export async function compressImage(
  file: File,
  options: CompressImageOptions = {},
): Promise<File> {
  const config = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  if (!file.type.startsWith("image/")) {
    throw new Error("請選擇圖片檔案");
  }

  const imageBitmap = await createImageBitmap(file);

  const ratio = Math.min(
    config.maxWidth / imageBitmap.width,
    config.maxHeight / imageBitmap.height,
    1,
  );

  const width = Math.round(
    imageBitmap.width * ratio,
  );

  const height = Math.round(
    imageBitmap.height * ratio,
  );

  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    imageBitmap.close();
    throw new Error("無法建立圖片處理器");
  }

  context.drawImage(
    imageBitmap,
    0,
    0,
    width,
    height,
  );

  imageBitmap.close();

  const blob = await new Promise<Blob>(
    (resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (!result) {
            reject(
              new Error("圖片壓縮失敗"),
            );
            return;
          }

          resolve(result);
        },
        config.mimeType,
        config.quality,
      );
    },
  );

  const extension =
    config.mimeType === "image/webp"
      ? "webp"
      : "jpg";

  const originalName =
    file.name.replace(
      /\.[^/.]+$/,
      "",
    );

  return new File(
    [blob],
    `${originalName}.${extension}`,
    {
      type: config.mimeType,
      lastModified: Date.now(),
    },
  );
}

export function fileToDataUrl(
  file: File,
): Promise<string> {
  return new Promise(
    (resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (
          typeof reader.result !==
          "string"
        ) {
          reject(
            new Error(
              "圖片讀取失敗",
            ),
          );
          return;
        }

        resolve(reader.result);
      };

      reader.onerror = () => {
        reject(
          new Error(
            "圖片讀取失敗",
          ),
        );
      };

      reader.readAsDataURL(file);
    },
  );
}

export function formatFileSize(
  bytes: number,
): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    1024 /
    1024
  ).toFixed(2)} MB`;
}