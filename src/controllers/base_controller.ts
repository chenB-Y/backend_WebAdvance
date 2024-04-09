import {Request, Response} from 'express';
import  Mongoose  from 'mongoose';

class BaseController <ModelInterface>{
    model: Mongoose.Model<ModelInterface>;
    constructor(model){
        this.model = model;
    }
    
    async get (req:Request, res:Response) {
        try{
            if (req.params.id != null){
                const models = await this.model.findById(req.params.id);
                res.status(200).send(models);
            }else{
                if(req.query.name != null){
                    const models = await this.model.find({name: req.query.name});
                    res.status(200).send(models);
                }else{
                    const models = await this.model.find();
                    res.status(200).send(models);
                }
            }
        }catch(err){
            res.status(500).send(err.message);
        }
    }
    
    //post should be used to create a new student
    async post (req:Request, res:Response) {
        const mod = req.body;
        try{
        const newStudent = await this.model.create(mod);
        res.status(201).json(newStudent);
        }catch(err){
            res.status(500).send(err.message);
        }
    }
    
    //put should be used to update a student
    async put (req:Request, res:Response) {
        const mod = req.body;
        try{
            const updatedModel = await this.model.findByIdAndUpdate(
                mod._id,
                mod,
                {new: true}
            );
            res.status(200).json(updatedModel);
        }catch(err){
            res.status(500).send(err.message);
        }
    }

    async delete (req:Request, res:Response){
        try{
            const mod = req.body;
            await this.model.findByIdAndDelete(mod._id);
            res.status(200).json(`Student with id: ${mod._id} deleted`);
        }catch(err){
            res.status(500).send(err.message);
        }
    }
}

export default BaseController;