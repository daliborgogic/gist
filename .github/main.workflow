workflow "New workflow" {
  on = "push"
  resolves = [
    "200",
    "Sleep",
  ]
}

action "Run deploy script" {
  uses = "daliborgogic/actions/ssh@master"
  args = "date"
  secrets = [
    "PRIVATE",
    "PUBLIC",
    "HOST",
    "USER",
  ]
}

action "200" {
  uses = "daliborgogic/actions/200@master"
  needs = ["Run deploy script"]
  env = {
    URL = "https://daliborgogic.com"
    SECONDS_BETWEEN_CHECKS = "5"
    MAX_TRIES = "10"
  }
}

action "Sleep" {
  uses = "daliborgogic/actions/sleep@master"
  needs = ["Run deploy script"]
  args = "20"
}
