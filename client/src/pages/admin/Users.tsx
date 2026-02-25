import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { useAdminUsers } from "@/hooks/use-admin";

export default function AdminUsers() {
  const { data: users, isLoading } = useAdminUsers();

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Registered Users</h1>

        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/50 border-b border-border text-sm text-muted-foreground font-medium uppercase tracking-wider">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
              ) : users?.map(user => (
                <tr key={user._id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="p-4 font-semibold">{user.name}</td>
                  <td className="p-4 text-muted-foreground">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-secondary text-foreground'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
