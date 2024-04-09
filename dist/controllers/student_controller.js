"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const student_model_js_1 = __importDefault(require("../models/student_model.js"));
//get should be used to return a student/s
const getStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.params.id != null) {
            const students = yield student_model_js_1.default.findById(req.params.id);
            res.status(200).send(students);
        }
        else {
            if (req.query.name != null) {
                const students = yield student_model_js_1.default.find({ name: req.query.name });
                res.status(200).send(students);
            }
            else {
                const students = yield student_model_js_1.default.find();
                res.status(200).send(students);
            }
        }
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});
//post should be used to create a new student
const postStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const student = req.body;
    try {
        const newStudent = yield student_model_js_1.default.create(student);
        res.status(201).json(newStudent);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});
//put should be used to update a student
const putStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const student = req.body;
    try {
        const updatedStudent = yield student_model_js_1.default.findByIdAndUpdate(student._id, student, { new: true });
        res.status(200).json(updatedStudent);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});
//delete should be used to delete a student
const deleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const student = req.body;
        yield student_model_js_1.default.findByIdAndDelete(student._id);
        res.status(200).json(`Student with id: ${student._id} deleted`);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});
exports.default = {
    getStudent,
    postStudent,
    putStudent,
    deleteStudent
};
//# sourceMappingURL=student_controller.js.map