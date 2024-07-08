import { Request, Response } from 'express';
import Group from '../models/group_model';

// Create a new group
export const createGroup = async (req: Request, res: Response) => {
  try {
    const newGroup = await Group.create(req.body);
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ message: 'Error creating group', error });
  }
};

// Get a single group by ID
export const getGroupByName = async (req: Request, res: Response) => {
  try {
    const group = await Group.findOne({name:req.params.name}).populate('products');
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching group', error });
  }
};

// Update a group by ID
export const updateGroup = async (req: Request, res: Response) => {
  try {
    console.log("1111111111111111");
    const group = await Group.findOne({name:req.params.name}).populate('products');
    console.log("222222222222222");
    if (!group) {
      console.log("3333333333333333333");
      return res.status(404).json({ message: 'Group not found' });
    }
    console.log("444444444444444444");
    if (req.body.name) group.name = req.body.name;
    if (req.body.participants) {
      //add participant to the array of participant that already exist
      console.log("5555555555555555555555555");
      const newParticipants = Array.isArray(req.body.participants) ? req.body.participants : [req.body.participants];
      group.participants = [...group.participants, ...newParticipants];
    }
    if(req.body.products){
      const newProducts = Array.isArray(req.body.products) ? req.body.products : [req.body.products];
      group.products = [...group.products, ...newProducts];
    }
    const updatedGroup = await group.save();
    res.status(200).json(updatedGroup);
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
  deleteGroup,
};