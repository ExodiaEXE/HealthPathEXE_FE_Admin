// ─── Role & Permission DTOs (matches AdminRoleDtos.cs) ──────────────────────

export interface AdminRole {
  id: string;
  name: string;
  description?: string;
  isSystem: boolean;
  createdAt: string;
}

export interface AdminPermission {
  id: string;
  resource: string;
  action: string;
  description?: string;
}

export interface AssignPermission {
  roleId: string;
  permissionIds: string[];
}

export interface RoleWithPermissions extends AdminRole {
  permissions: AdminPermission[];
}
