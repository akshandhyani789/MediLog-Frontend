// In your Onboarding Page component
const { goToDashboard } = useAppNavigation();
const { user, setUser } = useAuth(); // Assuming your auth hook gives you a way to update the user

const handleFinishOnboarding = async () => {
  // 1. Update the backend (Highly Recommended)
  // await api.updateUser({ isOnboarded: true });

  // 2. Update the local React state so the ProtectedRoute sees the change
  setUser({ ...user, isOnboarded: true });

  // 3. Now navigate
  goToDashboard();
};