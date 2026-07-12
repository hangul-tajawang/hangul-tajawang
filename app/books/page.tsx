import { Metadata } from "next";
import { BookStore } from "@/components/books/BookStore";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "책방 - 오리지널 장편 연재소설 필사",
  description:
    "한글타자왕 오리지널 장편 연재소설을 모은 책방입니다. 하루 한 화씩, 며칠에 걸쳐 완필하는 오리지널 장편을 표지로 만나 미리 읽어보고, 마음에 드는 작품을 키보드로 한 자 한 자 새겨보세요.",
  keywords: [
    "오리지널 연재소설",
    "장편 필사",
    "온라인 필사 책방",
    "필사하기 좋은 소설",
    "연재소설 필사",
    "감성 필사",
  ],
  alternates: {
    canonical: "https://www.hangul-tajawang.com/books",
  },
  openGraph: {
    title: "책방 - 오리지널 장편 연재소설 필사 | 한글타자왕",
    description:
      "한글타자왕에서만 읽고 새길 수 있는 오리지널 장편 연재소설. 표지를 눌러 미리 읽어보고, 1화부터 완필해 보세요.",
    url: "https://www.hangul-tajawang.com/books",
    images: [
      {
        url: "https://www.hangul-tajawang.com/ogimage.png",
        width: 1200,
        height: 630,
        alt: "한글타자왕 책방",
      },
    ],
  },
};

export default function BooksPage() {
  return (
    <div className="w-full py-6 md:py-10 text-on-surface">
      <div className="text-center mb-4 md:mb-8 px-4">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center justify-center gap-2"><BookOpen className="text-primary" /> 책방</h1>
        <p className="mt-3 text-zinc-500 font-medium break-keep">
          표지를 눌러 미리 읽어보고, 마음에 들면 새기세요
        </p>
      </div>
      <BookStore />
    </div>
  );
}
