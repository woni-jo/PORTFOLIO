import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import type { Project } from "@/types/project";

type Props = {
  project: Project;
};

function normalizeStack(stack: Project["stack"]): string[] {
  if (Array.isArray(stack)) return stack;
  if (!stack) return [];
  return stack.split(",").map((item) => item.trim());
}

export default function ProjectCard({ project }: Props) {
  const stacks = normalizeStack(project.stack);
  const cardDescription = project.summary || project.description;

  return (
    <article className="grid gap-8 rounded-2xl border border-line bg-surface p-6 md:grid-cols-[1.1fr_1fr]">
      <div className="w-full md:mx-auto md:w-7/8">
        <Image
          className="w-full rounded-2xl object-cover"
          src={project.image_url || "https://placehold.co/550x420"}
          alt={project.title}
          width={550}
          height={420}
        />
      </div>

      <div className="flex flex-col">
        <p className="font-display text-5xl leading-none tracking-wide">{project.title}</p>
        <p className="mt-4 text-base leading-8 text-muted">{cardDescription}</p>

        <div className="mt-6 border-t border-line pt-4">
          <p className="font-display text-3xl text-accent">PROJECT INFO</p>
          <div className="mt-3 flex items-center justify-between border-b border-line py-2 text-base">
            <span className="text-muted">Period</span>
            <span>{project.year ?? "-"}</span>
          </div>
          <div className="flex items-center justify-between border-b border-line py-2 text-base">
            <span className="text-muted">Role</span>
            <span>{project.role ?? "-"}</span>
          </div>
          <div className="flex items-center justify-between border-b border-line py-2 text-base">
            <span className="text-muted">Team Size</span>
            <span>{project.team_size ?? "-"}</span>
          </div>
          <div className="py-3">
            <ul className="flex flex-wrap gap-2">
              {stacks.map((tag) => (
                <li
                  key={`${project.id}-${tag}`}
                  className="rounded-full border border-line px-4 py-1.5 text-base tracking-wide text-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-7 text-base">
          <Link
            href={`/projects/${project.id}`}
            scroll={false}
            className="inline-flex items-center gap-2 border-b border-accent pb-1 text-accent"
          >
            VIEW DETAILS
          </Link>

          {project.live_url ? (
            <a
              href={project.live_url}
              className="inline-flex items-center gap-2 border-b border-accent pb-1 text-accent"
              target="_blank"
              rel="noreferrer"
            >
              LIVE DEMO <ExternalLink size={16} />
            </a>
          ) : null}

          {project.github_url ? (
            <a
              href={project.github_url}
              className="inline-flex items-center gap-2 border-b border-accent pb-1 text-accent"
              target="_blank"
              rel="noreferrer"
            >
              SEE ON GITHUB <Github size={16} />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
