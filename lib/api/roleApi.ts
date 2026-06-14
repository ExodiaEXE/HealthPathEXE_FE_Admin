import {
  AdminRole,
  AdminPermission,
  AssignPermission,
  RoleWithPermissions,
} from "@/schema/role";
import axiosInstance from "../axiosInstance";

const roleApi = {
  getRoles: async (): Promise<AdminRole[]> => {
    const response = await axiosInstance.get<AdminRole[]>("/admin/roles");
    return response.data;
  },

  getPermissions: async (): Promise<AdminPermission[]> => {
    const response = await axiosInstance.get<AdminPermission[]>(
      "/admin/roles/permissions"
    );
    return response.data;
  },

  getRolePermissions: async (id: string): Promise<RoleWithPermissions> => {
    const response = await axiosInstance.get<RoleWithPermissions>(
      `/admin/roles/${id}/permissions`
    );
    return response.data;
  },

  assignPermissions: async (payload: AssignPermission): Promise<void> => {
    await axiosInstance.put("/admin/roles/assign-permissions", payload);
  },
};

export default roleApi;
