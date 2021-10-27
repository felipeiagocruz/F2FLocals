const f2flocal = require('../models/f2flocal');
const { cloudinary } = require("../cloudinary")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res, next) => {
    const locals = await f2flocal.find({});
    res.render('f2flocal/index.ejs', { locals })
}

module.exports.renderNovoFormulario = (req, res) => {
    res.render('f2flocal/novo.ejs')
}

module.exports.criarF2flocal = async (req, res) => {


    const geoData = await geocoder.forwardGeocode({
        query: `${req.body.local.endereco}`,
        limit: 1
    }).send()
    const local = new f2flocal(req.body.local)
    local.geometry = geoData.body.features[0].geometry;
    local.imagem = req.files.map(f => ({ url: f.path, filename: f.filename }))
    local.author = req.user._id;
    await local.save();
    req.flash('success', 'Um novo local foi criado!')
    res.redirect(`/f2flocal/${local._id}`);
}

module.exports.renderF2flocal = async (req, res) => {
    const local = await f2flocal.findById(req.params.id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author')
    if (!local) {
        req.flash('error', 'Não foi possível encontrar esse local.')
        res.redirect('/f2flocal')
    }
    res.render('f2flocal/detalhes.ejs', { local })
}

module.exports.editF2flocal = async (req, res) => {
    const local = await f2flocal.findById(req.params.id)
    res.render('f2flocal/editar.ejs', { local })
}

module.exports.updateF2flocal = async (req, res) => {
    const local = await f2flocal.findByIdAndUpdate(req.params.id, req.body.local)
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    local.imagem.push(...imgs);
    await local.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            console.log(filename)
            await cloudinary.uploader.destroy(filename);
        }
        await local.updateOne({ $pull: { imagem: { filename: { $in: req.body.deleteImages } } } })
    }
    res.redirect(`/f2flocal/${local._id}`);
}

module.exports.deleteF2flocal = async (req, res) => {
    const local = await f2flocal.findByIdAndDelete(req.params.id)
    res.redirect(`/f2flocal`);
}