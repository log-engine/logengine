package user

type UserToAdd struct {
	Username string   `json:"username" binding:"required,min=3,max=100"`
	Password string   `json:"password" binding:"required,min=8,max=128"`
	Role     string   `json:"role" binding:"required,oneof=admin user viewer"`
	Apps     []string `json:"apps"`
}

type User struct {
	Id        string   `json:"id"`
	Username  string   `json:"username"`
	Role      string   `json:"role"`
	Apps      []string `json:"apps"`
	CreatedAt string   `json:"createdAt,omitempty"`
	UpdatedAt string   `json:"updatedAt,omitempty"`
	AddedBy   string   `json:"addedBy,omitempty"`
}

type LoginInput struct {
	Username string `json:"username" binding:"required,min=3,max=100"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}
