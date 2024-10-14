# Log-Engine

## Install requirements
```sh
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest

go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

echo $PATH

export PATH=$PATH:$(go env GOPATH)/bin

go mod tidy

```
