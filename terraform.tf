terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 2.21.0"
    }
  }
}

resource "docker_image" "nginx" {
  name         = "nginx:1.23.3-alpine-slim"
  keep_locally = false
}

resource "docker_container" "vue-live-chat-server-redis" {
  image   = "redis:latest"
  name    = "vue-live-chat-server-redis"
  restart = "always"

  ports {
    internal = 6379
    external = 6379
  }
}

resource "docker_container" "nginx" {
  image = docker_image.nginx.name
  name  = "vue-live-chat-server-load-balancer"

  must_run          = true
  restart           = "always"
  publish_all_ports = false
  depends_on = [
    docker_container.vue-live-chat-server-1,
    docker_container.vue-live-chat-server-2
  ]
  links = [
    "vue-live-chat-server-1:vue-live-chat-server-1",
    "vue-live-chat-server-2:vue-live-chat-server-2"
  ]

  ports {
    internal = 3000
    external = 3000
  }

  ports {
    internal = 4000
    external = 4000
  }

  upload {
    content = file("server/nginx.conf")
    file    = "/etc/nginx/nginx.conf"
  }
}

resource "docker_image" "vue-live-chat-server-image" {
  name = "vue-live-chat-server-image"

  build {
    path       = "."
    dockerfile = "Dockerfile"
    target     = "deploy-server"
  }
}

resource "docker_container" "vue-live-chat-server-1" {
  image             = docker_image.vue-live-chat-server-image.image_id
  name              = "vue-live-chat-server-1"
  env               = ["APP_REDIS=1"]
  user              = "node"
  must_run          = true
  restart           = "always"
  publish_all_ports = true
  depends_on        = ["docker_container.vue-live-chat-server-redis"]
  links             = ["vue-live-chat-server-redis:vue-live-chat-server-redis"]

  ports {
    internal = 3000
    external = 3001
  }

  ports {
    internal = 4000
    external = 4001
  }
}

resource "docker_container" "vue-live-chat-server-2" {
  image             = docker_image.vue-live-chat-server-image.image_id
  name              = "vue-live-chat-server-2"
  env               = ["APP_REDIS=1"]
  user              = "node"
  must_run          = true
  restart           = "always"
  publish_all_ports = true
  depends_on        = ["docker_container.vue-live-chat-server-redis"]
  links             = ["vue-live-chat-server-redis:vue-live-chat-server-redis"]

  ports {
    internal = 3000
    external = 3002
  }

  ports {
    internal = 4000
    external = 4002
  }
}

resource "docker_image" "vue-live-chat-client-image" {
  name = "vue-live-chat-client-image"

  build {
    path       = "."
    dockerfile = "Dockerfile"
    target     = "deploy-client"
  }
}

resource "docker_container" "vue-live-chat-client" {
  image = docker_image.vue-live-chat-client-image.name
  name  = "vue-live-chat-client"

  must_run          = true
  restart           = "always"
  publish_all_ports = false

  ports {
    internal = 80
    external = 5173
    protocol = "tcp"
  }
}
