import { Metadata } from 'next';
import { MyLibrary } from '@/components/library/MyLibrary';
import { Library } from 'lucide-react';

export const metadata: Metadata = {
  title: '내 서재 - 키보드로 새긴 나의 필사집',
  description: '필사를 완주한 작품들이 책이 되어 쌓이는 나만의 서재입니다. 새긴 문장을 카드로 간직하고, 필사 중인 작품을 이어서 새겨보세요.',
  // 개인화 페이지 — 크롤러에게는 빈 페이지라 색인 제외
  robots: { index: false, follow: true },
};

export default function LibraryPage() {
  return (
    <div className="w-full py-6 md:py-10 text-on-surface">
      <div className="text-center mb-4 md:mb-8 px-4">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center justify-center gap-2"><Library className="text-primary" /> 내 서재</h1>
        <p className="mt-3 text-zinc-500 font-medium">키보드로 새긴 문장들이 책이 되어 쌓입니다</p>
      </div>
      <MyLibrary />
    </div>
  );
}
