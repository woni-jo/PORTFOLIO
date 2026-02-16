import { supabase } from "@/lib/supabase/client";
import type { Project } from "@/types/project";

const PROJECT_IMAGE_BUCKET = "project-images";

type DbProjectRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  stack: string[] | string;
  image_path: string;
  detail_image_path: string | null;
  github_url: string | null;
  live_url: string | null;
  year: string;
  role: string;
  featured: boolean;
  sort_order: number;
  status: string;
  team_size: number | null;
  problem: string | null;
  solution: string | null;
  key_results: string[] | null;
  tech_details: string | null;
  troubleshooting: string | null;
  images: string[] | null;
  created_at: string;
  updated_at: string;
};

function toPublicImageUrl(path: string): string {
  if (!path) return "https://placehold.co/550x420";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) return path;

  const { data } = supabase.storage.from(PROJECT_IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl || "https://placehold.co/550x420";
}

function normalizeImageArray(paths: string[] | null): string[] {
  if (!paths || !paths.length) return [];
  return paths.map((item) => toPublicImageUrl(item));
}

function normalizeStringArray(values: string[] | null): string[] {
  if (!values || !values.length) return [];
  return values.map((value) =>
    value.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n").replace(/\r\n/g, "\n"),
  );
}

function mapProject(row: DbProjectRow): Project {
  return {
    ...row,
    stack: row.stack ?? [],
    problem: (row.problem ?? row.troubleshooting ?? null)
      ?.replace(/\\r\\n/g, "\n")
      .replace(/\\n/g, "\n")
      .replace(/\r\n/g, "\n"),
    solution: row.solution
      ?.replace(/\\r\\n/g, "\n")
      .replace(/\\n/g, "\n")
      .replace(/\r\n/g, "\n"),
    key_results: normalizeStringArray(row.key_results),
    tech_details: row.tech_details
      ?.replace(/\\r\\n/g, "\n")
      .replace(/\\n/g, "\n")
      .replace(/\r\n/g, "\n"),
    image_url: toPublicImageUrl(row.image_path),
    detail_image_url: toPublicImageUrl(row.detail_image_path || row.image_path),
    images: normalizeImageArray(row.images),
  };
}

const fallbackProjects: Project[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    slug: "picture",
    title: "Picture",
    summary: "Supabase data is not ready yet. This is a fallback card.",
    description: "Supabase data is not ready yet. This is a fallback detail page.",
    stack: ["Next.js", "Tailwind CSS", "Supabase"],
    image_path: "/images/projects/project-1.jpg",
    detail_image_path: "/images/projects/project-1.jpg",
    image_url: "/images/projects/project-1.jpg",
    detail_image_url: "/images/projects/project-1.jpg",
    github_url: "https://github.com/woni-jo",
    live_url: "#",
    year: "2025.03 ~ 2025.07",
    role: "Back-end Developer",
    featured: true,
    sort_order: 1,
    status: "completed",
    team_size: 1,
    problem: "No production issue data yet.",
    solution: "N/A",
    key_results: ["N/A"],
    tech_details: "N/A",
    images: ["/images/projects/project-1.jpg"],
  },
];

const selectColumns =
  "id,slug,title,summary,description,stack,image_path,detail_image_path,github_url,live_url,year,role,featured,sort_order,status,team_size,problem,solution,key_results,tech_details,troubleshooting,images,created_at,updated_at";

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select(selectColumns)
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch projects:", error.message);
    return fallbackProjects;
  }

  return ((data ?? []) as DbProjectRow[]).map(mapProject);
}

export async function fetchProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase.from("projects").select(selectColumns).eq("id", id).single();

  if (error) {
    console.error(`Failed to fetch project ${id}:`, error.message);
    return null;
  }

  return mapProject(data as DbProjectRow);
}
