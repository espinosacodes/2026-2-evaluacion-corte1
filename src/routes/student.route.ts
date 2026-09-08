import { Router } from "express";
import { studentController } from "../controllers/student.controller";

export const studentRouter = Router();
studentRouter.get("/", studentController.getAll);
studentRouter.post("/create", studentController.create);

// TODO (Reto 1 - Bulk create): agregar POST /students/bulk -> studentController.bulkCreate
studentRouter.post("/bulk", studentController.bulkCreate);

// TODO (Reto 2 - Search): agregar GET /students/search -> studentController.search
// IMPORTANTE: debe registrarse ANTES que GET /:email, o Express interpretará "search" como un email.
studentRouter.get('/search', studentController.search)
studentRouter.get('/:email', studentController.getByEmail);
studentRouter.put("/update/:email", studentController.updateStudent);

// TODO (Reto 3 - Delete): agregar DELETE /students/delete/:email -> studentController.deleteStudent
studentRouter.delete("/delete/:email", studentController.deleteStudent);