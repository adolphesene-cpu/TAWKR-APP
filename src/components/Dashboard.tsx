import { useAuth } from '@/contexts/AuthContext';
import DashboardAdmin from './DashboardAdmin';
import DashboardFranchise from './DashboardFranchise';

const Dashboard = () => {
  const { isAdmin } = useAuth();

  return isAdmin ? <DashboardAdmin /> : <DashboardFranchise />;
};

export default Dashboard;
