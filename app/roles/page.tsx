"use client";

import { useEffect, useState, useCallback } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import roleApi from "@/lib/api/roleApi";
import { AdminRole, AdminPermission, RoleWithPermissions } from "@/schema/role";

// ─── Main Content ───────────────────────────────────────────────────────────

function RolesContent() {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [rolePerms, setRolePerms] = useState<RoleWithPermissions | null>(null);
  const [loadingPerms, setLoadingPerms] = useState(false);
  const [selectedPerms, setSelectedPerms] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [rolesData, permsData] = await Promise.all([
        roleApi.getRoles(),
        roleApi.getPermissions(),
      ]);
      setRoles(rolesData);
      setPermissions(permsData);
    } catch {
      console.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleExpand = async (roleId: string) => {
    if (expandedRole === roleId) {
      setExpandedRole(null);
      setRolePerms(null);
      return;
    }
    setExpandedRole(roleId);
    setLoadingPerms(true);
    setMessage("");
    try {
      const data = await roleApi.getRolePermissions(roleId);
      setRolePerms(data);
      setSelectedPerms(new Set(data.permissions.map((p) => p.id)));
    } catch {
      console.error("Failed to load role permissions");
    } finally {
      setLoadingPerms(false);
    }
  };

  const togglePerm = (permId: string) => {
    setSelectedPerms((prev) => {
      const next = new Set(prev);
      if (next.has(permId)) next.delete(permId);
      else next.add(permId);
      return next;
    });
  };

  const handleSave = async () => {
    if (!expandedRole) return;
    setSaving(true);
    setMessage("");
    try {
      await roleApi.assignPermissions({
        roleId: expandedRole,
        permissionIds: Array.from(selectedPerms),
      });
      setMessage("Permissions saved successfully!");
      // Refresh
      const data = await roleApi.getRolePermissions(expandedRole);
      setRolePerms(data);
      setSelectedPerms(new Set(data.permissions.map((p) => p.id)));
    } catch {
      setMessage("Failed to save permissions.");
    } finally {
      setSaving(false);
    }
  };

  // Group permissions by resource
  const permsByResource = permissions.reduce<Record<string, AdminPermission[]>>((acc, p) => {
    if (!acc[p.resource]) acc[p.resource] = [];
    acc[p.resource].push(p);
    return acc;
  }, {});

  if (loading) {
    return <div className="empty-state"><div className="spinner" /><p>Loading roles...</p></div>;
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: "grid", gridTemplateColumns: expandedRole ? "1fr 1fr" : "1fr", gap: "1.5rem" }}>
        {/* Roles List */}
        <div className="glass-card-static" style={{ padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1.25rem" }}>Roles</h2>
          {roles.length === 0 ? (
            <div className="empty-state">No roles found.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleExpand(role.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1rem",
                    background: expandedRole === role.id ? "rgba(99,102,241,0.1)" : "var(--bg-glass-hover)",
                    border: expandedRole === role.id ? "1px solid var(--border-accent)" : "1px solid transparent",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)",
                    width: "100%",
                    textAlign: "left",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: "0.15rem" }}>
                      {role.name}
                      {role.isSystem && (
                        <span className="badge badge-warning" style={{ marginLeft: "0.5rem", fontSize: "0.65rem" }}>System</span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{role.description || "No description"}</div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expandedRole === role.id ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>
                    <polyline points="9,18 15,12 9,6" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Permissions Panel */}
        {expandedRole && (
          <div className="glass-card-static" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                Permissions — {rolePerms?.name || "..."}
              </h2>
              <button className="btn-primary" style={{ fontSize: "0.8rem", padding: "0.5rem 1rem" }} onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>

            {message && (
              <div className={message.includes("success") ? "alert-success" : "alert-error"} style={{ marginBottom: "1rem" }}>
                {message}
              </div>
            )}

            {loadingPerms ? (
              <div className="empty-state"><div className="spinner" /></div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {Object.entries(permsByResource).map(([resource, perms]) => (
                  <div key={resource}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                      {resource}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      {perms.map((p) => (
                        <label key={p.id} className="checkbox-wrapper" style={{ padding: "0.5rem 0.75rem", borderRadius: "var(--radius-sm)", background: selectedPerms.has(p.id) ? "rgba(99,102,241,0.08)" : "transparent" }}>
                          <input type="checkbox" checked={selectedPerms.has(p.id)} onChange={() => togglePerm(p.id)} />
                          <div>
                            <span style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 500 }}>{p.action}</span>
                            {p.description && (
                              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: "0.5rem" }}>— {p.description}</span>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                {permissions.length === 0 && <div className="empty-state">No permissions defined yet.</div>}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function RolesPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <RolesContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
