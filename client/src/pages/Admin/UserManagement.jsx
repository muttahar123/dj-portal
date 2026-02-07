import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit2,
    Trash2,
    UserPlus,
    ShieldCheck,
    User,
    Users,
    X
} from 'lucide-react';
import { toast } from 'react-toastify';

const UserManagement = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'STUDENT',
        department: '',
        studentId: '',
        teacherId: ''
    });

    // Fetch users
    const { data: usersData, isLoading, error } = useQuery({
        queryKey: ['users', roleFilter],
        queryFn: async () => {
            const url = roleFilter ? `/admin/users?role=${roleFilter}` : '/admin/users';
            const res = await api.get(url);
            return res.data.data;
        }
    });

    // Create user mutation
    const createUserMutation = useMutation({
        mutationFn: (userData) => api.post('/admin/users', userData),
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            toast.success('User created successfully');
            closeModal();
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to create user');
        }
    });

    // Update user mutation
    const updateUserMutation = useMutation({
        mutationFn: ({ id, data }) => api.put(`/admin/users/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            toast.success('User updated successfully');
            closeModal();
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to update user');
        }
    });

    // Delete user mutation
    const deleteUserMutation = useMutation({
        mutationFn: (id) => api.delete(`/admin/users/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            toast.success('User deleted successfully');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to delete user');
        }
    });

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({
            name: '', email: '', password: '', role: 'STUDENT', department: '', studentId: '', teacherId: ''
        });
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
            department: user.department || '',
            studentId: user.studentId || '',
            teacherId: user.teacherId || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = (user) => {
        if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
            deleteUserMutation.mutate(user._id);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingUser) {
            // For updates, only send fields that changed (excluding empty password)
            const updateData = { ...formData };
            if (!updateData.password) {
                delete updateData.password;
            }
            updateUserMutation.mutate({ id: editingUser._id, data: updateData });
        } else {
            createUserMutation.mutate(formData);
        }
    };

    const filteredUsers = usersData?.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Users className="w-6 h-6 text-blue-500" />
                        User Management
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Manage institutional access and roles.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                    <UserPlus className="w-5 h-5" />
                    Register New User
                </button>
            </div>

            {/* Filters & Search */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <select
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-all appearance-none"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="">All Roles</option>
                        <option value="STUDENT">Students</option>
                        <option value="TEACHER">Teachers</option>
                        <option value="ADMIN">Admins</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                                        <div className="flex justify-center flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                            Loading directory...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers?.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500">No users found.</td>
                                </tr>
                            ) : filteredUsers?.map((user) => (
                                <tr key={user._id} className="hover:bg-slate-800/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-slate-300 font-bold border border-slate-700 uppercase">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-slate-200 font-medium">{user.name}</div>
                                                <div className="text-slate-500 text-xs">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                            user.role === 'TEACHER' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400">{user.department}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                            Active
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="p-2 hover:bg-blue-500/20 rounded-lg text-slate-500 hover:text-blue-400 transition-all"
                                                title="Edit User"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user)}
                                                className="p-2 hover:bg-red-500/20 rounded-lg text-slate-500 hover:text-red-400 transition-all"
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Register/Edit User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={closeModal} />
                    <div className="relative bg-slate-900 border border-slate-800 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    {editingUser ? <Edit2 className="text-blue-500" /> : <UserPlus className="text-blue-500" />}
                                    {editingUser ? 'Edit User' : 'Register New User'}
                                </h2>
                                <button onClick={closeModal} className="text-slate-500 hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Full Name</label>
                                    <input
                                        name="name"
                                        required
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-all"
                                        placeholder="Enter full name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Email Address</label>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-all"
                                        placeholder="name@example.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
                                        {editingUser ? 'New Password (leave blank to keep)' : 'Initial Password'}
                                    </label>
                                    <input
                                        name="password"
                                        type="password"
                                        required={!editingUser}
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-all"
                                        placeholder={editingUser ? 'Leave blank to keep current' : 'Minimum 6 chars'}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Role</label>
                                    <select
                                        name="role"
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-all appearance-none"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                    >
                                        <option value="STUDENT">Student</option>
                                        <option value="TEACHER">Teacher</option>
                                        <option value="ADMIN">Administrator</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Department</label>
                                    <input
                                        name="department"
                                        required
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-all"
                                        placeholder="e.g. Physics, Administration"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {formData.role === 'STUDENT' && (
                                    <div className="md:col-span-2 space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Student ID</label>
                                        <input
                                            name="studentId"
                                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-all"
                                            placeholder="e.g. STD-2024-001"
                                            value={formData.studentId}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                )}

                                {formData.role === 'TEACHER' && (
                                    <div className="md:col-span-2 space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Teacher ID</label>
                                        <input
                                            name="teacherId"
                                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500 transition-all"
                                            placeholder="e.g. TCH-PHY-01"
                                            value={formData.teacherId}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                )}

                                <div className="md:col-span-2 pt-4">
                                    <button
                                        disabled={createUserMutation.isPending || updateUserMutation.isPending}
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/30 active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        {(createUserMutation.isPending || updateUserMutation.isPending) ? (
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <ShieldCheck className="w-5 h-5" />
                                                {editingUser ? 'Update User' : 'Complete Registration'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;

