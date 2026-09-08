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
        const created: StudentDocument[] = [];
        const skipped: { email: string; reason: string }[] = [];
        const seen = new Set<string>();

        for (const data of studentsData) {
            const email = (data as StudentInput)?.email;
            const emailLabel = typeof email === "string" ? email : "unknown";
            try {
                if (!email || typeof email !== "string") {
                    skipped.push({ email: emailLabel, reason: "Missing or invalid email" });
                    continue;
                }
                if (seen.has(email)) {
                    skipped.push({ email, reason: "El estudiante con este email ya existe" });
                    continue;
                }
                const existing = await StudentModel.findOne({ email });
                if (existing) {
                    seen.add(email);
                    skipped.push({ email, reason: "El estudiante con este email ya existe" });
                    continue;
                }
                const doc = await StudentModel.create(data);
                seen.add(email);
                created.push(doc);
            } catch (error: any) {
                skipped.push({ email: emailLabel, reason: error?.message ?? "Invalid student data" });
            }
        }

        return { created, skipped };
    }

    // TODO (Reto 2 - Search): implementar.
    // Construye un filtro de Mongoose SOLO con los criterios presentes en el query (los ausentes no deben filtrar nada).
    // isActive: "true"/"false" -> boolean | minAge/maxAge -> rango con $gte/$lte sobre "age" | name -> coincidencia parcial case-insensitive con $regex
    async search(query: StudentSearchQuery): Promise<StudentDocument[]>{
        const filter: Record<string, any> = {};
        if (query.isActive === "true") filter.isActive = true;
        if (query.isActive === "false") filter.isActive = false;
        const min = query.minAge !== undefined ? Number(query.minAge) : NaN;
        const max = query.maxAge !== undefined ? Number(query.maxAge) : NaN;
        if (!Number.isNaN(min) || !Number.isNaN(max)) {
            filter.age = {};
            if (!Number.isNaN(min)) filter.age.$gte = min;
            if (!Number.isNaN(max)) filter.age.$lte = max;
        }
        if (query.name) filter.name = { $regex: query.name, $options: "i" };
        return StudentModel.find(filter);
    }

    // TODO (Reto 3 - Delete): implementar.
    // Debe eliminar el estudiante con ese email y devolver el documento eliminado, o null si no existía.
    async deleteStudent(email: string): Promise<StudentDocument | null>{
        
        try{
            const deleted:StudentDocument | null = await StudentModel.findOneAndUpdate(
                { email }
            );
            return deleted;
        }catch(error){

            console.log(this.handleError(error));
            throw error;
        }


    }

    handleError(error: any){
        return {
            status: 404,
            error:error
        }
    }
}

export const studentService = new StudentService();