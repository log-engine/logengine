package user

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"logengine/libs/utils"
	"time"

	"github.com/google/uuid"
)

type UserService struct {
	datasource *sql.DB
}

func NewUserService(db *sql.DB) *UserService {
	return &UserService{datasource: db}
}

func (s *UserService) CreateUser(input *UserToAdd, performedBy string) (*User, error) {
	log.Printf("create une user input %s %s", input, fmt.Sprintf("%s", input.Apps))

	query := `insert into "user" (id,username,password,role,apps) values ($1, $2, $3, $4, $5) returning id, username, role, apps`

	if performedBy != "" {
		query = `insert into "user" (id,username,password,role,apps,"addedBy") values ($1, $2, $3, $4, $5, $6) returning id, username, role, apps`
	}

	log.Printf("create user query %s", query)

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)

	defer cancel()

	userID := uuid.New().String()

	apps, err := json.Marshal(input.Apps)

	if err != nil {
		log.Printf("can't scan user: %v", err)
		return nil, err
	}

	var row *sql.Row

	if performedBy != "" {
		row = s.datasource.QueryRowContext(ctx, query, userID, input.Username, utils.HashP(input.Password), input.Role, apps, performedBy)
	} else {
		row = s.datasource.QueryRowContext(ctx, query, userID, input.Username, utils.HashP(input.Password), input.Role, apps)
	}

	if row.Err() != nil {
		log.Printf("can't create user: %v", row.Err())
		return nil, row.Err()
	}
	user := &User{}

	apps = []byte{}

	err = row.Scan(&user.Id, &user.Username, &user.Role, &apps)

	if err != nil {
		log.Printf("can't scan user: %v", err)
		return nil, err
	}

	err = json.Unmarshal(apps, &user.Apps)

	if err != nil {
		log.Printf("can't unmarshal apps: %v", err)
		return nil, err
	}

	return user, nil
}

func (s *UserService) Login(input *LoginInput) (string, error) {
	log.Printf("login user input %s", input)

	query := `select id, password from "user" where username = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)

	defer cancel()

	row := s.datasource.QueryRowContext(ctx, query, input.Username)

	if row.Err() != nil {
		log.Printf("can't login user: %v", row.Err())
		return "", row.Err()
	}

	password := ""
	userId := ""

	row.Scan(&userId, &password)

	if password == "" || userId == "" {
		return "", fmt.Errorf("wrong password or username")
	}

	log.Printf("hashed password %s", password)
	log.Printf("plain password %s", input.Password)
	log.Printf("id %s", userId)

	isCorrectPwd := utils.CompareP(password, input.Password)

	if isCorrectPwd == false {
		return "", fmt.Errorf("wrong password or username")
	}

	token := utils.GenerateStr(16)

	query = `insert into "token" (id,token, "userId", "expiredAt") values ($1, $2, $3, $4) returning token`

	expiredAt := time.Now().Add(2 * time.Hour)
	id := uuid.New().String()

	row = s.datasource.QueryRowContext(ctx, query, id, token, userId, expiredAt)

	if row.Err() != nil {
		log.Printf("can't create token: %v", row.Err())
		return "", row.Err()
	}

	row.Scan(&token)

	return token, nil
}
