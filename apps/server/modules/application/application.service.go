package application

import (
	"database/sql"
	"fmt"
	"log"
	str "strings"
	"time"

	"golang.org/x/net/context"
)

type ApplicationService struct {
	datasource *sql.DB
}

func NewApplicationService(db *sql.DB) *ApplicationService {
	return &ApplicationService{datasource: db}
}

func (s *ApplicationService) Find(inputs *FindApplicationInputs) *[]ApplicationEntity {
	apps := &[]ApplicationEntity{}

	query := "select id, name, createdAt, updatedAt from app where id in(?) and name like ?"

	fmt.Printf("find application with inputs %v, query %s\n", inputs, query)

	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)

	defer cancel()

	rows, err := s.datasource.QueryContext(ctx, query, str.Join(inputs.Ids, ","), inputs.Q)

	if err != nil {
		log.Fatalf("fail to query application with query %s, error %v\n", query, err.Error())
	}

	defer rows.Close()

	for rows.Next() {
		app := &ApplicationEntity{}

		if err = rows.Scan(app.Id, app.Name, app.CreatedAt, app.UpdatedAt); err != nil {
			log.Fatalf("scan app error %v\n", err)
		}

		*apps = append(*apps, *app)
	}

	return apps
}
