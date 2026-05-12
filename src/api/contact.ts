import { apiClient } from "./client";

export interface ContactFormData {
  email: string;
  subject: string;
  message: string;
}

export const contactApi = {
  submit: async (data: ContactFormData) => {
    const response = await apiClient.post("/contact", data);
    return response.data;
  },
};