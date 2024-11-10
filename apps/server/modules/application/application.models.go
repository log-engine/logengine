package application

import "time"

type FindApplicationInputs struct {
	Q string 
	Ids []string
}

type ApplicationEntity struct {
	Id string
	Name string
	CreatedAt time.Time
	UpdatedAt time.Time
}

type ApplicationToAdd struct {
	Name string
	Admin string
}

type ApplicationToEdit struct {
	Id string
	Name string
}