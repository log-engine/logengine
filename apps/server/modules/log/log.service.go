package log

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"math"
	"time"
)

type LogService struct {
	datasource *sql.DB
}

func NewLogService(db *sql.DB) *LogService {
	return &LogService{datasource: db}
}

func (s *LogService) GetLogs(filters *GetLogsFilters) (*PaginatedLogs, error) {
	// Default pagination values
	if filters.Limit == 0 {
		filters.Limit = 50
	}
	if filters.Page == 0 {
		filters.Page = 1
	}

	offset := (filters.Page - 1) * filters.Limit

	// Build WHERE clause dynamically
	whereClause := "where 1=1"
	args := []interface{}{}
	argPos := 1

	if filters.AppId != "" {
		whereClause += fmt.Sprintf(" and \"appId\" = $%d", argPos)
		args = append(args, filters.AppId)
		argPos++
	}

	if filters.Level != "" {
		whereClause += fmt.Sprintf(" and level = $%d", argPos)
		args = append(args, filters.Level)
		argPos++
	}

	if filters.Search != "" {
		whereClause += fmt.Sprintf(" and message ilike $%d", argPos)
		args = append(args, "%"+filters.Search+"%")
		argPos++
	}

	if filters.StartDate != "" {
		whereClause += fmt.Sprintf(" and ts >= $%d", argPos)
		args = append(args, filters.StartDate)
		argPos++
	}

	if filters.EndDate != "" {
		whereClause += fmt.Sprintf(" and ts <= $%d", argPos)
		args = append(args, filters.EndDate)
		argPos++
	}

	// Get total count
	countQuery := fmt.Sprintf("select count(*) from log %s", whereClause)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var total int
	err := s.datasource.QueryRowContext(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		log.Printf("can't get logs count: %v", err)
		return nil, err
	}

	// Get logs
	query := fmt.Sprintf(`
		select id, level, pid, hostname, ts, message, "createdAt", "updatedAt", "appId"
		from log
		%s
		order by ts desc
		limit $%d offset $%d
	`, whereClause, argPos, argPos+1)

	args = append(args, filters.Limit, offset)

	rows, err := s.datasource.QueryContext(ctx, query, args...)
	if err != nil {
		log.Printf("can't get logs: %v", err)
		return nil, err
	}
	defer rows.Close()

	logs := []Log{}

	for rows.Next() {
		var logEntry Log
		var ts, createdAt, updatedAt time.Time

		err := rows.Scan(
			&logEntry.Id,
			&logEntry.Level,
			&logEntry.Pid,
			&logEntry.Hostname,
			&ts,
			&logEntry.Message,
			&createdAt,
			&updatedAt,
			&logEntry.AppId,
		)

		if err != nil {
			log.Printf("can't scan log: %v", err)
			continue
		}

		logEntry.Ts = ts.Format(time.RFC3339)
		logEntry.CreatedAt = createdAt.Format(time.RFC3339)
		logEntry.UpdatedAt = updatedAt.Format(time.RFC3339)

		logs = append(logs, logEntry)
	}

	totalPages := int(math.Ceil(float64(total) / float64(filters.Limit)))

	return &PaginatedLogs{
		Data:       logs,
		Total:      total,
		Page:       filters.Page,
		Limit:      filters.Limit,
		TotalPages: totalPages,
	}, nil
}

func (s *LogService) GetStats() (*LogStats, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Get total logs
	var totalLogs int
	err := s.datasource.QueryRowContext(ctx, "select count(*) from log").Scan(&totalLogs)
	if err != nil {
		log.Printf("can't get total logs: %v", err)
		return nil, err
	}

	// Get logs today
	var logsToday int
	query := "select count(*) from log where date(ts) = current_date"
	err = s.datasource.QueryRowContext(ctx, query).Scan(&logsToday)
	if err != nil {
		log.Printf("can't get logs today: %v", err)
		return nil, err
	}

	// Get logs by level
	logsByLevel := make(map[string]int)
	rows, err := s.datasource.QueryContext(ctx, "select level, count(*) from log group by level")
	if err != nil {
		log.Printf("can't get logs by level: %v", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var level string
		var count int
		if err := rows.Scan(&level, &count); err != nil {
			log.Printf("can't scan level stats: %v", err)
			continue
		}
		logsByLevel[level] = count
	}

	return &LogStats{
		TotalLogs:   totalLogs,
		LogsToday:   logsToday,
		LogsByLevel: logsByLevel,
	}, nil
}
