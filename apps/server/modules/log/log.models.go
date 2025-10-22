package log

type Log struct {
	Id        string `json:"id"`
	Level     string `json:"level"`
	Pid       string `json:"pid"`
	Hostname  string `json:"hostname"`
	Ts        string `json:"ts"`
	Message   string `json:"message"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
	AppId     string `json:"appId"`
}

type GetLogsFilters struct {
	AppId     string `form:"appId"`
	Level     string `form:"level"`
	StartDate string `form:"startDate"`
	EndDate   string `form:"endDate"`
	Search    string `form:"search"`
	Page      int    `form:"page"`
	Limit     int    `form:"limit"`
}

type PaginatedLogs struct {
	Data       []Log `json:"data"`
	Total      int   `json:"total"`
	Page       int   `json:"page"`
	Limit      int   `json:"limit"`
	TotalPages int   `json:"totalPages"`
}

type LogStats struct {
	TotalLogs   int            `json:"totalLogs"`
	LogsToday   int            `json:"logsToday"`
	LogsByLevel map[string]int `json:"logsByLevel"`
}
