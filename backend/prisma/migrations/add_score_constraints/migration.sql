-- Add check constraint to ensure score is between 1 and 3600000 centiseconds (1 hour)
-- This prevents negative times and unreasonably large times

-- Create a trigger to validate score values for SQLite
CREATE TRIGGER validate_game_session_score
BEFORE UPDATE OF score ON game_sessions
FOR EACH ROW
WHEN NEW.score IS NOT NULL AND (NEW.score < 1 OR NEW.score > 3600000)
BEGIN
    SELECT RAISE(ABORT, 'Score must be between 1 and 3600000 centiseconds');
END;

CREATE TRIGGER validate_game_session_score_insert
BEFORE INSERT ON game_sessions
FOR EACH ROW
WHEN NEW.score IS NOT NULL AND (NEW.score < 1 OR NEW.score > 3600000)
BEGIN
    SELECT RAISE(ABORT, 'Score must be between 1 and 3600000 centiseconds');
END;