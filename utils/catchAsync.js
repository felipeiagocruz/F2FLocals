//Pega o erro da função assincrona e passa para o next

module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}