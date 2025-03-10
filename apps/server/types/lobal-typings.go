package types

type User struct {
	Id       string   `json:"id"`
	Username string   `json:"username"`
	Role     string   `json:"role"`
	Apps     []string `json:"apps"`
}
