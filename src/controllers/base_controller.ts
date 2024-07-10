import { Request, Response } from 'express';
import Mongoose from 'mongoose';
import Product from '../models/Product_model';
import fs from 'fs';
import path from 'path';
import Comment from '../models/comment_model';

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

  async getComments(req: Request, res: Response) {
    try {
      const product = await Product.findById(req.params.id).populate(
        'comments'
      );
      console.log('**************************************product:', product);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching comments', error });
    }
  }

  async postComment(req: Request, res: Response) {
    try {
      console.log('**************************************req.body:', req.body);
      const product = await Product.findById(req.params.id);
      console.log('22222222222222222222222');
      if (!product) {
        console.log('3333333333333333333');
        return res.status(404).json({ message: 'Product not found' });
      }
      try {
        console.log('4444444444444444444444');
        const newComment = await Comment.create(req.body);
        console.log('5555555555555555555555');
        product.comments.push(newComment.id);
        console.log('6666666666666666666666');
        const updatedProduct = await product.save();
        console.log('7777777777777777777777');
        res.status(200).json(updatedProduct);
      } catch (err) {
        res.status(500).send(err.message);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating group', error });
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
      const productID = req.params.id;
      await Product.findByIdAndDelete(productID);
      res.status(200).json(`product with id: ${productID} deleted`);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

export default BaseController;
