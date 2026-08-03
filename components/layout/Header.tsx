"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User as UserIcon, Layout, PenTool, Gamepad2, Users, BookOpenCheck, LogOut, Loader2, Menu, X, ChevronRight, Zap, Keyboard, Newspaper, Timer, Store, TramFront } from "lucide-react";
import { SupabaseService, supabase } from "@/lib/supabase";
import { NotificationDrawer } from "./NotificationDrawer";

export const Header: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let isMounted = true;

    const initAuth = async () => {
      const timeoutId = setTimeout(() => {
        if (isMounted) {
          setLoading(false);
        }
      }, 2000);

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const initialUser = session?.user || null;
        
        if (initialUser && isMounted) {
          setUser(initialUser);
          setLoading(false); 
          
          (async () => {
            let p = await SupabaseService.getMyProfile(initialUser.id);
            if (!p && isMounted) {
              await new Promise(r => setTimeout(r, 800));
              p = await SupabaseService.getMyProfile(initialUser.id);
            }
            if (isMounted) setProfile(p);
          })();
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      } finally {
        clearTimeout(timeoutId);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const currentUser = session?.user || null;
        if (currentUser && isMounted) {
          setUser(currentUser);
          setLoading(false); 

          (async () => {
            const p = await SupabaseService.getMyProfile(currentUser.id);
            if (isMounted) setProfile(p);
            if (event === 'SIGNED_IN') {
              router.refresh(); 
            }
          })();
        } else {
          setLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setLoading(false);
        router.refresh(); 
      }
    });

    // 카카오 로그인 페이지에서 뒤로가기로 돌아오면(bfcache 복원) 스피너가 남아있지 않도록 해제
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) setLoading(false);
    };
    window.addEventListener('pageshow', onPageShow);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      window.removeEventListener('pageshow', onPageShow);
    };
  }, [router]);

  const handleLogin = async () => {
    setLoading(true);
    try { await SupabaseService.signInWithKakao(); } 
    catch (error) { setLoading(false); }
  };

  const handleLogout = async () => {
    try {
      await SupabaseService.signOut();
      setIsMobileMenuOpen(false);
      router.refresh();
    } catch (error) { console.error(error); }
  };

  const mobileMenuContent = (
    <div className="fixed inset-0 z-[10000] flex justify-end">
        <div className="absolute inset-0 bg-on-surface/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsMobileMenuOpen(false)} />
        <div className="relative w-80 h-full bg-surface shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 primary-gradient rounded-lg flex items-center justify-center text-white font-black text-lg">한</div>
                    <span className="editorial-heading">메뉴</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-zinc-400 hover:text-on-surface transition-colors"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                <MobileNavItem href="/test" icon={<Timer size={20} />} label="타자 속도 테스트" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavItem href="/practice" icon={<Layout size={20} />} label="타자 연습장" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavItem href="/transcription" icon={<PenTool size={20} />} label="긴 글 연습" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavItem href="/books" icon={<Store size={20} />} label="책방" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavItem href="/game" icon={<Gamepad2 size={20} />} label="한글 게임" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavItem href="/journey" icon={<TramFront size={20} />} label="지식타자" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavItem href="/quiz" icon={<BookOpenCheck size={20} />} label="맞춤법 퀴즈" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavItem href="/challenge" icon={<Users size={20} />} label="필사 챌린지" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavItem href="/recommend" icon={<Keyboard size={20} />} label="키보드 추천" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavItem href="/blog" icon={<Newspaper size={20} />} label="블로그" onClick={() => setIsMobileMenuOpen(false)} />
            </div>

            <div className="p-6 bg-surface-low">
                {user ? (
                    <div className="flex flex-col gap-4">
                        <Link href="/mypage" prefetch={false} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2">
                            {profile?.avatar_url ? <Image src={profile.avatar_url} alt="p" width={40} height={40} className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-primary font-bold">U</div>}
                            <div>
                                <p className="editorial-heading text-sm">{profile?.nickname || '필사 작가'}</p>
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">My Page</p>
                            </div>
                        </Link>
                        <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full py-3 bg-surface-lowest border border-outline-variant text-zinc-500 rounded-xl text-xs font-black">
                            <LogOut size={14} /> 로그아웃
                        </button>
                    </div>
                ) : (
                    <button onClick={handleLogin} className="w-full py-4 bg-[#FEE500] text-black font-black rounded-xl flex items-center justify-center gap-2 shadow-lg">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 3c-5.5 0-10 3.5-10 7.8 0 2.8 1.8 5.3 4.5 6.6l-1.1 4.1c-.1.5.4.8.8.6l4.8-3.2c.3 0 .7.1 1 .1 5.5 0 10-3.5 10-7.8S17.5 3 12 3" /></svg>
                        3초 만에 시작하기
                    </button>
                )}
            </div>
        </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="w-full bg-surface/80 backdrop-blur-md">
        <div className="container mx-auto max-w-7xl h-16 flex items-center justify-between px-4 lg:px-8">
            <Link href="/" prefetch={false} className="flex items-center gap-2 cursor-pointer group shrink-0">
                <div className="w-8 h-8 primary-gradient rounded-lg flex items-center justify-center text-white font-black text-xl group-hover:scale-110 transition-transform">한</div>
                <span className="editorial-heading text-xl whitespace-nowrap">한글타자왕</span>
            </Link>

            {/* 데스크톱 내비(텍스트 전용): 1024px 미만은 햄버거, 1024~1151px은 핵심 7개, 1152px~ 전체 10개 */}
            <nav className="hidden lg:flex items-center gap-0.5 min-w-0">
                <NavButton label="타자 테스트" href="/test" />
                <NavButton label="타자 연습장" href="/practice" />
                <NavButton label="긴 글 연습" href="/transcription" />
                <NavButton label="책방" href="/books" />
                <NavButton label="한글 게임" href="/game" />
                <NavButton label="지식타자" href="/journey" />
                <NavButton label="맞춤법 퀴즈" href="/quiz" className="hidden min-[1152px]:flex" />
                <NavButton label="필사 챌린지" href="/challenge" />
                <NavButton label="키보드 추천" href="/recommend" className="hidden min-[1152px]:flex" />
                <NavButton label="블로그" href="/blog" className="hidden min-[1152px]:flex" />
            </nav>

            <div className="flex items-center gap-2 shrink-0">
                {loading ? (
                    <div className="w-10 h-10 flex items-center justify-center">
                        <Loader2 className="animate-spin text-zinc-300" size={20} />
                    </div>
                ) : (
                    <>
                        {user && <NotificationDrawer userId={user.id} />}
                        <div className="hidden lg:flex items-center gap-2">
                            {user ? (
                                <Link href="/mypage" prefetch={false} className="flex items-center gap-2 p-1 pr-4 bg-surface-low rounded-full hover:bg-surface-high transition-all">
                                    {profile?.avatar_url ? <Image src={profile.avatar_url} alt="p" width={32} height={32} className="w-8 h-8 rounded-full object-cover" /> : <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-primary font-bold text-xs">U</div>}
                                    <span className="text-sm font-bold text-zinc-700">마이페이지</span>
                                </Link>
                            ) : (
                                <button onClick={handleLogin} className="flex items-center gap-2 px-4 py-2 bg-[#FEE500] text-black rounded-full text-sm font-bold hover:opacity-90">
                                    <Zap size={14} fill="currentColor" /> 시작하기
                                </button>
                            )}
                        </div>
                        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 lg:hidden text-zinc-600 hover:bg-surface-low rounded-xl">
                            <Menu size={24} />
                        </button>
                    </>
                )}
            </div>
        </div>
      </div>
      {mounted && isMobileMenuOpen && createPortal(mobileMenuContent, document.body)}
    </header>
  );
};

function NavButton({ label, href, className = "flex" }: { label: string; href: string; className?: string }) {
  return (
    <Link href={href} prefetch={false} className={`${className} items-center px-2.5 py-2 text-sm whitespace-nowrap text-zinc-600 hover:text-primary hover:bg-surface-low rounded-lg font-medium transition-all`}>
      <span>{label}</span>
    </Link>
  );
}

function MobileNavItem({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick: () => void }) {
    return (
        <Link href={href} prefetch={false} onClick={onClick} className="flex items-center justify-between p-4 bg-surface-lowest hover:bg-surface-low rounded-2xl transition-all">
            <div className="flex items-center gap-4 text-zinc-600">
                {icon}
                <span className="editorial-heading text-lg">{label}</span>
            </div>
            <ChevronRight size={18} className="text-zinc-300" />
        </Link>
    );
}
