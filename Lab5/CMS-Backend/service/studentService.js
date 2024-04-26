const StudentModel = require("../model/Student");

class StudentService {
  async getAllStudents() {
    return await StudentModel.find();
  }

  async getAllStudents(page, size) {
    page = page * 1;
    size = size * 1;
    const skip = page * size;
    const totalStudentsCount = await StudentModel.countDocuments();
    const totalPages = Math.ceil(totalStudentsCount / size);
    const students = await StudentModel.find().skip(skip).limit(size);
    return {
      content: students,
      totalPages: totalPages,
      totalElements: totalStudentsCount,
      number: page
    };
  }

  async getStudentById(id) {
    return await StudentModel.findOne({ id });
  }

  async addStudent(studentData) {
    try {
      // Find the maximum id currently in use
      const maxIdStudent = await StudentModel.findOne().sort({ id: -1 });
      let maxId = 0;
      if (maxIdStudent) {
        maxId = maxIdStudent.id;
      }
      // Increment the id for the new student
      const newId = maxId + 1;
      console.log(studentData);
      // Add the id to studentData
      studentData.id = newId;

      console.log(studentData);

      return await StudentModel.create(studentData);
    } catch (err) {
      console.log(err);
    }
  }

  async updateStudent(id, studentData) {
    return await StudentModel.findOneAndUpdate({ id }, studentData, {
      new: true,
    });
  }

  async deleteStudent(id) {
    return await StudentModel.findOneAndDelete({ id });
  }
}

module.exports = new StudentService();
