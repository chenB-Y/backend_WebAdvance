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
const student_model_1 = __importDefault(require("../models/student_model"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class BaseController {
    constructor(model) {
        this.model = model;
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.params.id != null) {
                    const models = yield this.model.findById(req.params.id);
                    res.status(200).send(models);
                }
                else {
                    if (req.query.name != null) {
                        const models = yield this.model.find({ name: req.query.name });
                        res.status(200).send(models);
                    }
                    else {
                        const models = yield this.model.find();
                        res.status(200).send(models);
                    }
                }
            }
            catch (err) {
                res.status(500).send(err.message);
            }
        });
    }
    //post should be used to create a new student
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('**************************************req.body:', req.body);
            const mod = req.body;
            try {
                const newStudent = yield this.model.create(mod);
                res.status(201).json(newStudent);
            }
            catch (err) {
                res.status(500).send(err.message);
            }
        });
    }
    //put should be used to update a student
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params.id != null) {
                const student = yield student_model_1.default.findById(req.params.id);
                const mod = req.body;
                console.log('**************************************req.body:', req.body.url);
                console.log('**************************************student:', student.url);
                try {
                    // If there's a current image URL, remove the old image file
                    if (student.url && mod.url) {
                        const imagePath = path_1.default.join('./public/products', student.url.split('localhost:3000/')[1]);
                        fs_1.default.unlink(imagePath, (err) => {
                            if (err) {
                                console.error('Error deleting old image:', err);
                            }
                            else {
                                console.log('Old image deleted:', imagePath);
                            }
                        });
                    }
                    if (student.name)
                        student.name = mod.name;
                    if (student.age)
                        student.age = mod.age;
                    if (student.url)
                        student.url = mod.url;
                    const updatedModel = yield student.save();
                    res.status(200).json(updatedModel);
                }
                catch (err) {
                    res.status(500).send(err.message);
                }
            }
            else {
                res.status(400).send('There is no student with this ID');
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mod = req.body;
                yield this.model.findByIdAndDelete(mod._id);
                res.status(200).json(`Student with id: ${mod._id} deleted`);
            }
            catch (err) {
                res.status(500).send(err.message);
            }
        });
    }
}
exports.default = BaseController;
//# sourceMappingURL=base_controller.js.map