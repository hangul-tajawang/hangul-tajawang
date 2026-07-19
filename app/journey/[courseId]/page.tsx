import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, BookOpen, Lightbulb } from 'lucide-react';
import { JOURNEY_COURSES, getJourneyCourse, getCourseStations } from '@/lib/journey-data';
import { JourneyPlay } from '@/components/journey/JourneyPlay';

type Props = {
  params: Promise<{ courseId: string }>;
};

// 코스는 전부 정적 데이터 — 빌드 시점에 모두 생성
export const dynamicParams = false;

export function generateStaticParams() {
  return JOURNEY_COURSES.map((course) => ({ courseId: course.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseId } = await params;
  const course = getJourneyCourse(courseId);
  if (!course) return {};
  const stations = getCourseStations(course);

  return {
    title: `${course.title} 순서 외우기 - ${course.subtitle} 타자 게임`,
    description: `${course.description} ${stations.length}개 항목을 타자로 완주하며 순서를 외워보세요.`,
    keywords: [...course.keywords, '한글 타자 연습', '한글타자왕'],
    alternates: {
      canonical: `https://www.hangul-tajawang.com/journey/${course.id}`,
    },
    openGraph: {
      title: `${course.title} 순서 외우기 | 한글타자왕 지식타자`,
      description: `${course.subtitle} — 한 항목씩 타자로 정복하며 외우기`,
      url: `https://www.hangul-tajawang.com/journey/${course.id}`,
    },
  };
}

export default async function JourneyCoursePage({ params }: Props) {
  const { courseId } = await params;
  const course = getJourneyCourse(courseId);
  if (!course) notFound();
  const stations = getCourseStations(course);

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4">
      <h1 className="sr-only">
        {course.title} 순서 외우기 - {course.subtitle} 한글 타자 암기 게임
      </h1>

      <Link
        prefetch={false}
        href="/journey"
        className="inline-flex items-center gap-1 text-xs font-black text-secondary/70 hover:text-on-surface transition-colors mb-4"
      >
        <ChevronLeft size={14} /> 지식타자
      </Link>

      {/* 플레이 본체 */}
      <JourneyPlay course={course} />

      {/* SEO 보너스: 전체 역 목록 표 — 검색 랜딩과 복습용 */}
      <div className="mt-20 border-t border-outline-variant pt-16 pb-20">
        <section className="mb-16">
          <div className="flex items-center gap-3 text-primary mb-6">
            <BookOpen size={26} />
            <h2 className="text-2xl font-black">{course.title} 한눈에 보기</h2>
          </div>
          <p className="text-sm text-secondary leading-relaxed font-medium mb-8 max-w-2xl">
            시작하기 전이나 완주한 뒤 복습할 때 참고하세요. 표의 순서가 그대로
            코스의 진행 순서입니다{course.groups ? ` (${course.groups.map((g) => g.label).join(' · ')})` : ''}.
          </p>
          <div className="overflow-x-auto rounded-2xl bg-surface-lowest shadow-[0_20px_40px_rgba(21,28,39,0.06)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-low text-left">
                  <th className="px-4 py-3 font-black text-secondary/70 text-xs w-12">순서</th>
                  <th className="px-4 py-3 font-black text-secondary/70 text-xs">이름</th>
                  <th className="px-4 py-3 font-black text-secondary/70 text-xs hidden sm:table-cell">시기</th>
                  <th className="px-4 py-3 font-black text-secondary/70 text-xs">핵심 지식</th>
                </tr>
              </thead>
              <tbody>
                {stations.map((station, i) => (
                  <tr key={station.id} className="border-t border-outline-variant">
                    <td className="px-4 py-3 font-black text-secondary/60 tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3 font-black text-on-surface whitespace-nowrap">
                      {station.name}
                    </td>
                    <td className="px-4 py-3 text-secondary whitespace-nowrap hidden sm:table-cell">
                      {station.year || '-'}
                    </td>
                    <td className="px-4 py-3 text-secondary">
                      {station.fact}
                      {station.detail && (
                        <span className="block text-xs text-secondary/60 mt-0.5">{station.detail}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="max-w-2xl">
          <div className="flex items-center gap-3 text-tertiary mb-6">
            <Lightbulb size={26} />
            <h2 className="text-2xl font-black">이렇게 외우면 더 잘 외워집니다</h2>
          </div>
          <ul className="space-y-4 text-sm text-secondary font-medium">
            <li className="flex gap-3">
              <span className="font-black text-primary shrink-0">01</span>
              첫 완주는 &ldquo;이름 보기&rdquo;를 켜고 순서에 익숙해지는 데 집중하세요.
            </li>
            <li className="flex gap-3">
              <span className="font-black text-primary shrink-0">02</span>
              두 번째부터는 암기 모드로 초성만 보고 떠올려보세요. 기억이 나지 않아
              힌트를 누른 역이 바로 복습 포인트입니다.
            </li>
            <li className="flex gap-3">
              <span className="font-black text-primary shrink-0">03</span>
              하루 이틀 간격을 두고 재완주하면 간격 반복 효과로 장기 기억에 정착합니다.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
