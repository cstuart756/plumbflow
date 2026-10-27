# PlumbFlow Runbook

## How to view production logs
`heroku logs --tail -a plumbflow-app`

## How to roll back a bad deploy
`heroku releases:rollback -a plumbflow-app`

## How to update Stripe/Resend API Keys
1. Update the keys in your local `.env` file.
2. Update the keys in the Heroku Dashboard -> Settings -> Config Vars.
3. If Stripe keys changed, restart the dynos: `heroku restart -a plumbflow-app`.