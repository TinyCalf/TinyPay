var Log = require("./Log")("TEST")

Log.info("something happen")
Log.success("something done")
Log.err(new Error("something wrong"))
