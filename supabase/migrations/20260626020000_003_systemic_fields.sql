-- Add systemic fields to profiles
alter table profiles add column if not exists principles text[];
alter table profiles add column if not exists standards text[];

-- Add daily mission to daily_logs
alter table daily_logs add column if not exists daily_mission text;
