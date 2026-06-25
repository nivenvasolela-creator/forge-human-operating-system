-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (user identity and extracted goals)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  mind_dump text,
  destination text,
  current_reality text,
  gap text,
  deep_work_goal_minutes int default 240,
  optimal_task_count int default 3,
  optimal_work_hours text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Daily logs table (task outcomes with timestamps)
create table daily_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  log_date date default current_date,
  tasks jsonb,
  tasks_completed_count int default 0,
  tasks_total_count int default 0,
  deep_work_minutes int default 0,
  streak_days int default 0,
  created_at timestamptz default now()
);

-- Deep work sessions table
create table deep_work_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  session_start timestamptz not null,
  session_end timestamptz,
  duration_minutes int,
  label text,
  created_at timestamptz default now()
);

-- Reflections table with sentiment analysis
create table reflections (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  reflection_date date default current_date,
  did text not null,
  blocked text,
  tomorrow text,
  sentiment_tags text[],
  blocker_keywords text[],
  created_at timestamptz default now()
);

-- Behavior patterns table (learned insights)
create table behavior_patterns (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  pattern_type text not null,
  pattern_data jsonb not null,
  confidence_score float default 0.5,
  sample_size int default 0,
  last_observed timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, pattern_type)
);

-- Insights table (cached recommendations)
create table insights (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  insight_text text not null,
  insight_type text not null,
  category text,
  relevance_score float default 0.5,
  is_dismissed boolean default false,
  is_acted_upon boolean default false,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- Milestone progress table
create table milestone_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  milestone_id text not null,
  milestone_label text not null,
  timeframe text,
  is_completed boolean default false,
  started_at timestamptz,
  completed_at timestamptz,
  estimated_days int,
  actual_days int,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create indexes for performance
create index idx_daily_logs_user_date on daily_logs(user_id, log_date desc);
create index idx_deep_work_sessions_user on deep_work_sessions(user_id, session_start desc);
create index idx_reflections_user on reflections(user_id, reflection_date desc);
create index idx_behavior_patterns_user on behavior_patterns(user_id);
create index idx_insights_user on insights(user_id, is_dismissed, created_at desc);
create index idx_milestone_progress_user on milestone_progress(user_id);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table daily_logs enable row level security;
alter table deep_work_sessions enable row level security;
alter table reflections enable row level security;
alter table behavior_patterns enable row level security;
alter table insights enable row level security;
alter table milestone_progress enable row level security;

-- RLS Policies for profiles
create policy "select_own_profile" on profiles for select
  to authenticated using (auth.uid() = id);
create policy "insert_own_profile" on profiles for insert
  to authenticated with check (auth.uid() = id);
create policy "update_own_profile" on profiles for update
  to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- RLS Policies for daily_logs
create policy "select_own_logs" on daily_logs for select
  to authenticated using (auth.uid() = user_id);
create policy "insert_own_logs" on daily_logs for insert
  to authenticated with check (auth.uid() = user_id);
create policy "update_own_logs" on daily_logs for update
  to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- RLS Policies for deep_work_sessions
create policy "select_own_sessions" on deep_work_sessions for select
  to authenticated using (auth.uid() = user_id);
create policy "insert_own_sessions" on deep_work_sessions for insert
  to authenticated with check (auth.uid() = user_id);
create policy "update_own_sessions" on deep_work_sessions for update
  to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- RLS Policies for reflections
create policy "select_own_reflections" on reflections for select
  to authenticated using (auth.uid() = user_id);
create policy "insert_own_reflections" on reflections for insert
  to authenticated with check (auth.uid() = user_id);

-- RLS Policies for behavior_patterns
create policy "select_own_patterns" on behavior_patterns for select
  to authenticated using (auth.uid() = user_id);
create policy "insert_own_patterns" on behavior_patterns for insert
  to authenticated with check (auth.uid() = user_id);
create policy "update_own_patterns" on behavior_patterns for update
  to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- RLS Policies for insights
create policy "select_own_insights" on insights for select
  to authenticated using (auth.uid() = user_id);
create policy "insert_own_insights" on insights for insert
  to authenticated with check (auth.uid() = user_id);
create policy "update_own_insights" on insights for update
  to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- RLS Policies for milestone_progress
create policy "select_own_milestones" on milestone_progress for select
  to authenticated using (auth.uid() = user_id);
create policy "insert_own_milestones" on milestone_progress for insert
  to authenticated with check (auth.uid() = user_id);
create policy "update_own_milestones" on milestone_progress for update
  to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Function to update updated_at timestamp
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_profiles_updated_at before update on profiles
  for each row execute function update_updated_at();
create trigger update_behavior_patterns_updated_at before update on behavior_patterns
  for each row execute function update_updated_at();
create trigger update_milestone_progress_updated_at before update on milestone_progress
  for each row execute function update_updated_at();