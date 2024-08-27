FROM golang:1.19-alpine AS build

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o main .

FROM alpine:latest

WORKDIR /root/

COPY --from=build /app/main .

COPY --from=build /app/config ./config

EXPOSE 3000

CMD ["./main"]
