const { application } = require('express');
const express = require('express');
const { prototype } = require('express-handlebars/lib/express-handlebars');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

// ----- ----- Propietario ----- -----

// ----- Proyectos ------

router.get('/' , async(req,res) => {
    if( req.user.email == "admin@admin.com" ){
        const proyectos = await pool.query('SELECT * FROM proyecto');
        //console.log(proyectos);
        res.render('proyectos/list' , {proyectos});
    }
    else{
        const proyectos = await pool.query('SELECT * FROM proyecto WHERE user_id = ?', req.user.user_id);
        //console.log(proyectos);
        res.render('proyectos/list' , {proyectos});
    }
    
});

// ----- Add Proyectos -----

router.get('/add', isLoggedIn ,(req, res) => {
    res.render('proyectos/add');
})

router.post('/add', isLoggedIn ,async (req,res) => {
    const { nombre, img_url, descripcion } = req.body;
    const newProyecto = {
        nombre,
        img_url,
        descripcion,
        user_id: req.user.user_id,
        subCategoria_id: 11
    };  

    const result = await pool.query('INSERT INTO proyecto set ?' , [newProyecto] );
    newProyecto.proyecto_id = result.insertId;
    
    //console.log(newProyecto);

    const proyectos = await pool.query('SELECT * FROM proyecto WHERE user_id = ?', req.user.user_id);
    //console.log(proyectos);
    res.render('proyectos/list' , {proyectos});
});

//----- Proyectos View -----

router.get('/view' , isLoggedIn , (req,res) => {
    res.render('proyectos/view');
});

router.post('/view', isLoggedIn ,async (req,res) => {    

    const {proyecto_id} = req.body;
    const pid = proyecto_id;
    
    const proyectos = await pool.query('SELECT * FROM proyecto WHERE proyecto_id = ?', pid);

    let resProy = proyectos[0];
    let rec = 0;

    const finQ = await pool.query('SELECT mon.* FROM proyecto as pro, monto as mon, financiacion as fin WHERE (( fin.monto_id = mon.monto_id ) AND (mon.proyecto_id = pro.proyecto_id) ) AND pro.proyecto_id = ?',pid);

    finQ.forEach( liFinQ =>{
        rec = rec + parseInt(liFinQ.img_url);
    });

    //resProy.recaudacion = rec;
    proyectos[0].recaudacion = rec;
    
    console.log(proyectos[0]);
    //console.log(res.user);

    res.render('proyectos/view' , proyectos[0] );
});

// ----- Proyectos View Montos-----

router.post('/view/montos', isLoggedIn , async(req,res) => {
    const {proyecto_id} = req.body;
    const pid = proyecto_id;

    //console.log(pid);
    //console.log(app.locals.proyectoT);
    //console.log(req.body);

    const montos = await pool.query('SELECT * FROM monto WHERE proyecto_id = ?', pid);
    //console.log(montos);
    res.render('proyectos/montolist' , {montos});
});

// ----- Proyectos View Montos Add -----

router.post('/view/montos/add', isLoggedIn,(req,res) => {    
    console.log(req.body);
    res.render('proyectos/montoadd',req.body);
});

router.post('/view/montos/addAct', isLoggedIn, async(req,res) =>{
    const {img_url, descripcion , proyecto_id} = req.body;
    const pid = proyecto_id;

    //console.log(proyecto_id);
    //console.log(pid);
    //console.log(req.body);

    const newMonto = {
        descripcion,
        img_url,
        proyecto_id
    };  
    console.log(newMonto);
    const result = await pool.query('INSERT INTO monto set ?' , [newMonto] );
    newMonto.monto_id = result.insertId;

    const montos = await pool.query('SELECT * FROM monto WHERE proyecto_id = ?', pid);

    res.render('proyectos/montolist' , {montos});
});

// ----- Proyectos View Recaudacion ----- 

router.post('/financia' , async (req,res)=>{

    const proyectos = await pool.query('SELECT * FROM proyecto');
    console.log(proyectos);
    res.render('proyectos/proyectosfin', {proyectos});
});

router.post('/financia/montos' , async (req,res)=>{

    const {proyecto_id} = req.body;
    const pid = proyecto_id;

    const montos = await pool.query('SELECT * FROM monto WHERE proyecto_id = ?', pid);
    //console.log(montos);
    res.render('proyectos/montosfin' , {montos});

});

router.post( '/view/recaudacion' , async (req,res) => {

    const {proyecto_id} = req.body;
    const pid = proyecto_id;

    const proy = await pool.query('SELECT nombre FROM proyecto WHERE proyecto_id = ?' , proyecto_id);
    const montos = await pool.query('SELECT * FROM monto WHERE proyecto_id = ?', proyecto_id);

    let monData = [];

    montos.forEach( async liMon => {
        let monDataObj = {
            nombre: proy.nombre,
            descripcion: 'Defecto',
            img_url: 'Defecto',
            date: ''
        };
        
        monDataObj.descripcion = liMon.descripcion;

        monDataObj.img_url = liMon.img_url;

        const financiaciones = await pool.query('SELECT fecha_financiacion FROM financiacion WHERE monto_id = ?', liMon.monto_id)

        monDataObj.date = financiaciones[0].fecha_financiacion;

        monData.push( monDataObj );
        
    });    
    
    console.log(monData);

    res.render('proyectos/recaudacion' , {monData});

});

// ----- Proyectos Recaudacion ----- 

router.post('/financia/financiacion' , async (req,res)=>{

    const {monto_id} = req.body;
    const mid = monto_id;

    const newFinanciacion = {        
        monto_id,
        user_id: req.user.user_id
    };  
    console.log(newFinanciacion);
    const result = await pool.query('INSERT INTO financiacion set ?' , [newFinanciacion] );
    newFinanciacion.financiacion_id = result.insertId;

    const proyectos = await pool.query('SELECT * FROM proyecto WHERE user_id = ?', req.user.user_id);
    //console.log(proyectos);
    res.render('proyectos/list' , {proyectos});
});

// ----- Proyectos Financiaciones ----- 

router.post('/financiaciones', async (req,res) =>{

    const financiaciones = await pool.query('SELECT * FROM financiacion WHERE user_id = ?', req.user.user_id);
    //console.log(financiaciones);
    
    //const montos = await pool.query('SELECT * FROM monto WHERE monto_id = ?', financiaciones[0].monto_id);
    //console.log(montos);

    //const proyectos = await pool.query('SELECT * FROM proyecto WHERE proyecto_id = ?', montos[0].proyecto_id)
    //console.log(proyectos);

    let finData = [];

    financiaciones.forEach( async liFin => {
        let finDataObj = {
            proyecto: 'Defecto',
            descripcion: 'Defecto',
            img_url: 'Defecto',
            date: liFin.fecha_financiacion
        };

        const montos = await pool.query('SELECT * FROM monto WHERE monto_id = ?', liFin.monto_id);
        
        finDataObj.descripcion = montos[0].descripcion;

        finDataObj.img_url = montos[0].img_url;

        const proyectos = await pool.query('SELECT * FROM proyecto WHERE proyecto_id = ?', montos[0].proyecto_id)

        finDataObj.nombre = proyectos[0].nombre;

        finData.push( finDataObj );
        
    });
    
    console.log(finData);

    res.render('proyectos/financiaciones' , {finData});
});

// ----- El export OwO -----

module.exports = router;