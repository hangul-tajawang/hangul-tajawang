// 업로드 전 클라이언트에서 이미지를 축소·WebP 재인코딩한다.
//
// 원본을 그대로 Storage에 올리면 (1) 버킷에 수 MB 파일이 쌓이고 (2) 조회될 때마다
// 그 크기 그대로 재다운로드되어 Supabase 캐시 이그레스를 크게 잡아먹는다.
// 업로드 지점이 여러 곳(마이페이지 아바타 / 관리자 표지·작가 사진)이므로
// 검증과 축소를 이 파일 한 곳에서 담당한다.

/** 재인코딩을 시도할 최대 원본 크기. 이보다 크면 업로드 자체를 거부한다. */
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

/**
 * 이미지가 아닌 파일(mp4·crdownload 등)이 버킷에 섞여 들어가는 것을 막는다.
 * 실패 시 사용자에게 그대로 보여줄 수 있는 메시지로 throw 한다.
 */
export function assertImageFile(file: File): void {
  if (!file.type.startsWith("image/")) {
    throw new Error("이미지 파일만 업로드할 수 있습니다.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("이미지는 8MB 이하만 업로드할 수 있습니다.");
  }
}

interface ResizeOptions {
  /** 결과물의 최대 가로 폭(px). square 모드에서는 한 변의 길이. */
  maxWidth: number;
  /** true면 가운데를 정사각으로 잘라낸다 (아바타용). */
  square?: boolean;
  quality?: number;
}

/**
 * 브라우저 캔버스로 축소 후 WebP로 재인코딩한다.
 * 인코딩에 실패하면 원본을 그대로 돌려주어 업로드 자체가 막히지는 않게 한다.
 */
export async function resizeToWebp(
  file: File,
  { maxWidth, square = false, quality = 0.82 }: ResizeOptions
): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    if (square) {
      // 짧은 변 기준으로 가운데를 잘라 정사각으로 맞춘다.
      const side = Math.min(bitmap.width, bitmap.height);
      const size = Math.min(maxWidth, side);
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(
        bitmap,
        (bitmap.width - side) / 2,
        (bitmap.height - side) / 2,
        side,
        side,
        0,
        0,
        size,
        size
      );
    } else {
      const scale = Math.min(1, maxWidth / bitmap.width);
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    }
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality)
    );
    if (!blob) return file;
    // 비율 유지 모드에서 재인코딩이 오히려 손해면 원본을 쓴다.
    // square 모드는 크기를 강제로 맞추는 것이 목적이므로 항상 결과물을 쓴다.
    if (!square && blob.size >= file.size) return file;

    const base = file.name.replace(/\.[^./\\]+$/, "") || "image";
    return new File([blob], `${base}.webp`, { type: "image/webp" });
  } catch {
    return file; // 실패 시 원본 그대로 업로드 (기능 저하 없이 폴백)
  }
}
