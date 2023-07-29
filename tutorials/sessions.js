const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const dbUri = require('../credentials')

const MongoStrore = require('connect-mongo')
const { Cookie } = require('express-session')

const app = express()
const dbOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true
}

//make connection object
const connection = mongoose.createConnection(dbUri, dbOptions)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//Config session storage
const sessionStore = new MongoStrore ({
    mongooseConnection: connection,
    collection: 'sessions'
})

//configure and dispatch session
app.use(session({
    secret: 'some sting', //Used to sign session ID cookie
    // Value should be rotated over time while keeping the 
    // old secrete string in the array of secretes
    // Secrete should be set from environment variables
    // Changing the secrete will invalidate all exisitng sessions. 
    // to prevent session invalidation, provide the new string as the first element
    // of the array containing all preceeding secretes
    resave: false, //if set to tru- forces session to be saved back to session store 
    // on every request even if
    //no changes have been made on the cookie: default value true is deprecated
    store: sessionStore,
    saveUninitialized: true, //Forces as session that is new but not modified (uninitialized) to be
    // saved to the store
    // setUninitialized: false is useful for setting login sessions, 
    // reducing server storage or complying with laws that require permission before setting a cookie
    // Default value is being deprecated
    cookie: {
        maxAge: 1000 * 60* 60 * 24 * 365,
        secure: process.env.COOKIE_SECURE,//secure : true/false:- setting secure to true restricts
        // Setting cookie only when server is accessed through https protocal. 
        // Otherwise, if the access protocol is http, the cooki will not be set
        // If the node application is set behind proxy, you need to trust the proxy to access
        // and set cookie when secure: true
        // Trusting proxy can be done as in the following code
    },
    genid: (req) => genuuid(), // default value is a function the uses uid-safe library to generate ids
    name: 'Name of session id', //default value is connect.sid
    // if you have several applications running on the same host, set names per app
    proxy: true, //default is undefined true trusts proxy                    
    rolling: true, //Setting rolling to true forces the session identifier cookie to be set
    // on every response, the expiration is set to original maxAge resetting the countdown
    // on the maxAge.Default value is false
    // With this set to true, the session identifier cookie will expire in the maxAge since the
    // last response was sent and not the default since the session was last modified by server
    // rolling: true only works as expected if setUnitialized: true

    unset: 'keep', //controls result of unsetting req.session through 'delete' , setting to null etc
    // default value is 'keep' :- keeps the session in store while 
    // modifications made during the request are not saves
    // unset: 'destroy': deletes/destroys the session when the response ends
}))

// Trust proxy
if(app.get(env) === 'production'){
    app.set('trust proxy', 1)
    session.cookie.secure = true
}

//Storing or accessing session data : - use req.session
app.get('/', (req, res) =>{
    if(req.session.views){
        req.session.views ++
        res.setHeader('Content-Types', 'text/html')
        res.write(`<p>views: ${req.session.views} </p>`)
        res.write(`<p>Session expires in: ${req.session.maxAge / 1000} seconds </p>`)
        res.end()
    } else{
        req.session.views = 1
        res.end('Welcome to the session demo. Refresh page to see session stats')
    }
    // modifying session
    req.session.regenerate(()=>{
        // regenerate initializes a new session at req.session
        // callback is invoked once the regeneration is compelete
        // New session generated
    })

    req.session.destroy(()=>{
        // destroy: destroys session and unset the req.session property
        // callback is invoked after the session has been destroyed
        // Cannot access session here
    })

    req.session.reload(()=>{
        // Reloads session data from session store
        // Callback is invoked after reload
        // Session updated
    })

    req.session.save(()=>{
        // Saves the session back to store replacing contents of store with memory contents
        // this method is automatically called if session data has been modified
        // and after a response has been served
        // The callback fuctionn is called when the save process is complete
            //Session saved
    })

    req.session.touch() 
        // Updates the cookie maxAge
        // Called by session middlewear
    
    req.session.id //Unique session identifier and is immutable, provided only for read

    req.session.cookie //Unique for each session/ user. 
    // Allows for altering of session cookie per visiter

    req.session.cookie.maxAge // returns time left to expiry
    req.session.cookie.originalMaxAge //returns original maxAge
    req.sessionID //Returns session unique id. Read only



})

//Session store implementation
store.all((error, sessions) =>{
    if(error) throw error
    return sessions
    //optional method which is used to get all sessions in the store as an array
    // callback is called once the job is done
})

store.destroy(sid, (error) =>{
    if(error) throw error
    //Required method used to delete session with the give session id (sid) from store
    // the callback is called once the operation is complete
})

store.clear((error) =>{
    if(error) throw error
    // optional method used to delete all sessions from store
    // callback is called once the store is cleared
})

store.length((error, len) =>{
    if(error) throw error
    return len
})

store.get(sid, (error, session) =>{
    if(error) throw error
    if(session) //otherwise session is not found and there was no error null/undefined
        return session
    // Required method used to get a session fro store given a session id
    // Callback is called once the operation is complete

    // if error.code === 'ENOENT callback is called with null on both parameters as argumests

})

store.set(sid, session, (error) =>{
    if(error) throw error
    // Required method used to upsert a session into the store given session iD and session object
    // Callback is called once the session has been set to store
})

store.touch(sid, session, (error)=>{
    if(error) throw error
    // Recommended method used to signal the store that a particular session is still active
    // to prevent the store from deleting the session due to idleness
    // Potentially resets the idle time
})

store.get

//get homepage
app.get('/', (req, res, next) =>{
    res.send('<h1>Hello world</h1>')
})

app.listen(3000)