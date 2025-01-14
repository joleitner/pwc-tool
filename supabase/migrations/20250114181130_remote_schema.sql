set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_pwc_counts()
 RETURNS TABLE(survey bigint, count bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
    return query
    select pwc_results.survey, count(*)
    from pwc_results
    group by pwc_results.survey;
end;
$function$
;


