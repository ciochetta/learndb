const repl = require('repl');


myContext = {
    SELECT: {
        teste:"funcionou"
    }
}


const myRelp = repl.start("Luis DB *** ")

Object.assign(myRelp.context, myContext)