import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProjectById } from "@/lib/queries/projects";
import ProjectDetailView from "@/components/project/ProjectDetailView";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const project = await fetchProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-12">
      <Link href="/" className="text-sm text-muted underline underline-offset-4">
        Back to Portfolio
      </Link>
      <ProjectDetailView project={project} />
    </main>
  );
}
