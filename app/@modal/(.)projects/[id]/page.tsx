import { notFound } from "next/navigation";
import { fetchProjectById } from "@/lib/queries/projects";
import ProjectDetailView from "@/components/project/ProjectDetailView";
import ModalCloseButton from "@/components/ui/ModalCloseButton";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailModal({ params }: Props) {
  const { id } = await params;
  const project = await fetchProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm">
      <div className="mx-auto mt-6 flex w-full max-w-5xl items-center justify-end px-4 md:mt-8 md:px-6">
        <ModalCloseButton />
      </div>

      <div className="mx-auto mt-3 h-[calc(100vh-6.5rem)] w-full max-w-5xl px-4 pb-6 md:px-6">
        <div className="h-full overflow-y-auto rounded-2xl border border-line bg-background p-6 md:p-8">
          <ProjectDetailView project={project} />
        </div>
      </div>
    </div>
  );
}
