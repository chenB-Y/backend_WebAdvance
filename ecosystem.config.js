module.exports = {
  apps : [{
    name   : "backend",
    script : "./dist/src/Server.js",
    env_production: {
      NODE_ENV: "production"
    }
  }]
}
