import { Router } from "express";
import authentecationEmployee from "../../auth/employee.auth.js";
import authorizationEmpoyee from "../../authorization/employee.authorization.js";
import uploadingFileRequets from "../../utils/uploadingFiles.js";
import * as categoryController from './catgeory.controller.js';
import * as categorySchema from './catgeory.schema.js';
import * as validation from '../../validation/validation.js';
const categoryRouter=Router({mergeParams:true});
// cateory routes:
// adding category:
categoryRouter.post("/addCatgory",authentecationEmployee,authorizationEmpoyee("superAdmin","instructor"),uploadingFileRequets().any(),validation.bodyValidation(categorySchema.addCategorySchema),categoryController.addCatgeoryController);
// upadte catgeory(and allt he things that includes the subCatgeory):
categoryRouter.patch("/updateCatgery/:categId",authentecationEmployee,authorizationEmpoyee("superAdmin","instructor"),uploadingFileRequets().any(),validation.bodyValidation(categorySchema.updateCategorySchema),validation.paramsValidation(categorySchema.checkCtageoryId),categoryController.updateCategorys)
// delete catgeory:
categoryRouter.delete("/deleteCategory/:categId",authentecationEmployee,authorizationEmpoyee("superAdmin"),validation.paramsValidation(categorySchema.checkCtageoryId),categoryController.deleteCategory);
// get all the category with filter:
categoryRouter.get("/getCategories",validation.queryValidation(categorySchema.getCategories),validation.bodyValidation(categorySchema.filterCatgeiry),categoryController.getCatgeories);
// get the subCategory of sp catgeory:
categoryRouter.get("/getSubCategory",validation.queryValidation(categorySchema.getFIlterSubCategory),categoryController.getSubCatgeories);
// get the courses with all filters options:
categoryRouter.get("/getAllCoursesWithAllFiltsersOptions",validation.queryValidation(categorySchema.getCourses),categoryController.getCourses);
// get all the instructor:
categoryRouter.get("/getAllInstrcuctor",validation.queryValidation(categorySchema.getInstrcuctorsSchema),categoryController.getInstrcuctors);
// get one course with the id only:
categoryRouter.get("/getOnlyOneCourse/:courseId",validation.paramsValidation(categorySchema.getOInlyOneCOurse),categoryController.getOnlyOneCourse)


export default categoryRouter;