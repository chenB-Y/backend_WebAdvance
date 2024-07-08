import Product, {IProduct} from '../models/Product_model';
import BaseController from './base_controller';


class ProductController extends BaseController<IProduct>{
    constructor(){
        super(Product);
    }
}
export default new ProductController;