// global error handling middleware

function errHandling(err, req, res, next) {
    res.status(err.status || 500).json({ 
        status: err.status || 500,
        code: err.code || 'INTERNAL_ERR',
        message: err.message || 'Internal server error.'
    })
}

module.exports = { errHandling }