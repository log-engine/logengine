package application

type FindApplicationInputs struct {
	Q   string
	Ids []string
}

type CreateApplicationInputs struct {
	Name  string
	Admin string
}

type ApplicationEntity struct {
	Id   string
	Name string
	Key  string
}

type ApplicationToAdd struct {
	Name  string
	Admin string
}

type ApplicationToEdit struct {
	Id   string
	Name string
}
