if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


//Require padrão do Express
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError.js')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js')
const helmet = require('helmet')

const mongoSanitize = require('express-mongo-sanitize')

const userRoutes = require('./routes/users.js')
const f2flocals = require('./routes/f2flocal.js')
const reviews = require('./routes/reviews.js');
const MongoStore = require('connect-mongo');


//'mongodb://localhost:27017/f2flocal'
//process.env.DB_URL
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/f2flocal';


//Conexão com o mongodb a partir do moonse, essas configurações são padrões e sugeridas pelo Colt.
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected')
})

const app = express();

app.engine('ejs', ejsMate)
//Texto padrão que o Colt usa para definir o diretório de views e alterar o render para EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

//Fazendo o parse dos componentes de resposta/requerimento das funções do express:
app.use(express.urlencoded({ extended: true }))
//Trazendo o middleware do method override que faz o fake do que não for "Get"/"Post"
app.use(methodOverride('_method'));

app.use(mongoSanitize());

app.use(helmet({
    contentSecurityPolicy: false
}));

const secret = process.env.SECRET || '#secreto'

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: secret
    }
});

store.on("error", function (e) {
    console.log("Seesion store error", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        // secure: true,
        httpOnly: true
    }
}
app.use(session(sessionConfig))
app.use(flash())
//Colocar o passport para usar session também
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
//Criando um middleware que pegue o flash em todos os casos e disponibilize diretamente no template.
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})


app.use('/', userRoutes)
app.use('/f2flocal', f2flocals)
app.use('/f2flocal/:id/reviews', reviews)
app.use(express.static(path.join(__dirname, 'public')))


app.get('/', (req, res) => {
    res.render('home');
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Algo deu errado."
    res.status(statusCode).render('error', { err })
})





app.listen(3000, (req, res) => {
    console.log('It Worked, port 3000')
})
