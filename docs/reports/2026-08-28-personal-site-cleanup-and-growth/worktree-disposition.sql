WITH worktree_disposition(bucket, count, decision, sort_order) AS (
  VALUES
    ('Clean + merged', 8, 'Remove after approval', 1),
    ('Clean + distinct', 4, 'Classify', 2),
    ('Dirty artifacts', 3, 'Preserve artifacts', 3),
    ('Dirty sources', 3, 'Triage separately', 4),
    ('Canonical', 1, 'Keep', 5)
)
SELECT bucket, count, decision
FROM worktree_disposition
ORDER BY sort_order;
