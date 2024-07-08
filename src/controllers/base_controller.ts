import { Request, Response } from 'express';
import Mongoose from 'mongoose';
import Product from '../models/Product_model';
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

  //post should be used to create a new product
  async post(req: Request, res: Response) {
    console.log('**************************************req.body:', req.body);
    const mod = req.body;
    try {
      const newProduct = await this.model.create(mod);
      res.status(201).json(newProduct);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  //put should be used to update a product
  async put(req: Request, res: Response) {
    if (req.params.id != null) {
      const product = await Product.findById(req.params.id);
      const mod = req.body;
      console.log(
        '**************************************req.body:',
        req.body.imageUrl
      );
      console.log(
        '**************************************product:',
        product.imageUrl
      );
      try {
        // If there's a current image URL, remove the old image file
        if (product.imageUrl && mod.imageUrl) {
          const imagePath = path.join(
            './public/products',
            product.imageUrl.split('localhost:3000/')[1]
          );
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error('Error deleting old image:', err);
            } else {
              console.log('Old image deleted:', imagePath);
            }
          });
        }
        if (product.name) product.name = mod.name;
        if (product.amount) product.amount = mod.amount;
        if (product.imageUrl) product.imageUrl = mod.imageUrl;
        const updatedModel = await product.save();
        res.status(200).json(updatedModel);
      } catch (err) {
        res.status(500).send(err.message);
      }
    } else {
      res.status(400).send('There is no product with this ID');
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const mod = req.body;
      await this.model.findByIdAndDelete(mod._id);
      res.status(200).json(`product with id: ${mod._id} deleted`);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

export default BaseController;
