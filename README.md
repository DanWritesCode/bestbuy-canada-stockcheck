# BestBuy Canada Stock Checker
A simple stock-checking script for BestBuy Canada, written in Node.js.
The script checks BestBuy's inventory once every time it is run, so it's best used with a scheduler or crontab.

# Features
- Custom SKUs list
- Simple, only sends 1 HTTP request
- Proxy Support
- Easily customizable

# How it notifies you
The script sends an email by invoking PHP through the command line. Thus, in order to use the notification system of this script as-is, you must have PHP installed on your system.

# How to use
- Install PHP and have it accessible via PATH (test this by typing 'php' as a command)
- Edit the program's configuration in `bestbuy.js`. You can edit anything between "Program configuration" and "Start of program". This is where you specify your email address and desired message.
- Run the script as often as you'd like. To automate running it in the background, look into configuring Crontab (Linux) or Scheduler (Windows) on your system.

### Example crontab:
### Runs the script every other minute:
`*/2 * * * * /root/.nvm/versions/node/v12.10.0/bin/node /root/bestbuy.js >/dev/null 2>&1`

(This specific command will only work if you have Node v12.10.0 installed. To make it work on your system, run `which node` to find your Node binary location. For more crontab configuration settings, try https://crontab-generator.org/. Also, don't forget to update the location of the script.)
