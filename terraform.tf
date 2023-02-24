terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 2.21.0"
    }
  }
}

resource "docker_image" "nginx" {
  name         = "nginx:latest"
  keep_locally = false
}

resource "docker_container" "vue2-live-chat-server-redis" {
  image   = "redis:latest"
  name    = "vue2-live-chat-server-redis"
  restart = "always"

  ports {
    internal = 6379
    external = 6379
  }
}

resource "docker_container" "nginx" {
  image = docker_image.nginx.name
  name  = "vue2-live-chat-server-load-balancer"

  must_run          = true
  restart           = "always"
  publish_all_ports = false
  depends_on = [
    docker_container.vue2-live-chat-server-1,
    docker_container.vue2-live-chat-server-2
  ]
  links = [
    "vue2-live-chat-server-1:vue2-live-chat-server-1",
    "vue2-live-chat-server-2:vue2-live-chat-server-2"
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

resource "docker_image" "server_image" {
  name = "server_image"

  build {
    path       = "."
    dockerfile = "Dockerfile"
    target     = "deploy-server"
  }
}

resource "docker_container" "vue2-live-chat-server-1" {
  image             = docker_image.server_image.image_id
  name              = "vue2-live-chat-server-1"
  env               = ["APP_REDIS=1"]
  user              = "node"
  must_run          = true
  restart           = "always"
  publish_all_ports = true
  depends_on        = ["docker_container.vue2-live-chat-server-redis"]
  links             = ["vue2-live-chat-server-redis:vue2-live-chat-server-redis"]

  ports {
    internal = 3000
    external = 3001
  }

  ports {
    internal = 4000
    external = 4001
  }
}

resource "docker_container" "vue2-live-chat-server-2" {
  image             = docker_image.server_image.image_id
  name              = "vue2-live-chat-server-2"
  env               = ["APP_REDIS=1"]
  user              = "node"
  must_run          = true
  restart           = "always"
  publish_all_ports = true
  depends_on        = ["docker_container.vue2-live-chat-server-redis"]
  links             = ["vue2-live-chat-server-redis:vue2-live-chat-server-redis"]

  ports {
    internal = 3000
    external = 3002
  }

  ports {
    internal = 4000
    external = 4002
  }
}

resource "docker_image" "client_image" {
  name = "client_image"

  build {
    path       = "."
    dockerfile = "Dockerfile"
    target     = "deploy-client"
  }
}

resource "docker_container" "vue2-live-chat-client" {
  image = docker_image.client_image.name
  name  = "vue2-live-chat-client"

  must_run          = true
  restart           = "always"
  publish_all_ports = false

  ports {
    internal = 80
    external = 5173
    protocol = "tcp"
  }
}
