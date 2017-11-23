var log = require("./log")("logtest")

log.print({a:"a",b:"b"})
log.print("hello")

log.info({a:"a",b:"b"})
log.info("hello")

log.err({a:"a",b:"b"})
log.err("hello")

log.warn({a:"a",b:"b"})
log.warn("hello")

log.success({a:"a",b:"b"})
log.success("hello")
