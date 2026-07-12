import { Metadata } from "next";
import { ManuscriptSubmit } from "@/components/books/ManuscriptSubmit";

export const metadata: Metadata = {
  title: "원고 투고 - 당신의 글을 책방에 올려보세요",
  description:
    "직접 쓴 글을 한글타자왕 책방에 투고하세요. 선정되면 오리지널로 게재되어 누군가 당신의 문장을 한 자 한 자 새기게 됩니다. 저작권은 언제나 작가에게 있습니다.",
  keywords: [
    "원고 투고",
    "글 투고",
    "필사 원고 모집",
    "작가 투고",
    "한글타자왕 오리지널",
  ],
  alternates: {
    canonical: "https://www.hangul-tajawang.com/books/submit",
  },
  openGraph: {
    title: "원고 투고 - 당신의 글이 다음 책이 될 수 있어요 | 한글타자왕",
    description:
      "직접 창작한 글을 책방에 투고하세요. 선정되면 오리지널로 게재됩니다.",
    url: "https://www.hangul-tajawang.com/books/submit",
  },
};

export default function ManuscriptSubmitPage() {
  return (
    <div className="w-full py-6 md:py-10 text-on-surface">
      <div className="text-center mb-2 px-4">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight break-keep">
          ✍️ 원고 투고
        </h1>
        <p className="mt-3 text-zinc-500 font-medium break-keep">
          당신의 글이 다음 책이 될 수 있어요
        </p>
      </div>
      <ManuscriptSubmit />
    </div>
  );
}
