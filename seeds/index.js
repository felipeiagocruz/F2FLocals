const mongoose = require('mongoose');
const F2flocal = require('../models/f2flocal')
const stations = require('./stations')

//Conexão com o mongodb a partir do moonse, essas configurações são padrões e sugeridas pelo Colt.
mongoose.connect('mongodb://localhost:27017/f2flocal', {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected')
})
let title = ''
let descricao = ''
let address = ''
let latitude = ''
let longitude = ''
const seedDB = async () => {
    await F2flocal.deleteMany({});
    for (let s of stations) {
        for (const [key, value] of Object.entries(s)) {
            for (const [k, v] of Object.entries(value)) {

                if (k === 'lines') {
                    let lines = await v
                    descricao = lines.toString()
                }
                if (k === 'location') {
                    for (const [k1, v1] of Object.entries(v)) {
                        if (k1 === 'address') {
                            address = await v1
                        }
                        if (k1 === 'latitude') {
                            Olatitude = await v1
                        }
                        if (k1 === 'longitude') {
                            Olongitude = await v1
                        }
                    }
                }
                if (k === 'title') {
                    title = await v;
                }
            }
            let local = {
                nome: await title,
                descricao: await descricao,
                endereco: await address,
                geometry: {
                    type: "Point",
                    coordinates: [Olongitude, Olatitude]

                },
                author: "6179c21bd75ad829a88fcb89",
                doadores: 0,
                imagem: [
                    {
                        url: 'https://res.cloudinary.com/dkbkcfecr/image/upload/v1635182662/f2flocal/ebs0x20vwgbct13txp7q.jpg',
                        filename: 'f2flocal/ebs0x20vwgbct13txp7q'
                    },
                    {
                        url: 'https://res.cloudinary.com/dkbkcfecr/image/upload/v1635182662/f2flocal/gccvegxsjzrgxs1ortfm.jpg',
                        filename: 'f2flocal/gccvegxsjzrgxs1ortfm'
                    }
                ]
            }
            let l = new F2flocal(local)
            await l.save();

        }

    }
}
//fechando a conexão.
seedDB().then(() => {
    mongoose.connection.close()
})