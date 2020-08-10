const express = require('express');
const app = express(); 
const {verificaToken} = require('../middlewares/autenticacion');
const Producto = require('../models/producto');
const _ = require('underscore');
const usuario = require('../models/usuario');



app.get('/producto', verificaToken, (req, res)=>{
    // Paginación
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({disponible: true})
        .skip(desde)
        .limit(limite)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            Producto.countDocuments({disponible: true}, (err, conteo)=>{
                res.json({
                    ok: true,
                    producto: productoDB,
                    cuantos: conteo
                })
            })
        });
});

app.get('/producto/:id', verificaToken, (req, res)=>{

    let id = req.params.id;

    Producto.findById({_id:id})
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            if(!productoDB){
                return res.status(400).json({
                    ok:false,
                    err: 'El producto no fue encotrado'
                })
            }

            res.json({
                ok: true,
                producto: productoDB
            })
        })
})



app.get('/producto/buscar/:termino', verificaToken, (req, res)=>{
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex, disponible:true})
        .populate('categoria', 'nombre')
        .exec((err, productoDB)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            } 

            res.json({
                ok: true,
                producto: productoDB
            })
        })
});

app.post('/producto', verificaToken, (req, res)=>{

    let body = req.body; 

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id
    });


    producto.save((err, productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            producto: productoDB
        })
    })

});

app.put('/producto/:id', verificaToken, (req, res)=>{
    let id  = req.params.id;

    let body = req.body;
    let updateDate = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    };

   
   Producto.findByIdAndUpdate(id, updateDate, {new:true, runValidators: true},(err, productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err:'El producto no fue encontrado'
            });
        }

        res.json({
            ok:true,
            producto: productoDB
        });
   })
});


app.delete('/producto/:id', verificaToken, (req, res)=>{

    let id = req.params.id;

    Producto.findByIdAndUpdate(id, {disponible: req.body.disponible }, {new:true, runValidators: true}, (err, productoDB)=>{
        if (err) {
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if (!productoDB) {
            res.status(400).json({
                res:false,
                err: 'El producto no fue encontrado '
            }) 
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    });
});

module.exports = app;