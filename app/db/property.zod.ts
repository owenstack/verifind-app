import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import {
	property,
	propertyContact,
	propertyImage,
	propertySearch,
	propertyView,
} from "./property.schema";

// Insert schemas for each table
export const insertPropertySchema = createInsertSchema(property);
export const insertPropertyImageSchema = createInsertSchema(propertyImage);
export const insertPropertyContactSchema = createInsertSchema(propertyContact);
export const insertPropertyViewSchema = createInsertSchema(propertyView);
export const insertPropertySearchSchema = createInsertSchema(propertySearch);

// Update schemas for each table
export const updatePropertySchema = createUpdateSchema(property);
export const updatePropertyImageSchema = createUpdateSchema(propertyImage);
export const updatePropertyContactSchema = createUpdateSchema(propertyContact);
export const updatePropertyViewSchema = createUpdateSchema(propertyView);
export const updatePropertySearchSchema = createUpdateSchema(propertySearch);
