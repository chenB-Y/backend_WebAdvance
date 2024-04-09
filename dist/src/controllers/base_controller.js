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
Object.defineProperty(exports, "__esModule", { value: true });
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
            const mod = req.body;
            try {
                const updatedModel = yield this.model.findByIdAndUpdate(mod._id, mod, { new: true });
                res.status(200).json(updatedModel);
            }
            catch (err) {
                res.status(500).send(err.message);
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