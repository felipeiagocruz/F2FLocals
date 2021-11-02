const mongoose = require('mongoose');
const F2flocal = require('../models/f2flocal')
const stations = require('./stations')

//Conexão com o mongodb a partir do moonse, essas configurações são padrões e sugeridas pelo Colt.
mongoose.connect('', {
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
                author: "6179dd2d08534500163a4849",
                doadores: 0,
                imagem: [
                    {
                        url: 'https://res.cloudinary.com/dkbkcfecr/image/upload/v1635262150/f2flocal/rxcytvzuh3cgwrgr206x.jpg',
                        filename: 'f2flocal/ebs0x20vwgbct13txp7q'
                    },
                    {
                        url: 'https://res.cloudinary.com/dkbkcfecr/image/upload/v1635369629/f2flocal/matyyhzu1rstcmjetgxh.jpg',
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