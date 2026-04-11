"use client";

import {
  Users, Plus, X, AlertCircle, Trash2,
  Shield, Edit2, Crown, UserCheck,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TeamMemberUser { id: string; name: string; email: string; image: string | null; }
interface TeamMember { id: string; role: "owner" | "manager" | "contributor"; member: TeamMemberUser; createdAt: string; }

const roleConfig: Record<string, { label: string; color: string; icon: React.ReactNode; description: string }> = {
  owner:       { label: "Owner",       color: "bg-amber-50 text-amber-600",  icon: <Crown className="h-3.5 w-3.5" />,     description: "Full access to all features and billing" },
  manager:     { label: "Manager",     color: "bg-blue-50 text-blue-600",    icon: <Shield className="h-3.5 w-3.5" />,    description: "Can manage projects, clients, and team" },
  contributor: { label: "Contributor", color: "bg-gray-100 text-gray-600",   icon: <UserCheck className="h-3.5 w-3.5" />, description: "Can view and work on assigned projects" },
};

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInviting, setIsInviting] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"manager" | "contributor">("contributor");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/pro/team")
      .then(r => r.json())
      .then(d => setMembers(d.members ?? []))
      .finally(() => setLoading(false));
  }, []);

  const handleInvite = async () => {
    setFormError("");
    if (!email) { setFormError("Email address is required."); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/pro/team", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberEmail: email, role }),
      });
      if (!res.ok) { setFormError((await res.json()).error ?? "Failed to add member"); return; }
      const { member } = await res.json();
      setMembers(prev => [...prev, member]);
      setIsInviting(false);
      setEmail("");
      setRole("contributor");
    } catch { setFormError("Network error."); }
    finally { setSaving(false); }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    const res = await fetch(`/api/pro/team/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      const { member } = await res.json();
      setMembers(prev => prev.map(m => m.id === id ? { ...m, ...member } : m));
    }
    setEditingRole(null);
  };

  const handleRemove = async (id: string) => {
    setDeleting(id);
    const res = await fetch(`/api/pro/team/${id}`, { method: "DELETE" });
    if (res.ok) setMembers(prev => prev.filter(m => m.id !== id));
    setDeleting(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Team</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your agency team members and access levels</p>
        </div>
        <button onClick={() => setIsInviting(true)}
          className="h-11 px-5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-sm">
          <Plus className="h-4 w-4" /> Add Member
        </button>
      </div>

      {/* Role legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(roleConfig).map(([key, rc]) => (
          <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${rc.color}`}>{rc.icon}</div>
            <div>
              <p className="font-black text-gray-900 text-sm">{rc.label}</p>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">{rc.description}</p>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 font-medium">Loading team...</div>
      ) : members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-5">
            <Users className="h-9 w-9 text-gray-300" />
          </div>
          <h3 className="text-lg font-black text-gray-900 mb-1">No team members yet</h3>
          <p className="text-gray-400 font-medium text-sm max-w-xs mb-6">
            Add team members to collaborate on projects, manage clients, and share the workload.
          </p>
          <button onClick={() => setIsInviting(true)}
            className="h-10 px-5 rounded-xl bg-gray-900 text-white font-bold text-sm flex items-center gap-2 cursor-pointer">
            <Plus className="h-4 w-4" /> Add First Member
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {members.map(m => {
            const rc = roleConfig[m.role];
            return (
              <div key={m.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-5 hover:border-gray-200 transition-all">
                {m.member.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.member.image} alt={m.member.name}
                    className="h-12 w-12 rounded-2xl object-cover shrink-0" />
                ) : (
                  <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-[#0a9396] to-emerald-400 flex items-center justify-center text-white font-black text-lg shrink-0">
                    {m.member.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-gray-900">{m.member.name}</h3>
                  <p className="text-sm text-gray-500 font-medium">{m.member.email}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {editingRole === m.id ? (
                    <div className="flex items-center gap-2">
                      {(["manager", "contributor"] as const).map(r => (
                        <button key={r} onClick={() => handleRoleChange(m.id, r)}
                          className={`h-8 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer capitalize ${m.role === r ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
                          {roleConfig[r].label}
                        </button>
                      ))}
                      <button onClick={() => setEditingRole(null)}
                        className="h-8 w-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 cursor-pointer">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${rc.color}`}>
                        {rc.icon}{rc.label}
                      </span>
                      <button onClick={() => setEditingRole(m.id)}
                        className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 cursor-pointer">
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleRemove(m.id)} disabled={deleting === m.id}
                        className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center text-red-400 hover:text-red-600 cursor-pointer disabled:opacity-50">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invite Modal */}
      <AnimatePresence>
        {isInviting && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-3xl shadow-2xl w-full max-w-md"
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900">Add Team Member</h2>
                <button onClick={() => { setIsInviting(false); setEmail(""); setFormError(""); }}
                  className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-6 space-y-5">
                <AnimatePresence>
                  {formError && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                      <AlertCircle className="h-4 w-4 shrink-0" />{formError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input type="email" placeholder="teammate@agency.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#0a9396] focus:ring-4 focus:ring-[#0a9396]/10 transition-all" />
                  <p className="text-xs text-gray-400">The person must already have a Telemoz account.</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-[13px] font-black uppercase tracking-wider text-gray-500">Role</label>
                  {(["manager", "contributor"] as const).map(r => {
                    const rc = roleConfig[r];
                    return (
                      <button key={r} onClick={() => setRole(r)}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${role === r ? "border-[#0a9396] bg-[#0a9396]/5" : "border-gray-200 hover:border-gray-300"}`}>
                        <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${rc.color}`}>{rc.icon}</div>
                        <div>
                          <p className="font-black text-gray-900 text-sm">{rc.label}</p>
                          <p className="text-xs text-gray-400 font-medium">{rc.description}</p>
                        </div>
                        {role === r && <div className="ml-auto h-5 w-5 rounded-full bg-[#0a9396] flex items-center justify-center"><div className="h-2 w-2 rounded-full bg-white" /></div>}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setIsInviting(false); setEmail(""); }}
                    className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 cursor-pointer">
                    Cancel
                  </button>
                  <button onClick={handleInvite} disabled={saving}
                    className="flex-1 h-11 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
                    <Users className="h-4 w-4" />{saving ? "Adding..." : "Add Member"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
