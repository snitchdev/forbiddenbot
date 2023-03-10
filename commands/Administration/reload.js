const glob = require('glob')
const ownerid = '1053044263618883704';

module.exports = {
    name: "reload",

    run: async (client, message, args) => {
        if (message.author.id !== ownerid) return;
        client.commands.sweep(() => true)
        glob(`${__dirname}/../**/*.js`, async (err, filePaths) => {
            if (err) message.react("1053044263618883704")
            if (err) return console.log(err)
            filePaths.forEach((file) => {
                delete require.cache[require.resolve(file)]

                const pull = require(file)

                if (pull.name) {
                    // console.log(`Reloaded ${pull.name} (cmd)`)
                    client.commands.set(pull.name, pull)
                }

                if (pull.aliases && Array.isArray(pull.aliases)) {
                    pull.aliases.forEach((alias) => {
                        client.aliases.set(alias, pull.name)
                    })
                }
            })
            message.react("1053044263618883704")
        })
    }
}