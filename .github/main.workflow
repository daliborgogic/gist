workflow "New workflow" {
  on = "push"
  resolves = ["200"]
}

action "Run deploy script" {
  uses = "daliborgogic/actions/ssh@master"
  args = "ls"
  secrets = [
    "PRIVATE",
    "PUBLIC",
    "HOST",
    "USER",
  ]
}

action "200" {
  uses = "200"
  needs = ["Run deploy script"]
  env = {
    URL = "https://daliborgogic.com"
    SECONDS_BETWEEN_CHECKS = "5"
    MAX_TRIES = "10"
  }
}
