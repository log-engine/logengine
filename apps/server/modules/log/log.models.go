package log

type FindLogInputs struct {
	Q         string   `json:"q"`
	Limit     int      `json:"limit"`
	Offset    int      `json:"offset"`
	AppId     string   `json:"appId"`
	Ids       []string `json:"ids"`
	Name      string   `json:"name"`
	StartDate string   `json:"startDate"`
	EndDate   string   `json:"endDate"`
}

type LogEntity struct {
	Id   string `json:"id"`
	Name string `json:"name"`
	Key  string `json:"key"`
}
