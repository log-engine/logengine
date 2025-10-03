package user

import (
	"database/sql"
	"log"

	"logengine/apps/server/middleware"
	"logengine/libs/datasource"
	"logengine/libs/utils"

	"github.com/gin-gonic/gin"
)

type UserModule struct {
	db     *sql.DB
	router *gin.Engine
}

func NewUserModule(db *sql.DB, router *gin.Engine) *UserModule {
	return &UserModule{db: db, router: router}
}

func (appM *UserModule) Bootstrap() {

	authGroupRouter := appM.router.Group("users")
	openGroupRouter := appM.router.Group("api")

	authGroupRouter.Use(middleware.Authorization(appM.db))

	appService := NewUserService(appM.db)
	appController := NewUserController(appM.router, appService)

	createAdminPayload := UserToAdd{
		Username: utils.GetEnv("ADMIN_USERNAME"),
		Password: utils.GetEnv("ADMIN_PASSWORD"),
		Role:     datasource.ADMINROLE,
		Apps:     []string{},
	}

	log.Printf("create admin info: %v", createAdminPayload)

	appService.CreateUser(&createAdminPayload, "")

	authGroupRouter.POST("/", appController.CreateUser)
	openGroupRouter.POST("/login", appController.Login)
}
