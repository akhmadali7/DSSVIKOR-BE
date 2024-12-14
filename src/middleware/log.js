import express from "express";

const log = (req, res, next) => {
    // console.log(`${req.method} ${req.originalUrl}`);
    res.on('finish', () =>
        console.log(`${req.method} ${req.originalUrl} - ${res.statusCode}`));
    next();
};


export {
    log
}
