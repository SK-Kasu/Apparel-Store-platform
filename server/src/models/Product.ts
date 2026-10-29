import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';

const sizeSchema = new Schema(
  {
    size: { type: String, required: true, trim: true, maxlength: 12 },
    stock: { type: Number, required: true, min: 0, default: 0 }
  },
  { _id: false }
);

const specSchema = new Schema(
  {
    label: { type: String, required: true, trim: true, maxlength: 60 },
    value: { type: String, required: true, trim: true, maxlength: 160 }
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    code: { type: String, required: true, trim: true, uppercase: true, maxlength: 20 },
    category: { type: String, required: true, trim: true, index: true, maxlength: 40 },
    price: { type: Number, required: true, min: 0, validate: Number.isInteger },
    compareAt: { type: Number, min: 0, default: null, validate: Number.isInteger },
    description: { type: String, required: true, trim: true, maxlength: 600 },
    story: { type: String, required: true, trim: true, maxlength: 3000 },
    details: { type: [String], default: [] },
    specs: { type: [specSchema], default: [] },
    care: { type: [String], default: [] },
    image: { type: String, required: true, trim: true },
    images: { type: [String], default: [] },
    sizes: { type: [sizeSchema], default: [] },
    status: {
      type: String,
      enum: ['active', 'draft', 'archived'],
      default: 'active',
      index: true
    },
    featured: { type: Boolean, default: false, index: true },
    drop: { type: String, trim: true, default: 'Core line', maxlength: 40 }
  },
  { timestamps: true }
);

productSchema.index({ status: 1, category: 1, createdAt: -1 });

export type Product = InferSchemaType<typeof productSchema>;
export type ProductDoc = HydratedDocument<Product>;

export const ProductModel = model('Product', productSchema);
