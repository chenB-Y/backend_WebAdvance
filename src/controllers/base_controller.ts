import { Request, Response } from 'express';
import Mongoose from 'mongoose';
import Student from '../models/student_model';
import fs from 'fs';
import path from 'path';

class BaseController<ModelInterface> {
  model: Mongoose.Model<ModelInterface>;
  constructor(model) {
    this.model = model;
  }

  async get(req: Request, res: Response) {
    try {
      if (req.params.id != null) {
        const models = await this.model.findById(req.params.id);
        res.status(200).send(models);
      } else {
        if (req.query.name != null) {
          const models = await this.model.find({ name: req.query.name });
          res.status(200).send(models);
        } else {
          const models = await this.model.find();
          res.status(200).send(models);
        }
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  //post should be used to create a new student
  async post(req: Request, res: Response) {
    console.log('**************************************req.body:', req.body);
    const mod = req.body;
    try {
      const newStudent = await this.model.create(mod);
      res.status(201).json(newStudent);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  //put should be used to update a student
  async put(req: Request, res: Response) {
    if (req.params.id != null) {
      const student = await Student.findById(req.params.id);
      const mod = req.body;
      console.log(
        '**************************************req.body:',
        req.body.url
      );
      console.log(
        '**************************************student:',
        student.url
      );
      try {
        // If there's a current image URL, remove the old image file
        if (student.url && mod.url) {
          const imagePath = path.join(
            './public/products',
            student.url.split('localhost:3000/')[1]
          );
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error('Error deleting old image:', err);
            } else {
              console.log('Old image deleted:', imagePath);
            }
          });
        }
        if (student.name) student.name = mod.name;
        if (student.age) student.age = mod.age;
        if (student.url) student.url = mod.url;
        const updatedModel = await student.save();
        res.status(200).json(updatedModel);
      } catch (err) {
        res.status(500).send(err.message);
      }
    } else {
      res.status(400).send('There is no student with this ID');
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const mod = req.body;
      await this.model.findByIdAndDelete(mod._id);
      res.status(200).json(`Student with id: ${mod._id} deleted`);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

export default BaseController;
