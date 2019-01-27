workflow "New workflow" {
  on = "push"
  resolves = ["Run deploy script"]
}

action "Run deploy script" {
  uses = "daliborgogic/actions/ssh@master"
  args = "ls"
  secrets = [
    "PRIVATE",
    "PUBLIC",
    "HOST",
    "USER"
  ]
}
