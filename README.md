# Log-Engine

## Install requirements
```sh
# install protoc compiler
brew install protobuf

arch -arm64 brew install protobuf # for m1 macbook

# install protoc-gen-go
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest

# install protoc-gen-go-grpc
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest


export PATH="$PATH:$(go env GOPATH)/bin"

make generate_proto

# install app packages
go mod tidy

# run http server app
make run_http_server

# run grpc server app
make run_grpc_server

```
