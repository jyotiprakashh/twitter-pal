FROM golang:1.22-alpine AS build

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download


COPY *.go ./
COPY .env .env

RUN CGO_ENABLED=0 GOOS=linux go build -o /main

EXPOSE 3000

CMD ["./main"]
