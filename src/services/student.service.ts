import { BulkCreateResult, StudentDocument, StudentInput, StudentModel, StudentSearchQuery } from "../models/student.model";

class StudentService {

    async create(studentData: StudentDocument){
        try{
            const existStudent: StudentDocument | null = await this.findByEmail(studentData.email);
            if (existStudent) return {message: `User ${studentData.email} already exist.`}
            const createStudent: StudentDocument = await StudentModel.create(studentData);
            return createStudent;
        }catch(error){
            console.log(this.handleError(error));
            throw error;
        }
        
    }
    async findAll(): Promise<StudentDocument[]>{
        try{
            const students : StudentDocument[] = await StudentModel.find();
            return students;
        }catch(error){
            console.log(this.handleError(error));
            throw error;
        }
    }
    async findByEmail(email:string){
        try{
            const students = await StudentModel.findOne({ email });
            return students;
        }catch(error){
            console.log(this.handleError(error));
            throw error;
        }
    }

    async updateStudent(email:string, student: StudentInput){
        try{
            const updateStudent : StudentDocument | null = await StudentModel.findOneAndUpdate({ email }, student, { returnOriginal : false });
            return updateStudent;
        }catch(error){
            console.log(this.handleError(error));
            throw error;
        }
    }

    // TODO (Reto 1 - Bulk create): implementar.
    // Recibe un arreglo de StudentInput. Por cada uno:
    //   - si ya existe un estudiante con ese email (en BD o repetido en el mismo arreglo), agregarlo a "skipped" con un "reason"
    //   - si no existe, crearlo y agregarlo a "created"
    // Un solo estudiante inválido NO debe tumbar el resto del lote: atrapa el error por estudiante, no solo por el arreglo completo.
    async bulkCreate(studentsData: StudentInput[]): Promise<BulkCreateResult>{
        try{
            const skipped: string[] =  [];
            const created: string[] = [];

            


        }catch(error){

        }

        throw new Error("Not implemented");
    }

    // TODO (Reto 2 - Search): implementar.
    // Construye un filtro de Mongoose SOLO con los criterios presentes en el query (los ausentes no deben filtrar nada).
    // isActive: "true"/"false" -> boolean | minAge/maxAge -> rango con $gte/$lte sobre "age" | name -> coincidencia parcial case-insensitive con $regex
    async search(query: StudentSearchQuery): Promise<StudentDocument[]>{
        throw new Error("Not implemented");
    }

    // TODO (Reto 3 - Delete): implementar.
    // Debe eliminar el estudiante con ese email y devolver el documento eliminado, o null si no existía.
    async deleteStudent(email: string): Promise<StudentDocument | null>{
        throw new Error("Not implemented");
    }

    handleError(error: any){
        return {
            status: 404,
            error:error
        }
    }
}

export const studentService = new StudentService();