IMAGE_NAME = tweet-generator
CONTAINER_NAME = tweet-generator-container
PORT = 3000

build:
	docker build -t $(IMAGE_NAME) .

run:
	docker run -d --name $(CONTAINER_NAME) -p $(PORT):$(PORT) $(IMAGE_NAME)

stop:
	docker stop $(CONTAINER_NAME) || true

rm:
	docker rm $(CONTAINER_NAME) || true

clean: stop rm

rebuild: clean build run

.PHONY: build run stop rm clean rebuild
