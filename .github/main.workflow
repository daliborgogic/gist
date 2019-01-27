workflow "New workflow" {
  on = "push"
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
