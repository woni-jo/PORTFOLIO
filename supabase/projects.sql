-- Extensions
create extension if not exists pgcrypto;

-- Projects table (idempotent schema sync)
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  description text not null,
  stack text[] not null default '{}',
  image_path text not null,
  detail_image_path text,
  github_url text,
  live_url text,
  year text not null default '',
  role text not null default 'Back-end Developer',
  featured boolean not null default false,
  sort_order integer not null default 0,
  status text not null default 'completed',
  team_size integer,
  problem text,
  solution text,
  key_results text[] not null default '{}',
  tech_details text,
  troubleshooting text,
  images text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add missing columns for existing tables
alter table public.projects add column if not exists slug text;
alter table public.projects add column if not exists summary text;
alter table public.projects add column if not exists image_path text;
alter table public.projects add column if not exists detail_image_path text;
alter table public.projects add column if not exists featured boolean not null default false;
alter table public.projects add column if not exists sort_order integer not null default 0;
alter table public.projects add column if not exists status text not null default 'completed';
alter table public.projects add column if not exists team_size integer;
alter table public.projects add column if not exists problem text;
alter table public.projects add column if not exists solution text;
alter table public.projects add column if not exists key_results text[] not null default '{}';
alter table public.projects add column if not exists tech_details text;
alter table public.projects add column if not exists troubleshooting text;
alter table public.projects add column if not exists images text[] not null default '{}';

-- Backfill for legacy schema that used image_url
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'projects'
      and column_name = 'image_url'
  ) then
    execute 'update public.projects set image_path = coalesce(image_path, image_url) where image_path is null';
  end if;
end $$;

-- Backfill problem from troubleshooting for legacy data
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'projects'
      and column_name = 'troubleshooting'
  ) then
    execute 'update public.projects set problem = coalesce(problem, troubleshooting) where problem is null and troubleshooting is not null';
  end if;
end $$;

update public.projects
set
  slug = coalesce(slug, regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g')),
  summary = coalesce(nullif(summary, ''), left(description, 110)),
  image_path = coalesce(image_path, '/images/projects/project-1.jpg'),
  detail_image_path = coalesce(detail_image_path, image_path),
  status = coalesce(status, 'completed'),
  key_results = coalesce(key_results, '{}')
where slug is null
  or summary is null
  or image_path is null
  or status is null
  or key_results is null;

alter table public.projects alter column slug set not null;
alter table public.projects alter column summary set not null;
alter table public.projects alter column image_path set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'projects_slug_unique'
  ) then
    alter table public.projects add constraint projects_slug_unique unique (slug);
  end if;
end $$;

drop index if exists projects_featured_sort_idx;
create index projects_featured_sort_idx on public.projects (featured desc, sort_order asc);
create index if not exists projects_slug_idx on public.projects (slug);

-- Convert legacy integer year column to text period format column.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'projects'
      and column_name = 'year'
      and data_type in ('integer', 'bigint', 'smallint')
  ) then
    alter table public.projects alter column year type text using year::text;
  end if;
end $$;

-- Keep updated_at in sync
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

-- RLS for project data
alter table public.projects enable row level security;

drop policy if exists "projects_select_public" on public.projects;
create policy "projects_select_public"
on public.projects
for select
to anon, authenticated
using (true);

drop policy if exists "projects_insert_auth" on public.projects;
create policy "projects_insert_auth"
on public.projects
for insert
to authenticated
with check (true);

drop policy if exists "projects_update_auth" on public.projects;
create policy "projects_update_auth"
on public.projects
for update
to authenticated
using (true)
with check (true);

drop policy if exists "projects_delete_auth" on public.projects;
create policy "projects_delete_auth"
on public.projects
for delete
to authenticated
using (true);

-- Storage bucket for project images
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view project images" on storage.objects;
create policy "Public can view project images"
on storage.objects
for select
to public
using (bucket_id = 'project-images');

drop policy if exists "Authenticated can upload project images" on storage.objects;
create policy "Authenticated can upload project images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'project-images');

drop policy if exists "Authenticated can update project images" on storage.objects;
create policy "Authenticated can update project images"
on storage.objects
for update
to authenticated
using (bucket_id = 'project-images')
with check (bucket_id = 'project-images');

drop policy if exists "Authenticated can delete project images" on storage.objects;
create policy "Authenticated can delete project images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'project-images');

-- Seed rows (safe to run repeatedly)
insert into public.projects (
  id,
  slug,
  title,
  summary,
  description,
  stack,
  image_path,
  detail_image_path,
  github_url,
  live_url,
  year,
  role,
  featured,
  sort_order,
  status,
  team_size,
  problem,
  solution,
  key_results,
  tech_details,
  troubleshooting,
  images
)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'metaverse-on',
    '메타버스 프로젝트 ON',
    '다수 사용자 실시간 위치 동기화 병목을 Redis 기반으로 해결한 메타버스 백엔드 프로젝트',
    '비대면 학습 환경에서 상호작용 지연 문제를 줄이고 안정적인 실시간 동기화를 구현한 프로젝트입니다.',
    array['Java', 'Spring Boot', 'Spring Security', 'Neon DB', 'Redis'],
    'ON-Main.jpg',
    'ON-Main-Front.jpg',
    'https://github.com/KimZo2/ON-BE',
    'https://example.com',
    '2025.08 ~ 2026.01',
    'Back-end Developer',
    true,
    1,
    'completed',
    4,
    $$메타버스 환경에서 다수의 유저가 동시에 이동할 때,
