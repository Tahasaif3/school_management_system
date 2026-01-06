import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { getToken, removeToken, setToken } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

class ApiClient {
  private client: AxiosInstance;
  private static instance: ApiClient;

  private constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          removeToken();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  public getClient(): AxiosInstance {
    return this.client;
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.client.post("/auth/login", { email, password });
    if (response.data.access_token) {
      setToken(response.data.access_token);
    }
    return response.data;
  }

  async getCurrentUser() {
    return this.client.get("/auth/me");
  }

  async logout() {
    removeToken();
  }

  // Student endpoints
  async getStudents(params?: { class?: string; section?: string; status?: string; skip?: number; limit?: number }) {
    return this.client.get("/students", { params });
  }

  async getStudent(id: string) {
    return this.client.get(`/students/${id}`);
  }

  async getMyStudentRecord() {
    return this.client.get("/students/me");
  }

  async createStudent(data: any) {
    return this.client.post("/students", data);
  }

  async updateStudent(id: string, data: any) {
    return this.client.patch(`/students/${id}`, data);
  }

  async deleteStudent(id: string) {
    return this.client.delete(`/students/${id}`);
  }

  // Attendance endpoints
  async getAttendance(params?: { student_id?: string; start_date?: string; end_date?: string }) {
    return this.client.get("/attendance", { params });
  }

  async getStudentAttendance(studentId: string, params?: { start_date?: string; end_date?: string }) {
    return this.client.get(`/attendance/student/${studentId}`, { params });
  }

  async getAttendanceSummary(studentId: string) {
    return this.client.get(`/attendance/student/${studentId}/summary`);
  }

  async markAttendance(data: any) {
    return this.client.post("/attendance", data);
  }

  // Fee endpoints
  async getFees(params?: { student_id?: string; status?: string }) {
    return this.client.get("/fees", { params });
  }

  async getStudentFees(studentId: string, params?: { status?: string }) {
    return this.client.get(`/fees/student/${studentId}`, { params });
  }

  async getOverdueFees(studentId: string) {
    return this.client.get(`/fees/student/${studentId}/overdue`);
  }

  async createFee(data: any) {
    return this.client.post("/fees", data);
  }

  async payFee(feeId: string, data: any) {
    return this.client.post(`/fees/${feeId}/pay`, data);
  }

  async getFeeSummary() {
    return this.client.get("/fees/reports/summary");
  }

  // Exam endpoints
  async getExams(params?: { skip?: number; limit?: number }) {
    return this.client.get("/exams", { params });
  }

  async getExam(id: string) {
    return this.client.get(`/exams/${id}`);
  }

  async createExam(data: any) {
    return this.client.post("/exams", data);
  }

  // Marksheet endpoints
  async getMarksheets(params?: { student_id?: string; exam_id?: string; status?: string }) {
    return this.client.get("/marksheets", { params });
  }

  async getMarksheet(id: string) {
    return this.client.get(`/marksheets/${id}`);
  }

  async getStudentMarksheets(studentId: string) {
    return this.client.get(`/marksheets/student/${studentId}`);
  }

  async createMarksheet(data: any) {
    return this.client.post("/marksheets", data);
  }

  async updateMarksheet(id: string, data: any) {
    return this.client.patch(`/marksheets/${id}`, data);
  }

  async getMarksheetHistory(id: string) {
    return this.client.get(`/marksheets/${id}/history`);
  }

  async getAcademicReport(examId: string) {
    return this.client.get(`/marksheets/reports/academic/${examId}`);
  }

  // Subject endpoints
  async getSubjects(params?: { class?: string; is_active?: boolean; skip?: number; limit?: number }) {
    return this.client.get("/subjects", { params });
  }

  async getSubjectsByClass(class_: string) {
    return this.client.get(`/subjects/class/${class_}`);
  }

  async getSubject(id: string) {
    return this.client.get(`/subjects/${id}`);
  }

  async createSubject(data: any) {
    return this.client.post("/subjects", data);
  }

  async updateSubject(id: string, data: any) {
    return this.client.patch(`/subjects/${id}`, data);
  }

  async deleteSubject(id: string) {
    return this.client.delete(`/subjects/${id}`);
  }

  // Student profile with all data
  async getStudentProfile(studentId: string) {
    const [student, fees, attendance, marksheets] = await Promise.all([
      this.getStudent(studentId),
      this.getStudentFees(studentId),
      this.getAttendanceSummary(studentId),
      this.getStudentMarksheets(studentId),
    ]);
    return {
      student: student.data,
      fees: fees.data,
      attendance: attendance.data,
      marksheets: marksheets.data,
    };
  }
}

export const api = ApiClient.getInstance();
