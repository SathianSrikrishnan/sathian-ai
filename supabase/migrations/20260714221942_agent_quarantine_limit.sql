-- Keep the storage boundary aligned with the application and reservation RPC.
-- The public agent accepts files up to 5 MiB at launch.
UPDATE storage.buckets
SET file_size_limit = 5242880
WHERE id = 'agent-quarantine';
