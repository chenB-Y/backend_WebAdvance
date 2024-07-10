import { Request, Response } from 'express';
import Group from '../models/group_model';
import Product from '../models/Product_model';
import User from '../models/user_model';

// Create a new group
export const createGroup = async (req: Request, res: Response) => {
  try {
    const newGroup = await Group.create(req.body);
    const response = await User.findById(req.body.participants);
    response.groupID = newGroup._id;
    response.save();
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ message: 'Error creating group', error });
  }
};

export const getGroupByName = async (req: Request, res: Response) => {
  try {
    const group = await Group.findById(req.params.id).populate('products');
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching group', error });
  }
};

// Update a group by Name
export const updateGroup = async (req: Request, res: Response) => {
  try {
    const group = await Group.findOne({ name: req.params.name });
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    group.participants.push(req.body.userID);
    console.log(req.body.userID);
    const response = await User.findById(req.body.userID);
    response.groupID = group._id;
    response.save();
    const updatedGroup = await group.save();
    res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: 'Error updating group', error });
  }
};

// Add Product by group name
export const addProduct = async (req: Request, res: Response) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    const mod = req.body;
    try {
      const newProduct = await Product.create(mod);
      group.products.push(newProduct.id);
      const updatedGroup = await group.save();
      res.status(200).json(updatedGroup);
    } catch (err) {
      res.status(500).send(err.message);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating group', error });
  }
};

// Delete a group by ID
export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const deletedGroup = await Group.findByIdAndDelete(req.params.id);
    if (!deletedGroup) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting group', error });
  }
};

export default {
  createGroup,
  getGroupByName,
  updateGroup,
  addProduct,
  deleteGroup,
};
