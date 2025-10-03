package user

import (
	"net/http"

	"logengine/apps/server/types"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	router  *gin.Engine
	service *UserService
}

func NewUserController(router *gin.Engine, appService *UserService) *UserController {
	return &UserController{router: router, service: appService}
}

func (c *UserController) CreateUser(ctx *gin.Context) {
	var expectedBody UserToAdd

	if err := ctx.ShouldBindJSON(&expectedBody); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := c.service.CreateUser(&expectedBody, ctx.MustGet("me").(types.User).Id)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, user)
}

func (c *UserController) Login(ctx *gin.Context) {
	var expectedBody LoginInput

	errorData := map[string]string{
		"code":    "",
		"message": "",
	}

	if err := ctx.ShouldBindJSON(&expectedBody); err != nil {
		errorData["code"] = "BAD_REQUEST"
		errorData["message"] = "invalid request body"

		ctx.JSON(http.StatusBadRequest, errorData)
		return
	}

	token, err := c.service.Login(&expectedBody)

	if err != nil {
		errorData["code"] = "UNAUTHORIZED"
		errorData["message"] = "username or password invalid"

		ctx.JSON(http.StatusUnauthorized, errorData)
		return
	}

	data := map[string]string{
		"token": token,
	}

	ctx.JSON(http.StatusOK, data)
}
