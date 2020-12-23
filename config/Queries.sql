-- taken from https://github.com/mjgp2/pgkron

CREATE TABLE IF NOT EXISTS job(
       id serial primary key,
       name text not null unique,
       sql text not null,
       run_at timestamp with time zone not null,
       interval text not null,
       active boolean not null default true
);
CREATE TABLE IF NOT EXISTS job_log(
       id serial primary key,
       job_id int not null,
       run_at timestamp with time zone not null,
       sql text not null,
       row_count int,
       error boolean not null
);

CREATE OR REPLACE PROCEDURE run()
AS $$
DECLARE
   job_id integer; 
   job_sql text;
   job_run_at timestamp with time zone;
   job_interval text;
   row_count int;
   error boolean;
   max_jobs integer;
   jobs integer := 0;
   job_ids int[] := ARRAY[]::int[];
BEGIN

select count(*) into max_jobs from job;

while jobs < max_jobs loop

  row_count := null;
  error := false;

  BEGIN
    select id, sql, run_at, interval into job_id, job_sql, job_run_at, job_interval from job where active and run_at < now() and not ( id = any(job_ids) ) order by run_at limit 1 for update skip locked;
    if job_id is null then
      return;
    END IF;

    BEGIN
      RAISE DEBUG 'pgkron: sql running: %', job_sql;
      EXECUTE job_sql;
      GET DIAGNOSTICS row_count = ROW_COUNT;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE NOTICE 'pgkron: sql failed: %', job_sql;
        error:=true;
    END;

    INSERT INTO job_log ( job_id, run_at, row_count, error, sql ) VALUES ( job_id, job_run_at, row_count, error, job_sql );
    UPDATE job SET run_at = run_at + interval::interval * ceiling(extract( epoch from now() - run_at)/extract( epoch from interval::interval )) where id = job_id;
    COMMIT; 
  END; -- end job execution
  jobs := jobs + 1;
  job_ids := job_ids || job_id;
END LOOP;

RAISE DEBUG 'pgkron: run % jobs', jobs;
END;
$$
LANGUAGE plpgsql;
