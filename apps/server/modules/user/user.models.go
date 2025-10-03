package user

type UserToAdd struct {
	Username string   `json:"username" binding:"required,min=3,max=100"`
	Password string   `json:"password" binding:"required,min=8,max=128"`
	Role     string   `json:"role" binding:"required,oneof=admin user viewer"`
	Apps     []string `json:"apps"`
}

type User struct {
	Id       string   `json:"id"`
	Username string   `json:"username"`
	Role     string   `json:"role"`
	Apps     []string `json:"apps"`
}

type LoginInput struct {
	Username string `json:"username" binding:"required,min=3,max=100"`
	Password string `json:"password" binding:"required"`
}
