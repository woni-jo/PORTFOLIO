import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import type { Project } from "@/types/project";
import ProjectImageGallery from "@/components/project/ProjectImageGallery";

type Props = {
  project: Project;
};

export default function ProjectDetailView({ project }: Props) {
  return (
    <>
      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface">
        <Image
          className="h-auto w-full object-cover"
          src={project.detail_image_url || project.image_url}
          alt={project.title}
          width={1200}
          height={720}
        />
      </div>

      <h1 className="mt-8 font-display text-7xl leading-none tracking-wide">{project.title}</h1>
      <p className="mt-4 text-base leading-8 text-muted">{project.description}</p>

      <div className="mt-6 grid gap-4 rounded-2xl border border-line bg-surface p-5 text-base sm:grid-cols-2 sm:gap-x-10">
        <div className="flex items-center justify-between border-b border-line pb-2 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-8">
          <span className="text-muted">Status</span>
          <span>{project.status || "-"}</span>
        </div>
        <div className="flex items-center justify-between sm:pl-2">
          <span className="text-muted">Team Size</span>
          <span>{project.team_size ?? "-"}</span>
        </div>
      </div>

      {project.problem || project.solution || project.key_results.length > 0 || project.tech_details ? (
        <div className="mt-6 rounded-2xl border border-line bg-surface p-5">
          <h2 className="font-display text-4xl leading-none tracking-wide text-accent">Case Study</h2>

          {project.problem ? (
            <div className="mt-5">
              <h3 className="text-lg font-semibold">문제점</h3>
              <p className="mt-2 whitespace-pre-line text-base leading-8 text-muted">{project.problem}</p>
            </div>
          ) : null}

          {project.solution ? (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">해결책</h3>
              <p className="mt-2 whitespace-pre-line text-base leading-8 text-muted">{project.solution}</p>
            </div>
          ) : null}

          {project.key_results.length > 0 ? (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">주요 기술적 성과</h3>
              <ul className="mt-2 space-y-2">
                {project.key_results.map((result, index) => (
                  <li key={`${project.id}-result-${index}`} className="whitespace-pre-line text-base leading-8 text-muted">
                    - {result}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {project.tech_details ? (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">기술 상세</h3>
              <p className="mt-2 whitespace-pre-line text-base leading-8 text-muted">{project.tech_details}</p>
            </div>
          ) : null}
        </div>
      ) : null}

      {project.images.length > 0 ? (
        <div className="mt-10">
          <h2 className="font-display text-4xl leading-none tracking-wide text-accent">Image Example</h2>
          <ProjectImageGallery images={project.images} title={project.title} />
        </div>
      ) : null}

      <div className="mt-10 flex flex-wrap gap-4">
        {project.live_url ? (
          <a
            href={project.live_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2"
          >
            Live Demo <ExternalLink size={16} />
          </a>
        ) : null}
        {project.github_url ? (
          <a
            href={project.github_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2"
          >
            See on GitHub <Github size={16} />
          </a>
        ) : null}
      </div>
    </>
  );
}
