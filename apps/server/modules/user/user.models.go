package user

type UserToAdd struct {
	Username string   `json:"username"`
	Password string   `json:"password"`
	Role     string   `json:"role"`
	Apps     []string `json:"apps"`
}

type User struct {
	Id       string   `json:"id"`
	Username string   `json:"username"`
	Role     string   `json:"role"`
	Apps     []string `json:"apps"`
}

type LoginInput struct {
	Username string `json:"username"`
	Password string `json:"password"`
}
