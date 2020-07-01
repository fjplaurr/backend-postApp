import {
  NextFunction,
  Request,
  Response,
} from 'express';
import { Model } from 'mongoose';

export function getAll(model: Model<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const document = await model.find({});
      return res.status(200).send(document);
    } catch (err) {
      return next({
        status: 500,
        message: err.message,
      });
    }
  };
}

export function getById(model: Model<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const document = await model.findById(req.params.id);
      return res.status(200).send(document);
    } catch (err) {
      return next({
        status: 500,
        message: err.message,
      });
    }
  };
}

export function test() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).send('test completed');
    } catch (err) {
      return next({
        status: 500,
        message: err.message,
      });
    }
  };
}

export function create(GenericModel: Model<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const document = req.body;
      const newDocument = await new GenericModel(document).save();
      return res.status(200).send(newDocument);
    } catch (err) {
      return next({
        status: 500,
        message: err.message,
      });
    }
  };
}

export function update(GenericModel: Model<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const document = req.body;
      const updatedDocument = await GenericModel.findOneAndUpdate({ _id: req.params.id }, document);
      return res.status(200).send(updatedDocument);
    } catch (err) {
      return next({
        status: 500,
        message: err.message,
      });
    }
  };
}

export function deleteById(GenericModel: Model<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = Object.keys(req.params)[0];
    try {
      const deletedDocument = await GenericModel.deleteOne({ [key]: req.params[key] });
      return res.status(200).send(deletedDocument);
    } catch (err) {
      return next({
        status: 500,
        message: err.message,
      });
    }
  };
}
