const express = require('express');
const router = express.Router();
const f2flocalControllers = require('../controllers/f2flocal.js')
const catchAsync = require('../utils/catchAsync.js')
//Middleware que dá parse em formulários tupo multipart/form-data e permite fazer upload de arquivos.
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })


const { isLoggedIn, isAuthor, validarLocal } = require('../middleware.js')

router.route('/')
    .get(catchAsync(f2flocalControllers.index))
    .post(isLoggedIn, upload.array('image'), validarLocal,
        catchAsync(f2flocalControllers.criarF2flocal)
    )

router.get('/novo', isLoggedIn, f2flocalControllers.renderNovoFormulario)

router.route('/:id')
    .get(catchAsync(f2flocalControllers.renderF2flocal))
    .put(isLoggedIn, isAuthor, upload.array('image'), validarLocal, catchAsync(f2flocalControllers.updateF2flocal))
    .delete(isLoggedIn, isAuthor, catchAsync(f2flocalControllers.deleteF2flocal))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(f2flocalControllers.editF2flocal))

module.exports = router;