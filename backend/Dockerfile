FROM golang:1.21-alpine 

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download


COPY *.go ./

RUN CGO_ENABLED=0 GOOS=linux go build -o /main

EXPOSE 3000

CMD ["./main"]
