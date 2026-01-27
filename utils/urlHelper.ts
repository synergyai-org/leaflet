
export const getDirectImageUrl = (input: string): string => {
  if (!input) return "";

  // 1. 입력값 정화 (따옴표 및 앞뒤 공백 제거)
  let cleanInput = input.replace(/['"]/g, '').trim();

  // 2. 구글 드라이브 링크 패턴 감지 및 변환
  // 패턴 A: https://drive.google.com/file/d/FILE_ID/view...
  // 패턴 B: https://drive.google.com/uc?id=FILE_ID...
  // 패턴 C: https://drive.google.com/open?id=FILE_ID...
  const driveRegex = /(?:https?:\/\/)?(?:drive\.google\.com\/(?:file\/d\/|uc\?id=|open\?id=))([a-zA-Z0-9_-]{25,})/;
  const match = cleanInput.match(driveRegex);

  if (match && match[1]) {
    const fileId = match[1];
    // 고성능 lh3 이미지 엔진 주소로 변환
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  // 3. 구글 드라이브 링크가 아니면 입력된 URL 그대로 반환 (일반 호스팅 서버 지원)
  return cleanInput;
};
