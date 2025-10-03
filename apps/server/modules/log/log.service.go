package log

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	str "strings"
	"time"

	"logengine/apps/server/types"
	"logengine/libs/utils"

	"github.com/google/uuid"
	"golang.org/x/net/context"
)

type LogService struct {
	datasource *sql.DB
}

func NewLogService(db *sql.DB) *LogService {
	return &LogService{datasource: db}
}

func (s *LogService) Find(inputs *FindLogInputs) *[]LogEntity {
	apps := &[]LogEntity{}

	query := "select id, name,key from app where id in(?) and name like ?"

	fmt.Printf("find application with inputs %v, query %s\n", inputs, query)

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)

	defer cancel()

	rows, err := s.datasource.QueryContext(ctx, query, str.Join(inputs.Ids, ","), inputs.Q)

	if err != nil {
		log.Fatalf("fail to query application with query %s, error %v\n", query, err.Error())
	}

	defer rows.Close()

	for rows.Next() {
		app := &LogEntity{}

		if err = rows.Scan(&app.Id, &app.Name, &app.Key); err != nil {
			log.Fatalf("scan app error %v\n", err)
		}

		*apps = append(*apps, *app)
	}

	return apps
}

func (s *LogService) Create(inputs *FindLogInputs, createdBy types.User) (*LogEntity, error) {
	log.Printf("create application %v\n inputs", inputs)

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	tx, err := s.datasource.BeginTx(ctx, nil)

	if err != nil {
		log.Fatalf("fail to begin transaction %v\n", err)
		return nil, err
	}

	defer tx.Rollback()

	query := `insert into app(id,name,key,admin) values($1, $2, $3, $4) returning id,key,name`

	id := uuid.New().String()
	key := utils.GenerateStr(20)
	row := tx.QueryRowContext(ctx, query, id, inputs.Name, key, createdBy.Id)

	app := &LogEntity{}

	if row.Err() != nil {
		log.Printf("fail to create application with query %s, error %v\n", query, row.Err())
		return nil, row.Err()
	}

	if err := row.Scan(&app.Id, &app.Key, &app.Name); err != nil {
		log.Fatalf("failed to scan application: %v", err)
		return nil, err
	}

	query = `update "user" set apps = $1 where id = $2`

	apps, err := json.Marshal(append(createdBy.Apps, app.Id))

	if err != nil {
		log.Printf("fail to marshal user apps %v\n", err)
		return nil, err
	}

	rowu, err := s.datasource.ExecContext(ctx, query, apps, createdBy.Id)

	if err != nil {
		log.Fatalf("fail to update user with query %s, error %v\n", query, err)
		return nil, err
	}

	if count, err := rowu.RowsAffected(); err != nil || count == 0 {
		log.Printf("fail to update user with query %s, error %v\n", query, err)
		return nil, err
	}

	if err := tx.Commit(); err != nil {
		log.Fatalf("fail to commit transaction %v\n", err)
		return nil, err
	}

	return app, nil
}
