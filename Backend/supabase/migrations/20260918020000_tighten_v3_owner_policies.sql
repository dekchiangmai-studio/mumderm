drop policy if exists "Users can create their own submissions" on public.submissions;

create policy "Users can create pending submissions"
  on public.submissions for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and status = 'pending'
    and reviewed_by is null
    and reviewed_at is null
    and review_note is null
  );

revoke update on public.profiles from authenticated;
grant update (display_name) on public.profiles to authenticated;
