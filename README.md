# heroku-node: Node application demo repository for Heroku presentation

Related repo: <https://github.com/lisadean/heroku-static> Look at the README for this one first. Information in that applies here as well.

## To run this application locally

* Must have Heroku CLI installed
* Create a `.env` file at the root of the backend directory with this text: `STUFF=things`
* Run `npm install`
* Run `npm start` or `npm run dev` to run application and access at http://localhost:3000

## Prepare repo for Heroku deployment

* Create a new Heroku app

### Buildpacks

* Add the Node buildpack
* If your application's main script does not exist at the root of your repository, you'll need to use this buildpack as well. It replaces the contents of the application directory on the Heroku server with just the contents of the chosen subdirectory.
  * Add the `https://github.com/timanovsky/subdir-heroku-buildpack`
  * Make sure this buildpack is before any others. You can drag and drop them in the list
  * Add a environment variable under Settings > Config Vars > Reveal Config Vars called PROJECT_PATH. The value should be the path to your main script file. For example, in this repository, that config variable value would be `backend`

### Database or other addons

* Add a database if needed under Resources > Add-ons

### Conifiguration

* Create a file called `Procfile` at the root of your application directory
  * At the very least, put this line in the file. It tells Heroku how to run the application: `web: npm start`
  * If you are using a release tasks script, insert this line as well: `release: ./release-tasks.sh`
* Modify your npm dev script to run using the local Heroku environment. This makes sure your local environment is as close as possible to the deployed environment: `nodemon --exec 'heroku local' --signal SIGTERM`
* It may be useful to set a NODE_ENV environment variable. It is a variable avaiable by default on Heroku. The value of the variable on the Heroku slug is `production`: `const NODE_ENV = process.env.NODE_ENV || 'dev'`
* Make sure your post selection is dynamic: `const port = process.env.PORT || 3000`

### Deploy

Deploy via CLI or the dashboard.

### Release tasks

Heroku can run tasks after the slug is built but before it is released such as database migrations or copying assets to Amazon S3.

* Create a script to run your tasks
* Make sure to make the script executable: `chmod +x release-tasks.sh`
* Make sure to add the release line to your Procfile

## Troubleshooting

Heroku, unlike AWS, automatically takes care of things like Nginx and database configuration so the shell and file system seem hidden. However you can still access them.

Note: If you have not set a heroku remote because you are deploying automatically via GitHub integration or manually via the dashboard, you will need to tell the CLI which app you want to connect to with the `-a` argument.

### Shell & file access

`heroku run bash`
`heroku run bash -a <heroku-app-name>`

This gives you access to the bash shell on your Heroku slug similar to an SSH session. Note that this shell is different for each deployed slug. If you are connected to it when you deploy a new release, make a change to configuration variables or a number of other things that cause the slug to be rebuilt, you will find that you are not connected to the system you thought you were. It is best to connect to the shell, run your command and disconnect as soon as you are done.

You can access the file system via the shell. However, the file system is ephemeral. It is destroyed and rebuilt with each slug deployment. Any changes you make here will not survive long. If you need persistent file storage for files not stored in your repository, you need to use something like Amazon S3.

Use `exit` to quit.

### Logs

`heroku logs -tail`
`heroku logs -tail -a <heroku-app-name>`

Using the `-tail` argument will show the last few lines of the console log and continue to show new updates to the console. Use `Ctrl + c` to quit.

### PostgreSQL & PSQL

If you've provisioned a Postgres database, you will have a `DATABASE_URL` config variable. That means you'll need to use the URL form of the database connection on your local environment as well unless you use logic to configure them differently based on environment. You can detect which environment you are running through the `NODE_ENV` environment variable.

`heroku pg:psql`
`heroku pg:psql -a <heroku-app-name>`

This gives you access to psql for primary database attached to your Heroku app. Exit with the normal `\q`.

`heroku pg:psql -a <heroku-app-name> < database.schema.pgsql`

You can also run psql scripts via this command. Make sure the `-a` argument comes right after `pg:psql` if you are using that. This is good for creating your database schema or bulk adding data.

### Sequelize

`heroku pg:reset -a <heroku-app-name> DATABASE_URL --confirm <heroku-app-name>`
`heroku run -a <heroku-app-name> sequelize db:migrate`

If you are using Sequelize, you can run the `sequelize` command to do your migrations. You will not be able to drop and recreate your database via that command because of permissions. You will need to run the `pg:reset` command.

If you are running your migrations in the release tasks script, you just use the normal shell command for that: `./node_modules/.bin/sequelize db:migrate`
