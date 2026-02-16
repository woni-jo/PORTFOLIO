import fs from "node:fs";
import path from "node:path";
import { Github, Linkedin } from "lucide-react";
import Image from "next/image";
import ProjectCard from "@/components/project/ProjectCard";
import TypewriterText from "@/components/ui/TypewriterText";
import { fetchProjects } from "@/lib/queries/projects";

export default async function Home() {
  const projects = await fetchProjects();

  const localHeroImage = "/images/main/profile-main.jpg";
  const localHeroImageFile = path.join(process.cwd(), "public", "images", "main", "profile-main.jpg");
  const heroImageSrc = fs.existsSync(localHeroImageFile) ? localHeroImage : "https://placehold.co/1200x1400";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-line bg-background/95 backdrop-blur">
        <nav className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
          <a href="#" className="font-display text-4xl tracking-wide">
            Woni-Jo
          </a>
          <ul className="flex items-center gap-6 text-base uppercase tracking-wide text-muted">
            <li>
              <a
                href="#main-section"
                className="inline-block border-b border-transparent pb-1 transition hover:border-foreground hover:text-foreground"
              >
                Main
              </a>
            </li>
            <li>
              <a
                href="#project-section"
                className="inline-block border-b border-transparent pb-1 transition hover:border-foreground hover:text-foreground"
              >
                Project
              </a>
            </li>
            <li>
              <a
                href="#about-section"
                className="inline-block border-b border-transparent pb-1 transition hover:border-foreground hover:text-foreground"
              >
                About
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-[1400px] flex-col px-6 py-8 md:px-10 md:py-10">
        <section
          id="main-section"
          className="grid min-h-[calc(100svh-88px)] items-center gap-8 py-4 md:grid-cols-[0.92fr_1.08fr] md:gap-14 md:py-6"
        >
          <div className="flex flex-col justify-center">
            <p className="font-display text-[clamp(3.4rem,8.8vw,8.9rem)] leading-[0.9] tracking-[0.01em]">
              <span className="block">HI, I AM</span>
              <span className="block md:whitespace-nowrap">CHO WONHEE.</span>
            </p>
            <p className="mt-8 max-w-xl text-base leading-8 text-muted md:text-lg">
              더 나은 사용자 경험을 만들기 위해, 오늘도 한 줄의 코드를 고민합니다.
              <br />
              작은 개선이 쌓여 큰 변화를 만든다고 믿습니다.
            </p>
            <div className="mt-10 flex items-center gap-3">
              <a
                href="#about-section"
                className="inline-flex items-center rounded-full bg-accent px-6 py-3 text-base font-semibold text-black"
              >
                CONTACT ME
              </a>
              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://github.com/woni-jo"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line"
              >
                <Github size={18} />
              </a>
            </div>
          </div>

          <div className="h-full md:max-w-[760px] md:justify-self-end">
            <Image
              className="h-full w-full rounded-2xl object-cover"
              src={heroImageSrc}
              alt="Profile"
              width={1200}
              height={1400}
              priority
            />
          </div>
        </section>

        <div className="my-10 h-px w-full bg-line" />

        <section id="project-section" className="py-8 md:py-14">
          <div>
            <p className="font-display text-6xl leading-none tracking-wide md:text-7xl">PROJECTS</p>
            <p className="mt-4 text-base leading-8 text-muted md:text-lg">
              Here are selected projects that showcase my passion for back-end development.
            </p>
          </div>

          <div className="mt-8 space-y-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        <div className="my-10 h-px w-full bg-line" />

        <section id="about-section" className="py-8 md:py-14">
          <div className="grid gap-8 md:grid-cols-[0.4fr_1fr]">
            <p className="font-display text-6xl leading-none tracking-wide md:text-7xl">ABOUT ME</p>
            <div>
              <p className="text-2xl leading-8">
                백엔드 개발자 조원희입니다.
                <br />
                컴퓨터공학 전공을 바탕으로 시스템 설계와 문제 해결에 집중합니다.
              </p>

              <TypewriterText
                className="mt-5 whitespace-pre-line text-base leading-8 text-muted md:text-lg"
                text={`AI 시대에는 “몰라서 못한다”라는 말이 통하지 않는다고 생각합니다.
                  중요한 것은 새로운 기술을 얼마나 빠르게 운영 가능한 시스템으로 구현하고,
                  서비스 환경에 맞게 안정적으로 정착시킬 수 있는가입니다.
                  저는 기능 구현에 그치지 않고, 운영 과정에서 발생하는 문제를 끝까지 책임지는 개발자로 성장하고자 합니다.`}
              />

              <div className="mt-6 h-px w-full bg-line" />

              <div className="mt-6 w-full md:ml-auto md:max-w-[56%]">
                <p className="font-display text-4xl tracking-wide text-accent">Personal Information</p>
                <div className="mt-4 grid gap-3 text-base">
                  <div className="flex items-center justify-between border-b border-line pb-2">
                    <span className="text-muted">Name</span>
                    <span>조원희</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-line pb-2">
                    <span className="text-muted">Phone</span>
                    <span>010-2265-5927</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-line pb-2">
                    <span className="text-muted">Email</span>
                    <span>woni0517@naver.com</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-line pb-2">
                    <span className="text-muted">GitHub</span>
                    <span>https://github.com/woni-jo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="my-12 h-px w-full bg-line" />

          <div className="mt-16 grid gap-8 md:grid-cols-[0.4fr_1fr]">
            <p className="font-display text-6xl leading-none tracking-wide md:text-7xl">Capabilities</p>
            <div>
              <div className="hidden">
                저는 항상 새로운 기술을 배우고, 백엔드 개발 역량을 넓히기 위해 노력하고 있습니다.
                Java와 Spring Boot로 API 및 서버 애플리케이션을 개발해본 경험이 있으며, 이는
                유지보수성과 성능을 중요하게 생각하기 때문입니다. 또한 데이터베이스 설계와 쿼리
                최적화에도 흥미가 많습니다.
              </div>
              <div className="hidden mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-line px-3 py-1 text-sm tracking-wide">JAVA</span>
                <span className="rounded-full border border-line px-3 py-1 text-sm tracking-wide">SPRING</span>
                <span className="rounded-full border border-line px-3 py-1 text-sm tracking-wide">MYSQL</span>
              </div>

              <p className="text-base leading-8 text-muted md:text-lg">
                미국과 일본에서의 어학연수 경험은 단순히 언어를 배우는 것을 넘어, 낯선 환경에서 빠르게 적응하고
                다양한 배경을 가진 사람들과 소통하는 법을 길러주었습니다.
                <br />
                이러한 적응력은 새로운 기술 스택을 습득하고, 프로젝트 팀 내 의견 차이를 조율하는 팀장 및 팀원의
                역할을 수행하는 데 큰 자산이 되었습니다.
              </p>

              <div className="mt-10 grid gap-10 md:grid-cols-2">
                <div>
                  <p className="font-display text-4xl leading-none tracking-wide text-accent md:text-4xl">EDUCATION</p>
                  <ul className="mt-5 space-y-2 text-lg leading-8">
                    <li>순천향대학교 컴퓨터공학과 2019.03 ~ 2025.08</li>
                    <li>우리 FIS Academy 2025.07 ~ 2025.12</li>
                  </ul>
                </div>

                <div>
                  <p className="font-display text-4xl leading-none tracking-wide text-accent md:text-4xl">GLOBAL EXPERIENCE</p>
                  <ul className="mt-5 space-y-2 text-lg leading-8">
                    <li>미국 어학연수 - Kaplan NewYork 2022.11 ~ 2023.05</li>
                    <li>일본 어학연수 - ISI Tokyo 2023.06 ~ 2024.12</li>
                  </ul>
                </div>
              </div>

              <div className="mt-12">
                <p className="font-display text-4xl leading-none tracking-wide text-accent md:text-4xl">SKILLS</p>
                <ul className="mt-5 list-disc space-y-2 pl-6 text-xl leading-8">
                  <li>Backend : Java, Spring, JPA</li>
                  <li>Database &amp; Cache : MySQL, PostgreSQL, Redis</li>
                  <li>Infra &amp; DevOps : AWS, Docker, Jenkins, GitHub Actions</li>
                </ul>
              </div>

              <div className="mt-12">
                <p className="font-display text-4xl leading-none tracking-wide text-accent md:text-4xl">CERTIFICATION</p>
                <div className="mt-5 grid gap-x-12 gap-y-2 text-xl leading-8 md:grid-cols-2">
                  <p>• OPIC - IH</p>
                  <p>• 정보처리기사</p>
                  <p>• SQLD</p>
                  <p>• ADsP</p>
                  <p>• 리눅스 마스터 2급</p>
                  <p>• 네트워크 관리사 2급</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line px-6 py-5 text-right text-sm text-muted md:px-10">
        &copy; 2026 WONHEE CHO
      </footer>
    </div>
  );
}
