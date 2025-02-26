export interface Departamento {
  id_departamento: string
  nombre: string
}

export interface Profesor {
  id_profesor: string
  nombre: string
  fecha_contratacion: Date
  id_departamento: string
  departamento?: Departamento
}

export interface Curso {
  id_curso: string
  nombre: string
  descripcion: string
  horario: string
  id_profesor: string
  profesor?: Profesor
  prerrequisitos?: Curso[]
}

export interface Estudiante {
  id_estudiante: string
  nombre: string
  fecha_nacimiento: Date
}

export interface Matricula {
  id_matricula: string
  id_curso: string
  id_estudiante: string
  fecha_inscripcion: Date
  calificacion_final: number
  curso?: Curso
  estudiante?: Estudiante
}

export interface Evaluacion {
  id_evaluacion: string
  fecha_realizacion: Date
  id_curso: string
  curso?: Curso
}

export interface NotaEvaluacion {
  id_evaluacion: string
  id_nota: string
  calificacion: number
  id_estudiante: string
  evaluacion?: Evaluacion
  estudiante?: Estudiante
}

