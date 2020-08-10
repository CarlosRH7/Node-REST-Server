const express = require('express');
const app = express();
let {verificaToken, verificaAdminRole} = require('../middlewares/autenticacion');
let Categoria = require('../models/categoria');


app.get('/categoria', verificaToken, (req, res)=>{
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB)=>{
            console.log(err);
            if(err){
                return res.status(400).json({
                    ok:false,
                    err
                })
            }

            Categoria.countDocuments((err, conteo)=>{
                res.json({
                    ok: true,
                    categoria: categoriaDB,
                    cuantos: conteo
                })
            })
        })
});


app.get('/categoria/:id', verificaToken, (req, res)=>{

    let id = req.params.id;
    Categoria.findById({_id: id}).exec((err, categoriaDB)=>{
        if(err){

            return res.status(400).json({
                ok:false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err: 'La categoría no fue encontrada.'
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});



app.post('/categoria', [verificaToken, verificaAdminRole], (req, res)=>{

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err: 'La categoría no fue encontrada.'
            });
        }

        res.json({
            ok:true,
            categoria: categoriaDB
        });
    });

});


app.put('/categoria/:id', verificaToken, (req, res)=>{
    let id = req.params.id;
    Categoria.findByIdAndUpdate(id, {descripcion: req.body.descripcion}, {new:true, runValidators: true}, (err, categoriaDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err: 'La categoría no fue encontrada.'
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
});


app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res)=>{
    
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });           
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok:false,
                err: 'La categoría no fue encontrada.'
            });
        }

        res.json({
            ok:true,
            categoria: categoriaDB
        });
    })
} );


module.exports = app;