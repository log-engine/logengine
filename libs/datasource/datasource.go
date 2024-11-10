package datasource

import (
	"context"
	"database/sql"
	"fmt"
	"time"
)

type Datasource struct {
	uri    string
	driver string
	db     *sql.DB
}

func NewDatasource(uri string, driver string) *Datasource {
	fmt.Println("new datasource creating ...")

	db := &Datasource{uri: uri, driver: driver}

	db.init()

	return db
}

func (ds *Datasource) init() {
	fmt.Printf("init new datasource, driver '%s' , uri '%s'\n", ds.driver, ds.uri)

	db, err := sql.Open(ds.driver, ds.uri)

	if err != nil {
		fmt.Printf("fail to init new datasource, driver '%s' , uri '%s'\n", ds.driver, ds.uri)
		panic(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)

	defer cancel()

	err = db.PingContext(ctx)

	if err != nil {
		fmt.Printf("fail to ping db, driver '%s' , uri '%s'\n", ds.driver, ds.uri)
		panic(err)
	}

	ds.db = db

	runDDL(engineDDL, ds.db)
}

func runDDL(ddlSQL string, db *sql.DB) {
	fmt.Printf("run ddl ..., '%s'\n", ddlSQL)

	_, err := db.Exec(ddlSQL)

	if err != nil {
		fmt.Printf("dll running failed, error '%s' \n", err.Error())
		panic(err)
	}

	fmt.Printf("ddl queries is applied successfully, affected row \n")
}
