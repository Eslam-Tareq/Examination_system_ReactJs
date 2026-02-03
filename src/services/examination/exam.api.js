import http from "@/services/http";
export const getExamsApi = async (params) => {
    const res = await http.get("/exams", {
        params,
    });
    return res.data;
};
