const express=require('express')
const app=express()
app.use(express.json())


const MockUserdata=[
    {id:1,username:'admin',email:"admin@gmail.com",password:"ad12345min",is_admin:true},
    {id:2,username:"anna",email:"annann@gmail.com",password:"an12an12n",id_admin:false}
]
const products=[]
//1. Validate Request Fields
const custom=((req,res,next)=>{
    const {username,email,password}=req.body
    if(!username || username.length<3){
        res.end(JSON.stringify({error:"Username must be at least 3 characters "}))
    }
    if(!email){
        res.end(JSON.stringify({error:"Email is not valid "}))
    }
    if(!password || password.length<6){
        res.end(JSON.stringify({error:"{Password must be at least 6 characters"}))
    }
    next()
})

//2. Implement Request Logging
const ReqLogg=((req,res,next)=>{
    const time=new Date()
    console.log(`${time} time, ${req.method} method, ${req.url} url,`)
    next()
})
app.use(ReqLogg)

//3. Restrict Access by Role
const access=(req,res,next)=>{
    if(!MockUserdata.is_admin){
        return res.status(403).json({message:"Access Denied"})
    }
    next()
}

//4. Input Sanitization
const sanitization=((req,res,next)=>{
    if(req.body.username){
        req.body.username=req.body.username.trim()
    }
    if(req.body.email){
        req.body.email=req.body.username.trim().toLowerCase()
    }
    if(req.body.password){
        req.body.password=req.body.password.trim()
    }
    next()
})
app.use((req, res, next) => {
    if (['POST', 'PUT'].includes(req.method)) sanitization(req, res, next);
    else next();
});

//5. Middleware Chaining
const ckeckId=((req,res,next)=>{
    if(!req.body.id){
        return res.status(400).json({message:"user id is required"})
    }

})
const checkExists=(req,res,next)=>{
    const user=uder.find(user=>user.id===user.body.id)
    if(!user){
        return res.status(400).json({message:"User not found."})
    }
    next()
}

app.post('/users', custom, (req, res) => {
    res.status(201).json({ message: 'User created successfully.', user: req.body });
});

app.post('/products', access, (req, res) => {
    products.push(req.body);
    res.status(201).json({ message: 'Product created successfully.', product: req.body });
});

app.post('/orders', [custom, checkExists], (req, res) => {
    res.status(201).json({ message: 'Order placed successfully.', order: req.body });
});



const PORT=3000
app.listen(PORT,()=>{
    console.log(`Server running in ${PORT} port`)
})