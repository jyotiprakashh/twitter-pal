FROM golang:alpine3.20

ENV GOLANG_VERSION 1.22.2

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download
RUN go mod tidy

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o /main

EXPOSE 3000

CMD ["/main"]