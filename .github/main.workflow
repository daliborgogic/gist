workflow "New workflow" {
  on = "push"
  resolves = ["Run deploy script"]
}

action "Run deploy script" {
  uses = "daliborgogic/actions/ssh@master"
  args = "date"
  secrets = [
    "PRIVATE",
    "PUBLIC",
    "HOST",
    "USER"
  ]
}
