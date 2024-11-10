package application

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	app "logengine.http/modules"
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

	apps := c.service.Find(&FindApplicationInputs{Q: q, Ids: []string{}})

	data, err := json.Marshal(apps)

	if err != nil {
		fmt.Printf("can't marchal response %v \n", err)
		data, _ = json.Marshal(&app.ApiResponse{Code: "SERVER_ERROR"})
		ctx.Data(http.StatusBadGateway, "application/json", data)
	}

	ctx.Data(http.StatusOK, "application/json", data)

}
