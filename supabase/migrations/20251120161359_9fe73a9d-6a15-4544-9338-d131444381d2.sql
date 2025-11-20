-- Fix search_path for delete_old_task_proofs function
CREATE OR REPLACE FUNCTION public.delete_old_task_proofs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  old_task RECORD;
  proof_path text;
BEGIN
  -- Find tasks with proofs older than 7 days
  FOR old_task IN 
    SELECT id, proof_url, user_id
    FROM public.tasks
    WHERE proof_uploaded_at < NOW() - INTERVAL '7 days'
    AND proof_url IS NOT NULL
  LOOP
    -- Delete files from storage
    IF old_task.proof_url IS NOT NULL THEN
      FOREACH proof_path IN ARRAY old_task.proof_url
      LOOP
        -- Extract the storage path from the full URL
        DELETE FROM storage.objects
        WHERE bucket_id = 'task-proofs'
        AND name LIKE '%' || old_task.id || '%';
      END LOOP;
    END IF;
    
    -- Clear proof_url and proof_uploaded_at from task
    UPDATE public.tasks
    SET proof_url = NULL,
        proof_uploaded_at = NULL
    WHERE id = old_task.id;
  END LOOP;
END;
$$;