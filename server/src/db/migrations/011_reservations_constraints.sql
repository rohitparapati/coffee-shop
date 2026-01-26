-- Make reservations safer + faster

-- Ensure only one reservation per table per date/time slot
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_table_slot
ON reservations (date, time, table_id);

-- Helpful lookup index
CREATE INDEX IF NOT EXISTS idx_res_date_time
ON reservations (date, time);
