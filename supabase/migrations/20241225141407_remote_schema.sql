drop policy "Select for admin" on "public"."questionnaires";

drop policy "Select for admins or own entry" on "public"."registrations";

create policy "Select for admin and own entry"
on "public"."questionnaires"
as permissive
for select
to authenticated
using ((permissions.is_admin() OR ("user" = auth.uid())));


create policy "Select for helper or own entry"
on "public"."registrations"
as permissive
for select
to authenticated
using ((permissions.is_helper() OR (id = auth.uid())));



