package application

type FindApplicationInputs struct {
	Q   string
	Ids []string
}

type ApplicationEntity struct {
	Id   string `json:"id"`
	Name string `json:"name"`
	Key  string `json:"key"`
}

type ApplicationToAdd struct {
	Name string `json:"name"`
}

type ApplicationToEdit struct {
	Id   string
	Name string
}
