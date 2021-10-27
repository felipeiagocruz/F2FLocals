//Chamando mongoose e fazendo um Schema, essa variavél será importante ao tratar de relacionamentos.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const opts = {toJSON: {virtuals:true}}

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
});


const localSchema = new Schema({
    descricao: String,
    endereco: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    imagem: [ImageSchema],
    nome: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    doadores: Number,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
},opts)

localSchema.virtual('properties.popUpMarkup').get(function () {
return `<a href="/f2flocal/${this._id}">${this.nome}</a>
        <p>Doadores: ${this.doadores}</p>`
});


//Middleware do mongoose para fazer ações entre as ações descritas na função.
localSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

//Module é a função que permitirá eu fazer o require fora do arquivo, em seguida eu defino como
//o que será exportando como o modelo do Mongoose com o parámetro nome, que será colocado em plural
//pelo mongodb e o argumento do modelo criado acima.
module.exports = mongoose.model('local', localSchema);
