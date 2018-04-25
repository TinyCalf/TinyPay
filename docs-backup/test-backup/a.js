var chalk = require("chalk")
var string = "\n---------------------------------------------------------------------\n"
   string += "|                                                                   |\n"
   string += "| Run 'npm run repo' to see detailed test reporter in browser !     |\n"
   string += "| Make sure you are running this test in regtest coinnodes!         |\n"
   string += "|                                                                   |\n"
   string += "---------------------------------------------------------------------\n"
console.log(chalk.blueBright(string))
