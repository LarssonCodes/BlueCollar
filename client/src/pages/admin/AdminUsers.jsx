import { useState, useEffect } from 'react';
import { getAdminUsers, deleteAdminUser } from '../../api/admin.js';
import { useAuth } from '../../context/AuthContext.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import Pagination from '../../components/Pagination.jsx';

function AdminUsers() {
  const { user: currentUser } = useAuth();
  
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchUsers = async () => {
      // Delay state updates to avoid synchronous setState inside useEffect
      await Promise.resolve();
      if (!active) return;

      setIsLoading(true);
      setError('');
      try {
        const res = await getAdminUsers({ page, limit: 20 });
        if (!active) return;
        if (res.data && res.data.success) {
          setUsers(res.data.data.users || []);
          setTotalPages(res.data.data.totalPages || 1);
        } else {
          setError(res.data?.error || 'Failed to fetch users list.');
        }
      } catch (err) {
        if (!active) return;
        console.error(err);
        setError(err.response?.data?.error || 'Failed to fetch users. Please try again.');
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchUsers();

    return () => {
      active = false;
    };
  }, [page]);

  const handleDeleteClick = (user) => {
    setDeleteTarget(user);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deleteAdminUser(deleteTarget.id);
      if (res.data && res.data.success) {
        setUsers(users.filter((u) => u.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'WORKER':
        return 'bg-[#EFF6FF] text-[#2563EB]';
      case 'EMPLOYER':
        return 'bg-[#FFF7ED] text-[#EA580C]';
      case 'ADMIN':
        return 'bg-surface-container text-on-surface-variant';
      default:
        return 'bg-surface-container text-on-surface-variant';
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Page Header */}
      <div className="mb-stack-lg">
        <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
          User Management
        </h1>
      </div>

      {error && (
        <div className="mb-6 bg-error-container text-error border border-error/20 rounded-lg p-3 font-body-sm text-body-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          {error}
        </div>
      )}

      {/* Table Card */}
      <div className="bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.02)] border border-[#E2E8F0] overflow-hidden">
        <div className="w-full overflow-x-auto -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0">
          <table className="w-full min-w-[600px] text-left border-collapse">
            <thead className="bg-surface-container-low border-b border-[#F1F5F9]">
              <tr>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant font-medium">Email</th>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant font-medium">Role</th>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant font-medium">Joined</th>
                <th className="p-4 font-label-md text-label-md text-on-surface-variant font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm text-on-surface">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="border-b border-[#F1F5F9] animate-pulse">
                    <td className="p-4"><div className="h-4 bg-surface-container rounded w-48"></div></td>
                    <td className="p-4"><div className="h-6 bg-surface-container rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-surface-container rounded w-24"></div></td>
                    <td className="p-4"><div className="h-8 bg-surface-container rounded w-16"></div></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <span className="material-symbols-outlined text-on-surface-variant text-5xl select-none">
                        people
                      </span>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                        No users found
                      </h3>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isSelf = currentUser && currentUser.id === user.id;
                  return (
                    <tr key={user.id} className="border-b border-[#F1F5F9] hover:bg-surface-bright transition-colors">
                      <td className="p-4 font-medium">{user.email}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded font-label-sm text-label-sm font-semibold uppercase ${getRoleBadgeClass(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">{formatDate(user.createdAt)}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDeleteClick(user)}
                          disabled={isSelf}
                          className={`rounded px-3 py-1 font-label-md text-label-md transition-colors cursor-pointer ${
                            isSelf
                              ? 'text-on-surface-variant/40 bg-surface-container/20 cursor-not-allowed'
                              : 'text-error hover:bg-error-container hover:text-error'
                          }`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage((p) => Math.max(p - 1, 1))}
          onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmModal
          isOpen={true}
          title={`Delete User?`}
          message="This will permanently delete the user and all their data (profile, jobs, and applications). This action cannot be undone."
          confirmLabel="Delete"
          isLoading={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}

export default AdminUsers;
