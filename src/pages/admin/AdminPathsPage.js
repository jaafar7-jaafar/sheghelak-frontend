import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Users,
  Clock,
  Plus,
  ChevronDown,
  ChevronUp,
  UserPlus,
  Layers,
  X,
  Check,
  Pencil,
  Trash2,
  FileText,
  Link2,
  Save,
  AlertCircle,
  Search,
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { SkeletonCard } from "../../components/ui/Skeleton";
import pathService from "../../services/pathService";
import taskService from "../../services/taskService";
import userService from "../../services/userService";

const CATEGORIES = [
  "Development",
  "Design",
  "DevOps",
  "Data",
  "Mobile",
  "Other",
];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
const DIFF_COLOR = { Beginner: "green", Intermediate: "blue", Advanced: "red" };

// ─── Shared field components ──────────────────────────────────────────────────
function Field({ label, required, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-on-surface dark:text-slate-200 block mb-1">
        {label}
        {required && " *"}
      </label>
      {children}
    </div>
  );
}

// ─── Path Form Modal (Create & Edit) ─────────────────────────────────────────
function PathFormModal({ editPath = null, onClose, onSaved }) {
  const isEdit = !!editPath;

  const [form, setForm] = useState({
    title: editPath?.title || "",
    description: editPath?.description || "",
    category: editPath?.category || "Development",
    difficulty: editPath?.difficulty || "Intermediate",
    estimatedWeeks: editPath?.estimatedWeeks || 12,
    price: editPath?.price ? parseFloat(editPath.price) : "",
  });

  // Existing levels (edit mode) — we track edits/removals
  const [existingLevels, setExistingLevels] = useState(
    editPath?.levels?.map((l) => ({ ...l, _edited: false, _deleted: false })) ||
      [],
  );
  // New levels to add
  const [newLevels, setNewLevels] = useState(
    isEdit ? [] : [{ title: "", description: "" }],
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  // ── existing level handlers ──
  const editExisting = (i, k) => (e) => {
    setExistingLevels((prev) =>
      prev.map((l, idx) =>
        idx === i ? { ...l, [k]: e.target.value, _edited: true } : l,
      ),
    );
  };
  const markDeleted = (i) => {
    setExistingLevels((prev) =>
      prev.map((l, idx) => (idx === i ? { ...l, _deleted: !l._deleted } : l)),
    );
  };

  // ── new level handlers ──
  const addNew = () =>
    setNewLevels((p) => [...p, { title: "", description: "" }]);
  const removeNew = (i) => setNewLevels((p) => p.filter((_, idx) => idx !== i));
  const setNew = (i, k) => (e) =>
    setNewLevels((p) =>
      p.map((l, idx) => (idx === i ? { ...l, [k]: e.target.value } : l)),
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required.");
      return;
    }
    setSaving(true);
    setError("");

    try {
      let pathId;

      if (isEdit) {
        // Update path details
        await pathService.updatePath(editPath.id, {
          ...form,
          estimatedWeeks: parseInt(form.estimatedWeeks),
          price: form.price !== "" ? parseFloat(form.price) : null,
        });
        pathId = editPath.id;

        // Update edited existing levels
        for (const l of existingLevels) {
          if (l._deleted) {
            await pathService.deleteLevel(l.id);
          } else if (l._edited) {
            await pathService.updateLevel(l.id, {
              title: l.title,
              description: l.description || l.title,
            });
          }
        }
      } else {
        // Create new path
        const pathRes = await pathService.createPath({
          ...form,
          estimatedWeeks: parseInt(form.estimatedWeeks),
          price: form.price !== "" ? parseFloat(form.price) : null,
        });
        pathId = pathRes.data.id;
      }

      // Add new levels
      const activeExisting = existingLevels.filter((l) => !l._deleted);
      let nextOrder = activeExisting.length + 1;
      for (const l of newLevels) {
        if (l.title.trim()) {
          await pathService.createLevel(pathId, {
            order: nextOrder++,
            title: l.title.trim(),
            description: l.description.trim() || l.title.trim(),
          });
        }
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Failed to ${isEdit ? "update" : "create"} path.`,
      );
    } finally {
      setSaving(false);
    }
  };

  const activeExistingCount = existingLevels.filter((l) => !l._deleted).length;
  const totalLevelCount =
    activeExistingCount + newLevels.filter((l) => l.title.trim()).length;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-xl shadow-glass border border-outline-variant/30 dark:border-white/5 max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20 dark:border-white/5 flex-shrink-0">
          <div>
            <h2 className="font-bold text-on-surface dark:text-white">
              {isEdit ? "Edit Path" : "Create Learning Path"}
            </h2>
            <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-0.5">
              {isEdit
                ? `Editing: ${editPath.title}`
                : "Fill in details and add levels"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-outline dark:text-slate-400 hover:text-on-surface dark:hover:text-white p-1 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-3 text-sm text-error flex items-center gap-2">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <form id="path-form" onSubmit={handleSubmit}>
            {/* Path details */}
            <div className="space-y-3 mb-6">
              <p className="text-label-caps text-outline dark:text-slate-500 font-geist">
                PATH DETAILS
              </p>

              <Field label="Title" required>
                <input
                  className="input-field w-full"
                  placeholder="e.g. Full-Stack Web Development"
                  value={form.title}
                  onChange={set("title")}
                  required
                />
              </Field>

              <Field label="Description" required>
                <textarea
                  className="input-field w-full resize-none"
                  rows={3}
                  placeholder="What will learners achieve by the end?"
                  value={form.description}
                  onChange={set("description")}
                  required
                />
              </Field>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Field label="Category">
                  <select
                    className="input-field w-full"
                    value={form.category}
                    onChange={set("category")}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Difficulty">
                  <select
                    className="input-field w-full"
                    value={form.difficulty}
                    onChange={set("difficulty")}
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Est. Weeks">
                  <input
                    type="number"
                    min="1"
                    max="104"
                    className="input-field w-full"
                    value={form.estimatedWeeks}
                    onChange={set("estimatedWeeks")}
                  />
                </Field>
                <Field label="Price ($)">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="input-field w-full"
                    placeholder="e.g. 25"
                    value={form.price}
                    onChange={set("price")}
                  />
                </Field>
              </div>
            </div>

            {/* Existing levels (edit mode) */}
            {isEdit && existingLevels.length > 0 && (
              <div className="mb-5">
                <p className="text-label-caps text-outline dark:text-slate-500 font-geist mb-3">
                  EXISTING LEVELS ({activeExistingCount})
                </p>
                <div className="space-y-2">
                  {existingLevels.map((level, i) => (
                    <div
                      key={level.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                        level._deleted
                          ? "border-error/30 bg-error/5 dark:bg-error/10 opacity-60"
                          : "border-outline-variant/30 dark:border-white/5 bg-surface-container dark:bg-white/5"
                      }`}
                    >
                      <div className="w-6 h-6 rounded bg-primary/10 dark:bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-1">
                        {level.order}
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <input
                          className="input-field w-full text-sm"
                          placeholder="Level title"
                          value={level.title}
                          onChange={editExisting(i, "title")}
                          disabled={level._deleted}
                        />
                        <input
                          className="input-field w-full text-sm"
                          placeholder="Short description"
                          value={level.description}
                          onChange={editExisting(i, "description")}
                          disabled={level._deleted}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => markDeleted(i)}
                        className={`mt-1 flex-shrink-0 p-0.5 transition-colors ${
                          level._deleted
                            ? "text-tertiary hover:text-tertiary"
                            : "text-outline dark:text-slate-500 hover:text-error"
                        }`}
                        title={level._deleted ? "Undo remove" : "Remove level"}
                      >
                        {level._deleted ? (
                          <Check size={15} />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New levels */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-label-caps text-outline dark:text-slate-500 font-geist">
                  {isEdit ? "ADD NEW LEVELS" : `LEVELS (${totalLevelCount})`}
                </p>
                <button
                  type="button"
                  onClick={addNew}
                  className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
                >
                  <Plus size={13} /> Add Level
                </button>
              </div>
              <div className="space-y-2">
                {newLevels.map((level, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg bg-primary/4 dark:bg-primary/8 border border-primary/20 dark:border-primary/20"
                  >
                    <div className="w-6 h-6 rounded bg-primary/10 dark:bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-1">
                      {activeExistingCount + i + 1}
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <input
                        className="input-field w-full text-sm"
                        placeholder={`New level ${i + 1} title`}
                        value={level.title}
                        onChange={setNew(i, "title")}
                      />
                      <input
                        className="input-field w-full text-sm"
                        placeholder="Short description (optional)"
                        value={level.description}
                        onChange={setNew(i, "description")}
                      />
                    </div>
                    {(isEdit || newLevels.length > 1) && (
                      <button
                        type="button"
                        onClick={() => removeNew(i)}
                        className="text-outline dark:text-slate-500 hover:text-error mt-1 flex-shrink-0 p-0.5 transition-colors"
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>
                ))}
                {newLevels.length === 0 && (
                  <button
                    type="button"
                    onClick={addNew}
                    className="w-full border-2 border-dashed border-outline-variant/40 dark:border-white/10 rounded-lg p-4 text-sm text-outline dark:text-slate-500 hover:border-primary/40 hover:text-primary transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Add a level
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant/20 dark:border-white/5 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="path-form"
            variant="primary"
            size="sm"
            loading={saving}
            icon={isEdit ? Save : Check}
          >
            {saving
              ? isEdit
                ? "Saving..."
                : "Creating..."
              : isEdit
                ? "Save Changes"
                : "Create Path"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Assign Path Modal ────────────────────────────────────────────────────────
function AssignPathModal({ paths, onClose, onAssigned }) {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedPath, setSelectedPath] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    userService
      .listUsers({ limit: 100, role: "user", status: "active" })
      .then((res) => setUsers(res.data?.users || []))
      .catch(() => {})
      .finally(() => setLoadingUsers(false));
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAssign = async () => {
    if (!selectedUser || !selectedPath) {
      setError("Select both a user and a path.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await pathService.assignPath(
        parseInt(selectedUser),
        parseInt(selectedPath),
      );
      setSuccess("Path assigned successfully!");
      onAssigned();
      setTimeout(onClose, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign path.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-glass border border-outline-variant/30 dark:border-white/5 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20 dark:border-white/5">
          <div>
            <h2 className="font-bold text-on-surface dark:text-white">
              Assign Path to User
            </h2>
            <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-0.5">
              Select a user and a learning path
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-outline dark:text-slate-400 hover:text-on-surface dark:hover:text-white p-1"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-3 text-sm text-error">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-tertiary/10 border border-tertiary/20 rounded-lg p-3 text-sm text-tertiary flex items-center gap-2">
              <Check size={14} />
              {success}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-on-surface dark:text-slate-200 block mb-2">
              Select User *
            </label>
            <input
              className="input-field w-full mb-2"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="max-h-44 overflow-y-auto rounded-lg border border-outline-variant/30 dark:border-white/5 divide-y divide-outline-variant/20 dark:divide-white/5">
              {loadingUsers ? (
                <div className="p-3 text-sm text-outline dark:text-slate-500 text-center">
                  Loading users...
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-3 text-sm text-outline dark:text-slate-500 text-center">
                  No users found
                </div>
              ) : (
                filteredUsers.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setSelectedUser(String(u.id))}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                      selectedUser === String(u.id)
                        ? "bg-primary/8 dark:bg-primary/15"
                        : "hover:bg-surface-container dark:hover:bg-white/5"
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {u.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-on-surface dark:text-white truncate">
                        {u.name}
                      </p>
                      <p className="text-xs text-outline dark:text-slate-500 truncate">
                        {u.email}
                      </p>
                    </div>
                    {selectedUser === String(u.id) && (
                      <Check size={14} className="text-primary flex-shrink-0" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-on-surface dark:text-slate-200 block mb-2">
              Select Path *
            </label>
            <div className="space-y-2">
              {paths.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPath(String(p.id))}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all ${
                    selectedPath === String(p.id)
                      ? "border-primary/30 bg-primary/5 dark:bg-primary/10"
                      : "border-outline-variant/30 dark:border-white/5 hover:bg-surface-container dark:hover:bg-white/5"
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-primary/8 dark:bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <BookOpen size={14} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface dark:text-white truncate">
                      {p.title}
                    </p>
                    <p className="text-xs text-outline dark:text-slate-500">
                      {p._count?.levels || p.levels?.length || 0} levels ·{" "}
                      {p.difficulty}
                    </p>
                  </div>
                  {selectedPath === String(p.id) && (
                    <Check size={14} className="text-primary flex-shrink-0" />
                  )}
                </button>
              ))}
              {paths.length === 0 && (
                <p className="text-sm text-outline dark:text-slate-500 text-center py-3">
                  No paths available
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant/20 dark:border-white/5">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            loading={saving}
            onClick={handleAssign}
            icon={UserPlus}
          >
            {saving ? "Assigning..." : "Assign Path"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Level Row inside PathCard ────────────────────────────────────────────────
function LevelRow({ level }) {
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState(null); // null = not loaded yet
  const [loadingTasks, setLoadingTasks] = useState(false);

  const handleToggle = async () => {
    if (!open && tasks === null) {
      setLoadingTasks(true);
      try {
        const res = await taskService.getTasksByLevel(level.id);
        setTasks(res.data || []);
      } catch {
        setTasks([]);
      } finally {
        setLoadingTasks(false);
      }
    }
    setOpen((p) => !p);
  };

  return (
    <div className="rounded-lg border border-outline-variant/20 dark:border-white/5 overflow-hidden">
      {/* Level header */}
      <button
        onClick={handleToggle}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-container dark:hover:bg-white/5 transition-colors"
      >
        <div className="w-7 h-7 rounded bg-primary/8 dark:bg-primary/15 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
          {level.order}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-on-surface dark:text-white truncate">
            {level.title}
          </p>
          {level.description && level.description !== level.title && (
            <p className="text-xs text-on-surface-variant dark:text-slate-400 truncate">
              {level.description}
            </p>
          )}
        </div>
        <span className="text-xs text-outline dark:text-slate-500 flex-shrink-0 mr-2">
          {level._count?.tasks ?? 0} tasks
        </span>
        <div className="text-outline dark:text-slate-500 flex-shrink-0">
          {loadingTasks ? (
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          ) : open ? (
            <ChevronUp size={15} />
          ) : (
            <ChevronDown size={15} />
          )}
        </div>
      </button>

      {/* Tasks list */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-outline-variant/20 dark:border-white/5 bg-surface-container-low dark:bg-slate-900/50">
              {!tasks || tasks.length === 0 ? (
                <p className="text-xs text-outline dark:text-slate-500 text-center py-4">
                  No tasks in this level yet.
                </p>
              ) : (
                <div className="divide-y divide-outline-variant/10 dark:divide-white/5">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 px-4 py-3"
                    >
                      <div className="w-5 h-5 rounded flex-shrink-0 bg-primary/8 dark:bg-primary/15 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                        {task.order}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-on-surface dark:text-white">
                          {task.title}
                        </p>
                        <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-0.5 line-clamp-1">
                          {task.description}
                        </p>
                        {/* Resources */}
                        {task.resources?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {task.resources.map((r) => (
                              <span
                                key={r.id}
                                className="inline-flex items-center gap-1 text-xs bg-surface-container dark:bg-white/10 text-on-surface-variant dark:text-slate-300 px-2 py-0.5 rounded"
                              >
                                {r.type === "link" ? (
                                  <Link2 size={10} />
                                ) : (
                                  <FileText size={10} />
                                )}
                                {r.title}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <Badge
                        color={
                          {
                            task: "gray",
                            project: "blue",
                            submission: "purple",
                          }[task.type] || "gray"
                        }
                      >
                        {task.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Path Card ────────────────────────────────────────────────────────────────
function PathCard({ path, onEdit, onAssign, onDelete, index }) {
  const [levelsOpen, setLevelsOpen] = useState(false);
  const levels = path.levels || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <Card className="overflow-hidden">
        <div className="p-6">
          {/* Title row */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-primary/8 dark:bg-primary/15 flex items-center justify-center flex-shrink-0">
                <BookOpen size={18} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-on-surface dark:text-white">
                  {path.title}
                </h3>
                <p className="text-sm text-on-surface-variant dark:text-slate-400 mt-0.5 line-clamp-2">
                  {path.description}
                </p>
              </div>
            </div>
            <Badge
              color={DIFF_COLOR[path.difficulty] || "blue"}
              className="flex-shrink-0"
            >
              {path.difficulty}
            </Badge>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-3 text-sm text-on-surface-variant dark:text-slate-400 mb-4">
            <span className="flex items-center gap-1">
              <Users size={13} />
              {path._count?.userPaths || 0} enrolled
            </span>
            <span className="flex items-center gap-1">
              <Layers size={13} />
              {levels.length} levels
            </span>
            <span className="flex items-center gap-1">
              <Clock size={13} />
              {path.estimatedWeeks}w
            </span>
            {path.price != null && (
              <span className="flex items-center gap-1 font-semibold text-primary">
                ${parseFloat(path.price).toFixed(0)}
              </span>
            )}
            <Badge color="gray">{path.category}</Badge>
          </div>

          {/* Actions */}
          <div className="flex items-center flex-wrap gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={UserPlus}
              onClick={() => onAssign(path)}
            >
              Assign to User
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={Pencil}
              onClick={() => onEdit(path)}
            >
              Edit
            </Button>
            {levels.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLevelsOpen((p) => !p)}
              >
                {levelsOpen ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
                {levelsOpen ? "Hide Levels" : `View ${levels.length} Levels`}
              </Button>
            )}
            <button
              onClick={() => onDelete(path)}
              className="ml-auto text-outline dark:text-slate-500 hover:text-error transition-colors p-1.5 rounded hover:bg-error/10"
              title="Deactivate path"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Levels panel */}
        <AnimatePresence>
          {levelsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 border-t border-outline-variant/20 dark:border-white/5 pt-4 space-y-2">
                <p className="text-label-caps text-outline dark:text-slate-500 font-geist mb-3">
                  LEVELS & TASKS
                </p>
                {levels.length === 0 ? (
                  <p className="text-sm text-outline dark:text-slate-500 text-center py-4">
                    No levels yet — click Edit to add levels.
                  </p>
                ) : (
                  levels.map((level) => (
                    <LevelRow key={level.id} level={level} />
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────
function DeleteConfirm({ path, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await pathService.deletePath(path.id);
      onDeleted();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to deactivate path.");
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-xl shadow-glass border border-outline-variant/30 dark:border-white/5 p-6"
      >
        <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={22} className="text-error" />
        </div>
        <h3 className="font-bold text-on-surface dark:text-white text-center mb-1">
          Deactivate Path?
        </h3>
        <p className="text-sm text-on-surface-variant dark:text-slate-400 text-center mb-5">
          "{path.title}" will be hidden from users. You can reactivate it later.
        </p>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="flex-1"
            loading={deleting}
            onClick={handleDelete}
          >
            {deleting ? "Removing..." : "Deactivate"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminPathsPage() {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editPath, setEditPath] = useState(null);
  const [deletePath, setDeletePath] = useState(null);
  const [showAssign, setShowAssign] = useState(false);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await pathService.listPaths({ limit: 50 });
      setPaths(res.data?.paths || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load paths.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <DashboardLayout isAdmin>
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-xl font-bold text-on-surface dark:text-white">
                Learning Paths
              </h1>
              <p className="text-sm text-on-surface-variant dark:text-slate-400 mt-0.5">
                {paths.length} active path{paths.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-slate-500"
                />
                <input
                  type="text"
                  placeholder="Search paths..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-9 w-44"
                />
              </div>
              <Button
                variant="secondary"
                size="sm"
                icon={UserPlus}
                onClick={() => setShowAssign(true)}
              >
                Assign Path
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => setShowCreate(true)}
              >
                New Path
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-4 text-sm text-error flex items-center gap-2">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-5">
              {[1, 2].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : paths.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/8 dark:bg-primary/15 flex items-center justify-center mx-auto mb-4">
                <BookOpen size={22} className="text-primary" />
              </div>
              <p className="font-semibold text-on-surface dark:text-white mb-1">
                No paths yet
              </p>
              <p className="text-sm text-on-surface-variant dark:text-slate-400 mb-5">
                Create your first learning path to get started.
              </p>
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => setShowCreate(true)}
              >
                Create First Path
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {paths
                .filter(
                  (p) =>
                    !search ||
                    p.title.toLowerCase().includes(search.toLowerCase()),
                )
                .map((path, i) => (
                  <PathCard
                    key={path.id}
                    path={path}
                    index={i}
                    onEdit={setEditPath}
                    onAssign={() => setShowAssign(true)}
                    onDelete={setDeletePath}
                  />
                ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCreate && (
          <PathFormModal onClose={() => setShowCreate(false)} onSaved={load} />
        )}
        {editPath && (
          <PathFormModal
            editPath={editPath}
            onClose={() => setEditPath(null)}
            onSaved={load}
          />
        )}
        {showAssign && (
          <AssignPathModal
            paths={paths}
            onClose={() => setShowAssign(false)}
            onAssigned={load}
          />
        )}
        {deletePath && (
          <DeleteConfirm
            path={deletePath}
            onClose={() => setDeletePath(null)}
            onDeleted={load}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
