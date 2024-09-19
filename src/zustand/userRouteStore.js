import { create } from 'zustand';

const userRouteStore = create((set) => ({
  routeFormData: {
    routeName: '',
    address: '',
    description: '',
    selectedPuppy: 'default'
  },

  setUserRouteData: (data) => set((state) => ({ routeFormData: { ...state.routeFormData, ...data } }))
}));

export default userRouteStore;