실시간 좌표 정보를 RDB에 매번 저장하면서 Disk I/O 병목과 Row Lock 경합이 발생하여
동시 접속 시 최대 5.6초의 지연이 발생하였습니다.$$,
    $$빈번하게 변경되는 휘발성 데이터인 유저 위치 좌표를 Redis로 분리하여
실시간 처리에 특화된 In-Memory 구조로 아키텍처를 재설계하였습니다.$$,
    array[
      $$Redis 기반 실시간 좌표 처리로 성능 45배 개선:
RDB 대비 최대 지연 시간을 5,646ms에서 126ms로 단축하였으며 동시 접속 100명 기준 실시간 좌표 동기화 지연을 0.2초 미만으로 개선하였습니다.$$,
      $$Lua Script 기반의 원자적 동시성 제어:
Redis의 싱글 스레드 특성과 Lua Script를 활용해 Stateless 환경에서도 세션의 원자성과 데이터 정합성을 보장하였습니다.$$,
      $$세션 및 생명 주기 관리 프로세스 설계로 더미 데이터 제거:
Heartbeat 기반 TTL 갱신으로 비정상 종료(강제 종료, 탭 종료) 유저를 자동 감지하며 TTL 만료 시 Keyspace Notification와 Scheduler를 결합하여 고스트 유저 및 고아 데이터를 정리하였습니다. 또한 방, 유저, 위치 정보 간 생명 주기를 일관되게 관리하여 Redis 메모리 누수 및 잘못된 방 노출 문제를 해결하였습니다.$$
    ],
    $$실시간 좌표 처리와 세션 생명 주기 관리를 분리해 확장성과 안정성을 동시에 확보했습니다.$$,
    null,
    array['ON-Play.png', 'ON-Room.png']
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'know-who-how',
    'Know Who How',
    '7주 내 시니어 대상 금융 서비스 MVP를 완주하고 보안/정합성/안정성을 동시에 만족시킨 프로젝트',
    '시니어 대상 금융 서비스에서 인증/인가와 보안 아키텍처를 중심으로 설계/구현/배포를 수행한 프로젝트입니다.',
    array['Java', 'Spring Boot', 'Spring Security', 'OAuth 2.0', 'Spring Authorization Server', 'Redis', 'Jenkins', 'AWS', 'On-Premise'],
    'KnowWhoHow-Main.jpg',
    'KnowWhoHow-Main.jpg',
    'https://github.com/Fisa5-Main-Project',
    null,
    '2025.10 ~ 2025.12',
    'Team Lead / Back-end Developer',
    true,
    2,
    'completed',
    6,
    $$7주라는 제한된 기간 내에 시니어 대상 금융 서비스의 기획/개발/배포 전 과정을 완주해야 했으며,
금융 데이터 특성상 보안/정합성/안정성을 동시에 만족해야 하는 제약이 존재했습니다.$$,
    $$- 핵심 기능 위주의 MVP 범위 정의 및 Hybrid Agile 방식 채택
- 금융권 마이데이터 표준을 참고한 OAuth 2.0 기반 인증/인가 서버 분리
- 민감 데이터 보호를 위한 Hybrid Cloud(On-Premise-Cloud) 아키텍처 설계$$,
    array[
      $$팀장 역할 수행을 통한 프로젝트 완주:
WBS 기반 일정 관리와 API 명세 사전 확정을 통해 개발 병목을 최소화하고,
기능 우선순위를 3단계로 분리하여 1차 MVP를 7주 내 100% 구현 및 배포하였습니다.$$,
      $$금융권 표준을 고려한 인증·인가 아키텍처 구현:
Spring Authorization Server 기반으로 Auth Server를 분리하고,
Authorization Code Grant 방식을 적용하여 토큰 교환 로직을 백엔드에서 처리하도록 구성했습니다.$$,
      $$금융 보안 규정을 반영한 Hybrid Cloud 아키텍처 설계:
민감한 금융 데이터는 On-Premise 환경에 격리하고,
서비스 접점은 Cloud로 분리한 이중 구조를 채택했으며,
전자금융감독규정 제15조를 기준으로 보안 아키텍처를 설계했습니다.$$
    ],
    $$인증/인가 서버 분리, OAuth 2.0 Authorization Code Grant 적용, On-Premise와 Cloud 분리 설계를 통해
보안성과 확장성을 동시에 확보했습니다.$$,
    null,
    array['KnowWhoHow-OAuth.jpg','KnowWhoHow-Architecture.jpg']
  )
on conflict (id) do update set
  slug = excluded.slug,
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  stack = excluded.stack,
  image_path = excluded.image_path,
  detail_image_path = excluded.detail_image_path,
  github_url = excluded.github_url,
  live_url = excluded.live_url,
  year = excluded.year,
  role = excluded.role,
  featured = excluded.featured,
  sort_order = excluded.sort_order,
  status = excluded.status,
  team_size = excluded.team_size,
  problem = excluded.problem,
  solution = excluded.solution,
  key_results = excluded.key_results,
  tech_details = excluded.tech_details,
  troubleshooting = excluded.troubleshooting,
  images = excluded.images;
