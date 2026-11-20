create sequence if not exists public.reader_card_id_seq
  as bigint
  start with 127
  minvalue 127
  maxvalue 999999
  no cycle;

create table if not exists public.reader_card_requests (
  email text primary key,
  name text not null default '',
  reader_id text not null unique
    check (reader_id ~ '^RC-[0-9]{6}$'),
  date_issued timestamptz not null default now()
);

alter table public.reader_card_requests enable row level security;

revoke all on table public.reader_card_requests from anon, authenticated;
revoke all on sequence public.reader_card_id_seq from public, anon, authenticated;

create or replace function public.issue_reader_card(
  p_name text,
  p_email text
)
returns table (
  name text,
  email text,
  reader_id text,
  date_issued timestamptz
)
language plpgsql
security definer
set search_path = ''
as $function$
declare
  normalized_name text := coalesce(nullif(btrim(p_name), ''), '');
  normalized_email text := lower(btrim(p_email));
begin
  if normalized_email is null
    or char_length(normalized_email) > 254
    or normalized_email !~ '^[^[:space:]@<>]+@[^[:space:]@<>]+\.[^[:space:]@<>]+$'
  then
    raise exception 'A valid email address is required.'
      using errcode = '22023';
  end if;

  if char_length(normalized_name) > 100 then
    raise exception 'The reader name is too long.'
      using errcode = '22023';
  end if;

  insert into public.reader_card_requests as current_card (
    email,
    name,
    reader_id
  )
  values (
    normalized_email,
    normalized_name,
    'RC-' || lpad(nextval('public.reader_card_id_seq')::text, 6, '0')
  )
  on conflict (email) do update
    set name = coalesce(nullif(excluded.name, ''), current_card.name);

  return query
    select saved_card.name, saved_card.email, saved_card.reader_id, saved_card.date_issued
    from public.reader_card_requests as saved_card
    where saved_card.email = normalized_email;
end;
$function$;

revoke all on function public.issue_reader_card(text, text) from public, anon, authenticated;
grant execute on function public.issue_reader_card(text, text) to service_role;
