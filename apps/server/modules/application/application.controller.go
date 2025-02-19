package application

import (
	"encoding/json"
	"fmt"
	appTyping "logengine/apps/server/modules/app-typing"
	logengineHTTP "logengine/apps/server/modules/http"
	"net/http"

	"github.com/gin-gonic/gin"
	// app "logengine.http/modules"
)

type ApplicationController struct {
	router  *gin.Engine
	service *ApplicationService
}

func NewApplicationController(router *gin.Engine, appService *ApplicationService) *ApplicationController {
	return &ApplicationController{router: router, service: appService}
}

func (c *ApplicationController) FindApps(ctx *gin.Context) {
	q, exist := ctx.GetQuery("q")

	fmt.Println(q)
	fmt.Println(exist)

	apps := c.service.Find(&FindApplicationInputs{Q: q, Ids: []string{"A", "B"}})

	data, err := json.Marshal(apps)

	if err != nil {
		fmt.Printf("can't marchal response %v \n", err)
		data, _ = json.Marshal(&logengineHTTP.ApiResponse{Code: "SERVER_ERROR"})
		ctx.Data(http.StatusBadGateway, "application/json", data)
	}

	ctx.Data(http.StatusOK, "application/json", data)

}

func (c *ApplicationController) CreateApp(ctx *gin.Context) {
	var expectedBody CreateApplicationInputs

	if err := ctx.BindJSON(expectedBody); err != nil {
		badReq := appTyping.BadRequest{Code: "BAD_REQUEST", Message: "invalid inputs"}
		data, _ := json.Marshal(badReq)
		ctx.Data(http.StatusBadRequest, "application/json", data)
	}

	app := c.service.Create(&expectedBody)

	data, _ := json.Marshal(app)

	ctx.Data(http.StatusOK, "application/json", data)

}
