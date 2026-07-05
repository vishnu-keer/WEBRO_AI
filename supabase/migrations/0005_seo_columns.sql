-- 0005 intentionally left as a no-op.
-- The SEO agent stores its url + summary inside seo_reports.data (jsonb) and uses
-- the existing `score` column, so no schema change is needed. Kept as a numbered
-- placeholder so migration ordering stays stable.
select 1;
