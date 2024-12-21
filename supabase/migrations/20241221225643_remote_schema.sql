create policy "Insert for admins and helper 13c5jeu_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'group-images'::text) AND permissions.is_helper()));


create policy "Select for authenticated 13c5jeu_0"
on "storage"."objects"
as permissive
for select
to authenticated
using ((bucket_id = 'group-images'::text));


create policy "Update for admins 13c5jeu_0"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'group-images'::text) AND permissions.is_admin()));



